import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'
import { PageShell } from '@hoop-master/ui'
import { CircleCheck as CheckCircle, ShoppingBag, ArrowRight, Loader as Loader2 } from 'lucide-react'
import { SERVICE_CONFIGS, type Deliverable } from './ServicesPage'

interface ServiceOffer {
  id: string
  name: string
  slug: string
  description: string | null
  price_cents: number
}

type CheckoutState = 'form' | 'submitting' | 'success' | 'error'

export default function CheckoutPage() {
  const { slug } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [offer, setOffer] = useState<ServiceOffer | null>(null)
  const [loadingOffer, setLoadingOffer] = useState(true)
  const [state, setState] = useState<CheckoutState>('form')
  const [errorMsg, setErrorMsg] = useState('')
  const [orderId, setOrderId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!slug) { setLoadingOffer(false); return }
    supabase
      .from('service_offers')
      .select('id, name, slug, description, price_cents')
      .eq('slug', slug)
      .eq('active', true)
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error('[CheckoutPage] DB Error loading offer:', error.message)
        setOffer(data)
        setLoadingOffer(false)
      })
  }, [slug])

  useEffect(() => {
    if (user?.email) setEmail(user.email)
  }, [user])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!offer || !name || !email) return
    setState('submitting')
    setErrorMsg('')

    // Create the order in Supabase
    const { data: order, error } = await supabase
      .from('service_orders')
      .insert({
        service_offer_id: offer.id,
        customer_user_id: user?.id ?? null,
        customer_name: name,
        customer_email: email,
        notes: notes || null,
        status: 'new',
      })
      .select('id')
      .single()

    if (error) {
      setErrorMsg('Something went wrong creating the order. Please try again.')
      setState('error')
      return
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      // Call the Express backend to generate the Stripe Checkout Session
      const res = await fetch(`${apiUrl}/api/payments/checkout/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          serviceOfferId: offer.id,
          successUrl: `${window.location.origin}/checkout/success`,
          cancelUrl: window.location.href,
        })
      });

      if (!res.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await res.json();
      
      // Redirect to Stripe Checkout URL (or sandbox mock)
      window.location.href = data.url;
    } catch (err: any) {
      console.error('[CheckoutPage] Error calling payment API:', err)
      setErrorMsg('Payment gateway is unavailable. Please try again later.')
      setState('error')
    }
  }

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(0)}`

  if (loadingOffer) {
    return (
      <PageShell title="Checkout" description="Loading your order..." badge="Checkout">
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-[#0134BD]" />
        </div>
      </PageShell>
    )
  }

  if (!offer) {
    return (
      <PageShell title="Checkout" description="Select a valid service package to continue." badge="Checkout">
        <div className="text-center py-16">
          <ShoppingBag size={48} className="mx-auto mb-4 text-slate-500" />
          <p className="text-slate-400 text-lg mb-4">Service not found.</p>
          <Link
            to="/services"
            data-testid="checkout-view-services-link"
            className="bg-[#0134BD] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#002a80] transition-colors"
          >
            View Services
          </Link>
        </div>
      </PageShell>
    )
  }



  const config = SERVICE_CONFIGS[offer.slug]
  const renderFeatures = config?.deliverables || [
    { text: 'Professional evaluation and support' },
    { text: 'Customized strategy session' },
    { text: 'Ongoing coach communication' }
  ]

  return (
    <PageShell title={`Checkout — ${offer.name}`} description={`Complete your secure checkout for ${offer.name}.`} badge="Checkout">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        {/* Order Summary */}
        <div className="bg-navy-800 p-7 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
          <div className="flex items-start justify-between pb-4 border-b border-white/10 mb-4 gap-4">
            <div>
              <h3 className="font-semibold text-white">{offer.name}</h3>
              {offer.description && <p className="text-sm text-slate-400 mt-0.5">{offer.description}</p>}
            </div>
            <span className="text-2xl font-bold text-[#FB6C1D] shrink-0">{formatPrice(offer.price_cents)}</span>
          </div>
          <div className="space-y-2 mb-4">
            {renderFeatures.map((d: Deliverable, i: number) => (
              <div key={i} className="flex items-center text-sm text-slate-400 gap-2">
                <CheckCircle size={14} className="text-[#0134BD] shrink-0" />
                <span className={d.isKeyFeature ? 'font-semibold text-white' : ''}>{d.text}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="font-semibold text-white">Total</span>
            <span className="text-2xl font-bold text-white">{formatPrice(offer.price_cents)}</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-navy-800 p-7 rounded-xl border border-white/10">
          <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name <span className="text-red-400">*</span></label>
              <input
                data-testid="checkout-full-name-input"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full px-3 py-2.5 border border-white/20 rounded-lg bg-transparent text-white placeholder-slate-600 focus:outline-none focus:border-[#0134BD] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address <span className="text-red-400">*</span></label>
              <input
                data-testid="checkout-email-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-3 py-2.5 border border-white/20 rounded-lg bg-transparent text-white placeholder-slate-600 focus:outline-none focus:border-[#0134BD] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Additional Notes <span className="text-slate-500">(optional)</span></label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Anything specific you'd like us to know?"
                rows={3}
                className="w-full px-3 py-2.5 border border-white/20 rounded-lg bg-transparent text-white placeholder-slate-600 focus:outline-none focus:border-[#0134BD] transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {state === 'error' && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          data-testid="checkout-complete-purchase-button"
          disabled={!name || !email || state === 'submitting'}
          className="w-full bg-[#FB6C1D] hover:bg-[#e55a1a] disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 px-6 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
        >
          {state === 'submitting' ? (
            <><Loader2 size={18} className="animate-spin" /> Processing...</>
          ) : (
            <>Place Order — {formatPrice(offer.price_cents)}</>
          )}
        </button>

        <p className="text-center text-sm text-slate-500">
          By placing your order you agree to our terms of service. Our team will contact you within 24 hours to confirm your session.
        </p>
      </form>
    </PageShell>
  )
}
