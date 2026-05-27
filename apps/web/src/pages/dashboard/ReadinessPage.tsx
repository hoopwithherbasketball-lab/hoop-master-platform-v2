import { useCurrentUserProfile } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import ReadinessGauge from '../../components/ui/ReadinessGauge'
import ScoreBar from '../../components/ui/ScoreBar'
import { Loader2 } from 'lucide-react'

export default function ReadinessPage() {
  const { profile, loading } = useCurrentUserProfile()
  const score = profile?.profile_completion_percent ?? 0

  if (loading) return <DashboardLayout variant="player" title="Readiness" subtitle="Loading..."><div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-slate-400" /></div></DashboardLayout>

  return (
    <DashboardLayout variant="player" title="Readiness" subtitle="Track your personal readiness for recruiting and NIL engagement.">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="card p-6">
          <ReadinessGauge score={score} size="lg" />
        </div>
        <div className="space-y-4">
          <ScoreBar label="Profile Completion" score={score} />
          <ScoreBar label="Profile Info" score={profile?.bio ? 90 : 30} />
          <ScoreBar label="Stats" score={profile?.position ? 80 : 20} />
          <ScoreBar label="Media" score={profile?.film_url ? 85 : 25} />
        </div>
      </div>
    </DashboardLayout>
  )
}
