import DashboardLayout from '../../components/layout/DashboardLayout'

const leads = [
  { name: 'Madeline Harris', interest: 'Recruiting plan', status: 'New' },
  { name: 'Camila Ortiz', interest: 'NIL coaching', status: 'Contacted' },
  { name: 'Alyssa Nguyen', interest: 'Performance audit', status: 'Qualified' },
]

export default function AdminLeadsPage() {
  return (
    <DashboardLayout variant="admin" title="Leads" subtitle="Manage incoming athlete and partner inquiries." >
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Name</th>
              <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Interest</th>
              <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.name} className="hover:bg-slate-50">
                <td className="px-4 py-4 text-slate-800">{lead.name}</td>
                <td className="px-4 py-4 text-slate-600">{lead.interest}</td>
                <td className="px-4 py-4 text-slate-600">{lead.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
