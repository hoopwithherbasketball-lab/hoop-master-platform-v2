import { AuditCard } from '@hoop-master/ui'
import PageShell from '../../components/ui/PageShell'

const audits = [
  { title: 'Recruiting Review', description: 'Complete evaluation of your recruiting profile and highlight reel package.', label: 'Popular' },
  { title: 'Performance Audit', description: 'Advanced workout, nutrition, and mobility plan tailored to your position.', label: 'Coaching' },
  { title: 'NIL Assessment', description: 'Brand and market evaluation to determine high-value sponsorship readiness.', label: 'NIL' },
]

export default function AuditPage() {
  return (
    <PageShell title="Audit Services" description="Choose an audit to improve your recruiting, fitness, or NIL profile." badge="Audit">
      <div className="grid gap-6 md:grid-cols-3">
        {audits.map((entry) => (
          <AuditCard
            key={entry.title}
            title={entry.title}
            description={entry.description}
            label={entry.label}
          />
        ))}
      </div>
    </PageShell>
  )
}
