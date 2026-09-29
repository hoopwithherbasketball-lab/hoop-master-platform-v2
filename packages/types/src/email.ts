// Email types for outreach and tracking

export type EmailCategory = 'outreach' | 'proposal' | 'compliance' | 'notification' | 'reminder' | 'followup'
export type EmailDeliveryStatus = 'pending' | 'sent' | 'delivered' | 'bounced' | 'failed'
export type EmailCampaignStatus = 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'paused' | 'cancelled'

export interface EmailTracking {
  id: string
  outreach_id: string
  recipient_email: string
  recipient_name: string | null
  tracking_token: string
  opened: boolean
  opened_at: string | null
  opened_count: number
  clicked: boolean
  clicked_at: string | null
  click_count: number
  last_click_url: string | null
  delivery_status: EmailDeliveryStatus
  delivery_timestamp: string | null
  bounce_reason: string | null
  message_id: string | null
  created_at: string
  updated_at: string
}

export interface EmailTemplate {
  id: string
  name: string
  category: EmailCategory
  subject: string
  html_body: string
  plain_text_body: string | null
  variables: string[]
  tags: string[]
  is_active: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface EmailLog {
  id: string
  outreach_id: string | null
  template_id: string | null
  recipient_email: string
  recipient_name: string | null
  sender_email: string
  subject: string
  body_preview: string | null
  status: 'pending' | 'sent' | 'failed' | 'bounced'
  provider: string
  provider_message_id: string | null
  error_message: string | null
  attempt_count: number
  last_attempt_at: string | null
  sent_at: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface EmailPreferences {
  id: string
  user_id: string
  email: string
  unsubscribed: boolean
  unsubscribed_at: string | null
  unsubscribe_reason: string | null
  unsubscribe_token: string | null
  bounce_count: number
  complaint_count: number
  receives_outreach: boolean
  receives_proposals: boolean
  receives_notifications: boolean
  receives_reminders: boolean
  receives_marketing: boolean
  last_email_sent_at: string | null
  created_at: string
  updated_at: string
}

export interface EmailCampaign {
  id: string
  name: string
  description: string | null
  template_id: string | null
  subject: string
  from_name: string
  from_email: string
  status: EmailCampaignStatus
  scheduled_at: string | null
  started_at: string | null
  completed_at: string | null
  total_recipients: number
  sent_count: number
  failed_count: number
  opened_count: number
  clicked_count: number
  unsubscribed_count: number
  bounce_count: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface EmailSendRequest {
  recipient_email: string
  recipient_name?: string
  subject: string
  html_body: string
  plain_text_body?: string
  template_id?: string
  outreach_id?: string
  variables?: Record<string, string>
  tracking_enabled?: boolean
}

export interface EmailAnalytics {
  total_sent: number
  total_opened: number
  total_clicked: number
  open_rate: number
  click_rate: number
  bounce_rate: number
  unsubscribe_rate: number
  average_open_time?: number
  most_clicked_link?: string
  top_email_clients?: Record<string, number>
}

