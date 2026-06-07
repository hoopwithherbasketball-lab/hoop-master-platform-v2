import { Router } from 'express'
import { createClient } from '@supabase/supabase-js'

export const proposalsRouter = Router()

// STRICT CONSTRAINT 3: Initialize with SERVICE_ROLE_KEY to bypass RLS securely
const supabaseUrl = process.env.SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

/**
 * GET /api/proposals/:id
 * Fetches the proposal for the public Pitch Page.
 * Automatically marks as 'Viewed' if it was 'Sent'.
 */
proposalsRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  
  try {
    const { data: proposal, error } = await supabaseAdmin
      .from('proposals')
      .select('*, crm_partners(business_name, contact_name)')
      .eq('id', id)
      .single()
      
    if (error || !proposal) {
      return res.status(404).json({ error: 'Proposal not found or expired' })
    }

    // Optional: Auto-update status to Viewed if they open it for the first time
    if (proposal.status === 'Sent') {
      await supabaseAdmin.from('proposals').update({ status: 'Viewed' }).eq('id', id)
    }

    return res.status(200).json(proposal)
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})

/**
 * PATCH /api/proposals/:id/accept
 * Safely updates the status. The client cannot malform package_details.
 */
proposalsRouter.patch('/:id/accept', async (req, res) => {
  const { id } = req.params
  
  try {
    const { data: proposal, error: fetchError } = await supabaseAdmin
      .from('proposals')
      .select('status')
      .eq('id', id)
      .single()
      
    if (fetchError || !proposal) {
      return res.status(404).json({ error: 'Proposal not found' })
    }
    
    // Prevent accepting already closed proposals
    if (proposal.status === 'Accepted' || proposal.status === 'Declined') {
      return res.status(400).json({ error: 'Proposal has already been finalized' })
    }

    // STRICT CONSTRAINT 2: Hardcode the status update. Ignore any client body payload.
    const { error: updateError } = await supabaseAdmin
      .from('proposals')
      .update({ status: 'Accepted' })
      .eq('id', id)

    if (updateError) throw updateError

    // Optionally: You could trigger an email or Slack webhook here notifying the team

    return res.status(200).json({ success: true, message: 'Proposal accepted successfully' })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
})
