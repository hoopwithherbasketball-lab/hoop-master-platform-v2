import DashboardLayout from '../../components/layout/DashboardLayout'

const opportunities = [
  { athlete: 'Sarah Jenkins', brand: 'Gatorade', value: '$45K', status: 'Negotiation' },
  { athlete: 'Maya Thompson', brand: 'Nike', value: '$62K', status: 'Review' },
  { athlete: 'Jordan Lee', brand: 'Hoops Nutrition', value: '$18K', status: 'Matched' },
]

export default function OpportunityList() {
  return (
    <DashboardLayout variant="admin" title="Opportunities" subtitle="Track active NIL partner opportunities." >
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
            {opportunities.map((entry) => (
              <tr key={`${entry.athlete}-${entry.brand}`} className="hover:bg-white/5">
                <td className="px-4 py-4 text-gray-200">{entry.athlete}</td>
                <td className="px-4 py-4 text-slate-400">{entry.brand}</td>
                <td className="px-4 py-4 text-slate-400">{entry.value}</td>
                <td className="px-4 py-4 text-slate-400">{entry.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
