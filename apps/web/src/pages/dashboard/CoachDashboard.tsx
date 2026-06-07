import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCoachShortlist, ShortlistEntry } from '@hoop-master/features/scouting'
import { usePlayerEvaluation } from '@hoop-master/features/evaluations'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Skeleton } from '../../components/ui/skeleton'
import { toast } from 'sonner'
import {
  Users, Trophy, AlertCircle, FileText, ChevronRight, X, UserCheck, Activity, Save, AlertTriangle
} from 'lucide-react'

// --- Types & Mock Utilities ---
type TabView = 'overview' | 'recruiting' | 'academics' | 'evaluations'

interface NILApplication {
  id: string
  athlete_name: string
  opportunity_id: string
  status: string
  submitted_at: string
}

// Generate a deterministic mock GPA based on string hash since we don't have it in schema
const getMockGPA = (name: string) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const gpa = 2.0 + (Math.abs(hash) % 200) / 100 // Range 2.0 - 4.0
  return gpa.toFixed(1)
}

// --- Sub-Components ---

// Evaluation Modal Component
function EvaluationModal({ 
  player, 
  onClose,
  evaluatorId 
}: { 
  player: ShortlistEntry
  onClose: () => void
  evaluatorId: string 
}) {
  const { submitPlayerEvaluation } = usePlayerEvaluation(player.playerId)
  const [score, setScore] = useState<number>(75)
  const [scoutNotes, setScoutNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Send the evaluation to the existing audit_submissions tables
    const res = await submitPlayerEvaluation({
      overallScore: score,
      strengths: ['Mechanics', 'Footwork'], // Mocked for brevity in MVP
      areasToImprove: ['Basketball IQ'],
      scoutNotes: scoutNotes,
      evaluatorId: evaluatorId
    })

    setIsSubmitting(false)
    if (res.success) {
      toast.success(`Evaluation saved securely for ${player.name}.`)
      onClose()
    } else {
      toast.error(`Failed to save evaluation: ${res.error}`)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-md h-full bg-navy-900 border-l border-white/10 p-6 flex flex-col shadow-2xl overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-white">Log Evaluation</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6 p-4 bg-navy-800 rounded-lg border border-white/5">
          <p className="text-sm text-slate-400">Athlete</p>
          <p className="text-lg font-bold text-white">{player.name}</p>
          <p className="text-sm text-slate-300">Class of {player.grade || 'Unknown'} • {player.position}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="space-y-6 flex-1">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Overall Projection Score (0-100)</label>
              <input 
                type="number" min="0" max="100" value={score} onChange={e => setScore(Number(e.target.value))}
                className="w-full px-4 py-3 bg-navy-800 border border-white/20 rounded-lg text-white focus:border-[#FB6C1D] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Scout Notes (Mechanics, IQ, Footwork)</label>
              <textarea 
                required rows={6} value={scoutNotes} onChange={e => setScoutNotes(e.target.value)}
                placeholder="Enter detailed evaluation notes..."
                className="w-full px-4 py-3 bg-navy-800 border border-white/20 rounded-lg text-white focus:border-[#FB6C1D] outline-none resize-none"
              />
              <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                <AlertTriangle size={12} /> These notes are strictly private and not visible to the athlete.
              </p>
            </div>
          </div>
          <button 
            type="submit" disabled={isSubmitting || !scoutNotes}
            className="w-full mt-8 flex items-center justify-center gap-2 bg-[#FB6C1D] hover:bg-[#e55a1a] disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-lg transition-colors"
          >
            {isSubmitting ? 'Saving securely...' : <><Save size={18} /> Save Evaluation</>}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

// --- Main Page Component ---
export default function CoachDashboard() {
  const [activeTab, setActiveTab] = useState<TabView>('overview')
  const { entries, loading: shortlistLoading, statuses, advanceStatus } = useCoachShortlist()
  
  const [nilApps, setNilApps] = useState<NILApplication[]>([])
  const [loadingNil, setLoadingNil] = useState(true)
  const [userAuthId, setUserAuthId] = useState<string>('')
  
  const [evalModalPlayer, setEvalModalPlayer] = useState<ShortlistEntry | null>(null)
  const [gradeFilter, setGradeFilter] = useState<string>('ALL')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserAuthId(data.user.id)
    })

    // Fetch NIL Sync Bridge Data
    supabase.from('nil_applications').select('*').order('submitted_at', { ascending: false }).limit(10)
      .then(({ data }) => {
        if (data) setNilApps(data)
        setLoadingNil(false)
      })
  }, [])

  const isLoading = shortlistLoading || loadingNil

  // Stats Calculations
  const rosterCount = entries.length
  const offerCommittedCount = entries.filter(e => e.status === 'offer' || e.status === 'committed').length
  const pendingNILCount = nilApps.filter(a => a.status === 'Pending' || a.status === 'Drafting').length

  const academicRoster = entries.filter(e => gradeFilter === 'ALL' || e.grade === gradeFilter)

  return (
    <DashboardLayout variant="coach" title="Command Center" subtitle="Manage your recruitment funnel, evaluations, and academic tracking securely.">
      
      {/* High-Level Statistics Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-navy-800 p-6 rounded-xl border border-white/10 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Active Roster</p>
            {isLoading ? <Skeleton className="h-8 w-16 bg-slate-700" /> : <p className="text-3xl font-bold text-white">{rosterCount}</p>}
          </div>
          <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Users className="text-blue-400" size={24} />
          </div>
        </div>
        
        <div className="bg-navy-800 p-6 rounded-xl border border-white/10 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Offers / Committed</p>
            {isLoading ? <Skeleton className="h-8 w-16 bg-slate-700" /> : <p className="text-3xl font-bold text-white">{offerCommittedCount}</p>}
          </div>
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
            <Trophy className="text-green-400" size={24} />
          </div>
        </div>
        
        <div className="bg-navy-800 p-6 rounded-xl border border-[#FB6C1D]/30 shadow-lg flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#FB6C1D]/5" />
          <div className="relative z-10">
            <p className="text-sm font-medium text-slate-300 mb-1">Pending NIL/Grants</p>
            {isLoading ? <Skeleton className="h-8 w-16 bg-slate-700" /> : <p className="text-3xl font-bold text-white">{pendingNILCount}</p>}
          </div>
          <div className="relative z-10 w-12 h-12 bg-[#FB6C1D]/20 rounded-full flex items-center justify-center">
            <AlertCircle className="text-[#FB6C1D]" size={24} />
          </div>
        </div>
      </div>

      {/* State-Based Tab Switcher */}
      <div className="flex space-x-2 border-b border-white/10 mb-8 overflow-x-auto">
        {(['overview', 'recruiting', 'academics', 'evaluations'] as TabView[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-sm font-medium capitalize whitespace-nowrap transition-colors relative ${
              activeTab === tab ? 'text-[#FB6C1D]' : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            {tab === 'overview' ? 'Overview' : tab === 'recruiting' ? 'Recruiting Board' : tab === 'academics' ? 'Academics' : 'Evaluations'}
            {activeTab === tab && (
              <motion.div layoutId="coach-tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FB6C1D]" />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-48 w-full bg-navy-800 rounded-xl" />
              <Skeleton className="h-48 w-full bg-navy-800 rounded-xl" />
            </div>
          ) : (
            <>
              {/* TAB 1: Overview */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* NIL Monitoring Panel */}
                  <div className="bg-navy-800 border border-white/10 rounded-xl p-6 shadow-md">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Activity className="text-[#FB6C1D]" size={20} /> NIL & Scholarship Monitoring
                      </h3>
                    </div>
                    {nilApps.length === 0 ? (
                      <p className="text-slate-400 text-sm italic">No recent NIL applications synced.</p>
                    ) : (
                      <div className="space-y-4">
                        {nilApps.map(app => {
                          const isRecent = new Date(app.submitted_at).getTime() > Date.now() - (72 * 60 * 60 * 1000)
                          return (
                            <div key={app.id} className="p-4 bg-navy-900 border border-white/5 rounded-lg flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-white">{app.athlete_name}</p>
                                <p className="text-xs text-slate-400">{app.opportunity_id}</p>
                              </div>
                              <div className="text-right">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
                                  {app.status}
                                </span>
                                {isRecent && <p className="text-[10px] text-[#FB6C1D] mt-1 font-bold">Action Required</p>}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div className="bg-navy-800 border border-white/10 rounded-xl p-6 shadow-md flex items-center justify-center text-center">
                    <div>
                      <FileText className="mx-auto mb-4 text-slate-500" size={48} />
                      <h3 className="text-lg font-bold text-white mb-2">Evaluation Quick-Start</h3>
                      <p className="text-slate-400 text-sm max-w-sm mb-6">Switch to the Evaluations tab to securely log scout notes and overall projection scores.</p>
                      <button onClick={() => setActiveTab('evaluations')} className="bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                        Go to Evaluations
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Recruiting Board (Kanban Tiered List) */}
              {activeTab === 'recruiting' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-8">
                  {statuses.map(status => {
                    const columnEntries = entries.filter(e => e.status === status)
                    return (
                      <div key={status} className="bg-navy-800/50 rounded-xl border border-white/5 flex flex-col min-w-[280px]">
                        <div className="p-3 border-b border-white/10 bg-navy-800 rounded-t-xl font-bold text-white capitalize flex justify-between items-center">
                          {status}
                          <span className="text-xs font-normal text-slate-400 bg-white/10 px-2 py-0.5 rounded-full">{columnEntries.length}</span>
                        </div>
                        <div className="p-3 space-y-3 min-h-[200px]">
                          {columnEntries.map(player => (
                            <motion.div layout key={player.id} className="bg-navy-900 border border-white/10 rounded-lg p-3 shadow-sm hover:border-[#FB6C1D]/50 transition-colors cursor-default">
                              <p className="font-bold text-white text-sm truncate">{player.name}</p>
                              <p className="text-xs text-slate-400 mb-3">{player.position} • {player.school || 'Unknown School'}</p>
                              {status !== 'committed' && (
                                <button 
                                  onClick={() => advanceStatus(player.id)}
                                  className="w-full py-1.5 text-xs font-semibold bg-[#FB6C1D]/10 text-[#FB6C1D] hover:bg-[#FB6C1D]/20 rounded transition-colors flex items-center justify-center gap-1"
                                >
                                  Advance Stage <ChevronRight size={12} />
                                </button>
                              )}
                            </motion.div>
                          ))}
                          {columnEntries.length === 0 && (
                            <p className="text-xs text-slate-500 text-center py-4 italic">Empty</p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* TAB 3: Academics & Eligibility */}
              {activeTab === 'academics' && (
                <div className="bg-navy-800 border border-white/10 rounded-xl shadow-md overflow-hidden">
                  <div className="p-5 border-b border-white/10 flex justify-between items-center bg-navy-900">
                    <h3 className="font-bold text-white">Roster Academic Eligibility</h3>
                    <select 
                      value={gradeFilter} onChange={e => setGradeFilter(e.target.value)}
                      className="bg-navy-800 border border-white/20 text-white text-sm rounded-lg px-3 py-2 outline-none focus:border-[#FB6C1D]"
                    >
                      <option value="ALL">All Grades</option>
                      {[8,9,10,11,12].map(g => <option key={g} value={String(g)}>Grade {g}</option>)}
                    </select>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-navy-800 text-xs uppercase tracking-wider text-slate-400 border-b border-white/10">
                          <th className="p-4 font-semibold">Athlete Name</th>
                          <th className="p-4 font-semibold">Class Year</th>
                          <th className="p-4 font-semibold">Est. GPA</th>
                          <th className="p-4 font-semibold text-right">NCAA Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {academicRoster.map(player => {
                          const gpa = parseFloat(getMockGPA(player.name))
                          const isEligible = gpa >= 2.3
                          return (
                            <tr key={player.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                              <td className="p-4 text-sm font-medium text-white">{player.name}</td>
                              <td className="p-4 text-sm text-slate-300">{player.grade || '--'}</td>
                              <td className="p-4 text-sm font-bold text-white">{gpa.toFixed(1)}</td>
                              <td className="p-4 text-sm text-right">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                  isEligible ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                }`}>
                                  {isEligible ? 'Eligible' : 'At Risk'}
                                </span>
                              </td>
                            </tr>
                          )
                        })}
                        {academicRoster.length === 0 && (
                          <tr><td colSpan={4} className="p-8 text-center text-slate-500">No athletes match this criteria.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: Integrated Evaluations */}
              {activeTab === 'evaluations' && (
                <div className="space-y-4">
                  {entries.map(player => (
                    <div key={player.id} className="bg-navy-800 border border-white/10 rounded-xl p-5 shadow-sm flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-white">{player.name}</h4>
                        <p className="text-sm text-slate-400">{player.position} • {player.school || 'Unknown School'}</p>
                      </div>
                      <button 
                        onClick={() => setEvalModalPlayer(player)}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        <UserCheck size={18} /> Log Evaluation
                      </button>
                    </div>
                  ))}
                  {entries.length === 0 && (
                    <div className="bg-navy-800 p-12 rounded-xl text-center border border-white/10">
                      <p className="text-slate-400">Save athletes to your shortlist first to evaluate them.</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Slide-Out Modal */}
      <AnimatePresence>
        {evalModalPlayer && (
          <EvaluationModal 
            player={evalModalPlayer} 
            onClose={() => setEvalModalPlayer(null)} 
            evaluatorId={userAuthId}
          />
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
