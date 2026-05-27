import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import DashboardLayout from '../../components/layout/DashboardLayout'

interface OrderRow {
  id: string; status: string; created_at: string; due_at: string | null
  service_offer: { name: string } | null
}

export default function ServicesOrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('service_orders').select('id, status, created_at, due_at, service_offer:service_offer_id(name)').eq('customer_user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => {
      const mapped: OrderRow[] = (data ?? []).map((r: Record<string, unknown>) => ({
        id: r.id as string,
        status: r.status as string,
        created_at: r.created_at as string,
        due_at: r.due_at as string | null,
        service_offer: (Array.isArray(r.service_offer) ? r.service_offer[0] : r.service_offer) as { name: string } | null,
      }))
      setOrders(mapped)
      setLoading(false)
    })
  }, [user])

  return (
    <DashboardLayout variant="player" title="Service Requests" subtitle="Track your requests, approvals, and next actions.">
      {loading ? (
        <div className="animate-pulse space-y-3">{[1,2,3].map(i => <div key={i} className="card h-12" />)}</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 border-b border-white/10">
              <tr><th className="px-4 py-3 text-left text-xs uppercase text-slate-500">Order</th><th className="px-4 py-3 text-left text-xs uppercase text-slate-500">Service</th><th className="px-4 py-3 text-left text-xs uppercase text-slate-500">Status</th><th className="px-4 py-3 text-left text-xs uppercase text-slate-500">Date</th></tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-white/5">
                  <td className="px-4 py-4"><Link to={`/dashboard/services/${o.id}`} className="font-medium text-royal-400">{o.id.slice(0, 8)}</Link></td>
                  <td className="px-4 py-4 text-slate-400">{o.service_offer?.name || 'Service'}</td>
                  <td className="px-4 py-4"><span className="capitalize text-slate-400">{o.status.replace(/_/g, ' ')}</span></td>
                  <td className="px-4 py-4 text-slate-400">{new Date(o.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {orders.length === 0 && <tr><td colSpan={4} className="px-4 py-12 text-center text-slate-400">No service orders yet. <Link to="/elitegbb" className="text-royal-400 hover:underline">Create a profile</Link> to get started.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  )
}
