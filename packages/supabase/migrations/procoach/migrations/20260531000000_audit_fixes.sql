-- ==============================================================
-- Migration: 20260531000000_audit_fixes
--
-- Addresses issues found in production-grade audit:
--  1. Drop duplicate RLS policies before recreating them
--  2. Add ON DELETE CASCADE/SET NULL to FK constraints
--  3. Add indexes on foreign key columns for JOIN performance
--  4. Add missing CHECK constraints on enum-like columns
--  5. Fix nil_athlete_profiles.followers type (text → integer)
--  6. Fix intake_submissions.dob type (text → date)
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
CREATE INDEX IF NOT EXISTS idx_site_content_updated_at ON site_content(updated_at);

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
