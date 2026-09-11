-- ============================================================
-- MIGRATION: 20260911000000_add_email_tracking_system.sql
-- ============================================================
-- Email tracking, templates, logs, and preferences tables

-- Email Tracking Table: Track opens, clicks, and deliveries
CREATE TABLE IF NOT EXISTS email_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outreach_id uuid NOT NULL REFERENCES nil_outreach(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  recipient_name text,
  tracking_token text UNIQUE NOT NULL,
  opened boolean DEFAULT false,
  opened_at timestamptz,
  opened_count integer DEFAULT 0,
  clicked boolean DEFAULT false,
  clicked_at timestamptz,
  click_count integer DEFAULT 0,
  last_click_url text,
  delivery_status text NOT NULL DEFAULT 'pending' CHECK (delivery_status IN ('pending','sent','delivered','bounced','failed')),
  delivery_timestamp timestamptz,
  bounce_reason text,
  message_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE email_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage email tracking" ON email_tracking FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can view own tracking" ON email_tracking FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM nil_outreach WHERE id = outreach_id AND EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')));

CREATE INDEX IF NOT EXISTS email_tracking_outreach_idx ON email_tracking(outreach_id);
CREATE INDEX IF NOT EXISTS email_tracking_token_idx ON email_tracking(tracking_token);
CREATE INDEX IF NOT EXISTS email_tracking_recipient_idx ON email_tracking(recipient_email);
CREATE INDEX IF NOT EXISTS email_tracking_opened_idx ON email_tracking(opened);
CREATE INDEX IF NOT EXISTS email_tracking_clicked_idx ON email_tracking(clicked);

-- Email Templates Table: Reusable email content
CREATE TABLE IF NOT EXISTS email_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  category text NOT NULL DEFAULT 'outreach' CHECK (category IN ('outreach','proposal','compliance','notification','reminder','followup')),
  subject text NOT NULL,
  html_body text NOT NULL,
  plain_text_body text,
  variables text[] NOT NULL DEFAULT '{}',
  tags text[] DEFAULT '{}',
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage templates" ON email_templates FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Anyone can view active templates" ON email_templates FOR SELECT TO authenticated USING (is_active = true);

CREATE INDEX IF NOT EXISTS email_templates_name_idx ON email_templates(name);
CREATE INDEX IF NOT EXISTS email_templates_category_idx ON email_templates(category);

-- Email Logs Table: Full audit trail of all sent emails
CREATE TABLE IF NOT EXISTS email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outreach_id uuid REFERENCES nil_outreach(id) ON DELETE CASCADE,
  template_id uuid REFERENCES email_templates(id) ON DELETE SET NULL,
  recipient_email text NOT NULL,
  recipient_name text,
  sender_email text NOT NULL DEFAULT 'noreply@hoopwithher.com',
  subject text NOT NULL,
  body_preview text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','failed','bounced')),
  provider text DEFAULT 'sendgrid',
  provider_message_id text,
  error_message text,
  attempt_count integer DEFAULT 1,
  last_attempt_at timestamptz,
  sent_at timestamptz,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage logs" ON email_logs FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS email_logs_outreach_idx ON email_logs(outreach_id);
CREATE INDEX IF NOT EXISTS email_logs_recipient_idx ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS email_logs_status_idx ON email_logs(status);
CREATE INDEX IF NOT EXISTS email_logs_sent_at_idx ON email_logs(sent_at);

-- Email Preferences Table: User opt-out and preference management
CREATE TABLE IF NOT EXISTS email_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  unsubscribed boolean DEFAULT false,
  unsubscribed_at timestamptz,
  unsubscribe_reason text,
  unsubscribe_token text UNIQUE,
  bounce_count integer DEFAULT 0,
  complaint_count integer DEFAULT 0,
  receives_outreach boolean DEFAULT true,
  receives_proposals boolean DEFAULT true,
  receives_notifications boolean DEFAULT true,
  receives_reminders boolean DEFAULT true,
  receives_marketing boolean DEFAULT false,
  last_email_sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, email)
);

ALTER TABLE email_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own preferences" ON email_preferences FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own preferences" ON email_preferences FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage preferences" ON email_preferences FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS email_preferences_user_idx ON email_preferences(user_id);
CREATE INDEX IF NOT EXISTS email_preferences_email_idx ON email_preferences(email);
CREATE INDEX IF NOT EXISTS email_preferences_unsubscribed_idx ON email_preferences(unsubscribed);

-- Bulk Email Campaigns Table: Group email sends
CREATE TABLE IF NOT EXISTS email_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  template_id uuid REFERENCES email_templates(id) ON DELETE SET NULL,
  subject text NOT NULL,
  from_name text NOT NULL DEFAULT 'HoopWithHer',
  from_email text NOT NULL DEFAULT 'noreply@hoopwithher.com',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','in_progress','completed','paused','cancelled')),
  scheduled_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  total_recipients integer DEFAULT 0,
  sent_count integer DEFAULT 0,
  failed_count integer DEFAULT 0,
  opened_count integer DEFAULT 0,
  clicked_count integer DEFAULT 0,
  unsubscribed_count integer DEFAULT 0,
  bounce_count integer DEFAULT 0,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage campaigns" ON email_campaigns FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Users can view campaigns" ON email_campaigns FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE INDEX IF NOT EXISTS email_campaigns_status_idx ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS email_campaigns_scheduled_idx ON email_campaigns(scheduled_at);

-- Update nil_outreach table to add tracking and delivery fields
ALTER TABLE nil_outreach ADD COLUMN IF NOT EXISTS tracking_enabled boolean DEFAULT true;
ALTER TABLE nil_outreach ADD COLUMN IF NOT EXISTS opened_at timestamptz;
ALTER TABLE nil_outreach ADD COLUMN IF NOT EXISTS opened_count integer DEFAULT 0;
ALTER TABLE nil_outreach ADD COLUMN IF NOT EXISTS click_count integer DEFAULT 0;
ALTER TABLE nil_outreach ADD COLUMN IF NOT EXISTS template_id uuid REFERENCES email_templates(id) ON DELETE SET NULL;

-- Helper RPC functions for tracking
CREATE OR REPLACE FUNCTION public.increment_open_count(tracking_token text)
RETURNS void AS $$
BEGIN
  UPDATE email_tracking
  SET opened_count = opened_count + 1, updated_at = now()
  WHERE tracking_token = tracking_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.increment_click_count(tracking_token text)
RETURNS void AS $$
BEGIN
  UPDATE email_tracking
  SET click_count = click_count + 1, updated_at = now()
  WHERE tracking_token = tracking_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
