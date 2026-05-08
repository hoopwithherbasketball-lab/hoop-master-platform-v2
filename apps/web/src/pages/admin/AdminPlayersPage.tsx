import { usePlayerProfiles } from '@hoop-master/features/crm'
import type { Database } from '@hoop-master/types'
import DashboardLayout from '../../components/layout/DashboardLayout'

type PlayerProfile = Database['public']['Tables']['player_profiles']['Row']

export default function AdminPlayersPage() {
  const { profiles: players, loading } = usePlayerProfiles()

  return (
    <DashboardLayout variant="admin" title="Players" subtitle="All registered player profiles">
      {loading ? (<div className="animate-pulse space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="card h-14" />)}</div>) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Class</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Position</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase">GPA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {players.map((p: PlayerProfile) => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{p.first_name} {p.last_name}</td>
                  <td className="px-4 py-3 text-slate-500">{p.class_year ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-500">{p.position ?? '-'}</td>
                  <td className="px-4 py-3 text-slate-500">{p.gpa ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {players.length === 0 && <div className="text-center py-14"><p className="font-display text-xl font-bold text-slate-300">No players yet</p></div>}
        </div>
      )}
    </DashboardLayout>
  )
}
