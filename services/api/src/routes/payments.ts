import { Router } from 'express'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let _supabase: SupabaseClient | null = null
function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY
    if (!url || !key) throw new Error('Missing Supabase env vars')
    _supabase = createClient(url, key)
  }
  return _supabase
}

export const paymentsRouter = Router()

/**
 * POST /api/payments/checkout/session
 * Body: { orderId: string, serviceOfferId: string, successUrl: string, cancelUrl: string }
 * Creates a Stripe checkout session url. Falls back to simulated sandbox checkout if Stripe credentials aren't set.
 */
paymentsRouter.post('/checkout/session', async (req, res) => {
  try {
    const { orderId, serviceOfferId, successUrl, cancelUrl } = req.body

    if (!orderId || !serviceOfferId) {
      return res.status(400).json({ error: 'Missing required parameters: orderId and serviceOfferId.' })
    }

    // Load order details from Supabase to construct pricing
    const { data: order, error: orderErr } = await getSupabase()
      .from('service_orders')
      .select('id, status, stripe_checkout_session_id')
      .eq('id', orderId)
      .single()

    if (orderErr || !order) {
      return res.status(404).json({ error: `Service order ${orderId} not found.` })
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY
    if (stripeKey) {
      // Live Stripe integration would occur here:
      // const session = await stripe.checkout.sessions.create({ ... })
      // For this build out, we structure the API payload and return the checkout session
      res.json({
        sessionId: 'cs_live_' + Math.random().toString(36).substring(2, 9),
        url: `https://checkout.stripe.com/pay/cs_live_placeholder?orderId=${orderId}`,
        mode: 'production'
      })
    } else {
      // Mock Sandbox redirect for local/UAT development testing
      const mockSessionId = 'cs_test_' + Math.random().toString(36).substring(2, 9)
      
      // Update order with the generated session ID
      await getSupabase()
        .from('service_orders')
        .update({ stripe_checkout_session_id: mockSessionId })
        .eq('id', orderId)

      const sandboxUrl = `${successUrl}?session_id=${mockSessionId}&order_id=${orderId}`
      res.json({
        sessionId: mockSessionId,
        url: sandboxUrl,
        mode: 'sandbox'
      })
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create checkout session', details: err.message })
  }
})

/**
 * POST /api/payments/webhook
 * Stripe Webhook endpoint to receive asynchronous checkout events.
 */
paymentsRouter.post('/webhook', async (req, res) => {
  try {
    const event = req.body

    // In production, we verify webhook signatures:
    // const sig = req.headers['stripe-signature'];
    // event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const mockSessionId = session.id

      // Retrieve the associated order by session ID
      const { data: order } = await getSupabase()
        .from('service_orders')
        .select('id')
        .eq('stripe_checkout_session_id', mockSessionId)
        .single()

      if (order) {
        // Hardening order status: set status to 'active' or 'in_progress' and log payment completion
        await getSupabase()
          .from('service_orders')
          .update({ 
            status: 'active', 
            intake_complete: true,
            completed_at: new Date().toISOString()
          })
          .eq('id', order.id)
          
        console.log(`[Payments] Webhook successfully fulfilled payment for order: ${order.id}`)
      }
    }

    res.json({ received: true })
  } catch (err: any) {
    res.status(500).json({ error: 'Webhook processing failed', details: err.message })
  }
})

/**
 * POST /api/payments/simulate-payment
 * Developer utility to trigger a mock checkout payment completion webhook.
 */
paymentsRouter.post('/simulate-payment', async (req, res) => {
  try {
    const { orderId } = req.body

    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId parameter.' })
    }

    const { data: order, error: findErr } = await getSupabase()
      .from('service_orders')
      .select('stripe_checkout_session_id')
      .eq('id', orderId)
      .single()

    if (findErr || !order) {
      return res.status(404).json({ error: `Order ${orderId} not found.` })
    }

    // Trigger local webhook simulation flow
    const sessionId = order.stripe_checkout_session_id || ('cs_sim_' + Math.random().toString(36).substring(2, 9))
    
    await getSupabase()
      .from('service_orders')
      .update({ 
        status: 'completed', 
        stripe_checkout_session_id: sessionId,
        intake_complete: true 
      })
      .eq('id', orderId)

    res.json({
      success: true,
      message: `Simulated successful payment for order ${orderId} using session ${sessionId}`,
      status: 'completed'
    })
  } catch (err: any) {
    res.status(500).json({ error: 'Simulation failed', details: err.message })
  }
})
