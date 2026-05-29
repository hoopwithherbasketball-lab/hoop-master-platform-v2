-- ============================================================
-- MIGRATION: 20260409031506_fix_unused_indexes_permissive_policies_and_search_path.sql
-- ============================================================
/*
  # Fix Unused Indexes, Multiple Permissive Policies, and is_admin Search Path

  ## Summary
  Resolves all flagged security and performance issues from the Supabase advisor:
  1. Drops 23 unused indexes that add write overhead without benefiting reads
  2. Consolidates duplicate permissive RLS policies into single merged policies
  3. Fixes the is_admin() function to use a fixed search_path (prevents search_path injection)
*/

-- 1. Drop unused indexes
DROP INDEX IF EXISTS videos_category_idx;
DROP INDEX IF EXISTS videos_created_by_idx;
DROP INDEX IF EXISTS video_assignments_player_id_idx;
DROP INDEX IF EXISTS video_assignments_video_id_idx;
DROP INDEX IF EXISTS evaluation_packets_user_id_idx;
DROP INDEX IF EXISTS goals_client_id_idx;
DROP INDEX IF EXISTS goals_coach_id_idx;
DROP INDEX IF EXISTS notifications_actor_id_idx;
DROP INDEX IF EXISTS notifications_post_id_idx;
DROP INDEX IF EXISTS sessions_client_id_idx;
DROP INDEX IF EXISTS sessions_coach_id_idx;
DROP INDEX IF EXISTS video_assignments_assigned_by_idx;
DROP INDEX IF EXISTS social_posts_user_id_idx;
DROP INDEX IF EXISTS social_posts_created_at_idx;
DROP INDEX IF EXISTS social_posts_post_type_idx;
DROP INDEX IF EXISTS post_likes_post_id_idx;
DROP INDEX IF EXISTS post_likes_user_id_idx;
DROP INDEX IF EXISTS post_comments_post_id_idx;
DROP INDEX IF EXISTS post_comments_user_id_idx;
DROP INDEX IF EXISTS follows_follower_id_idx;
DROP INDEX IF EXISTS follows_following_id_idx;
DROP INDEX IF EXISTS notifications_is_read_idx;
DROP INDEX IF EXISTS notifications_created_at_idx;

-- 2. Fix is_admin() search path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'); $$;

-- 3. Consolidate multiple permissive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Admins or owners can update profile" ON profiles FOR UPDATE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = id) WITH CHECK (is_admin() OR (SELECT auth.uid()) = id);
DROP POLICY IF EXISTS "Admins can view all coaches" ON coaches;
DROP POLICY IF EXISTS "Admins can update any coach" ON coaches;
DROP POLICY IF EXISTS "Coaches can update own coach record" ON coaches;
CREATE POLICY "Admins or coaches can update coach record" ON coaches FOR UPDATE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = user_id) WITH CHECK (is_admin() OR (SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "Admins can view all evaluation packets" ON evaluation_packets;
DROP POLICY IF EXISTS "Users can view their own evaluation packets" ON evaluation_packets;
CREATE POLICY "Admins or owners can view evaluation packets" ON evaluation_packets FOR SELECT TO authenticated USING (is_admin() OR (SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "Admins can delete any evaluation packet" ON evaluation_packets;
DROP POLICY IF EXISTS "Users can delete their own evaluation packets" ON evaluation_packets;
CREATE POLICY "Admins or owners can delete evaluation packets" ON evaluation_packets FOR DELETE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "Admins can view all follows" ON follows;
DROP POLICY IF EXISTS "Admins can view all goals" ON goals;
DROP POLICY IF EXISTS "Clients can view own goals" ON goals;
CREATE POLICY "Admins or participants can view goals" ON goals FOR SELECT TO authenticated USING (is_admin() OR (SELECT auth.uid()) = client_id OR (SELECT auth.uid()) = coach_id);
DROP POLICY IF EXISTS "Admins can update any goal" ON goals;
DROP POLICY IF EXISTS "Participants can update goals" ON goals;
CREATE POLICY "Admins or participants can update goals" ON goals FOR UPDATE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = client_id OR (SELECT auth.uid()) = coach_id) WITH CHECK (is_admin() OR (SELECT auth.uid()) = client_id OR (SELECT auth.uid()) = coach_id);
DROP POLICY IF EXISTS "Admins can delete any goal" ON goals;
DROP POLICY IF EXISTS "Clients can delete own goals" ON goals;
CREATE POLICY "Admins or clients can delete goals" ON goals FOR DELETE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = client_id);
DROP POLICY IF EXISTS "Admins can view all notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Admins or owners can view notifications" ON notifications FOR SELECT TO authenticated USING (is_admin() OR (SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "Admins can view all post comments" ON post_comments;
DROP POLICY IF EXISTS "Admins can delete any post comment" ON post_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON post_comments;
CREATE POLICY "Admins or owners can delete post comments" ON post_comments FOR DELETE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "Admins can view all post likes" ON post_likes;
DROP POLICY IF EXISTS "Admins can view all sessions" ON sessions;
DROP POLICY IF EXISTS "Participants can view their sessions" ON sessions;
CREATE POLICY "Admins or participants can view sessions" ON sessions FOR SELECT TO authenticated USING (is_admin() OR (SELECT auth.uid()) = coach_id OR (SELECT auth.uid()) = client_id);
DROP POLICY IF EXISTS "Admins can update any session" ON sessions;
DROP POLICY IF EXISTS "Participants can update their sessions" ON sessions;
CREATE POLICY "Admins or participants can update sessions" ON sessions FOR UPDATE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = coach_id OR (SELECT auth.uid()) = client_id) WITH CHECK (is_admin() OR (SELECT auth.uid()) = coach_id OR (SELECT auth.uid()) = client_id);
DROP POLICY IF EXISTS "Admins can view all social posts" ON social_posts;
DROP POLICY IF EXISTS "Admins can delete any social post" ON social_posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON social_posts;
CREATE POLICY "Admins or owners can delete social posts" ON social_posts FOR DELETE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "Admins can view all video assignments" ON video_assignments;
DROP POLICY IF EXISTS "Players can view own assignments" ON video_assignments;
CREATE POLICY "Admins or participants can view video assignments" ON video_assignments FOR SELECT TO authenticated USING (is_admin() OR (SELECT auth.uid()) = player_id OR (SELECT auth.uid()) = assigned_by);
DROP POLICY IF EXISTS "Admins can delete any video assignment" ON video_assignments;
DROP POLICY IF EXISTS "Coaches can delete assignments they created" ON video_assignments;
CREATE POLICY "Admins or coaches can delete video assignments" ON video_assignments FOR DELETE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = assigned_by);
DROP POLICY IF EXISTS "Admins can view all videos" ON videos;
DROP POLICY IF EXISTS "Authenticated users can view public videos" ON videos;
CREATE POLICY "Admins or authorized users can view videos" ON videos FOR SELECT TO authenticated USING (is_admin() OR is_public = true OR created_by = (SELECT auth.uid()));
DROP POLICY IF EXISTS "Admins can update any video" ON videos;
DROP POLICY IF EXISTS "Coaches can update own videos" ON videos;
CREATE POLICY "Admins or coaches can update videos" ON videos FOR UPDATE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = created_by) WITH CHECK (is_admin() OR (SELECT auth.uid()) = created_by);
DROP POLICY IF EXISTS "Admins can delete any video" ON videos;
DROP POLICY IF EXISTS "Coaches can delete own videos" ON videos;
CREATE POLICY "Admins or coaches can delete videos" ON videos FOR DELETE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = created_by);


-- ============================================================
-- MIGRATION: 20260409033012_player_development_assistant_tables.sql
-- ============================================================
/*
  # Player Development Assistant Tables
*/
CREATE TABLE IF NOT EXISTS assistant_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_name text,
  title text NOT NULL DEFAULT 'New Session',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE assistant_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Coaches can view own sessions" ON assistant_sessions FOR SELECT TO authenticated USING ((SELECT auth.uid()) = coach_id);
CREATE POLICY "Coaches can insert own sessions" ON assistant_sessions FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = coach_id);
CREATE POLICY "Coaches can update own sessions" ON assistant_sessions FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = coach_id) WITH CHECK ((SELECT auth.uid()) = coach_id);
CREATE POLICY "Coaches can delete own sessions" ON assistant_sessions FOR DELETE TO authenticated USING ((SELECT auth.uid()) = coach_id);

