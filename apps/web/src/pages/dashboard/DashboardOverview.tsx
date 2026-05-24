import DashboardLayout from '../../components/layout/DashboardLayout'

const stats = [
  { label: 'Readiness', value: '82%', note: 'Performance ahead of peer average' },
  { label: 'NIL Score', value: '74', note: 'Brand visibility is growing' },
  { label: 'Upcoming Events', value: '5', note: 'Next event in 14 days' },
  { label: 'Service Requests', value: '3', note: 'Two requests pending review' },
]

export default function DashboardOverview() {
  return (
    <DashboardLayout variant="player" title="Dashboard Overview" subtitle="Your athlete hub for recruiting, NIL, and development." >
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div key={item.label} className="card p-6 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
            <p className="text-3xl font-bold text-white">{item.value}</p>
            <p className="text-sm text-slate-500">{item.note}</p>
          </div>
        ))}
      </div>
    </DashboardLayout>
  )
}
