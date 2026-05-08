import DashboardLayout from '../../components/layout/DashboardLayout'
import ReadinessGauge from '../../components/ui/ReadinessGauge'
import ScoreBar from '../../components/ui/ScoreBar'

export default function ReadinessPage() {
  return (
    <DashboardLayout variant="player" title="Readiness" subtitle="Track your personal readiness for recruiting and NIL engagement." >
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="card p-6">
          <ReadinessGauge score={79} size="lg" />
        </div>
        <div className="space-y-4">
          <ScoreBar label="Athletic Grade" score={82} />
          <ScoreBar label="Recruiting Profile" score={77} />
          <ScoreBar label="Exposure" score={69} />
          <ScoreBar label="Brand Fit" score={74} />
        </div>
      </div>
    </DashboardLayout>
  )
}
