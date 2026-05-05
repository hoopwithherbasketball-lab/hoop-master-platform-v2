import { StatusBadge, ReadinessGauge, ScoreBar } from '@hoop-master/ui'

export default function UITestPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">UI Library Test</h1>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Status Badges</h2>
        <div className="flex gap-2">
          <StatusBadge status="active" />
          <StatusBadge status="pending" />
          <StatusBadge status="completed" />
          <StatusBadge status="error" />
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Readiness and Scores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-4 border rounded-lg">
            <h3 className="mb-4">Readiness Gauge</h3>
            <ReadinessGauge percentage={85} />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="mb-4">Score Bars</h3>
            <div className="space-y-2">
              <ScoreBar label="Athleticism" score={92} />
              <ScoreBar label="Skills" score={78} />
              <ScoreBar label="Academics" score={88} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
