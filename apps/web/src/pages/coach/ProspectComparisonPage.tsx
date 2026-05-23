import { useProspectComparison } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { BarChart3, Plus, X } from 'lucide-react'

const statKeys = ['ppg', 'apg', 'rpg', 'fgp'] as const
const statLabels: Record<string, string> = { ppg: 'PPG', apg: 'APG', rpg: 'RPG', fgp: 'FG%' }

export default function ProspectComparisonPage() {
  const { selected, available, allProspects, selectedIds, toggleSelection } = useProspectComparison()

  const maxVal = Math.max(...selected.flatMap(p => [p.stats.ppg, p.stats.apg, p.stats.rpg, p.stats.fgp]), 25)

  return (
    <DashboardLayout variant="coach" title="Prospect Comparison" subtitle="Compare up to 4 prospects side-by-side.">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-gray-500 mr-1">Compare:</span>
          {allProspects.map(p => (
            <button key={p.id} onClick={() => toggleSelection(p.id)} disabled={!selectedIds.includes(p.id) && selectedIds.length >= 4} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${selectedIds.includes(p.id) ? 'bg-[#0134BD] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'} ${!selectedIds.includes(p.id) && selectedIds.length >= 4 ? 'opacity-40 cursor-not-allowed' : ''}`}>
              {selectedIds.includes(p.id) ? <span className="flex items-center gap-1"><X size={10} /> {p.name.split(' ')[0]}</span> : <span className="flex items-center gap-1"><Plus size={10} /> {p.name.split(' ')[0]}</span>}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="p-4 text-left text-xs text-gray-500 uppercase w-32">Metric</th>
                {selected.map(p => (
                  <th key={p.id} className="p-4 text-center border-l border-gray-100">
                    <div className="w-10 h-10 bg-[#0134BD] rounded-full flex items-center justify-center text-white font-bold text-sm mx-auto mb-1">{p.name[0]}</div>
                    <p className="font-bold text-[#121B47] text-sm">{p.name.split(' ')[0]}</p>
                    <p className="text-xs text-gray-400">{p.position} · {p.grade}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="p-4 text-sm font-medium text-gray-500">School</td>
                {selected.map(p => <td key={p.id} className="p-4 text-center border-l border-gray-100 text-sm text-[#121B47]">{p.school}</td>)}
              </tr>
              <tr className="bg-gray-50">
                <td className="p-4 text-sm font-medium text-gray-500">Height</td>
                {selected.map(p => <td key={p.id} className="p-4 text-center border-l border-gray-100 text-sm text-[#121B47]">{p.height}</td>)}
              </tr>
              <tr>
                <td className="p-4 text-sm font-medium text-gray-500">Rating</td>
                {selected.map(p => <td key={p.id} className="p-4 text-center border-l border-gray-100"><span className="font-bold text-lg text-[#C8A24A]">{p.rating}</span></td>)}
              </tr>
              {statKeys.map(key => (
                <tr key={key} className={key === 'apg' || key === 'fgp' ? 'bg-gray-50' : ''}>
                  <td className="p-4 text-sm font-medium text-gray-500">{statLabels[key]}</td>
                  {selected.map(p => {
                    const val = p.stats[key]
                    const pct = (val / maxVal) * 100
                    return (
                      <td key={p.id} className="p-4 border-l border-gray-100">
                        <div className="flex items-center gap-2 justify-center">
                          <span className="font-bold text-[#121B47] text-sm w-10 text-right">{val}</span>
                          <div className="w-20 bg-gray-100 rounded-full h-2">
                            <div className="bg-[#0134BD] h-2 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
              <tr>
                <td className="p-4 text-sm font-medium text-gray-500">Strengths</td>
                {selected.map(p => <td key={p.id} className="p-4 border-l border-gray-100"><div className="flex flex-wrap gap-1 justify-center">{p.strengths.map(s => <span key={s} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{s}</span>)}</div></td>)}
              </tr>
            </tbody>
          </table>
        </div>

        {selected.length < 2 && (
          <div className="text-center py-8 text-gray-400">
            <BarChart3 size={32} className="mx-auto mb-2 opacity-50" />
            <p>Select at least 2 prospects to compare</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
