import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAdminOrders } from '@hoop-master/features/crm'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { supabase } from '../../lib/supabase'
import { DollarSign, Edit3, Trash2, X, Check, AlertTriangle } from 'lucide-react'

const editableStatuses = ['new', 'awaiting_intake', 'in_review', 'needs_assets', 'assigned', 'in_progress', 'awaiting_client_feedback', 'complete', 'archived', 'cancelled', 'active', 'review', 'completed']

export default function AdminOrdersPage() {
  const { orders, statusColors } = useAdminOrders()
  const [fullIds, setFullIds] = useState<Record<string, string>>({})
  const [editingOrder, setEditingOrder] = useState<typeof orders[0] | null>(null)
  const [deleteOrder, setDeleteOrder] = useState<typeof orders[0] | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'cancelled' && o.status !== 'draft' ? o.amount : 0), 0)

  useEffect(() => {
    supabase.from('service_orders').select('id').order('created_at', { ascending: false }).then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {}
        data.forEach(r => { map[r.id.slice(0, 8)] = r.id })
        setFullIds(map)
      }
    })
  }, [])

  const openEdit = (order: typeof orders[0]) => {
    setEditingOrder(order)
    setEditStatus(order.status)
  }

  const handleUpdate = async () => {
    if (!editingOrder) return
    setSaving(true)
    const fullId = fullIds[editingOrder.id]
    if (fullId) {
      await supabase.from('service_orders').update({ status: editStatus }).eq('id', fullId)
    }
    setSaving(false)
    setEditingOrder(null)
    window.location.reload()
  }

  const handleDelete = async () => {
    if (!deleteOrder) return
    const fullId = fullIds[deleteOrder.id]
    if (fullId) {
      await supabase.from('service_orders').delete().eq('id', fullId)
    }
    setDeleteOrder(null)
    window.location.reload()
  }

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
            <div key={s.label} className="bg-navy-800 rounded-xl shadow-sm p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-navy-800 rounded-xl shadow-md overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Order</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Athlete</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Service</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Package</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs text-slate-400 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs text-slate-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-white/5">
                  <td className="px-4 py-4"><Link to={`/dashboard/services/${o.id}`} className="font-medium text-[#0134BD] hover:underline">{o.id}</Link></td>
                  <td className="px-4 py-4 text-gray-200">{o.athlete}</td>
                  <td className="px-4 py-4 text-slate-400">{o.service}</td>
                  <td className="px-4 py-4 text-slate-400">{o.package}</td>
                  <td className="px-4 py-4 text-slate-400 flex items-center gap-1"><DollarSign size={12} />{o.amount}</td>
                  <td className="px-4 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[o.status]}`}>{o.status}</span></td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(o)} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-amber-100"><Edit3 size={14} className="text-slate-400" /></button>
                      <button onClick={() => setDeleteOrder(o)} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-red-100"><Trash2 size={14} className="text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setEditingOrder(null)}>
          <div className="bg-navy-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Edit Order</h3>
              <button onClick={() => setEditingOrder(null)}><X size={20} className="text-gray-400 hover:text-white" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Athlete</label>
                <input value={editingOrder.athlete} disabled className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white/60 outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Service</label>
                <input value={editingOrder.service} disabled className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white/60 outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Amount</label>
                <input value={`$${editingOrder.amount}`} disabled className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white/60 outline-none cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Status</label>
                <select value={editStatus} onChange={e => setEditStatus(e.target.value)} className="w-full p-2.5 border border-white/20 rounded-lg bg-navy-800 text-white outline-none focus:border-[#0134BD]">
                  {editableStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setEditingOrder(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleUpdate} disabled={saving} className="flex items-center gap-1.5 bg-[#0134BD] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                {saving ? 'Saving...' : <><Check size={16} /> Update</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDeleteOrder(null)}>
          <div className="bg-navy-800 rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-red-400" />
              <h3 className="text-lg font-bold text-white">Delete Order</h3>
            </div>
            <p className="text-sm text-gray-400 mb-5">Are you sure you want to delete order <strong className="text-white">{deleteOrder.id}</strong> for <strong className="text-white">{deleteOrder.athlete}</strong>? This cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteOrder(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
              <button onClick={handleDelete} className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"><Trash2 size={16} /> Delete</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
