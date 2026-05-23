import { useVerification, VerifiedBadge } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Printer } from 'lucide-react'

const mockPlayer = {
  name: 'Ava Grant',
  gradClass: '2026',
  position: 'SG',
  height: "5'11\"",
  school: 'Sierra Canyon',
  city: 'Chatsworth',
  state: 'CA',
  gpa: '3.8',
  stats: { ppg: '18.4', apg: '5.2', rpg: '7.8', spg: '2.1', bpg: '1.3', fgp: '47.2', threep: '34.5', ftp: '81.0' },
  bio: 'Dynamic two-way guard with elite court vision. Three-year varsity starter. Team captain and honor roll student.',
  filmLinks: ['youtube.com/watch?v=abc123', 'youtube.com/watch?v=def456'],
  coachContact: 'Coach Williams • williams@sierracanyon.edu • (818) 555-0123',
}

export default function OnePagerPage() {
  const verification = useVerification()
  const p = mockPlayer

  return (
    <DashboardLayout variant="player" title="Recruiting One-Pager" subtitle="Your shareable profile for college coaches" action={
      <button onClick={() => window.print()} className="btn btn-secondary flex items-center gap-2"><Printer size={16} /> Print</button>
    }>
      <div id="onepager-content" className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden print:shadow-none print:rounded-none">
        <div className="bg-gradient-to-r from-[#121B47] to-[#0134BD] text-white p-8 print:p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold">{p.name}</h1>
                <VerifiedBadge level={verification.badge} size="md" />
              </div>
              <p className="text-xl text-blue-200">{p.position} • Class of {p.gradClass} • {p.height}</p>
              <p className="text-blue-200 mt-1">{p.school} • {p.city}, {p.state} • GPA: {p.gpa}</p>
            </div>
            <div className="hidden sm:block w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-3xl font-bold text-white">{p.name.split(' ').map(n => n[0]).join('')}</div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <h2 className="text-xl font-bold text-[#121B47] mb-4 border-b border-gray-200 pb-2">Player Bio</h2>
            <p className="text-gray-700 leading-relaxed">{p.bio}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#121B47] mb-4 border-b border-gray-200 pb-2">Stats Snapshot</h2>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {Object.entries(p.stats).map(([key, val]) => (
                <div key={key} className="text-center p-3 bg-slate-50 rounded-lg">
                  <p className="text-2xl font-bold text-[#121B47]">{val}</p>
                  <p className="text-xs text-gray-500 uppercase mt-1">{key === 'threep' ? '3PT%' : key === 'ftp' ? 'FT%' : key === 'fgp' ? 'FG%' : key.toUpperCase()}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#121B47] mb-4 border-b border-gray-200 pb-2">Film & Highlights</h2>
            <div className="space-y-2">
              {p.filmLinks.map((link, i) => (
                <a key={i} href={`https://${link}`} target="_blank" rel="noopener noreferrer" className="block text-[#0134BD] hover:underline">{link}</a>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#121B47] mb-4 border-b border-gray-200 pb-2">Coach Contact</h2>
            <p className="text-gray-700">{p.coachContact}</p>
          </section>

          <section className="flex items-center gap-3 pt-4 border-t border-gray-200">
            <VerifiedBadge level={verification.badge} size="lg" />
            <span className="text-sm text-gray-400">Verified since {verification.verifiedDate}</span>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}
