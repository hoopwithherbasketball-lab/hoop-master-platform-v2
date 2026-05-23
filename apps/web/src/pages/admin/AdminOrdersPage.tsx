import { Link } from 'react-router-dom'
import { useAdminOrders } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { DollarSign } from 'lucide-react'

export default function AdminOrdersPage() {
  const { orders, statusColors } = useAdminOrders()
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' && o.status !== 'draft' ? o.amount : 0), 0)

  return (
    <DashboardLayout variant="admin" title="Orders" subtitle="Review and fulfill service requests for athletes.">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Orders', value: orders.length, color: 'text-[#0134BD]' },
            { label: 'Active', value: orders.filter(o => o.status === 'active').length, color: 'text-blue-600' },
            { label: 'Completed', value: orders.filter(o => o.status === 'completed').length, color: 'text-green-600' },
            { label: 'Revenue', value: `$${totalRevenue}`, color: 'text-[#C8A24A]' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl shadow-sm p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Athlete</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Service</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Package</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4"><Link to={`/dashboard/services/${o.id}`} className="font-medium text-[#0134BD] hover:underline">{o.id}</Link></td>
                  <td className="px-4 py-4 text-slate-800">{o.athlete}</td>
                  <td className="px-4 py-4 text-slate-600">{o.service}</td>
                  <td className="px-4 py-4 text-slate-600">{o.package}</td>
                  <td className="px-4 py-4 text-slate-600 flex items-center gap-1"><DollarSign size={12} />{o.amount}</td>
                  <td className="px-4 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[o.status]}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}
