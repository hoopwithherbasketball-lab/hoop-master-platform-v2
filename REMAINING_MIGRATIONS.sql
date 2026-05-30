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



