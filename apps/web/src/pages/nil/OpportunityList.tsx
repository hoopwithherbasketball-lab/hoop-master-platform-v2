import { useNILOpportunities } from '@hoop-master/features/nil'
import DashboardLayout from '../../components/layout/DashboardLayout'

export default function OpportunityList() {
  const { opportunities, loading } = useNILOpportunities()

  return (
    <DashboardLayout variant="admin" title="Opportunities" subtitle="Track active NIL partner opportunities." >
      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="card h-14" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Athlete</th>
                <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Brand</th>
                <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Value</th>
                <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {opportunities.map(o => (
                <tr key={o.id} className="hover:bg-white/5">
                  <td className="px-4 py-4 text-gray-200">{o.athlete_name}</td>
                  <td className="px-4 py-4 text-slate-400">{o.brand}</td>
                  <td className="px-4 py-4 text-slate-400">{o.value}</td>
                  <td className="px-4 py-4"><span className="capitalize text-slate-400">{o.status}</span></td>
                </tr>
              ))}
              {opportunities.length === 0 && <tr><td colSpan={4} className="px-4 py-12 text-center text-slate-400">No opportunities yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
