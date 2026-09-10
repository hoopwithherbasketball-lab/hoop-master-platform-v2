import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { PageShell } from '@hoop-master/ui'
import { CircleCheck as CheckCircle, ArrowRight, Loader as Loader2 } from 'lucide-react'

export default function CheckoutSuccessPage() {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  
  const orderId = searchParams.get('order_id')
  const sessionId = searchParams.get('session_id')
  
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }
    
    supabase
      .from('service_orders')
      .select('*, service_offers(name)')
      .eq('id', orderId)
      .single()
      .then(({ data, error }) => {
        if (!error && data) {
          setOrder(data)
        }
        setLoading(false)
      })
  }, [orderId])

  if (loading) {
    return (
      <PageShell title="Order Confirmed" description="Loading your order..." badge="Checkout">
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-[#0134BD]" />
        </div>
      </PageShell>
    )
  }

  if (!order) {
    return (
      <PageShell title="Order Not Found" description="We couldn't find your order details." badge="Checkout">
        <div className="text-center py-16">
          <p className="text-slate-400 text-lg mb-4">But if you completed payment, it is being processed!</p>
          <Link
            to="/dashboard"
            className="bg-[#0134BD] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002a80] transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell title="Order Confirmed" description="Your order has been placed successfully." badge="Checkout">
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={32} className="text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h2>
        <p className="text-slate-400 mb-1">Thank you, {order.customer_name}. Your order for <strong className="text-white">{order.service_offers?.name || 'Service'}</strong> has been placed.</p>
        <p className="text-slate-500 text-sm mb-8">We'll reach out to <strong className="text-slate-300">{order.customer_email}</strong> within 24 hours to get started.</p>
        {user ? (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={`/dashboard/services/${order.id}`}
              className="flex items-center justify-center gap-2 bg-[#0134BD] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002a80] transition-colors"
            >
              Track Order <ArrowRight size={16} />
            </Link>
            <Link to="/dashboard" className="px-6 py-3 rounded-lg font-semibold border border-white/20 text-slate-300 hover:text-white transition-colors">
              Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup" className="flex items-center justify-center gap-2 bg-[#0134BD] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002a80] transition-colors">
              Create Account to Track Order <ArrowRight size={16} />
            </Link>
            <Link to="/" className="px-6 py-3 rounded-lg font-semibold border border-white/20 text-slate-300 hover:text-white transition-colors">
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </PageShell>
  )
}
