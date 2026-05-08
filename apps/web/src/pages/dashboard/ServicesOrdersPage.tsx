import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'

const orders = [
  { id: 'ORD-2154', service: 'Video Review', status: 'Active', due: 'May 18' },
  { id: 'ORD-1892', service: 'NIL Brand Strategy', status: 'Draft', due: 'Jun 1' },
  { id: 'ORD-1708', service: 'Recruiting Plan', status: 'Complete', due: 'Apr 30' },
]

export default function ServicesOrdersPage() {
  return (
    <DashboardLayout variant="player" title="Service Requests" subtitle="Track your requests, approvals, and next actions." >
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs uppercase text-slate-500">Order</th>
              <th className="px-4 py-3 text-left text-xs uppercase text-slate-500">Service</th>
              <th className="px-4 py-3 text-left text-xs uppercase text-slate-500">Status</th>
              <th className="px-4 py-3 text-left text-xs uppercase text-slate-500">Due</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-4 py-4"><Link to={`/dashboard/services/${order.id}`} className="font-medium text-royal-600">{order.id}</Link></td>
                <td className="px-4 py-4 text-slate-600">{order.service}</td>
                <td className="px-4 py-4 text-slate-600">{order.status}</td>
                <td className="px-4 py-4 text-slate-600">{order.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  )
}