CREATE TABLE IF NOT EXISTS assistant_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES assistant_sessions(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE assistant_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Coaches can view messages in own sessions" ON assistant_messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM assistant_sessions s WHERE s.id = session_id AND s.coach_id = (SELECT auth.uid())));
CREATE POLICY "Coaches can insert messages in own sessions" ON assistant_messages FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM assistant_sessions s WHERE s.id = session_id AND s.coach_id = (SELECT auth.uid())));
CREATE POLICY "Coaches can delete messages in own sessions" ON assistant_messages FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM assistant_sessions s WHERE s.id = session_id AND s.coach_id = (SELECT auth.uid())));
CREATE INDEX IF NOT EXISTS assistant_sessions_coach_id_idx ON assistant_sessions(coach_id);
CREATE INDEX IF NOT EXISTS assistant_messages_session_id_idx ON assistant_messages(session_id);


-- ============================================================
-- MIGRATION: 20260409035031_update_profiles_role_constraint_add_admin.sql
-- ============================================================
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('parent', 'player', 'coach', 'trainer', 'admin', 'client'));
UPDATE profiles SET role = 'admin' WHERE id IN ('edb36acf-cfb2-4849-9905-2a43a322ec24','20d0e140-f3f1-4d23-a5bb-4c1e28bdf071','00c7be21-86ec-4107-a2b1-ac1d6ddf1375');
INSERT INTO profiles (id, role, full_name) VALUES ('20d0e140-f3f1-4d23-a5bb-4c1e28bdf071', 'admin', 'Lamont Revell'),('00c7be21-86ec-4107-a2b1-ac1d6ddf1375', 'admin', 'Lamont Revell') ON CONFLICT (id) DO UPDATE SET role = 'admin';


-- ============================================================
-- MIGRATION: 20260409035259_site_content_table.sql
-- ============================================================
-- Site Content Management Table with seed data
CREATE TABLE IF NOT EXISTS site_content (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), section text NOT NULL, key text NOT NULL, value text NOT NULL DEFAULT '', content_type text NOT NULL DEFAULT 'text', label text NOT NULL DEFAULT '', updated_at timestamptz DEFAULT now(), updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL, UNIQUE(section, key));
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read site content" ON site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert site content" ON site_content FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE POLICY "Admins can update site content" ON site_content FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE POLICY "Admins can delete site content" ON site_content FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE INDEX IF NOT EXISTS site_content_section_idx ON site_content(section);


-- ============================================================
-- MIGRATION: 20260428204820_create_tournaments_events_programs_tables.sql
-- ============================================================
-- Tournaments, Events, Programs tables
CREATE TABLE IF NOT EXISTS tournaments (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL DEFAULT '', description text NOT NULL DEFAULT '', location text NOT NULL DEFAULT '', address text NOT NULL DEFAULT '', start_date timestamptz, end_date timestamptz, registration_deadline timestamptz, entry_fee numeric(10,2) NOT NULL DEFAULT 0, max_teams integer NOT NULL DEFAULT 0, current_teams integer NOT NULL DEFAULT 0, age_groups text[] NOT NULL DEFAULT '{}', divisions text[] NOT NULL DEFAULT '{}', format text NOT NULL DEFAULT '', prize_description text NOT NULL DEFAULT '', image_url text NOT NULL DEFAULT '', registration_link text NOT NULL DEFAULT '', organizer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','cancelled','completed')), featured boolean NOT NULL DEFAULT false, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now());
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published tournaments" ON tournaments FOR SELECT TO anon, authenticated USING (status = 'published' OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE POLICY "Admins can manage tournaments" ON tournaments FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE TABLE IF NOT EXISTS events (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL DEFAULT '', description text NOT NULL DEFAULT '', event_type text NOT NULL DEFAULT 'clinic', location text NOT NULL DEFAULT '', address text NOT NULL DEFAULT '', start_date timestamptz, end_date timestamptz, price numeric(10,2) NOT NULL DEFAULT 0, max_participants integer NOT NULL DEFAULT 0, current_participants integer NOT NULL DEFAULT 0, image_url text NOT NULL DEFAULT '', registration_link text NOT NULL DEFAULT '', organizer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, age_groups text[] NOT NULL DEFAULT '{}', status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','cancelled')), featured boolean NOT NULL DEFAULT false, is_active boolean NOT NULL DEFAULT true, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now());
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published events" ON events FOR SELECT TO anon, authenticated USING (status = 'published' OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE POLICY "Admins can manage events" ON events FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE TABLE IF NOT EXISTS programs (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), coach_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, title text NOT NULL DEFAULT '', description text NOT NULL DEFAULT '', category text NOT NULL DEFAULT 'skills', level text NOT NULL DEFAULT 'beginner', price numeric(10,2) NOT NULL DEFAULT 0, duration_weeks integer NOT NULL DEFAULT 0, sessions_per_week integer NOT NULL DEFAULT 1, max_participants integer NOT NULL DEFAULT 0, current_participants integer NOT NULL DEFAULT 0, image_url text NOT NULL DEFAULT '', location text NOT NULL DEFAULT '', schedule text NOT NULL DEFAULT '', age_min integer NOT NULL DEFAULT 0, age_max integer NOT NULL DEFAULT 99, status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')), featured boolean NOT NULL DEFAULT false, is_active boolean NOT NULL DEFAULT true, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now());
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published programs" ON programs FOR SELECT TO anon, authenticated USING (status = 'published' OR EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE POLICY "Admins can manage programs" ON programs FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));


-- ============================================================
-- MIGRATION: 20260505194401_create_user_roles_table.sql
-- ============================================================
-- Create user_roles table for role-based access control
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('player', 'parent', 'coach', 'club_admin', 'admin', 'service_specialist')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own roles
CREATE POLICY "Users can view own roles" ON user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Allow admins to manage all roles
CREATE POLICY "Admins can manage all roles" ON user_roles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
    )
  );

-- Allow service role to manage roles (for signup)
CREATE POLICY "Service role can manage roles" ON user_roles
  FOR ALL TO service_role
  USING (true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS user_roles_role_idx ON user_roles(role);

-- ============================================================
-- MIGRATION: 20260505200000_create_core_tables_fix_rls.sql
-- ============================================================
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

-- Create events table (for showcases, clinics, camps)
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  event_type text NOT NULL DEFAULT 'clinic',
  location text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  start_date timestamptz,
  end_date timestamptz,
  price numeric(10,2) NOT NULL DEFAULT 0,
  max_participants integer NOT NULL DEFAULT 0,
  current_participants integer NOT NULL DEFAULT 0,
  image_url text NOT NULL DEFAULT '',
  registration_link text NOT NULL DEFAULT '',
  organizer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  age_groups text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','cancelled')),
  featured boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published events" ON events
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Admins can manage events" ON events
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );


-- ============================================================
-- MIGRATION: 20260506000000_create_event_registrations.sql
-- ============================================================
-- Create event_registrations table (run AFTER 20260505200000_create_core_tables_fix_rls.sql)
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


-- ============================================================
-- MIGRATION: 20260524200000_fix_user_roles_rls_recursion.sql
-- ============================================================
-- Fix infinite RLS recursion on user_roles table
-- The "Admins can manage all roles" policy referenced user_roles itself, causing recursion

-- Create security definer helper functions to check roles without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(check_role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = check_role
  );
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(check_roles text[])
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = ANY(check_roles)
  );
$$;

-- Drop the recursive policy on user_roles
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;

-- Recreate using the security definer function to avoid recursion
CREATE POLICY "Admins can manage all roles" ON user_roles
  FOR ALL TO authenticated
  USING (public.has_role('admin'));


-- ============================================================
-- MIGRATION: 20260525180000_add_user_roles_select_policy.sql
-- ============================================================
-- Allow users to SELECT their own role from user_roles
-- Without this, loadRoles() returns empty for non-admin users
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
CREATE POLICY "Users can view own role" ON user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ============================================================
-- MIGRATION: 20260525200000_create_get_my_roles_rpc.sql
-- ============================================================
-- SECURITY DEFINER function to get current user's roles, bypassing RLS
CREATE OR REPLACE FUNCTION public.get_my_roles()
RETURNS text[]
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(ARRAY_AGG(role), ARRAY[]::text[]) FROM public.user_roles WHERE user_id = auth.uid();
$$;

-- ============================================================
-- MIGRATION: 20260526000000_ensure_missing_tables.sql
-- ============================================================
-- Ensure notifications table exists
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'info',
  title text NOT NULL,
  body text,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own notifications" ON notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can update own notifications" ON notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications(is_read);
