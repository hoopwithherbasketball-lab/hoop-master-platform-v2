import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { usePlayerEvaluation } from '@hoop-master/features/evaluations'
import { useCoachReferral } from '@hoop-master/features/crm'
import { useAuth } from '../../lib/auth'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { ArrowLeft, TrendingUp, Award, Target, User, Plus, MessageSquare, Share2, Check, Star } from 'lucide-react'

function scoreColor(s: number): string {
  if (s >= 90) return 'text-green-600'
  if (s >= 80) return 'text-blue-600'
  if (s >= 70) return 'text-amber-600'
  return 'text-red-400'
}

function scoreBar(s: number): string {
  if (s >= 90) return 'bg-green-500'
  if (s >= 80) return 'bg-blue-500'
  if (s >= 70) return 'bg-amber-500'
  return 'bg-red-500'
}

export default function PlayerEvaluationPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { evaluation: evalData, loading, submitPlayerEvaluation } = usePlayerEvaluation(id || '1')
  const { notes: referralNotes, newNote, setNewNote, addNote } = useCoachReferral(id || '1')
  
  const [copied, setCopied] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [overallGrade, setOverallGrade] = useState('B')
  const [athleticismScore, setAthleticismScore] = useState(7)
  const [skillScore, setSkillScore] = useState(7)
  const [iqScore, setIqScore] = useState(7)
  const [characterScore, setCharacterScore] = useState(7)
  const [academicsScore, setAcademicsScore] = useState(7)
  const [recommendation, setRecommendation] = useState('watch')
  const [scoutNotesText, setScoutNotesText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const shareEval = () => {
    navigator.clipboard.writeText(`${window.location.origin}/coach/evaluation/${id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmitEval = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    setSubmitError('')
    
    const res = await submitPlayerEvaluation({
      overallGrade,
      athleticismScore,
      skillScore,
      iqScore,
      characterScore,
      academicsScore,
      scoutNotes: scoutNotesText,
      recommendation,
      evaluatorId: user.id
    })
    
    setSubmitting(false)
    if (res.success) {
      setShowForm(false)
      setScoutNotesText('')
      setOverallGrade('B')
      setAthleticismScore(7)
      setSkillScore(7)
      setIqScore(7)
      setCharacterScore(7)
      setAcademicsScore(7)
      setRecommendation('watch')
    } else {
      setSubmitError(res.error || 'Failed to submit evaluation')
    }
  }

  if (loading) return <DashboardLayout variant="coach" title="Loading..." subtitle=""><div className="animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="bg-navy-800 p-6 rounded-lg shadow-md h-24" />)}</div></DashboardLayout>

  return (
    <DashboardLayout variant="coach" title="Player Evaluation" subtitle={`${evalData.playerName} — ${evalData.position} | Class of ${evalData.gradClass}`} action={
      <div className="flex items-center gap-2">
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary flex items-center gap-2">
          <Plus size={16} /> Evaluation Report
        </button>
        <button onClick={shareEval} className="btn btn-secondary flex items-center gap-2">
          {copied ? <><Check size={16} /> Copied</> : <><Share2 size={16} /> Share</>}
        </button>
        <Link to="/coach/search" className="btn btn-secondary flex items-center gap-2">
          <ArrowLeft size={16} /> Back
        </Link>
      </div>
    }>
      <div className="max-w-5xl mx-auto space-y-6">
        {showForm && (
          <form onSubmit={handleSubmitEval} className="bg-navy-800 rounded-2xl border border-[#0134BD]/30 p-6 space-y-4 shadow-lg animate-in fade-in slide-in-from-top-4 duration-200">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Star size={18} className="text-[#FB6C1D]" /> Submit New Scout Report
            </h2>
            {submitError && <p className="text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">{submitError}</p>}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block">Overall Grade (A-F)</label>
                <select
                  value={overallGrade}
                  onChange={e => setOverallGrade(e.target.value)}
                  className="w-full bg-[#121B47]/50 border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#0134BD]"
                >
                  <option value="A+">A+</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block">Athleticism (0-10)</label>
                <input
                  type="number" min="0" max="10" value={athleticismScore} onChange={e => setAthleticismScore(Number(e.target.value))}
                  className="w-full bg-[#121B47]/50 border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#0134BD]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block">Skill (0-10)</label>
                <input
                  type="number" min="0" max="10" value={skillScore} onChange={e => setSkillScore(Number(e.target.value))}
                  className="w-full bg-[#121B47]/50 border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#0134BD]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block">IQ (0-10)</label>
                <input
                  type="number" min="0" max="10" value={iqScore} onChange={e => setIqScore(Number(e.target.value))}
                  className="w-full bg-[#121B47]/50 border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#0134BD]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block">Character (0-10)</label>
                <input
                  type="number" min="0" max="10" value={characterScore} onChange={e => setCharacterScore(Number(e.target.value))}
                  className="w-full bg-[#121B47]/50 border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#0134BD]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block">Academics (0-10)</label>
                <input
                  type="number" min="0" max="10" value={academicsScore} onChange={e => setAcademicsScore(Number(e.target.value))}
                  className="w-full bg-[#121B47]/50 border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#0134BD]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 block">Recommendation</label>
                <select
                  value={recommendation}
                  onChange={e => setRecommendation(e.target.value)}
                  className="w-full bg-[#121B47]/50 border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#0134BD]"
                >
                  <option value="offer">Offer</option>
                  <option value="watch">Watch</option>
                  <option value="pass">Pass</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 block">Scout Notes & Priority Actions</label>
              <textarea
                placeholder="Write detailed observation notes here..."
                value={scoutNotesText}
                onChange={e => setScoutNotesText(e.target.value)}
                className="w-full bg-[#121B47]/50 border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#0134BD] h-24"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-sm transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-[#0134BD] hover:bg-[#002a80] text-white rounded-lg font-medium text-sm transition-all disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Evaluation'}
              </button>
            </div>
          </form>
        )}

        <div className="bg-navy-800 rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="w-24 h-24 bg-[#0134BD] rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
            {evalData.playerName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
              <h1 className="text-2xl font-bold text-white">{evalData.playerName}</h1>
              <span className="text-3xl font-bold text-[#0134BD]">{evalData.overall}</span>
            </div>
            <p className="text-slate-400 mt-1">{evalData.position} • {evalData.school} • {evalData.height} • Class of {evalData.gradClass}</p>
            <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
              <Award size={16} className="text-[#C8A24A]" />
              <span className="text-sm font-medium text-[#C8A24A]">{evalData.projection}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Evaluated {evalData.evalDate} by {evalData.evaluator}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {evalData.categories.map(cat => (
            <div key={cat.label} className="bg-navy-800 rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#0134BD]" />
                  <span className="font-semibold text-white">{cat.label}</span>
                </div>
                <span className={`text-xl font-bold ${scoreColor(cat.score)}`}>{cat.score}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                <div className={`h-2 rounded-full ${scoreBar(cat.score)}`} style={{ width: `${cat.score}%` }} />
              </div>
              <p className="text-sm text-slate-400">{cat.notes}</p>
            </div>
          ))}
        </div>

        <div className="bg-navy-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><User size={18} /> Scout Notes</h2>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{evalData.scoutNotes}</p>
        </div>

        <div className="bg-navy-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><MessageSquare size={18} /> Coach Referral Notes <span className="text-xs text-gray-400 font-normal">(Elite Track)</span></h2>
          <div className="space-y-3 mb-6">
            {referralNotes.map(n => (
              <div key={n.id} className="bg-[#121B47]/50 p-3 rounded-lg border border-white/5">
                <p className="text-sm text-gray-300">{n.note}</p>
                <p className="text-xs text-gray-500 mt-2 text-right">{n.createdAt.slice(0, 10)} by {n.coachName}</p>
              </div>
            ))}
            {referralNotes.length === 0 && <p className="text-sm text-gray-400 italic">No referral notes found.</p>}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add private referral note..."
              value={newNote}
              onChange={e => setNewNote(e.target.value)}
              className="flex-1 bg-[#121B47]/50 border border-white/10 rounded-lg p-2 text-sm text-white outline-none focus:ring-1 focus:ring-[#0134BD]"
              onKeyDown={e => e.key === 'Enter' && addNote()}
            />
            <button onClick={addNote} className="btn btn-secondary px-4 py-2 text-sm">Add Note</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
            {referralNotes.length === 0 && <p className="text-sm text-gray-400 italic">No referral notes yet. Add your evaluation note.</p>}
