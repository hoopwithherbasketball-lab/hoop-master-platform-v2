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
  const [overallScore, setOverallScore] = useState(80)
  const [scoutNotesText, setScoutNotesText] = useState('')
  const [strengthsText, setStrengthsText] = useState('')
  const [gapsText, setGapsText] = useState('')
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
      overallScore,
      strengths: strengthsText.split('\n').map(s => s.trim()).filter(Boolean),
      areasToImprove: gapsText.split('\n').map(s => s.trim()).filter(Boolean),
      scoutNotes: scoutNotesText,
      evaluatorId: user.id
    })
    
    setSubmitting(false)
    if (res.success) {
      setShowForm(false)
      setScoutNotesText('')
      setStrengthsText('')
      setGapsText('')
      setOverallScore(80)
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
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-xs font-semibold text-slate-400 block">Overall Score (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={overallScore}
                  onChange={e => setOverallScore(Number(e.target.value))}
                  className="w-full bg-[#121B47]/50 border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#0134BD]"
                  required
                />
              </div>
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-xs font-semibold text-slate-400 block">Strengths (one per line)</label>
                <textarea
                  placeholder="Excellent handles&#10;Active hands on defense"
                  value={strengthsText}
                  onChange={e => setStrengthsText(e.target.value)}
                  className="w-full bg-[#121B47]/50 border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#0134BD] h-20 resize-none"
                />
              </div>
              <div className="space-y-1.5 md:col-span-1">
                <label className="text-xs font-semibold text-slate-400 block">Areas to Improve (one per line)</label>
                <textarea
                  placeholder="Left hand finish&#10;Off-ball rotation speed"
                  value={gapsText}
                  onChange={e => setGapsText(e.target.value)}
                  className="w-full bg-[#121B47]/50 border border-white/10 rounded-lg p-2.5 text-white text-sm outline-none focus:ring-1 focus:ring-[#0134BD] h-20 resize-none"
                />
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

        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-5">
            <h3 className="font-bold text-green-400 mb-3 flex items-center gap-2"><Award size={16} /> Strengths</h3>
            <ul className="space-y-2">{evalData.strengths.map(s => <li key={s} className="flex items-center gap-2 text-sm text-green-300"><span className="w-1.5 h-1.5 bg-green-500 rounded-full" />{s}</li>)}</ul>
            {evalData.strengths.length === 0 && <p className="text-xs text-gray-400 italic">No strengths listed.</p>}
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
            <h3 className="font-bold text-amber-400 mb-3 flex items-center gap-2"><Target size={16} /> Areas to Improve</h3>
            <ul className="space-y-2">{evalData.areasToImprove.map(s => <li key={s} className="flex items-center gap-2 text-sm text-amber-300"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />{s}</li>)}</ul>
            {evalData.areasToImprove.length === 0 && <p className="text-xs text-gray-400 italic">No areas to improve listed.</p>}
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
            <h3 className="font-bold text-blue-400 mb-3 flex items-center gap-2"><User size={16} /> Comparable</h3>
            <p className="text-sm text-blue-300">{evalData.comparablePlayer || 'None specified'}</p>
          </div>
        </div>

        <div className="bg-navy-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><MessageSquare size={18} /> Coach Referral Notes <span className="text-xs text-gray-400 font-normal">(Elite Track)</span></h2>
          <div className="space-y-3 mb-4">
            {referralNotes.length === 0 && <p className="text-sm text-gray-400 italic">No referral notes yet. Add your evaluation note.</p>}
            {referralNotes.map(n => (
              <div key={n.id} className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-white">{n.coachName}</span>
                  <span className="text-xs text-gray-400">{n.date}</span>
                </div>
                <p className="text-sm text-gray-300">{n.content}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a referral note..." className="flex-1 p-3 bg-[#121B47]/50 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-[#0134BD] text-sm text-white" />
            <button onClick={addNote} className="flex items-center gap-1 px-4 py-2.5 bg-[#0134BD] text-white rounded-lg font-medium text-sm hover:bg-[#002a80]"><Plus size={16} /> Add</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