CREATE INDEX IF NOT EXISTS notifications_created_at_idx ON notifications(created_at);

-- Ensure coach_profiles table exists
CREATE TABLE IF NOT EXISTS coach_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name text,
  last_name text,
  title text,
  organization text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE coach_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own coach profile" ON coach_profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can manage own coach profile" ON coach_profiles
  FOR ALL TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS coach_profiles_user_id_idx ON coach_profiles(user_id);

-- Ensure event_registrations table exists
CREATE TABLE IF NOT EXISTS event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_profile_id uuid REFERENCES player_profiles(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered','attended','cancelled','no_show')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own registrations" ON event_registrations
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can insert own registrations" ON event_registrations
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Admins can manage registrations" ON event_registrations
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));


-- ============================================================
-- MIGRATION: 20260527000000_create_nil_and_connectgbb_tables.sql
-- ============================================================
-- NIL and ConnectGBB feature tables
-- Run in Supabase Dashboard -> SQL Editor

-- === NIL TABLES ===

CREATE TABLE IF NOT EXISTS nil_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  stage text NOT NULL DEFAULT 'prospecting' CHECK (stage IN ('prospecting','matched','outreach','negotiation','active')),
  logo_url text DEFAULT '',
  website text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE nil_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage nil_companies" ON nil_companies FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Anyone can view nil_companies" ON nil_companies FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS nil_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_name text NOT NULL DEFAULT '',
  brand text NOT NULL DEFAULT '',
  value_cents integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'matched' CHECK (status IN ('matched','review','negotiation','active','completed','cancelled')),
  athlete_profile_id uuid REFERENCES player_profiles(id) ON DELETE SET NULL,
  company_id uuid REFERENCES nil_companies(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE nil_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage nil_opportunities" ON nil_opportunities FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Anyone can view nil_opportunities" ON nil_opportunities FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS nil_athlete_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_profile_id uuid NOT NULL REFERENCES player_profiles(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  position text DEFAULT '',
  class_year integer,
  followers text DEFAULT '0',
  readiness_score integer DEFAULT 0,
  tier text NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze','silver','gold','platinum')),
  opted_in boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE nil_athlete_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage nil_athlete_profiles" ON nil_athlete_profiles FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Anyone can view nil_athlete_profiles" ON nil_athlete_profiles FOR SELECT TO anon, authenticated USING (opted_in = true);

CREATE TABLE IF NOT EXISTS nil_outreach (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_entity text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  body text DEFAULT '',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','pending','replied','closed')),
  athlete_profile_id uuid REFERENCES nil_athlete_profiles(id) ON DELETE SET NULL,
  company_id uuid REFERENCES nil_companies(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE nil_outreach ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage nil_outreach" ON nil_outreach FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Anyone can view nil_outreach" ON nil_outreach FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS nil_compliance_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_name text NOT NULL DEFAULT '',
  opportunity_name text NOT NULL DEFAULT '',
  items text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','error')),
  athlete_profile_id uuid REFERENCES nil_athlete_profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE nil_compliance_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage nil_compliance_items" ON nil_compliance_items FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS nil_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  target text NOT NULL DEFAULT '',
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','in_progress','completed')),
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE nil_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage nil_tasks" ON nil_tasks FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- === ConnectGBB TABLES ===

CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL DEFAULT '',
  author_role text NOT NULL DEFAULT 'player' CHECK (author_role IN ('player','parent','coach','club_admin')),
  content text NOT NULL,
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0
);
-- Backfill columns in case table already existed
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS author_name text NOT NULL DEFAULT '';
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS author_role text NOT NULL DEFAULT 'player' CHECK (author_role IN ('player','parent','coach','club_admin'));
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS image_url text DEFAULT '';
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS like_count integer DEFAULT 0;
ALTER TABLE community_posts ADD COLUMN IF NOT EXISTS comment_count integer DEFAULT 0;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view community_posts" ON community_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own community_posts" ON community_posts FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "Users can update own community_posts" ON community_posts FOR UPDATE TO authenticated USING (author_id = auth.uid());

CREATE TABLE IF NOT EXISTS community_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(post_id, user_id)
);
ALTER TABLE community_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view community_likes" ON community_likes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage own likes" ON community_likes FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS training_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL DEFAULT 'skill' CHECK (category IN ('skill','strength','film','recruiting','ball_handling','shooting','defense','conditioning','recruiting_ed')),
  level text NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner','intermediate','advanced')),
  duration_minutes integer DEFAULT 0,
  thumbnail_url text DEFAULT '',
  video_url text DEFAULT '',
  lesson_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE training_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view training_videos" ON training_videos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage training_videos" ON training_videos FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS member_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','blocked')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(requester_id, target_id)
);
ALTER TABLE member_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own connections" ON member_connections FOR SELECT TO authenticated USING (requester_id = auth.uid() OR target_id = auth.uid());
CREATE POLICY "Users can manage own connections" ON member_connections FOR ALL TO authenticated USING (requester_id = auth.uid()) WITH CHECK (requester_id = auth.uid());

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_one uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_two uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message text DEFAULT '',
  last_timestamp timestamptz DEFAULT now(),
  participant_one_unread integer DEFAULT 0,
  participant_two_unread integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(participant_one, participant_two)
);
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT TO authenticated USING (participant_one = auth.uid() OR participant_two = auth.uid());
CREATE POLICY "Users can manage own conversations" ON conversations FOR ALL TO authenticated USING (participant_one = auth.uid() OR participant_two = auth.uid());

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in own conversations" ON messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM conversations c WHERE c.id = conversation_id AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())));
CREATE POLICY "Users can insert messages in own conversations" ON messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());

CREATE TABLE IF NOT EXISTS member_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'player' CHECK (role IN ('player','parent','coach','scout')),
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  location text DEFAULT '',
  email_visibility text NOT NULL DEFAULT 'connections' CHECK (email_visibility IN ('public','connections','private')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE member_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own member_profile" ON member_profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can manage own member_profile" ON member_profiles FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Anyone can view public member_profiles" ON member_profiles FOR SELECT TO authenticated USING (true);


-- ============================================================
-- MIGRATION: 20260528000000_create_intake_submissions.sql
-- ============================================================
-- Create intake_submissions table for the public /elitegbb intake form
CREATE TABLE IF NOT EXISTS intake_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  preferred_name text DEFAULT '',
  dob text DEFAULT '',
  grad_class text DEFAULT '',
  gender text DEFAULT '',
  school text DEFAULT '',
  city text DEFAULT '',
  state text DEFAULT '',
  primary_position text DEFAULT '',
  secondary_position text DEFAULT '',
  jersey_number text DEFAULT '',
  height text DEFAULT '',
  weight text DEFAULT '',
  parent_name text DEFAULT '',
  parent_email text DEFAULT '',
  parent_phone text DEFAULT '',
  player_email text DEFAULT '',
  level text DEFAULT '',
  team_names text DEFAULT '',
  league_region text DEFAULT '',
  games_played integer DEFAULT NULL,
  ppg numeric DEFAULT NULL,
  apg numeric DEFAULT NULL,
  rpg numeric DEFAULT NULL,
  spg numeric DEFAULT NULL,
  bpg numeric DEFAULT NULL,
  fg_pct numeric DEFAULT NULL,
  three_pct numeric DEFAULT NULL,
  ft_pct numeric DEFAULT NULL,
  self_words text DEFAULT '',
  strength text DEFAULT '',
  improvement text DEFAULT '',
  separation text DEFAULT '',
  adversity_response text DEFAULT '',
  iq_self_rating text DEFAULT '',
  pride_tags text[] DEFAULT '{}',
  player_model text DEFAULT '',
  film_links text DEFAULT '',
  highlight_links text DEFAULT '',
  instagram_handle text DEFAULT '',
  other_socials text DEFAULT '',
  goal text DEFAULT '',
  colleges_interest text DEFAULT '',
  package_selected text DEFAULT 'free',
  consent_eval boolean DEFAULT false,
  consent_media boolean DEFAULT false,
  guardian_signature text DEFAULT '',
  player_profile_id uuid REFERENCES player_profiles(id) ON DELETE SET NULL,
  service_order_id uuid REFERENCES service_orders(id) ON DELETE SET NULL,
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert intake submissions" ON intake_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all intake submissions" ON intake_submissions
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE POLICY "Users can view own intake submissions" ON intake_submissions
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());


