import { useCurrentUserProfile } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import ReadinessGauge from '../../components/ui/ReadinessGauge'
import ScoreBar from '../../components/ui/ScoreBar'
import { Loader as Loader2 } from 'lucide-react'

export default function ReadinessPage() {
  const { profile, loading } = useCurrentUserProfile()
  const score = profile?.profile_completion_percent ?? 0

  const infoScore = profile
    ? Math.round([profile.first_name, profile.last_name, profile.bio, profile.position, profile.class_year, profile.school_name, profile.state].filter(Boolean).length / 7 * 100)
    : 0

  const statsScore = profile
    ? Math.round([profile.gpa, profile.height, profile.position, profile.secondary_position, profile.team_name].filter(Boolean).length / 5 * 100)
    : 0

  const mediaScore = profile
    ? Math.round([profile.film_url, profile.instagram_handle, profile.twitter_handle].filter(Boolean).length / 3 * 100)
    : 0

  if (loading) return <DashboardLayout variant="player" title="Readiness" subtitle="Loading..."><div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-slate-400" /></div></DashboardLayout>

  return (
    <DashboardLayout variant="player" title="Readiness" subtitle="Track your personal readiness for recruiting and NIL engagement.">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="card p-6">
          <ReadinessGauge score={score} size="lg" />
        </div>
        <div className="space-y-4">
          <ScoreBar label="Profile Completion" score={score} />
          <ScoreBar label="Profile Info" score={infoScore} />
          <ScoreBar label="Stats & Measurables" score={statsScore} />
          <ScoreBar label="Media & Film" score={mediaScore} />
        </div>
      </div>
    </DashboardLayout>
  )
}
