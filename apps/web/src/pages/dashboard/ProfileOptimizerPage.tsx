import DashboardLayout from '../../components/layout/DashboardLayout'
import ReadinessGauge from '../../components/ui/ReadinessGauge'
import ScoreBar from '../../components/ui/ScoreBar'

export default function ProfileOptimizerPage() {
  return (
    <DashboardLayout variant="player" title="Profile Optimizer" subtitle="Improve your profile before the next recruiting cycle." >
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="card p-6 space-y-5">
          <ReadinessGauge score={81} size="lg" />
          <p className="text-sm text-slate-500">Your optimized profile is well positioned for outreach. Focus on strength training and exposure content to push into the top tier.</p>
        </div>
        <div className="space-y-4">
          <ScoreBar label="Showcase Readiness" score={82} />
          <ScoreBar label="Academic Profile" score={88} />
          <ScoreBar label="Highlight Reels" score={76} />
          <ScoreBar label="Social Presence" score={68} />
        </div>
      </div>
    </DashboardLayout>
  )
}
