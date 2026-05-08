import PageShell from '../../components/ui/PageShell'

const audits = [
  { title: 'Recruiting Review', description: 'Complete evaluation of your recruiting profile and highlight reel package.', label: 'Popular' },
  { title: 'Performance Audit', description: 'Advanced workout, nutrition, and mobility plan tailored to your position.', label: 'Coaching' },
  { title: 'NIL Assessment', description: 'Brand and market evaluation to determine high-value sponsorship readiness.', label: 'NIL' },
]

export default function AuditPage() {
  return (
    <PageShell title="Audit Services" description="Choose an audit to improve your recruiting, fitness, or NIL profile." badge="Audit">
      <div className="grid gap-5 md:grid-cols-3">
        {audits.map((entry) => (
          <div key={entry.title} className="card p-6 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{entry.label}</p>
              <h2 className="text-xl font-semibold text-navy-900 mt-2">{entry.title}</h2>
            </div>
            <p className="text-slate-500">{entry.description}</p>
            <button className="btn btn-primary">Book audit</button>
          </div>
        ))}
      </div>
    </PageShell>
  )
}
