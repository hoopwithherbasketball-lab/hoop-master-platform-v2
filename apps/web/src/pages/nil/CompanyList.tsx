import DashboardLayout from '../../components/layout/DashboardLayout'

const companies = [
  { name: 'Rise Sports', category: 'Apparel', stage: 'Prospecting' },
  { name: 'Athlete Fuel', category: 'Nutrition', stage: 'Matched' },
  { name: 'Court Vision', category: 'Training', stage: 'Outreach' },
]

export default function CompanyList() {
  return (
    <DashboardLayout variant="admin" title="NIL Partners" subtitle="Manage company relationships and sponsorship pipelines." >
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Company</th>
              <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Category</th>
              <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Stage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {companies.map((company) => (
              <tr key={company.name} className="hover:bg-white/5">
                <td className="px-4 py-4 text-gray-200">{company.name}</td>
                <td className="px-4 py-4 text-slate-400">{company.category}</td>
                <td className="px-4 py-4 text-slate-400">{company.stage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
