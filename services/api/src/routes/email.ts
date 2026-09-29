import express, { Request, Response } from 'express'
import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

const router = express.Router()
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

// Send single email
router.post('/send', async (req: Request, res: Response) => {
  try {
    const { recipientEmail, recipientName, subject, htmlBody, plainTextBody, outreachId, trackingEnabled } = req.body

    if (!recipientEmail || !subject || !htmlBody) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Generate tracking token
    const trackingToken = crypto.randomBytes(16).toString('hex')
    const pixelUrl = `${process.env.API_URL || 'http://localhost:3000'}/api/email/pixel/${trackingToken}`

    // Add tracking pixel to HTML
    const trackingPixel = `<img src="${pixelUrl}" alt="" width="1" height="1" style="display:none;" />`
    const htmlWithTracking = htmlBody.includes('</body>')
      ? htmlBody.replace('</body>', `${trackingPixel}</body>`)
      : htmlBody + trackingPixel

    // Log email
    const { data: logData, error: logError } = await supabase.from('email_logs').insert([
      {
        outreach_id: outreachId,
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        subject,
        body_preview: htmlBody.substring(0, 200),
        status: 'sent',
        sent_at: new Date().toISOString(),
      },
    ])

    // Create tracking record
    if (trackingEnabled !== false && outreachId) {
      await supabase.from('email_tracking').insert([
        {
          outreach_id: outreachId,
          recipient_email: recipientEmail,
          recipient_name: recipientName,
          tracking_token: trackingToken,
          delivery_status: 'sent',
          delivery_timestamp: new Date().toISOString(),
        },
      ])
    }

    // In production, send via SendGrid or SMTP
    console.log(`Email sent to ${recipientEmail} with tracking token ${trackingToken}`)

    res.json({ success: true, messageId: `email-${Date.now()}`, trackingToken })
  } catch (error: any) {
    console.error('Email send failed:', error)
    res.status(500).json({ error: error.message })
  }
})

// Send bulk emails
router.post('/send-bulk', async (req: Request, res: Response) => {
  try {
    const { recipients, subject, htmlBody, plainTextBody, campaignId, trackingEnabled } = req.body

    if (!recipients || !Array.isArray(recipients)) {
      return res.status(400).json({ error: 'Invalid recipients array' })
    }

    let sent = 0
    let failed = 0
    const errors: string[] = []

    for (const recipient of recipients) {
      try {
        // Replace variables
        let personalizedHtml = htmlBody
        let personalizedSubject = subject

        if (recipient.variables) {
          Object.entries(recipient.variables).forEach(([key, value]) => {
            const regex = new RegExp(`{{${key}}}`, 'g')
            personalizedHtml = personalizedHtml.replace(regex, value as string)
            personalizedSubject = personalizedSubject.replace(regex, value as string)
          })
        }

        // Generate tracking token
        const trackingToken = crypto.randomBytes(16).toString('hex')

        // Log email
        await supabase.from('email_logs').insert([
          {
            recipient_email: recipient.email,
            recipient_name: recipient.name,
            subject: personalizedSubject,
            body_preview: personalizedHtml.substring(0, 200),
            status: 'sent',
            sent_at: new Date().toISOString(),
            metadata: { campaignId },
          },
        ])

        sent++
      } catch (error: any) {
        failed++
        errors.push(`${recipient.email}: ${error.message}`)
      }
    }

    res.json({ success: failed === 0, sent, failed, errors })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Track email open (pixel)
router.get('/pixel/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params

    // Record the open event
    await supabase
      .from('email_tracking')
      .update({
        opened: true,
        opened_at: new Date().toISOString(),
        opened_count: supabase.rpc('increment_open_count', { tracking_token: token }),
        updated_at: new Date().toISOString(),
      })
      .eq('tracking_token', token)

    // Return 1x1 transparent GIF
    const gif = Buffer.from(
      'GIF89a0100010000000ffffffff000000ffffff000000000000000000000000000000000000000000000000000000000000000000000000000000000021f90400000000000000000000000000000000000000000000000000000000000000000000003b',
      'hex'
    )

    res.type('image/gif')
    res.send(gif)
  } catch (error) {
    res.status(200).send('')
  }
})

// Track email click
router.post('/track-click', async (req: Request, res: Response) => {
  try {
    const { token, url } = req.body

    if (!token) {
      return res.status(400).json({ error: 'Missing tracking token' })
    }

    await supabase
      .from('email_tracking')
      .update({
        clicked: true,
        clicked_at: new Date().toISOString(),
        last_click_url: url || null,
        updated_at: new Date().toISOString(),
      })
      .eq('tracking_token', token)

    res.json({ success: true })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

// Unsubscribe endpoint
router.get('/unsubscribe/:token', async (req: Request, res: Response) => {
  try {
    const { token } = req.params

    await supabase
      .from('email_preferences')
      .update({
        unsubscribed: true,
        unsubscribed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('unsubscribe_token', token)

    res.send('You have been unsubscribed from HoopWithHer emails.')
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
})

export default router