-- ============================================================
-- MIGRATION: 20260529000000_create_game_stats_and_film_entries.sql
-- ============================================================
CREATE TABLE IF NOT EXISTS player_game_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_profile_id uuid NOT NULL REFERENCES player_profiles(id) ON DELETE CASCADE,
  season text NOT NULL DEFAULT '2025-26',
  month_label text DEFAULT '',
  ppg numeric DEFAULT 0,
  apg numeric DEFAULT 0,
  rpg numeric DEFAULT 0,
  spg numeric DEFAULT 0,
  bpg numeric DEFAULT 0,
  fg_pct numeric DEFAULT 0,
  three_pct numeric DEFAULT 0,
  ft_pct numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE player_game_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own game stats" ON player_game_stats FOR SELECT TO authenticated USING (player_profile_id IN (SELECT id FROM player_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Admins can manage game stats" ON player_game_stats FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS film_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_profile_id uuid NOT NULL REFERENCES player_profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  url text NOT NULL DEFAULT '',
  tags text[] DEFAULT '{}',
  season text DEFAULT '2025-26',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE film_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own film entries" ON film_entries FOR ALL TO authenticated USING (player_profile_id IN (SELECT id FROM player_profiles WHERE user_id = auth.uid()));
CREATE POLICY "Admins can manage film entries" ON film_entries FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));


-- ============================================================
-- MIGRATION: 20260530000000_create_coach_referral_notes.sql
-- ============================================================
CREATE TABLE IF NOT EXISTS coach_referral_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_profile_id uuid NOT NULL REFERENCES player_profiles(id) ON DELETE CASCADE,
  coach_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_name text NOT NULL DEFAULT '',
  coach_title text NOT NULL DEFAULT 'Coach',
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE coach_referral_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "coaches can select referral notes"
  ON coach_referral_notes FOR SELECT
  USING (true);

CREATE POLICY "coaches can insert referral notes"
  ON coach_referral_notes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "coaches can delete own referral notes"
  ON coach_referral_notes FOR DELETE
  USING (coach_user_id = auth.uid());


-- ============================================================
-- MIGRATION: 20260531000000_audit_fixes.sql
-- ============================================================
-- ==============================================================
-- Migration: 20260531000000_audit_fixes
--
-- Addresses issues found in production-grade audit:
--  1. Drop duplicate RLS policies before recreating them
--  2. Add ON DELETE CASCADE/SET NULL to FK constraints
--  3. Add indexes on foreign key columns for JOIN performance
--  4. Add missing CHECK constraints on enum-like columns
--  5. Fix nil_athlete_profiles.followers type (text â†’ integer)
--  6. Fix intake_submissions.dob type (text â†’ date)
--  7. Fix coach_saved_players RLS (remove type-cast hack)
--  8. Add missing DML policies on community_posts, nil tables
--  9. Add UPDATE policy on coach_referral_notes
-- 10. Add columns to event_registrations that were split across migrations
-- 11. Fix notifications.type and service_offers.category CHECK
-- ==============================================================

-- ======== 1. FIX DUPLICATE RLS POLICIES ========

DROP POLICY IF EXISTS "Anyone can view published events" ON events;

CREATE POLICY "Anyone can view published events" ON events FOR SELECT
  USING (status = 'published');

-- ======== 2. CONSOLIDATE event_registrations ========

ALTER TABLE event_registrations DROP CONSTRAINT IF EXISTS event_registrations_status_check;
ALTER TABLE event_registrations ADD CONSTRAINT event_registrations_status_check
  CHECK (status IN ('registered','cancelled','attended','no_show'));

ALTER TABLE event_registrations DROP CONSTRAINT IF EXISTS event_registrations_player_profile_id_event_id_key;
ALTER TABLE event_registrations ADD CONSTRAINT event_registrations_player_profile_id_event_id_key
  UNIQUE (player_profile_id, event_id);

-- ======== 3. ADD ON DELETE ACTIONS TO FK CONSTRAINTS ========

-- event_registrations
ALTER TABLE event_registrations DROP CONSTRAINT IF EXISTS event_registrations_player_profile_id_fkey;
ALTER TABLE event_registrations ADD CONSTRAINT event_registrations_player_profile_id_fkey
  FOREIGN KEY (player_profile_id) REFERENCES player_profiles(id) ON DELETE CASCADE;

-- service_orders
ALTER TABLE service_orders DROP CONSTRAINT IF EXISTS service_orders_service_offer_id_fkey;
ALTER TABLE service_orders ADD CONSTRAINT service_orders_service_offer_id_fkey
  FOREIGN KEY (service_offer_id) REFERENCES service_offers(id) ON DELETE SET NULL;

