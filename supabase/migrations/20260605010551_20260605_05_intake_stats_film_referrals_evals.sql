
-- Intake submissions, game stats, film entries, coach referral notes, coach evaluations

CREATE TABLE IF NOT EXISTS intake_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL DEFAULT '',
  parent_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  class_year text NOT NULL DEFAULT '',
  position text NOT NULL DEFAULT '',
  school text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  gpa text NOT NULL DEFAULT '',
  interests text NOT NULL DEFAULT '',
  referral_source text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','enrolled','declined')),
  submitted_at timestamptz DEFAULT now()
);
ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert intake submissions" ON intake_submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can manage intake submissions" ON intake_submissions FOR ALL TO authenticated USING (public.has_any_role(ARRAY['admin','service_specialist']));
CREATE INDEX IF NOT EXISTS intake_submissions_status_idx ON intake_submissions(status);
CREATE INDEX IF NOT EXISTS intake_submissions_submitted_idx ON intake_submissions(submitted_at DESC);

CREATE TABLE IF NOT EXISTS player_game_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_profile_id uuid NOT NULL REFERENCES player_profiles(id) ON DELETE CASCADE,
  game_date date NOT NULL,
  opponent text NOT NULL DEFAULT '',
  points integer NOT NULL DEFAULT 0,
  rebounds integer NOT NULL DEFAULT 0,
  assists integer NOT NULL DEFAULT 0,
  steals integer NOT NULL DEFAULT 0,
  blocks integer NOT NULL DEFAULT 0,
  turnovers integer NOT NULL DEFAULT 0,
  minutes_played integer NOT NULL DEFAULT 0,
  field_goal_attempts integer NOT NULL DEFAULT 0,
  field_goals_made integer NOT NULL DEFAULT 0,
  three_point_attempts integer NOT NULL DEFAULT 0,
  three_points_made integer NOT NULL DEFAULT 0,
  free_throw_attempts integer NOT NULL DEFAULT 0,
  free_throws_made integer NOT NULL DEFAULT 0,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE player_game_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own game stats" ON player_game_stats FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM player_profiles WHERE id = player_profile_id AND user_id = auth.uid()));
CREATE POLICY "Users can manage own game stats" ON player_game_stats FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM player_profiles WHERE id = player_profile_id AND user_id = auth.uid()));
CREATE POLICY "Coaches can view game stats" ON player_game_stats FOR SELECT TO authenticated
  USING (public.has_any_role(ARRAY['admin','coach','service_specialist']));
CREATE INDEX IF NOT EXISTS player_game_stats_profile_date_idx ON player_game_stats(player_profile_id, game_date DESC);

CREATE TABLE IF NOT EXISTS film_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_profile_id uuid NOT NULL REFERENCES player_profiles(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  video_url text NOT NULL DEFAULT '',
  thumbnail_url text NOT NULL DEFAULT '',
  duration_seconds integer NOT NULL DEFAULT 0,
  game_date date,
  event_name text NOT NULL DEFAULT '',
  is_public boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE film_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own film entries" ON film_entries FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM player_profiles WHERE id = player_profile_id AND user_id = auth.uid()) OR is_public = true);
CREATE POLICY "Users can manage own film entries" ON film_entries FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM player_profiles WHERE id = player_profile_id AND user_id = auth.uid()));
CREATE POLICY "Coaches can view film entries" ON film_entries FOR SELECT TO authenticated
  USING (public.has_any_role(ARRAY['admin','coach','service_specialist']));

CREATE TABLE IF NOT EXISTS coach_referral_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_profile_id uuid NOT NULL REFERENCES player_profiles(id) ON DELETE CASCADE,
  content text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  is_private boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE coach_referral_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Coaches can view own referral notes" ON coach_referral_notes FOR SELECT TO authenticated USING (coach_id = auth.uid());
CREATE POLICY "Coaches can manage own referral notes" ON coach_referral_notes FOR ALL TO authenticated USING (coach_id = auth.uid());
CREATE POLICY "Admins can view all referral notes" ON coach_referral_notes FOR SELECT TO authenticated USING (public.has_role('admin'));
CREATE INDEX IF NOT EXISTS coach_referral_notes_coach_player_idx ON coach_referral_notes(coach_id, player_profile_id);

CREATE TABLE IF NOT EXISTS coach_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_profile_id uuid NOT NULL REFERENCES player_profiles(id) ON DELETE CASCADE,
  overall_grade text NOT NULL DEFAULT 'B',
  athleticism_score integer NOT NULL DEFAULT 0 CHECK (athleticism_score BETWEEN 0 AND 10),
  skill_score integer NOT NULL DEFAULT 0 CHECK (skill_score BETWEEN 0 AND 10),
  iq_score integer NOT NULL DEFAULT 0 CHECK (iq_score BETWEEN 0 AND 10),
  character_score integer NOT NULL DEFAULT 0 CHECK (character_score BETWEEN 0 AND 10),
  academics_score integer NOT NULL DEFAULT 0 CHECK (academics_score BETWEEN 0 AND 10),
  notes text NOT NULL DEFAULT '',
  recommendation text NOT NULL DEFAULT 'watch' CHECK (recommendation IN ('offer','watch','pass')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE coach_evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Coaches can view own evaluations" ON coach_evaluations FOR SELECT TO authenticated USING (coach_id = auth.uid());
CREATE POLICY "Coaches can manage own evaluations" ON coach_evaluations FOR ALL TO authenticated USING (coach_id = auth.uid());
CREATE POLICY "Admins can manage all evaluations" ON coach_evaluations FOR ALL TO authenticated USING (public.has_role('admin'));
CREATE INDEX IF NOT EXISTS coach_evaluations_coach_player_idx ON coach_evaluations(coach_id, player_profile_id);
