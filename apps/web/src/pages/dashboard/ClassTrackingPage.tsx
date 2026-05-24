import { VerifiedBadge, useVerification } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'

const milestones = [
  { year: 'Freshman', grade: '2024-25', items: ['Varsity roster selection', 'Summer AAU circuit', 'First highlight reel'] },
  { year: 'Sophomore', grade: '2025-26', items: ['Starting lineup', 'Team captain nominee', 'College ID camp attendance'] },
  { year: 'Junior', grade: '2026-27', items: ['Full stats tracking', 'Coach connections', 'Recruiting one-pager'] },
  { year: 'Senior', grade: '2027-28', items: ['Official visits', 'National Letter of Intent', 'Graduation'] },
]

const currentClass = '2026'

export default function ClassTrackingPage() {
  const verification = useVerification()

  return (
    <DashboardLayout variant="player" title="Class Tracking" subtitle="Track your development and milestones by graduation class.">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4 bg-navy-800 p-6 rounded-xl shadow-md">
          <div className="w-16 h-16 bg-[#0134BD] rounded-full flex items-center justify-center text-2xl font-bold text-white">AG</div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">Ava Grant</h2>
              <VerifiedBadge level={verification.badge} />
            </div>
            <p className="text-slate-400 mt-1">Class of {currentClass} • SG • Sierra Canyon</p>
          </div>
        </div>

        <div className="grid gap-6">
          {milestones.map((m, idx) => {
            const isCurrent = m.grade.startsWith(currentClass.slice(0, 4))
            return (
              <div key={m.year} className={`relative pl-8 ${idx < milestones.length - 1 ? 'border-l-2 border-[#0134BD] pb-6' : ''}`}>
                <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 ${isCurrent ? 'bg-[#FB6C1D] border-[#FB6C1D]' : 'bg-navy-800 border-[#0134BD]'}`} />
                <div className={`bg-navy-800 p-5 rounded-xl shadow-sm ${isCurrent ? 'ring-2 ring-[#FB6C1D]' : ''}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-bold text-white">{m.year}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isCurrent ? 'bg-orange-500/20 text-orange-400' : 'bg-white/10 text-slate-400'}`}>{m.grade}</span>
                    {isCurrent && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-400">Active</span>}
                  </div>
                  <ul className="space-y-2">
                    {m.items.map(item => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="text-[#0134BD]">✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        <div className="bg-gradient-to-r from-[#121B47] to-[#0134BD] text-white p-6 rounded-xl text-center">
          <p className="text-lg font-semibold">Class of {currentClass} — 3 milestones completed</p>
          <p className="text-blue-200 text-sm mt-1">Next up: Coach connections & Recruiting one-pager</p>
        </div>
      </div>
    </DashboardLayout>
  )
}
