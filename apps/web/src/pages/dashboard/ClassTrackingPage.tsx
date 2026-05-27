import { useCurrentUserProfile, useVerification, VerifiedBadge } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Loader2 } from 'lucide-react'

const currentYear = new Date().getFullYear()

export default function ClassTrackingPage() {
  const { profile, loading } = useCurrentUserProfile()
  const verification = useVerification()

  const gradClass = profile?.class_year ?? currentYear + 1
  const name = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Your Player' : 'Your Player'
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()

  const hsStart = gradClass - 4
  const milestones = [
    { year: 'Freshman', grade: `${hsStart}-${hsStart + 1}` },
    { year: 'Sophomore', grade: `${hsStart + 1}-${hsStart + 2}` },
    { year: 'Junior', grade: `${hsStart + 2}-${hsStart + 3}` },
    { year: 'Senior', grade: `${hsStart + 3}-${hsStart + 4}` },
  ]

  const currentMilestoneIdx = Math.min(Math.max(gradClass - currentYear, 0), 3)
  const completedCount = currentMilestoneIdx

  if (loading) return <DashboardLayout variant="player" title="Class Tracking" subtitle="Loading..."><div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-slate-400" /></div></DashboardLayout>

  return (
    <DashboardLayout variant="player" title="Class Tracking" subtitle="Track your development and milestones by graduation class.">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4 bg-navy-800 p-6 rounded-xl shadow-md">
          <div className="w-16 h-16 bg-[#0134BD] rounded-full flex items-center justify-center text-2xl font-bold text-white">{initials}</div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">{name}</h2>
              <VerifiedBadge level={verification.badge} />
            </div>
            <p className="text-slate-400 mt-1">Class of {gradClass} • {profile?.position || 'Position'} • {profile?.school_name || 'School'}</p>
          </div>
        </div>

        <div className="grid gap-6">
          {milestones.map((m, idx) => {
            const isCurrent = idx === currentMilestoneIdx
            return (
              <div key={m.year} className={`relative pl-8 ${idx < milestones.length - 1 ? 'border-l-2 border-[#0134BD] pb-6' : ''}`}>
                <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 ${isCurrent ? 'bg-[#FB6C1D] border-[#FB6C1D]' : 'bg-navy-800 border-[#0134BD]'}`} />
                <div className={`bg-navy-800 p-5 rounded-xl shadow-sm ${isCurrent ? 'ring-2 ring-[#FB6C1D]' : ''}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-white">{m.year}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isCurrent ? 'bg-orange-500/20 text-orange-400' : 'bg-white/10 text-slate-400'}`}>{m.grade}</span>
                    {isCurrent && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Active</span>}
                    {idx < currentMilestoneIdx && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Complete</span>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-gradient-to-r from-[#121B47] to-[#0134BD] text-white p-6 rounded-xl text-center">
          <p className="text-lg font-semibold">Class of {gradClass} — {completedCount} milestone{completedCount !== 1 ? 's' : ''} completed</p>
          <p className="text-blue-200 text-sm mt-1">{currentMilestoneIdx < 3 ? `${milestones[currentMilestoneIdx].year} year in progress` : 'Graduation year reached'}</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
