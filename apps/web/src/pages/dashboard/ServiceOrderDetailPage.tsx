import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import DashboardLayout from '../../components/layout/DashboardLayout'

interface OrderDetail {
  id: string; status: string; created_at: string; due_at: string | null; intake_complete: boolean
  customer_name: string | null; customer_email: string | null; notes: string | null
  service_offer: { name: string; description: string; price_cents: number } | null
}

export default function ServiceOrderDetailPage() {
  const { orderId } = useParams()
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) return
    supabase
      .from('service_orders')
      .select('id, status, created_at, due_at, intake_complete, customer_name, customer_email, notes, service_offer:service_offer_id(name, description, price_cents)')
      .eq('id', orderId)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const r = data as Record<string, unknown>
          setOrder({
            id: r.id as string,
            status: r.status as string,
            created_at: r.created_at as string,
            due_at: r.due_at as string | null,
            intake_complete: r.intake_complete as boolean,
            customer_name: r.customer_name as string | null,
            customer_email: r.customer_email as string | null,
            notes: r.notes as string | null,
            service_offer: (Array.isArray(r.service_offer) ? r.service_offer[0] : r.service_offer) as OrderDetail['service_offer'],
          })
        }
        setLoading(false)
      })
  }, [orderId])

  return (
    <DashboardLayout variant="player" title="Order Detail" subtitle={orderId ? `Order ${orderId.slice(0, 8)}` : ''}>
      {loading ? (
        <div className="animate-pulse grid gap-6 lg:grid-cols-2">{['h-40','h-40'].map((h, i) => <div key={i} className={`card ${h}`} />)}</div>
      ) : order ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6 space-y-4">
            <h2 className="text-lg font-semibold text-white">{order.service_offer?.name || 'Service Order'}</h2>
            <p className="text-slate-400 text-sm">{order.service_offer?.description || 'No description.'}</p>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex justify-between"><span>Status</span><span className="font-semibold text-white capitalize">{order.status.replace(/_/g, ' ')}</span></div>
              {order.customer_name && <div className="flex justify-between"><span>Name</span><span className="text-white">{order.customer_name}</span></div>}
              {order.customer_email && <div className="flex justify-between"><span>Email</span><span className="text-white">{order.customer_email}</span></div>}
              <div className="flex justify-between"><span>Submitted</span><span>{new Date(order.created_at).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span>Intake Complete</span><span>{order.intake_complete ? 'Yes' : 'No'}</span></div>
              {order.service_offer && <div className="flex justify-between"><span>Price</span><span>${(order.service_offer.price_cents / 100).toFixed(2)}</span></div>}
            </div>
          </div>
          <div className="card p-6 space-y-4">
            <h3 className="text-base font-semibold text-white">Next Steps</h3>
            <p className="text-slate-400 text-sm">Your order is being reviewed. Our team will reach out within 24 hours to get started.</p>
            {order.notes && (
              <div className="pt-2 border-t border-white/10">
                <p className="text-xs uppercase text-slate-500 mb-1">Your Notes</p>
                <p className="text-slate-400 text-sm">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="card p-8 text-center text-slate-400">Order not found.</div>
      )}
    </DashboardLayout>
  )
}
