import { useCurrentUserProfile } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import ReadinessGauge from '../../components/ui/ReadinessGauge'
import ScoreBar from '../../components/ui/ScoreBar'
import { Loader2 } from 'lucide-react'

export default function ProfileOptimizerPage() {
  const { profile, loading } = useCurrentUserProfile()
  const score = profile?.profile_completion_percent ?? 0
  const hasBio = profile?.bio ? 85 : 30
  const hasPosition = profile?.position ? 90 : 20
  const hasSchool = profile?.school_name ? 80 : 25
  const hasMedia = profile?.film_url || profile?.instagram_handle ? 75 : 20

  if (loading) return <DashboardLayout variant="player" title="Profile Optimizer" subtitle="Loading..."><div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-slate-400" /></div></DashboardLayout>

  return (
    <DashboardLayout variant="player" title="Profile Optimizer" subtitle="Improve your profile before the next recruiting cycle.">
      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <div className="card p-6 space-y-5">
          <ReadinessGauge score={score} size="lg" />
          <p className="text-sm text-slate-500">{score >= 80 ? 'Your profile is well positioned for coach outreach.' : 'Completing your profile information will improve your visibility to recruiters.'}</p>
        </div>
        <div className="space-y-4">
          <ScoreBar label="Profile Info" score={hasPosition} />
          <ScoreBar label="Bio & Details" score={hasBio} />
          <ScoreBar label="School Info" score={hasSchool} />
          <ScoreBar label="Media Presence" score={hasMedia} />
        </div>
      </div>
    </DashboardLayout>
  )
}
