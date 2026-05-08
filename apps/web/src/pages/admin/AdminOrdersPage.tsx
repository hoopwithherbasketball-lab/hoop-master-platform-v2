import DashboardLayout from '../../components/layout/DashboardLayout'

const orders = [
  { id: 'ORD-2100', athlete: 'Sophia Lee', service: 'Highlight reel', status: 'Ready' },
  { id: 'ORD-2051', athlete: 'Kylie Brooks', service: 'Recruiting outreach', status: 'In progress' },
  { id: 'ORD-2017', athlete: 'Jamie Clark', service: 'Brand review', status: 'Completed' },
]

export default function AdminOrdersPage() {
  return (
    <DashboardLayout variant="admin" title="Orders" subtitle="Review and fulfill service requests for athletes." >
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Order</th>
              <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Athlete</th>
              <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Service</th>
              <th className="px-4 py-3 text-left uppercase text-slate-500 text-xs">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-4 py-4 text-slate-800">{order.id}</td>
                <td className="px-4 py-4 text-slate-600">{order.athlete}</td>
                <td className="px-4 py-4 text-slate-600">{order.service}</td>
                <td className="px-4 py-4 text-slate-600">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
