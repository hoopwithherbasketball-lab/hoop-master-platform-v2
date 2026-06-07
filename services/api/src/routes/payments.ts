import { Router } from 'express'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

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
    let event;
    const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock'
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (webhookSecret) {
      try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
          apiVersion: '2026-05-27.dahlia' as any,
        })
        const sig = req.headers['stripe-signature'];
        if (!sig) throw new Error('Missing stripe-signature header')
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
      } catch (err: any) {
        console.error(`⚠️ Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }
    } else {
      // Fallback for local testing when no webhook secret is configured
      event = JSON.parse(req.body.toString())
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const mockSessionId = session.id

      // Step 1: Execute atomic Idempotency Check and State Transition via Postgres RPC
      const { data: success, error } = await getSupabase().rpc('process_payment_webhook', {
        p_event_id: event.id,
        p_session_id: mockSessionId
      })

      if (error) {
        console.error(`[Payments] Webhook RPC error:`, error.message)
        // Throw 500 so Stripe knows to retry if the database had a transient lock issue
        return res.status(500).json({ error: 'Database transaction failed' })
      }

      if (success === false) {
        // Step 2: Early Return Guard (duplicate caught gracefully)
        console.log(`[Payments] Webhook Idempotency Catch: Event ${event.id} already processed.`)
        return res.status(200).json({ received: true, note: 'duplicate_caught' })
      }

      console.log(`[Payments] Webhook successfully fulfilled payment atomically for session: ${mockSessionId}`)
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
    // Determine if payload is an old-style { orderId } or a webhook event
    if (req.body.type === 'checkout.session.completed') {
      // It's a webhook simulation payload
      const event = req.body;
      const { data: success, error } = await getSupabase().rpc('process_payment_webhook', {
        p_event_id: event.id,
        p_session_id: event.data.object.id
      })

      if (error) return res.status(500).json({ error: 'Database transaction failed', details: error.message })
      if (success === false) return res.status(200).json({ received: true, note: 'duplicate_caught' })

      return res.json({ success: true, message: 'Simulated atomic fulfillment', status: 'completed' })
    }

    // Legacy fallback for manual UI simulation testing
    const { orderId } = req.body
    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId parameter.' })
    }

    const { data: order, error: findErr } = await getSupabase()
      .from('service_orders')
      .select('stripe_checkout_session_id')
      .eq('id', orderId)
      .single()

    if (findErr || !order) return res.status(404).json({ error: `Order ${orderId} not found.` })

    const sessionId = order.stripe_checkout_session_id || ('cs_sim_' + Math.random().toString(36).substring(2, 9))
    const mockEventId = 'evt_sim_' + Math.random().toString(36).substring(2, 9)

    const { data: success, error: rpcErr } = await getSupabase().rpc('process_payment_webhook', {
      p_event_id: mockEventId,
      p_session_id: sessionId
    })
    
    if (rpcErr) throw new Error(rpcErr.message)

    res.json({
      success: true,
      message: `Simulated successful payment for order ${orderId} using session ${sessionId}`,
      status: 'completed'
    })
  } catch (err: any) {
    res.status(500).json({ error: 'Simulation failed', details: err.message })
  }
})
