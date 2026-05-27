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
