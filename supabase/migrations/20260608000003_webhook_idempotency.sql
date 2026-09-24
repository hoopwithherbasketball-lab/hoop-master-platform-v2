-- Migration: Webhook Idempotency and Atomic Order Fulfilment
-- Description: Adds a transaction log for webhook events to prevent duplicate processing,
-- and an RPC function to atomically fulfill orders.

-- 1. Create the webhook_events table
CREATE TABLE IF NOT EXISTS webhook_events (
    id TEXT PRIMARY KEY, -- Stores the Stripe event.id
    type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create the RPC function for atomic order fulfillment
CREATE OR REPLACE FUNCTION process_payment_webhook(p_event_id TEXT, p_session_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order_id UUID;
BEGIN
    -- Step A: Idempotency Check
    -- Attempt to insert the event ID. If it exists, this throws a unique violation,
    -- but we catch it with ON CONFLICT to do nothing. 
    -- If no row was inserted, it means the event was already processed.
    INSERT INTO webhook_events (id, type)
    VALUES (p_event_id, 'checkout.session.completed')
    ON CONFLICT (id) DO NOTHING;

    IF NOT FOUND THEN
        -- The event was already processed (double-tap delivery).
        -- Return false so the caller knows it was a duplicate, but don't error out.
        RETURN FALSE;
    END IF;

    -- Step B: Locate the order associated with the session ID
    SELECT id INTO v_order_id
    FROM service_orders
    WHERE stripe_checkout_session_id = p_session_id
    LIMIT 1;

    IF v_order_id IS NULL THEN
        -- Order not found for this session. Rollback the event insert by raising an exception.
        RAISE EXCEPTION 'Order not found for session %', p_session_id;
    END IF;

    -- Step C: Atomically update the order status to fulfilled
    UPDATE service_orders
    SET 
        status = 'active',
        intake_complete = TRUE,
        completed_at = NOW()
    WHERE id = v_order_id;

    -- Return true indicating successful, first-time atomic processing
    RETURN TRUE;
END;
$$;
