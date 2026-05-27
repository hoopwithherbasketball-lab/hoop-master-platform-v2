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
