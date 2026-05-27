import { useNILCompanies } from '@hoop-master/features/nil'
import DashboardLayout from '../../components/layout/DashboardLayout'

export default function CompanyList() {
  const { companies, loading } = useNILCompanies()

  return (
    <DashboardLayout variant="admin" title="NIL Partners" subtitle="Manage company relationships and sponsorship pipelines." >
      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="card h-14" />)}</div>
      ) : (
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
              {companies.map(c => (
                <tr key={c.id} className="hover:bg-white/5">
                  <td className="px-4 py-4 text-gray-200">{c.name}</td>
                  <td className="px-4 py-4 text-slate-400">{c.category}</td>
                  <td className="px-4 py-4"><span className="capitalize text-slate-400">{c.stage}</span></td>
                </tr>
              ))}
              {companies.length === 0 && <tr><td colSpan={3} className="px-4 py-12 text-center text-slate-400">No companies yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
