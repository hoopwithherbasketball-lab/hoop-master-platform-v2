import DashboardLayout from '../../components/layout/DashboardLayout'
import StatusBadge from '../../components/ui/StatusBadge'

const summaries = [
  { title: 'Brand Partnerships', value: 6, note: 'Active and pending deals' },
  { title: 'Opportunity Matches', value: 12, note: 'Best-fit NIL partners found' },
  { title: 'Outreach Messages', value: 8, note: 'Pending replies' },
]

export default function NILOverview() {
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
          <div className="rounded-3xl bg-white/5 p-4"><p className="text-xs uppercase text-slate-400">Campaigns</p><p className="text-lg font-semibold text-white">14</p></div>
          <div className="rounded-3xl bg-white/5 p-4"><p className="text-xs uppercase text-slate-400">Active Partners</p><p className="text-lg font-semibold text-white">7</p></div>
          <div className="rounded-3xl bg-white/5 p-4"><p className="text-xs uppercase text-slate-400">Response Rate</p><p className="text-lg font-semibold text-white">82%</p></div>
        </div>
      </div>
    </DashboardLayout>
  )
}
