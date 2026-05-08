import DashboardLayout from '../../components/layout/DashboardLayout'
import { Search } from 'lucide-react'

const prospects = [
  { name: 'Ava Grant', grade: '2026', position: 'SG', rating: 92 },
  { name: 'Taylor Brooks', grade: '2027', position: 'PG', rating: 88 },
  { name: 'Mia Carter', grade: '2026', position: 'SF', rating: 85 },
]

export default function CoachSearchPage() {
  return (
    <DashboardLayout variant="coach" title="Coach Search" subtitle="Find elite prospects with filters for position, class, and performance." >
      <div className="space-y-6">
        <div className="card p-6">
          <div className="flex items-center gap-3 border border-slate-200 rounded-xl px-4 py-3">
            <Search size={18} className="text-slate-400" />
            <input type="search" placeholder="Search players, positions, schools, or availability" className="w-full bg-transparent outline-none text-slate-900" />
          </div>
        </div>
        <div className="grid gap-4">
          {prospects.map((player) => (
            <div key={player.name} className="card p-5 sm:flex sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-navy-900">{player.name}</p>
                <p className="text-sm text-slate-500">{player.position} • Class of {player.grade}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-navy-900">Rating {player.rating}</span>
                <button className="btn btn-secondary">Save prospect</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
