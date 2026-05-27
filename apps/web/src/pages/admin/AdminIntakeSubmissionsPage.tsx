import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { User, Calendar, Package, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
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

  const load = useCallback(async () => {
    try {
      const { data } = await supabase.from('intake_submissions').select('*').order('created_at', { ascending: false })
      setSubmissions(data ?? [])
    } catch (e) { console.error(e) }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

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
                <div className="px-4 pb-4 pt-2 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><p className="text-xs text-slate-500 mb-1">Gender</p><p className="text-white">{s.gender || '—'}</p></div>
                  <div><p className="text-xs text-slate-500 mb-1">State</p><p className="text-white">{s.state || '—'}</p></div>
                  <div><p className="text-xs text-slate-500 mb-1">Goal</p><p className="text-white">{s.goal || '—'}</p></div>
                  <div><p className="text-xs text-slate-500 mb-1">Package</p><p className="text-white capitalize">{s.package_selected}</p></div>
                  <div><p className="text-xs text-slate-500 mb-1">Player Profile</p>{s.player_profile_id ? <Link to={`/admin/players/${s.player_profile_id}`} className="text-royal-400 hover:underline flex items-center gap-1"><ExternalLink size={12} /> View</Link> : <p className="text-slate-500">—</p>}</div>
                  <div><p className="text-xs text-slate-500 mb-1">Auth User</p>{s.auth_user_id ? <p className="text-green-400 text-xs">Created</p> : <p className="text-slate-500">—</p>}</div>
                </div>
              )}
            </div>
          ))}
          {submissions.length === 0 && <div className="card p-8 text-center text-slate-400">No intake submissions yet.</div>}
        </div>
      )}
    </DashboardLayout>
  )
}
