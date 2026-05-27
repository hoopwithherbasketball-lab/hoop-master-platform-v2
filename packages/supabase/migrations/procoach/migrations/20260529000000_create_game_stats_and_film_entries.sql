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