ALTER TABLE service_orders DROP CONSTRAINT IF EXISTS service_orders_customer_user_id_fkey;
ALTER TABLE service_orders ADD CONSTRAINT service_orders_customer_user_id_fkey
  FOREIGN KEY (customer_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE service_orders DROP CONSTRAINT IF EXISTS service_orders_player_profile_id_fkey;
ALTER TABLE service_orders ADD CONSTRAINT service_orders_player_profile_id_fkey
  FOREIGN KEY (player_profile_id) REFERENCES player_profiles(id) ON DELETE SET NULL;

ALTER TABLE service_orders DROP CONSTRAINT IF EXISTS service_orders_assigned_to_fkey;
ALTER TABLE service_orders ADD CONSTRAINT service_orders_assigned_to_fkey
  FOREIGN KEY (assigned_to) REFERENCES auth.users(id) ON DELETE SET NULL;

-- audit_submissions
ALTER TABLE audit_submissions DROP CONSTRAINT IF EXISTS audit_submissions_service_order_id_fkey;
ALTER TABLE audit_submissions ADD CONSTRAINT audit_submissions_service_order_id_fkey
  FOREIGN KEY (service_order_id) REFERENCES service_orders(id) ON DELETE CASCADE;

ALTER TABLE audit_submissions DROP CONSTRAINT IF EXISTS audit_submissions_customer_user_id_fkey;
ALTER TABLE audit_submissions ADD CONSTRAINT audit_submissions_customer_user_id_fkey
  FOREIGN KEY (customer_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE audit_submissions DROP CONSTRAINT IF EXISTS audit_submissions_player_profile_id_fkey;
ALTER TABLE audit_submissions ADD CONSTRAINT audit_submissions_player_profile_id_fkey
  FOREIGN KEY (player_profile_id) REFERENCES player_profiles(id) ON DELETE CASCADE;

-- audit_results
ALTER TABLE audit_results DROP CONSTRAINT IF EXISTS audit_results_created_by_fkey;
ALTER TABLE audit_results ADD CONSTRAINT audit_results_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- player_readiness_scores
ALTER TABLE player_readiness_scores DROP CONSTRAINT IF EXISTS player_readiness_scores_calculated_by_fkey;
ALTER TABLE player_readiness_scores ADD CONSTRAINT player_readiness_scores_calculated_by_fkey
  FOREIGN KEY (calculated_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- coach_saved_players
ALTER TABLE coach_saved_players DROP CONSTRAINT IF EXISTS coach_saved_players_player_profile_id_fkey;
ALTER TABLE coach_saved_players ADD CONSTRAINT coach_saved_players_player_profile_id_fkey
  FOREIGN KEY (player_profile_id) REFERENCES player_profiles(id) ON DELETE CASCADE;

-- intake_submissions
ALTER TABLE intake_submissions DROP CONSTRAINT IF EXISTS intake_submissions_auth_user_id_fkey;
ALTER TABLE intake_submissions ADD CONSTRAINT intake_submissions_auth_user_id_fkey
  FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE intake_submissions DROP CONSTRAINT IF EXISTS intake_submissions_service_order_id_fkey;
ALTER TABLE intake_submissions ADD CONSTRAINT intake_submissions_service_order_id_fkey
  FOREIGN KEY (service_order_id) REFERENCES service_orders(id) ON DELETE SET NULL;

-- ======== 4. ADD INDEXES ON FOREIGN KEY COLUMNS ========

-- coach_referral_notes
CREATE INDEX IF NOT EXISTS idx_coach_referral_notes_player_profile_id ON coach_referral_notes(player_profile_id);
CREATE INDEX IF NOT EXISTS idx_coach_referral_notes_coach_user_id ON coach_referral_notes(coach_user_id);

-- player_game_stats
CREATE INDEX IF NOT EXISTS idx_player_game_stats_player_profile_id ON player_game_stats(player_profile_id);

-- film_entries
CREATE INDEX IF NOT EXISTS idx_film_entries_player_profile_id ON film_entries(player_profile_id);

-- intake_submissions
CREATE INDEX IF NOT EXISTS idx_intake_submissions_player_profile_id ON intake_submissions(player_profile_id);
CREATE INDEX IF NOT EXISTS idx_intake_submissions_auth_user_id ON intake_submissions(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_intake_submissions_service_order_id ON intake_submissions(service_order_id);

-- nil tables
CREATE INDEX IF NOT EXISTS idx_nil_opportunities_athlete_profile_id ON nil_opportunities(athlete_profile_id);
CREATE INDEX IF NOT EXISTS idx_nil_opportunities_company_id ON nil_opportunities(company_id);
CREATE INDEX IF NOT EXISTS idx_nil_athlete_profiles_player_profile_id ON nil_athlete_profiles(player_profile_id);
CREATE INDEX IF NOT EXISTS idx_nil_outreach_athlete_profile_id ON nil_outreach(athlete_profile_id);
CREATE INDEX IF NOT EXISTS idx_nil_outreach_company_id ON nil_outreach(company_id);
CREATE INDEX IF NOT EXISTS idx_nil_compliance_items_athlete_profile_id ON nil_compliance_items(athlete_profile_id);

-- community_posts & likes
CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_post_id ON community_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_likes_user_id ON community_likes(user_id);

-- member_connections
CREATE INDEX IF NOT EXISTS idx_member_connections_requester_id ON member_connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_member_connections_target_id ON member_connections(target_id);

-- conversations & messages
CREATE INDEX IF NOT EXISTS idx_conversations_participant_one ON conversations(participant_one);
CREATE INDEX IF NOT EXISTS idx_conversations_participant_two ON conversations(participant_two);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

-- service_orders
CREATE INDEX IF NOT EXISTS idx_service_orders_customer_user_id ON service_orders(customer_user_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_player_profile_id ON service_orders(player_profile_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_service_offer_id ON service_orders(service_offer_id);

-- audit_submissions
CREATE INDEX IF NOT EXISTS idx_audit_submissions_player_profile_id ON audit_submissions(player_profile_id);
CREATE INDEX IF NOT EXISTS idx_audit_submissions_customer_user_id ON audit_submissions(customer_user_id);

-- events / tournaments
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_organizer_id ON tournaments(organizer_id);

-- site_content
CREATE INDEX IF NOT EXISTS idx_site_content_updated_by ON site_content(updated_by);

-- player_tasks
CREATE INDEX IF NOT EXISTS idx_player_tasks_player_profile_id ON player_tasks(player_profile_id);

-- player_events
CREATE INDEX IF NOT EXISTS idx_player_events_player_profile_id ON player_events(player_profile_id);

-- coach_saved_players
CREATE INDEX IF NOT EXISTS idx_coach_saved_players_coach_profile_id ON coach_saved_players(coach_profile_id);
CREATE INDEX IF NOT EXISTS idx_coach_saved_players_player_profile_id ON coach_saved_players(player_profile_id);

-- ======== 5. ADD MISSING CHECK CONSTRAINTS ========

ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
  CHECK (type IN ('info', 'warning', 'success', 'error'));

ALTER TABLE service_offers DROP CONSTRAINT IF EXISTS service_offers_category_check;
ALTER TABLE service_offers ADD CONSTRAINT service_offers_category_check
  CHECK (category IN ('player_dev', 'recruiting', 'clinic', 'camp'));

ALTER TABLE intake_submissions DROP CONSTRAINT IF EXISTS intake_submissions_gender_check;
ALTER TABLE intake_submissions ADD CONSTRAINT intake_submissions_gender_check
  CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'));

ALTER TABLE intake_submissions DROP CONSTRAINT IF EXISTS intake_submissions_package_selected_check;
ALTER TABLE intake_submissions ADD CONSTRAINT intake_submissions_package_selected_check
  CHECK (package_selected IN ('free', 'bronze', 'silver', 'gold', 'platinum'));

-- ======== 6. FIX nil_athlete_profiles.followers TYPE ========

ALTER TABLE nil_athlete_profiles ALTER COLUMN followers TYPE integer USING (COALESCE(NULLIF(followers, ''), '0')::integer);
ALTER TABLE nil_athlete_profiles ALTER COLUMN followers SET DEFAULT 0;

-- ======== 7. FIX intake_submissions.dob TYPE ========

ALTER TABLE intake_submissions ALTER COLUMN dob TYPE date USING NULLIF(dob, '')::date;
ALTER TABLE intake_submissions ALTER COLUMN dob DROP DEFAULT;

-- ======== 8. FIX coach_saved_players RLS ========

DROP POLICY IF EXISTS "Coaches can manage their own saved players" ON coach_saved_players;

CREATE POLICY "Coaches can manage their own saved players" ON coach_saved_players
  USING (coach_profile_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()))
  WITH CHECK (coach_profile_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Coaches can view all saved players" ON coach_saved_players FOR SELECT
  USING (true);

-- ======== 9. ADD MISSING DML POLICIES ========

-- community_posts: allow users to delete own posts
CREATE POLICY "Users can delete own community posts" ON community_posts FOR DELETE
  USING (author_id = auth.uid());

-- coach_referral_notes: allow update by note author
CREATE POLICY "Coaches can update own referral notes" ON coach_referral_notes FOR UPDATE
  USING (coach_user_id = auth.uid())
  WITH CHECK (coach_user_id = auth.uid());

-- nil_compliance_items: allow authenticated users to select
CREATE POLICY "Authenticated users can view compliance items" ON nil_compliance_items FOR SELECT
  USING (auth.role() = 'authenticated');

-- nil_tasks: allow authenticated users to select
CREATE POLICY "Authenticated users can view tasks" ON nil_tasks FOR SELECT
  USING (auth.role() = 'authenticated');

-- ======== 10. ADD user_roles INDEX ========

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);


-- ============================================================
-- MIGRATION: 20260601000000_seed_demo_data.sql
-- ============================================================
-- ============================================================
-- Seed Data â€” Demo data for hoop-master-platform-v2
-- Run AFTER all other migrations have been applied.
-- ============================================================

-- ======== SERVICE OFFERS ========
INSERT INTO service_offers (slug, name, category, description, price_cents, active) VALUES
  ('profile-optimizer', 'Profile Optimizer', 'recruiting', 'Full profile review and optimization for college recruiting visibility', 14900, true),
  ('highlight-film', 'Highlight Film Editing', 'media', 'Professional highlight film editing and production', 29900, true),
  ('recruiting-audit', 'Recruiting Readiness Audit', 'recruiting', 'Comprehensive audit of your recruiting readiness with action plan', 9900, true),
  ('one-pager', 'Recruiting One-Pager', 'marketing', 'Professional one-page recruiting resume for coaches', 7900, true),
  ('college-camp', 'College Camp Package', 'events', 'Curated college camp recommendations and preparation', 19900, true),
  ('social-media-kit', 'Social Media Kit', 'marketing', 'Branded social media templates and strategy guide', 12900, true)
ON CONFLICT (slug) DO NOTHING;

-- ======== LEADS ========
INSERT INTO leads (first_name, last_name, email, phone, source, interest, status) VALUES
  ('Sarah', 'Johnson', 'sarah.j@example.com', '555-0101', 'instagram', 'Profile Optimization', 'new'),
  ('Marcus', 'Williams', 'marcus.w@example.com', '555-0102', 'website', 'Highlight Film', 'contacted'),
  ('Aisha', 'Brown', 'aisha.b@example.com', '555-0103', 'referral', 'Recruiting Audit', 'qualified'),
  ('Jaylen', 'Davis', 'jaylen.d@example.com', '555-0104', 'twitter', 'Full Package', 'booked'),
  ('Mia', 'Garcia', 'mia.g@example.com', '555-0105', 'website', 'One-Pager', 'won'),
  ('Tyler', 'Miller', 'tyler.m@example.com', '555-0106', 'instagram', 'Profile Optimization', 'nurture'),
  ('Zoe', 'Anderson', 'zoe.a@example.com', '555-0107', 'event', 'Highlight Film', 'new'),
  ('DeAndre', 'Thomas', 'd.thomas@example.com', '555-0108', 'referral', 'College Camp', 'contacted')
ON CONFLICT DO NOTHING;

-- ======== NIL COMPANIES ========
INSERT INTO nil_companies (name, category, stage, logo_url, website, description) VALUES
  ('Gatorade', 'sports_nutrition', 'active', 'https://placehold.co/200x200/0134BD/ffffff?text=G', 'https://gatorade.com', 'Official sports nutrition partner for elite athletes'),
  ('Nike', 'apparel', 'negotiation', 'https://placehold.co/200x200/0134BD/ffffff?text=N', 'https://nike.com', 'Premium athletic apparel and footwear brand'),
  ('State Farm', 'insurance', 'outreach', 'https://placehold.co/200x200/0134BD/ffffff?text=SF', 'https://statefarm.com', 'Insurance and financial services for athletes'),
  ('Powerade', 'sports_nutrition', 'matched', 'https://placehold.co/200x200/0134BD/ffffff?text=PA', 'https://powerade.com', 'Sports hydration brand'),
  ('Under Armour', 'apparel', 'prospecting', 'https://placehold.co/200x200/0134BD/ffffff?text=UA', 'https://underarmour.com', 'Performance athletic apparel'),
  ('AT&T', 'telecommunications', 'active', 'https://placehold.co/200x200/0134BD/ffffff?text=A', 'https://att.com', 'Telecommunications and media company')
ON CONFLICT DO NOTHING;

-- ======== NIL OPPORTUNITIES ========
INSERT INTO nil_opportunities (athlete_name, brand, value_cents, status) VALUES
  ('Sarah Johnson', 'Gatorade', 500000, 'active'),
  ('Marcus Williams', 'Nike', 250000, 'negotiation'),
  ('Aisha Brown', 'State Farm', 150000, 'review'),
  ('Jaylen Davis', 'Powerade', 300000, 'matched'),
  ('Mia Garcia', 'Under Armour', 200000, 'completed'),
  ('Zoe Anderson', 'AT&T', 400000, 'active')
ON CONFLICT DO NOTHING;

-- ======== NIL TASKS ========
INSERT INTO nil_tasks (title, target, priority, status, due_date) VALUES
  ('Review Gatorade contract terms', 'Sarah Johnson', 'high', 'in_progress', '2026-06-05'),
  ('Submit Nike compliance documents', 'Marcus Williams', 'high', 'todo', '2026-06-07'),
  ('Schedule State Farm call', 'Aisha Brown', 'medium', 'todo', '2026-06-10'),
  ('Film social media content for Powerade', 'Jaylen Davis', 'medium', 'completed', '2026-06-01'),
  ('Update athlete portfolio for Under Armour', 'Mia Garcia', 'low', 'completed', '2026-05-28'),
  ('Prepare AT&T campaign pitch deck', 'Zoe Anderson', 'high', 'in_progress', '2026-06-03')
ON CONFLICT DO NOTHING;

-- ======== NIL COMPLIANCE ITEMS ========
INSERT INTO nil_compliance_items (athlete_name, opportunity_name, items, status) VALUES
  ('Sarah Johnson', 'Gatorade Partnership', '{"contract_reviewed", "disclosure_posted", "tax_document_submitted"}', 'approved'),
  ('Marcus Williams', 'Nike Endorsement', '{"contract_reviewed", "compliance_form_pending"}', 'pending'),
  ('Aisha Brown', 'State Farm Ambassador', '{"disclosure_posted"}', 'pending'),
  ('Jaylen Davis', 'Powerade Sponsorship', '{"contract_reviewed", "disclosure_posted", "content_approved"}', 'approved')
ON CONFLICT DO NOTHING;

-- ======== COMMUNITY POSTS ========
-- These require an existing auth user. Replace the author_id with a real user ID after signup.
-- For demo purposes, we use a placeholder UUID. Update after creating a real user.
DO $$
DECLARE
  demo_user_id uuid := '00000000-0000-0000-0000-000000000001';
BEGIN
  -- Only insert if no community posts exist yet
  IF (SELECT count(*) FROM community_posts) = 0 THEN
    INSERT INTO community_posts (author_id, author_name, author_role, content, image_url, like_count, comment_count) VALUES
      (demo_user_id, 'Coach Thompson', 'coach', 'Excited to announce our summer showcase camp! Applications open now for 2026-27 recruits. DM for details.', 'https://placehold.co/800x400/0134BD/ffffff?text=Summer+Showcase', 24, 8),
      (demo_user_id, 'Sarah Johnson', 'player', 'Just completed my profile optimization session with Hoop With Her. My recruiting visibility has already improved! Highly recommend.', 'https://placehold.co/800x400/0134BD/ffffff?text=Profile+Done', 42, 12),
      (demo_user_id, 'Marcus Williams', 'player', 'Great workout session today. Focused on my crossover and finishing at the rim. Film coming soon!', 'https://placehold.co/800x400/0134BD/ffffff?text=Workout+Day', 31, 5),
      (demo_user_id, 'Aisha Brown', 'parent', 'Thank you to the Hoop With Her team for helping my daughter navigate the recruiting process. The audit was eye-opening.', '', 18, 3),
      (demo_user_id, 'Coach Davis', 'coach', 'Looking for point guards in the class of 2027. Must have strong academics and court vision. Reach out if interested.', 'https://placehold.co/800x400/0134BD/ffffff?text=Recruiting', 15, 7);
  END IF;
END $$;

-- ======== TRAINING VIDEOS ========
INSERT INTO training_videos (title, description, category, level, duration_minutes, thumbnail_url, video_url, lesson_count) VALUES
  ('Elite Ball Handling Drills', 'Advanced ball handling drills for guards looking to improve their handle under pressure', 'ball_handling', 'advanced', 45, 'https://placehold.co/640x360/0134BD/ffffff?text=Ball+Handling', 'https://storage.example.com/training/ball-handling-advanced.mp4', 8),
  ('Shooting Form Fundamentals', 'Break down the mechanics of a perfect jump shot from release to follow-through', 'shooting', 'beginner', 30, 'https://placehold.co/640x360/0134BD/ffffff?text=Shooting+Form', 'https://storage.example.com/training/shooting-fundamentals.mp4', 6),
  ('Defensive Slide Mastery', 'Improve lateral quickness and defensive positioning with these game-speed drills', 'defense', 'intermediate', 35, 'https://placehold.co/640x360/0134BD/ffffff?text=Defense', 'https://storage.example.com/training/defensive-slides.mp4', 7),
  ('Post Moves for Guards', 'Unorthodox post moves that give guards an advantage in mismatches', 'post_play', 'intermediate', 40, 'https://placehold.co/640x360/0134BD/ffffff?text=Post+Moves', 'https://storage.example.com/training/post-moves-guards.mp4', 5),
  ('Game Film Breakdown: Point Guard Reads', 'Learn to read defenses like a D1 point guard with real game film analysis', 'basketball_iq', 'advanced', 55, 'https://placehold.co/640x360/0134BD/ffffff?text=Film+Study', 'https://storage.example.com/training/pg-reads.mp4', 10),
  ('Conditioning for Basketball', 'Sport-specific conditioning program to build stamina for the full 32 minutes', 'conditioning', 'beginner', 25, 'https://placehold.co/640x360/0134BD/ffffff?text=Conditioning', 'https://storage.example.com/training/conditioning.mp4', 4),
  ('Triple Threat Position Mastery', 'Master the triple threat position â€” jab steps, shot fakes, and first step explosion', 'fundamentals', 'beginner', 20, 'https://placehold.co/640x360/0134BD/ffffff?text=Triple+Threat', 'https://storage.example.com/training/triple-threat.mp4', 5),
  ('Pick and Roll Reads', 'Advanced pick and roll reads for guards â€” short roll, pocket pass, and reject', 'basketball_iq', 'advanced', 50, 'https://placehold.co/640x360/0134BD/ffffff?text=PnR+Reads', 'https://storage.example.com/training/pnr-reads.mp4', 9)
ON CONFLICT DO NOTHING;

-- ======== TOURNAMENTS ========
INSERT INTO tournaments (title, description, location, address, start_date, end_date, registration_deadline, entry_fee, max_teams, current_teams, age_groups, divisions, format, prize_description, image_url, registration_link, status, featured) VALUES
  ('Hoop With Her Summer Showdown', 'Premier girls basketball summer tournament featuring top AAU programs', 'Atlanta Convention Center', '200 Andrew Young International Blvd NW, Atlanta, GA 30303', '2026-07-15', '2026-07-17', '2026-07-01', 35000, 32, 24, '{"14U", "16U", "17U"}', '{"Elite", "Competitive", "Development"}', 'Pool play into single elimination', 'Trophies + $5,000 scholarship fund', 'https://placehold.co/800x400/0134BD/ffffff?text=Summer+Showdown', 'https://hoopwithher.com/tournaments/summer-showdown', 'published', true),
  ('Fall Classic Invitational', 'End-of-season invitational tournament for varsity programs', 'Sports Complex of Georgia', '1200 Sports Way, Buford, GA 30519', '2026-11-20', '2026-11-22', '2026-11-05', 25000, 24, 18, '{"15U", "17U"}', '{"Open"}', 'Bracket play', '$2,000 scholarship fund', 'https://placehold.co/800x400/0134BD/ffffff?text=Fall+Classic', 'https://hoopwithher.com/tournaments/fall-classic', 'published', false)
ON CONFLICT DO NOTHING;

-- ======== EVENTS ========
INSERT INTO events (title, description, event_type, location, address, start_date, end_date, price, max_participants, current_participants, image_url, registration_link, age_groups, status, featured, is_active) VALUES
  ('Recruiting 101 Workshop', 'Learn the fundamentals of the college recruiting process from former D1 coaches', 'workshop', 'Hoop With Her Training Center', '500 Peachtree St, Atlanta, GA 30308', '2026-06-15', '2026-06-15', 0, 50, 32, 'https://placehold.co/800x400/0134BD/ffffff?text=Recruiting+101', 'https://hoopwithher.com/events/recruiting-101', '{"9th-12th Grade"}', 'published', true, true),
  ('Elite Skills Camp', 'Intensive 3-day skills development camp with college-level coaching staff', 'camp', 'Georgia Tech Athletic Facility', '150 Bobby Dodd Way NW, Atlanta, GA 30332', '2026-07-08', '2026-07-10', 29900, 60, 45, 'https://placehold.co/800x400/0134BD/ffffff?text=Skills+Camp', 'https://hoopwithher.com/events/skills-camp', '{"12U", "14U", "16U"}', 'published', true, true),
  ('College Coach Meet & Greet', 'Intimate networking event with college coaches from D1, D2, and D3 programs', 'showcase', 'Hoop With Her Training Center', '500 Peachtree St, Atlanta, GA 30308', '2026-08-20', '2026-08-20', 5000, 100, 67, 'https://placehold.co/800x400/0134BD/ffffff?text=Coach+Meet', 'https://hoopwithher.com/events/coach-meet-greet', '{"14U", "16U", "17U"}', 'published', false, true)
ON CONFLICT DO NOTHING;

-- ======== SITE CONTENT (Landing Page) ========
INSERT INTO site_content (page, section, content) VALUES
  ('home', 'hero_title', 'Empowering the Next Generation of Women''s Basketball'),
  ('home', 'hero_subtitle', 'Recruiting tools, player development, and community for serious athletes'),
  ('home', 'cta_text', 'Start Your Journey'),
  ('home', 'features_title', 'Everything You Need to Get Recruited'),
  ('services', 'page_title', 'Our Services'),
  ('services', 'subtitle', 'Professional recruiting and development services tailored for you')
ON CONFLICT DO NOTHING;

-- ======== MEDIA CHANNELS ========
INSERT INTO media_channels (slug, name, description, channel_type, status, branding, is_public) VALUES
  ('hoop-with-her-live', 'Hoop With Her Live', 'Live coverage of events, games, and showcases featuring elite girls basketball talent', 'live', 'active', '{"logo_url": "", "primary_color": "#0134BD", "secondary_color": "#ffffff", "font_family": "Inter"}', true),
  ('skills-showcase', 'Skills Showcase', '24/7 channel featuring the best skills drills, training sessions, and player highlights', 'linear', 'active', '{"logo_url": "", "primary_color": "#ff6b35", "secondary_color": "#ffffff", "font_family": "Inter"}', true),
  ('recruiting-tips', 'Recruiting Tips', 'On-demand content covering recruiting strategies, college prep, and player development', 'vod', 'active', '{"logo_url": "", "primary_color": "#10b981", "secondary_color": "#ffffff", "font_family": "Inter"}', true),
  ('game-film-room', 'Game Film Room', 'Breakdowns of game film, play analysis, and coaching insights from top programs', 'linear', 'active', '{"logo_url": "", "primary_color": "#8b5cf6", "secondary_color": "#ffffff", "font_family": "Inter"}', true)
ON CONFLICT (slug) DO NOTHING;

-- ======== MEDIA ASSETS ========
INSERT INTO media_assets (title, description, duration_seconds, storage_path, thumbnail_url, status, category, tags) VALUES
  ('Elite Ball Handling Drills', 'Advanced ball handling drills for guards looking to improve their handle under pressure', 2700, 'https://storage.example.com/training/ball-handling-advanced.mp4', 'https://placehold.co/640x360/0134BD/ffffff?text=Ball+Handling', 'ready', 'training', '{"drills", "ball-handling", "advanced"}'),
  ('Shooting Form Fundamentals', 'Break down the mechanics of a perfect jump shot from release to follow-through', 1800, 'https://storage.example.com/training/shooting-fundamentals.mp4', 'https://placehold.co/640x360/0134BD/ffffff?text=Shooting', 'ready', 'training', '{"shooting", "fundamentals", "beginner"}'),
  ('Defensive Slide Mastery', 'Improve lateral quickness and defensive positioning with game-speed drills', 2100, 'https://storage.example.com/training/defensive-slides.mp4', 'https://placehold.co/640x360/0134BD/ffffff?text=Defense', 'ready', 'training', '{"defense", "footwork", "intermediate"}'),
  ('Game Film Breakdown: Point Guard Reads', 'Learn to read defenses like a D1 point guard with real game film analysis', 3300, 'https://storage.example.com/training/pg-reads.mp4', 'https://placehold.co/640x360/0134BD/ffffff?text=Film+Study', 'ready', 'film', '{"film-study", "basketball-iq", "advanced"}'),
  ('Summer Showcase Highlights 2025', 'Best plays from the 2025 Summer Showcase featuring top prospects', 1200, 'https://storage.example.com/highlights/summer-showcase-2025.mp4', 'https://placehold.co/640x360/0134BD/ffffff?text=Highlights', 'ready', 'highlight', '{"highlights", "showcase", "2025"}'),
  ('Recruiting 101: What Coaches Look For', 'Comprehensive guide on what college coaches look for in recruits', 2400, 'https://storage.example.com/recruiting/recruiting-101.mp4', 'https://placehold.co/640x360/0134BD/ffffff?text=Recruiting', 'ready', 'recruiting', '{"recruiting", "guide", "college"}'),
  ('Post Moves for Guards', 'Unorthodox post moves that give guards an advantage in mismatches', 2400, 'https://storage.example.com/training/post-moves-guards.mp4', 'https://placehold.co/640x360/0134BD/ffffff?text=Post+Moves', 'ready', 'training', '{"post-play", "guards", "intermediate"}'),
  ('Conditioning for Basketball', 'Sport-specific conditioning program to build stamina for the full 32 minutes', 1500, 'https://storage.example.com/training/conditioning.mp4', 'https://placehold.co/640x360/0134BD/ffffff?text=Conditioning', 'ready', 'training', '{"conditioning", "fitness", "beginner"}')
ON CONFLICT DO NOTHING;

-- ======== CHANNEL SCHEDULES (sample for linear channels) ========
DO $$
DECLARE
  showcase_id uuid;
  skills_id uuid;
  asset1 uuid;
  asset2 uuid;
  asset3 uuid;
  asset4 uuid;
BEGIN
  SELECT id INTO showcase_id FROM media_channels WHERE slug = 'skills-showcase';
  SELECT id INTO skills_id FROM media_channels WHERE slug = 'game-film-room';

  SELECT id INTO asset1 FROM media_assets WHERE title = 'Elite Ball Handling Drills' LIMIT 1;
  SELECT id INTO asset2 FROM media_assets WHERE title = 'Shooting Form Fundamentals' LIMIT 1;
  SELECT id INTO asset3 FROM media_assets WHERE title = 'Defensive Slide Mastery' LIMIT 1;
  SELECT id INTO asset4 FROM media_assets WHERE title = 'Game Film Breakdown: Point Guard Reads' LIMIT 1;

  IF showcase_id IS NOT NULL AND asset1 IS NOT NULL AND asset2 IS NOT NULL AND asset3 IS NOT NULL THEN
    INSERT INTO channel_schedules (channel_id, asset_id, scheduled_start, scheduled_end, position, repeat_rule) VALUES
      (showcase_id, asset1, now(), now() + interval '45 minutes', 0, 'daily'),
      (showcase_id, asset2, now() + interval '45 minutes', now() + interval '1 hour 15 minutes', 1, 'daily'),
      (showcase_id, asset3, now() + interval '1 hour 15 minutes', now() + interval '1 hour 50 minutes', 2, 'daily');
  END IF;

  IF skills_id IS NOT NULL AND asset4 IS NOT NULL AND asset1 IS NOT NULL THEN
    INSERT INTO channel_schedules (channel_id, asset_id, scheduled_start, scheduled_end, position, repeat_rule) VALUES
      (skills_id, asset4, now(), now() + interval '55 minutes', 0, 'daily'),
      (skills_id, asset1, now() + interval '55 minutes', now() + interval '1 hour 40 minutes', 1, 'daily');
  END IF;
END $$;


-- ============================================================
-- MIGRATION: 20260602000000_create_media_platform_tables.sql
-- ============================================================
-- ============================================================
-- Phase 7: Media Platform Tables
-- Core tables for the Hoop With Her media platform:
-- channels, assets, schedules, ad slots, EPG, analytics, white-label
-- ============================================================

-- ======== MEDIA CHANNELS ========
CREATE TABLE IF NOT EXISTS media_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text DEFAULT '',
  channel_type text NOT NULL CHECK (channel_type IN ('live', 'linear', 'vod')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  branding jsonb NOT NULL DEFAULT '{"logo_url": "", "primary_color": "#0134BD", "secondary_color": "#ffffff", "font_family": "Inter"}',
  custom_domain text,
  cname_target text,
  stream_url text,
  thumbnail_url text DEFAULT '',
  is_public boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE media_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public channels" ON media_channels
  FOR SELECT USING (is_public = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage channels" ON media_channels
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS media_channels_slug_idx ON media_channels(slug);
CREATE INDEX IF NOT EXISTS media_channels_status_idx ON media_channels(status);
CREATE INDEX IF NOT EXISTS media_channels_type_idx ON media_channels(channel_type);

-- ======== MEDIA ASSETS ========
CREATE TABLE IF NOT EXISTS media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  duration_seconds integer NOT NULL DEFAULT 0,
  storage_path text NOT NULL DEFAULT '',
  thumbnail_url text DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'ready', 'failed', 'archived')),
  category text DEFAULT 'uncategorized',
  tags text[] NOT NULL DEFAULT '{}',
  metadata jsonb NOT NULL DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ready assets" ON media_assets
  FOR SELECT USING (status = 'ready' OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage assets" ON media_assets
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS media_assets_status_idx ON media_assets(status);
CREATE INDEX IF NOT EXISTS media_assets_category_idx ON media_assets(category);
CREATE INDEX IF NOT EXISTS media_assets_tags_idx ON media_assets USING gin(tags);

-- ======== CHANNEL SCHEDULES ========
CREATE TABLE IF NOT EXISTS channel_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES media_channels(id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  scheduled_start timestamptz NOT NULL,
  scheduled_end timestamptz NOT NULL,
  position integer NOT NULL DEFAULT 0,
  repeat_rule text NOT NULL DEFAULT 'none' CHECK (repeat_rule IN ('none', 'daily', 'weekly')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (scheduled_end > scheduled_start)
);

ALTER TABLE channel_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active schedules" ON channel_schedules
  FOR SELECT USING (is_active = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage schedules" ON channel_schedules
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS channel_schedules_channel_idx ON channel_schedules(channel_id);
CREATE INDEX IF NOT EXISTS channel_schedules_asset_idx ON channel_schedules(asset_id);
CREATE INDEX IF NOT EXISTS channel_schedules_start_idx ON channel_schedules(scheduled_start);
CREATE INDEX IF NOT EXISTS channel_schedules_channel_start_idx ON channel_schedules(channel_id, scheduled_start);

-- ======== AD SLOTS ========
CREATE TABLE IF NOT EXISTS ad_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES media_channels(id) ON DELETE CASCADE,
  position text NOT NULL CHECK (position IN ('pre', 'mid', 'post')),
  duration_seconds integer NOT NULL DEFAULT 30,
  ad_tag_url text NOT NULL DEFAULT '',
  scte35_cue text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ad_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active ad slots" ON ad_slots
  FOR SELECT USING (is_active = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage ad slots" ON ad_slots
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS ad_slots_channel_idx ON ad_slots(channel_id);

-- ======== EPG PROGRAMS ========
CREATE TABLE IF NOT EXISTS epg_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES media_channels(id) ON DELETE CASCADE,
  asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  episode_number integer,
  season_number integer,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);

ALTER TABLE epg_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view EPG programs" ON epg_programs
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage EPG programs" ON epg_programs
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS epg_programs_channel_idx ON epg_programs(channel_id);
CREATE INDEX IF NOT EXISTS epg_programs_start_idx ON epg_programs(start_time);
CREATE INDEX IF NOT EXISTS epg_programs_channel_time_idx ON epg_programs(channel_id, start_time, end_time);

-- ======== ANALYTICS EVENTS ========
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES media_channels(id) ON DELETE SET NULL,
  asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  viewer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text NOT NULL DEFAULT '',
  event_type text NOT NULL CHECK (event_type IN ('play', 'pause', 'stop', 'heartbeat', 'seek', 'ad_start', 'ad_end', 'fullscreen', 'quality_change')),
  watch_seconds numeric NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- No RLS on analytics_events â€” server-side ingestion only
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage analytics" ON analytics_events
  FOR ALL TO service_role
  USING (true);

CREATE POLICY "Admins can view analytics" ON analytics_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS analytics_events_channel_idx ON analytics_events(channel_id);
CREATE INDEX IF NOT EXISTS analytics_events_asset_idx ON analytics_events(asset_id);
CREATE INDEX IF NOT EXISTS analytics_events_type_idx ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS analytics_events_created_idx ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS analytics_events_channel_time_idx ON analytics_events(channel_id, created_at);

-- ======== ANALYTICS AGGREGATES (hourly rollups) ========
CREATE TABLE IF NOT EXISTS analytics_aggregates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES media_channels(id) ON DELETE SET NULL,
  asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  hour_bucket timestamptz NOT NULL,
  total_plays integer NOT NULL DEFAULT 0,
  total_watch_seconds numeric NOT NULL DEFAULT 0,
  unique_viewers integer NOT NULL DEFAULT 0,
  peak_concurrent integer NOT NULL DEFAULT 0,
  ad_plays integer NOT NULL DEFAULT 0,
  ad_completions integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE analytics_aggregates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view aggregates" ON analytics_aggregates
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS analytics_agg_channel_idx ON analytics_aggregates(channel_id);
CREATE INDEX IF NOT EXISTS analytics_agg_hour_idx ON analytics_aggregates(hour_bucket);
CREATE INDEX IF NOT EXISTS analytics_agg_channel_hour_idx ON analytics_aggregates(channel_id, hour_bucket);

-- ======== WHITE LABEL TENANTS ========
CREATE TABLE IF NOT EXISTS white_label_tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  custom_domain text,
  cname_target text,
  player_branding jsonb NOT NULL DEFAULT '{"logo_url": "", "primary_color": "#0134BD", "secondary_color": "#ffffff", "accent_color": "#ff6b35", "font_family": "Inter", "watermark_url": ""}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived')),
  max_channels integer NOT NULL DEFAULT 5,
  max_storage_gb integer NOT NULL DEFAULT 50,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE white_label_tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage tenants" ON white_label_tenants
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS white_label_tenants_slug_idx ON white_label_tenants(slug);
CREATE INDEX IF NOT EXISTS white_label_tenants_domain_idx ON white_label_tenants(custom_domain);

-- ======== TENANT CHANNEL MAPPING ========
CREATE TABLE IF NOT EXISTS tenant_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES white_label_tenants(id) ON DELETE CASCADE,
  channel_id uuid NOT NULL REFERENCES media_channels(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, channel_id)
);

ALTER TABLE tenant_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage tenant channels" ON tenant_channels
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS tenant_channels_tenant_idx ON tenant_channels(tenant_id);
CREATE INDEX IF NOT EXISTS tenant_channels_channel_idx ON tenant_channels(channel_id);



