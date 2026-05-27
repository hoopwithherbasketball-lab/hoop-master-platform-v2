import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAdminEvaluations } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { FileText, Eye, Edit3, CheckCircle, Clock, Archive, Trash2, X, Check, AlertTriangle } from 'lucide-react'

const statusConfig = {
  published: { icon: CheckCircle, label: 'Published', class: 'bg-green-500/20 text-green-400' },
  draft: { icon: Clock, label: 'Draft', class: 'bg-yellow-100 text-yellow-700' },
  archived: { icon: Archive, label: 'Archived', class: 'bg-white/10 text-slate-400' },
}

interface AuditFull {
  id: string
  total_score: number | null
  readiness_band: string | null
  strengths: string | null
  gaps: string | null
  priority_actions: string | null
}

export default function AdminEvaluationsPage() {
  const { evaluations } = useAdminEvaluations()
  const [auditDataMap, setAuditDataMap] = useState<Record<string, AuditFull>>({})
  const [editingEval, setEditingEval] = useState<typeof evaluations[0] | null>(null)
  const [deleteEval, setDeleteEval] = useState<typeof evaluations[0] | null>(null)
  const [form, setForm] = useState({ total_score: 0, readiness_band: '', strengths: '', gaps: '', priority_actions: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase
      .from('audit_results')
      .select(`id, total_score, readiness_band, strengths, gaps, priority_actions, audit_submissions!inner(player_profile_id)`)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) {
          const map: Record<string, AuditFull> = {}
          ;(data as any[]).forEach((r: any) => {
            const ppid = r.audit_submissions?.[0]?.player_profile_id
            if (ppid) {
              map[ppid] = { id: r.id, total_score: r.total_score, readiness_band: r.readiness_band, strengths: r.strengths, gaps: r.gaps, priority_actions: r.priority_actions }
            }
          })
          setAuditDataMap(map)
        }
      })
  }, [])

  const openEdit = (e: typeof evaluations[0]) => {
    const full = auditDataMap[e.playerId]
    setEditingEval(e)
    setForm({
      total_score: full?.total_score ?? 0,
      readiness_band: full?.readiness_band ?? '',
      strengths: full?.strengths ?? '',
      gaps: full?.gaps ?? '',
      priority_actions: full?.priority_actions ?? '',
    })
  }

  const handleUpdate = async () => {
    if (!editingEval) return
    setSaving(true)
    const full = auditDataMap[editingEval.playerId]
    if (full) {
      await supabase.from('audit_results').update({
        total_score: form.total_score,
        readiness_band: form.readiness_band || null,
        strengths: form.strengths || null,
        gaps: form.gaps || null,
        priority_actions: form.priority_actions || null,
      }).eq('id', full.id)
    }
    setSaving(false)
    setEditingEval(null)
    window.location.reload()
  }

  const handleDelete = async () => {
    if (!deleteEval) return
    const full = auditDataMap[deleteEval.playerId]
    if (full) {
      await supabase.from('audit_results').delete().eq('id', full.id)
    }
    setDeleteEval(null)
    window.location.reload()
  }

  return (
    <DashboardLayout variant="admin" title="Player Evaluations" subtitle="Manage scouting evaluations across all prospects.">
      <div className="max-w-5xl mx-auto">
        <div className="bg-navy-800 rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-5 py-3 text-left text-xs text-slate-400 uppercase tracking-wider">Player</th>
                <th className="px-5 py-3 text-left text-xs text-slate-400 uppercase tracking-wider">Position</th>
                <th className="px-5 py-3 text-left text-xs text-slate-400 uppercase tracking-wider">Class</th>
                <th className="px-5 py-3 text-left text-xs text-slate-400 uppercase tracking-wider">Rating</th>
                <th className="px-5 py-3 text-left text-xs text-slate-400 uppercase tracking-wider">Evaluator</th>
                <th className="px-5 py-3 text-left text-xs text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-right text-xs text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {evaluations.map(e => {
                const sc = statusConfig[e.status]
                const Icon = sc.icon
                return (
                  <tr key={e.playerId} className="hover:bg-white/5">
                    <td className="px-5 py-4 font-medium text-white">{e.playerName}</td>
                    <td className="px-5 py-4 text-slate-400">{e.position}</td>
                    <td className="px-5 py-4 text-slate-400">{e.gradClass}</td>
                    <td className="px-5 py-4">
                      <span className={`font-bold ${e.overall >= 90 ? 'text-green-600' : e.overall >= 80 ? 'text-blue-600' : 'text-amber-600'}`}>{e.overall}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-400">{e.evaluator}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${sc.class}`}>
                        <Icon size={12} /> {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/coach/evaluation/${e.playerId}`} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-100"><Eye size={14} className="text-slate-400" /></Link>
                        <button onClick={() => openEdit(e)} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-amber-100"><Edit3 size={14} className="text-slate-400" /></button>
                        <button onClick={() => setDeleteEval(e)} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-100"><Trash2 size={14} className="text-red-400" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
          <FileText size={14} /> {evaluations.length} evaluations • {evaluations.filter(e => e.status === 'published').length} published
        </div>
      </div>

      {editingEval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setEditingEval(null)}>
          <div className="bg-navy-800 rounded-xl p-6 w-full max-w-lg mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Edit Evaluation</h3>
              <button onClick={() => setEditingEval(null)}><X size={20} className="text-gray-400 hover:text-white" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Player</label>
                <input value={editingEval.playerName} disabled className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white/60 outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Total Score</label>
                <input type="number" value={form.total_score} onChange={e => setForm({ ...form, total_score: Number(e.target.value) })} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Readiness Band</label>
                <input value={form.readiness_band} onChange={e => setForm({ ...form, readiness_band: e.target.value })} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD]" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Strengths</label>
                <textarea value={form.strengths} onChange={e => setForm({ ...form, strengths: e.target.value })} rows={3} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD] resize-none" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Gaps</label>
                <textarea value={form.gaps} onChange={e => setForm({ ...form, gaps: e.target.value })} rows={3} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD] resize-none" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Priority Actions</label>
                <textarea value={form.priority_actions} onChange={e => setForm({ ...form, priority_actions: e.target.value })} rows={3} className="w-full p-2.5 border border-white/20 rounded-lg bg-transparent text-white outline-none focus:border-[#0134BD] resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setEditingEval(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleUpdate} disabled={saving} className="flex items-center gap-1.5 bg-[#0134BD] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : <><Check size={16} /> Update</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteEval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDeleteEval(null)}>
          <div className="bg-navy-800 rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-red-400" />
              <h3 className="text-lg font-bold text-white">Delete Evaluation</h3>
            </div>
            <p className="text-sm text-gray-400 mb-5">Are you sure you want to delete the evaluation for <strong className="text-white">{deleteEval.playerName}</strong>? This cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteEval(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleDelete} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"><Trash2 size={16} /> Delete</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
