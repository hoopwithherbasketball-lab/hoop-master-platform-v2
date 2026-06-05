import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import StatusBadge from '../../components/ui/StatusBadge'

interface ReadinessStats {
  campaigns: number
  activePartners: number
  responseRate: number | null
}

export default function NILOverview() {
  const [summaries, setSummaries] = useState([
    { title: 'Brand Partnerships', value: 0, note: 'Active and pending deals' },
    { title: 'Opportunity Matches', value: 0, note: 'Best-fit NIL partners found' },
    { title: 'Outreach Messages', value: 0, note: 'Pending replies' },
  ])
  const [readiness, setReadiness] = useState<ReadinessStats | null>(null)

  useEffect(() => {
    Promise.all([
      supabase.from('nil_companies').select('*', { count: 'exact', head: true }),
      supabase.from('nil_opportunities').select('*', { count: 'exact', head: true }),
      supabase.from('nil_outreach').select('*', { count: 'exact', head: true }).eq('status', 'open'),
      supabase.from('nil_opportunities').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('nil_opportunities').select('company_id'),
      supabase.from('nil_outreach').select('*', { count: 'exact', head: true }),
      supabase.from('nil_outreach').select('*', { count: 'exact', head: true }).neq('status', 'open'),
    ]).then(([comp, opp, out, activeCampaigns, activeOpps, totalOutreach, respondedOutreach]) => {
      setSummaries([
        { title: 'Brand Partnerships', value: comp.count ?? 0, note: 'Active and pending deals' },
        { title: 'Opportunity Matches', value: opp.count ?? 0, note: 'Best-fit NIL partners found' },
        { title: 'Outreach Messages', value: out.count ?? 0, note: 'Pending replies' },
      ])
      const uniquePartners = new Set((activeOpps.data ?? []).map((r: { company_id: string | null }) => r.company_id).filter(Boolean)).size
      const total = totalOutreach.count ?? 0
      const responded = respondedOutreach.count ?? 0
      setReadiness({
        campaigns: activeCampaigns.count ?? 0,
        activePartners: uniquePartners,
        responseRate: total > 0 ? Math.round((responded / total) * 100) : null,
      })
    }).catch(console.error)
  }, [])

  return (
    <DashboardLayout variant="admin" title="NIL Overview" subtitle="Monitor athlete NIL readiness, brand matches, and outreach." >
      <div className="grid gap-5 md:grid-cols-3">
        {summaries.map((item) => (
          <div key={item.title} className="card p-6 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.title}</p>
            <p className="text-3xl font-bold text-white">{item.value}</p>
            <p className="text-sm text-slate-500">{item.note}</p>
          </div>
        ))}
      </div>
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Brand Readiness</h2>
            <p className="text-slate-500">Current athletes ready for sponsorship outreach.</p>
          </div>
          <StatusBadge status="complete" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl bg-white/5 p-4">
            <p className="text-xs uppercase text-slate-400">Campaigns</p>
            <p className="text-lg font-semibold text-white">{readiness?.campaigns ?? '—'}</p>
          </div>
          <div className="rounded-3xl bg-white/5 p-4">
            <p className="text-xs uppercase text-slate-400">Active Partners</p>
            <p className="text-lg font-semibold text-white">{readiness?.activePartners ?? '—'}</p>
          </div>
          <div className="rounded-3xl bg-white/5 p-4">
            <p className="text-xs uppercase text-slate-400">Response Rate</p>
            <p className="text-lg font-semibold text-white">
              {readiness?.responseRate != null ? `${readiness.responseRate}%` : '—'}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
