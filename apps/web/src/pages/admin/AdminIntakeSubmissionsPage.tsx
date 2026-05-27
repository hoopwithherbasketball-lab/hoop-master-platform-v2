import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { User, Calendar, Package, ExternalLink, ChevronDown, ChevronUp, Trash2, AlertTriangle } from 'lucide-react'
import { Link } from 'react-router-dom'

interface IntakeSubmission {
  id: string; player_name: string; parent_email: string; package_selected: string
  grad_class: string; gender: string; primary_position: string; state: string
  goal: string; player_profile_id: string | null; auth_user_id: string | null
  created_at: string
}

export default function AdminIntakeSubmissionsPage() {
  const [submissions, setSubmissions] = useState<IntakeSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const { data } = await supabase.from('intake_submissions').select('*').order('created_at', { ascending: false })
      setSubmissions(data ?? [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const del = async () => {
    if (!deleteId) return
    try {
      await supabase.from('intake_submissions').delete().eq('id', deleteId)
      setDeleteId(null)
      window.location.reload()
    } catch (e) { console.error(e) }
  }

  return (
    <DashboardLayout variant="admin" title="Intake Submissions" subtitle="Player registrations from the public form">
      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3,4].map(i => <div key={i} className="card h-20" />)}</div>
      ) : (
        <div className="space-y-3">
          {submissions.map(s => (
            <div key={s.id} className="card">
              <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-royal-500/20 rounded-full flex items-center justify-center"><User size={18} className="text-royal-400" /></div>
                  <div>
                    <p className="font-semibold text-white">{s.player_name}</p>
                    <p className="text-xs text-slate-400">{s.parent_email} · {s.primary_position} · Class of {s.grad_class}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${s.package_selected === 'free' ? 'badge-navy' : 'badge-orange'}`}>{s.package_selected}</span>
                  <span className="text-xs text-slate-500"><Calendar size={12} className="inline mr-1" />{new Date(s.created_at).toLocaleDateString()}</span>
                  {expanded === s.id ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                </div>
              </div>
              {expanded === s.id && (
                <div className="px-4 pb-4 pt-2 border-t border-white/10">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div><p className="text-xs text-slate-500 mb-1">Gender</p><p className="text-white">{s.gender || '—'}</p></div>
                    <div><p className="text-xs text-slate-500 mb-1">State</p><p className="text-white">{s.state || '—'}</p></div>
                    <div><p className="text-xs text-slate-500 mb-1">Goal</p><p className="text-white">{s.goal || '—'}</p></div>
                    <div><p className="text-xs text-slate-500 mb-1">Package</p><p className="text-white capitalize">{s.package_selected}</p></div>
                    <div><p className="text-xs text-slate-500 mb-1">Player Profile</p>{s.player_profile_id ? <Link to={`/admin/players/${s.player_profile_id}`} className="text-royal-400 hover:underline flex items-center gap-1"><ExternalLink size={12} /> View</Link> : <p className="text-slate-500">—</p>}</div>
                    <div><p className="text-xs text-slate-500 mb-1">Auth User</p>{s.auth_user_id ? <p className="text-green-400 text-xs">Created</p> : <p className="text-slate-500">—</p>}</div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 flex justify-end">
                    <button onClick={() => setDeleteId(s.id)} className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/20 rounded-lg"><Trash2 size={14} /> Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {submissions.length === 0 && <div className="card p-8 text-center text-slate-400">No intake submissions yet.</div>}
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDeleteId(null)}>
          <div className="bg-navy-800 rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 text-center" onClick={e => e.stopPropagation()}>
            <AlertTriangle size={32} className="mx-auto mb-3 text-red-400" />
            <h3 className="text-lg font-bold text-white mb-1">Delete Submission?</h3>
            <p className="text-sm text-slate-400 mb-5">This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Cancel</button>
              <button onClick={del} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
