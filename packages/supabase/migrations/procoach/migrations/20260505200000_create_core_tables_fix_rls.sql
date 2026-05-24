-- Fix RLS: allow authenticated users to insert their own role during signup
DROP POLICY IF EXISTS "Users can insert own role" ON user_roles;
CREATE POLICY "Users can insert own role" ON user_roles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create player_profiles table
CREATE TABLE IF NOT EXISTS player_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  slug text UNIQUE,
  first_name text NOT NULL DEFAULT '',
  last_name text NOT NULL DEFAULT '',
  display_name text,
  class_year integer,
  grade text,
  birth_year integer,
  position text,
  secondary_position text,
  height text,
  city text,
  state text,
  school_name text,
  team_name text,
  jersey_number text,
  gpa numeric,
  bio text,
  coach_name text,
  coach_email text,
  is_public boolean DEFAULT false,
  profile_completion_percent integer DEFAULT 0,
  instagram_handle text,
  twitter_handle text,
  film_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON player_profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can insert own profile" ON player_profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON player_profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS player_profiles_user_id_idx ON player_profiles(user_id);
CREATE INDEX IF NOT EXISTS player_profiles_slug_idx ON player_profiles(slug);
CREATE INDEX IF NOT EXISTS player_profiles_class_year_idx ON player_profiles(class_year);

-- Create service_offers table
CREATE TABLE IF NOT EXISTS service_offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL,
  description text,
  price_cents integer NOT NULL DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active service offers" ON service_offers
  FOR SELECT TO authenticated, anon
  USING (active = true);

CREATE POLICY "Admins can manage service offers" ON service_offers
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Create service_orders table
CREATE TABLE IF NOT EXISTS service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_offer_id uuid REFERENCES service_offers(id),
  customer_user_id uuid REFERENCES auth.users(id),
  player_profile_id uuid REFERENCES player_profiles(id),
  assigned_to uuid REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','awaiting_intake','in_review','needs_assets','assigned','in_progress','awaiting_client_feedback','complete','archived')),
  stripe_checkout_session_id text,
  intake_complete boolean DEFAULT false,
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON service_orders
  FOR SELECT TO authenticated
  USING (customer_user_id = auth.uid());

CREATE POLICY "Admins can manage orders" ON service_orders
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin','service_specialist'))
  );

CREATE INDEX IF NOT EXISTS service_orders_customer_idx ON service_orders(customer_user_id);
CREATE INDEX IF NOT EXISTS service_orders_status_idx ON service_orders(status);

-- Create audit_submissions table
CREATE TABLE IF NOT EXISTS audit_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid REFERENCES service_orders(id),
  customer_user_id uuid REFERENCES auth.users(id),
  player_profile_id uuid REFERENCES player_profiles(id),
  goals text,
  target_schools text,
  current_film_status text,
  event_schedule_notes text,
  biggest_concern text,
  submitted_at timestamptz DEFAULT now()
);

ALTER TABLE audit_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audit submissions" ON audit_submissions
  FOR SELECT TO authenticated
  USING (customer_user_id = auth.uid());

CREATE POLICY "Users can insert own audit submissions" ON audit_submissions
  FOR INSERT TO authenticated
  WITH CHECK (customer_user_id = auth.uid());

CREATE POLICY "Admins can manage audit submissions" ON audit_submissions
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin','service_specialist'))
  );

-- Create audit_results table
CREATE TABLE IF NOT EXISTS audit_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_submission_id uuid NOT NULL REFERENCES audit_submissions(id) ON DELETE CASCADE,
  readiness_band text,
  total_score integer,
  strengths text,
  gaps text,
  priority_actions text,
  recommended_offer_slug text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audit results" ON audit_results
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM audit_submissions WHERE id = audit_submission_id AND customer_user_id = auth.uid())
  );

CREATE POLICY "Admins can manage audit results" ON audit_results
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin','service_specialist'))
  );

-- Create player_readiness_scores table
CREATE TABLE IF NOT EXISTS player_readiness_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_profile_id uuid NOT NULL REFERENCES player_profiles(id) ON DELETE CASCADE,
  overall_score integer NOT NULL DEFAULT 0,
  bio_score integer,
  film_score integer,
  academics_score integer,
  events_score integer,
  professionalism_score integer,
  notes text,
  calculated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE player_readiness_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own readiness scores" ON player_readiness_scores
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM player_profiles WHERE id = player_profile_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins and coaches can manage readiness scores" ON player_readiness_scores
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin','coach','service_specialist'))
  );

-- Create player_events table (player's personal event history)
CREATE TABLE IF NOT EXISTS player_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_profile_id uuid NOT NULL REFERENCES player_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  location text,
  city text,
  state text,
  start_date date,
  end_date date,
  team_name text,
  jersey_number text,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE player_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own player events" ON player_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM player_profiles WHERE id = player_profile_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can manage own player events" ON player_events
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM player_profiles WHERE id = player_profile_id AND user_id = auth.uid())
  );

-- Create player_tasks table
CREATE TABLE IF NOT EXISTS player_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_profile_id uuid NOT NULL REFERENCES player_profiles(id) ON DELETE CASCADE,
  task_type text NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','done','dismissed')),
  due_date date,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE player_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks" ON player_tasks
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM player_profiles WHERE id = player_profile_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can manage own tasks" ON player_tasks
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM player_profiles WHERE id = player_profile_id AND user_id = auth.uid())
  );

-- Create coach_saved_players table
CREATE TABLE IF NOT EXISTS coach_saved_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_profile_id uuid NOT NULL,
  player_profile_id uuid NOT NULL REFERENCES player_profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(coach_profile_id, player_profile_id)
);

ALTER TABLE coach_saved_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coaches can manage own saved players" ON coach_saved_players
  FOR ALL TO authenticated
  USING (coach_profile_id = auth.uid()::text::uuid);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_type text,
  first_name text,
  last_name text,
  email text,
  phone text,
  source text,
  interest text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','qualified','booked','won','nurture','lost')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);

CREATE POLICY "Admins can manage leads" ON leads
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS leads_status_idx ON leads(status);
CREATE INDEX IF NOT EXISTS leads_email_idx ON leads(email);

-- Create event_registrations table for event enrollment
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  player_profile_id uuid REFERENCES player_profiles(id),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered','cancelled','attended')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own registrations" ON event_registrations
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own registrations" ON event_registrations
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS event_registrations_user_idx ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS event_registrations_event_idx ON event_registrations(event_id);
