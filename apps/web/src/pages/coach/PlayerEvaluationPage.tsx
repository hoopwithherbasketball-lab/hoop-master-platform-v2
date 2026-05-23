import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { usePlayerEvaluation, useCoachReferral } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { ArrowLeft, TrendingUp, Award, Target, User, Plus, MessageSquare, Share2, Check } from 'lucide-react'

function scoreColor(s: number): string {
  if (s >= 90) return 'text-green-600'
  if (s >= 80) return 'text-blue-600'
  if (s >= 70) return 'text-amber-600'
  return 'text-red-600'
}

function scoreBar(s: number): string {
  if (s >= 90) return 'bg-green-500'
  if (s >= 80) return 'bg-blue-500'
  if (s >= 70) return 'bg-amber-500'
  return 'bg-red-500'
}

export default function PlayerEvaluationPage() {
  const { id } = useParams<{ id: string }>()
  const { evaluation: evalData, loading } = usePlayerEvaluation(id || '1')
  const { notes: referralNotes, newNote, setNewNote, addNote } = useCoachReferral(id || '1')
  const [copied, setCopied] = useState(false)

  const shareEval = () => {
    navigator.clipboard.writeText(`${window.location.origin}/coach/evaluation/${id}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <DashboardLayout variant="coach" title="Loading..." subtitle=""><div className="animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="bg-white p-6 rounded-lg shadow-md h-24" />)}</div></DashboardLayout>

  return (
    <DashboardLayout variant="coach" title="Player Evaluation" subtitle={`${evalData.playerName} — ${evalData.position} | Class of ${evalData.gradClass}`} action={
      <div className="flex items-center gap-2"><button onClick={shareEval} className="btn btn-secondary flex items-center gap-2">{copied ? <><Check size={16} /> Copied</> : <><Share2 size={16} /> Share</>}</button><Link to="/coach/search" className="btn btn-secondary flex items-center gap-2"><ArrowLeft size={16} /> Back</Link></div>
    }>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="w-24 h-24 bg-[#0134BD] rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
            {evalData.playerName.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start flex-wrap">
              <h1 className="text-2xl font-bold text-[#121B47]">{evalData.playerName}</h1>
              <span className="text-3xl font-bold text-[#0134BD]">{evalData.overall}</span>
            </div>
            <p className="text-gray-500 mt-1">{evalData.position} • {evalData.school} • {evalData.height} • Class of {evalData.gradClass}</p>
            <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
              <Award size={16} className="text-[#C8A24A]" />
              <span className="text-sm font-medium text-[#C8A24A]">{evalData.projection}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Evaluated {evalData.evalDate} by {evalData.evaluator}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {evalData.categories.map(cat => (
            <div key={cat.label} className="bg-white rounded-xl shadow-sm p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-[#0134BD]" />
                  <span className="font-semibold text-[#121B47]">{cat.label}</span>
                </div>
                <span className={`text-xl font-bold ${scoreColor(cat.score)}`}>{cat.score}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                <div className={`h-2 rounded-full ${scoreBar(cat.score)}`} style={{ width: `${cat.score}%` }} />
              </div>
              <p className="text-sm text-gray-500">{cat.notes}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#121B47] mb-4 flex items-center gap-2"><User size={18} /> Scout Notes</h2>
          <p className="text-gray-700 leading-relaxed">{evalData.scoutNotes}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-green-50 rounded-xl p-5 border border-green-200">
            <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2"><Award size={16} /> Strengths</h3>
            <ul className="space-y-2">{evalData.strengths.map(s => <li key={s} className="flex items-center gap-2 text-sm text-green-700"><span className="w-1.5 h-1.5 bg-green-500 rounded-full" />{s}</li>)}</ul>
          </div>
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
            <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2"><Target size={16} /> Areas to Improve</h3>
            <ul className="space-y-2">{evalData.areasToImprove.map(s => <li key={s} className="flex items-center gap-2 text-sm text-amber-700"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />{s}</li>)}</ul>
          </div>
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2"><User size={16} /> Comparable</h3>
            <p className="text-sm text-blue-700">{evalData.comparablePlayer}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#121B47] mb-4 flex items-center gap-2"><MessageSquare size={18} /> Coach Referral Notes <span className="text-xs text-gray-400 font-normal">(Elite Track)</span></h2>
          <div className="space-y-3 mb-4">
            {referralNotes.length === 0 && <p className="text-sm text-gray-400 italic">No referral notes yet. Add your evaluation note.</p>}
            {referralNotes.map(n => (
              <div key={n.id} className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-[#121B47]">{n.coachName}</span>
                  <span className="text-xs text-gray-400">{n.date}</span>
                </div>
                <p className="text-sm text-gray-700">{n.content}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a referral note..." className="flex-1 p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#0134BD] text-sm" />
            <button onClick={addNote} className="flex items-center gap-1 px-4 py-2.5 bg-[#0134BD] text-white rounded-lg font-medium text-sm hover:bg-[#002a80]"><Plus size={16} /> Add</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
