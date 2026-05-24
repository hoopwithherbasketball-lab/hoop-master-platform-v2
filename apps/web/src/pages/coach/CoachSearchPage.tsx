import { useProspectSearch } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { Search, Star, Bookmark, FileText, BarChart3 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CoachSearchPage() {
  const { query, setQuery, positionFilter, setPositionFilter, gradeFilter, setGradeFilter, filtered, toggleSave, positions, grades } = useProspectSearch()

  return (
    <DashboardLayout variant="coach" title="Coach Search" subtitle="Find elite prospects with filters for position, class, and performance.">
      <div className="space-y-6">
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-3 border border-white/10 rounded-xl px-4 py-3">
            <Search size={18} className="text-slate-400" />
            <input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, school, or position..." className="w-full bg-transparent outline-none text-white" />
          </div>
          <div className="flex flex-wrap gap-3">
            <select value={positionFilter} onChange={e => setPositionFilter(e.target.value)} className="px-4 py-2 border border-white/10 rounded-lg text-sm bg-navy-800">
              <option value="">All Positions</option>
              {positions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={gradeFilter} onChange={e => setGradeFilter(e.target.value)} className="px-4 py-2 border border-white/10 rounded-lg text-sm bg-navy-800">
              <option value="">All Classes</option>
              {grades.map(g => <option key={g} value={g}>Class of {g}</option>)}
            </select>
            <Link to="/coach/compare" className="flex items-center gap-1 px-4 py-2 border border-white/10 rounded-lg text-sm bg-navy-800 text-slate-400 hover:bg-white/5"><BarChart3 size={15} /> Compare</Link>
          </div>
        </div>

        <div className="grid gap-4">
          {filtered.map(player => (
            <div key={player.id} className="card p-5 sm:flex sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-[#0134BD] rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {player.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-semibold text-white">{player.name}</p>
                    {player.saved && <Star size={14} className="text-[#C8A24A] fill-current" />}
                  </div>
                  <p className="text-sm text-slate-500">{player.position} • Class of {player.grade} • {player.school} • {player.state} • {player.height}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3 sm:mt-0">
                <span className="text-sm font-bold text-white">Rtg {player.rating}</span>
                <Link to={`/coach/evaluation/${player.id}`} className="btn btn-secondary flex items-center gap-1 text-sm">
                  <FileText size={14} /> Eval
                </Link>
                <button onClick={() => toggleSave(player.id)} className={`btn ${player.saved ? 'btn-primary' : 'btn-secondary'} flex items-center gap-1`}>
                  <Bookmark size={14} /> {player.saved ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-slate-500 py-12">No prospects match your filters.</p>}
        </div>
      </div>
    </DashboardLayout>
  )
}
