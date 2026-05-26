import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'

export default function AdminAuditsPage() {
  const [audits, setAudits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('audit_submissions').select('*').order('submitted_at', { ascending: false }).then(({ data }) => { setAudits(data ?? []); setLoading(false) }, e => { console.error('AdminAuditsPage load error:', e); setLoading(false) })
  }, [])

  return (
    <DashboardLayout variant="admin" title="Audit Submissions" subtitle="Incoming Recruit-Ready Audit requests">
      {loading ? (<div className="animate-pulse space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="card h-20" />)}</div>) : audits.length === 0 ? (
        <div className="card text-center py-14"><p className="font-display text-xl font-bold text-slate-300">No audit submissions yet</p></div>
      ) : (
        <div className="space-y-4 max-w-3xl">
          {audits.map((a: any) => (
            <div key={a.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-gray-200 text-sm">Submission #{a.id?.slice(-6)}</p>
                <p className="text-xs text-slate-400">{new Date(a.submitted_at).toLocaleDateString()}</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                {a.goals && <div className="bg-white/5 rounded-lg p-3"><p className="text-xs font-semibold text-slate-500 mb-1">Goals</p><p className="text-gray-300">{a.goals}</p></div>}
                {a.biggest_concern && <div className="bg-white/5 rounded-lg p-3"><p className="text-xs font-semibold text-slate-500 mb-1">Biggest Concern</p><p className="text-gray-300">{a.biggest_concern}</p></div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
