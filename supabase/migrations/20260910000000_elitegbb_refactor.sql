-- MIGRATION: EliteGBB Data Audit Refactors

-- 1. Convert text fields to enums in intake_submissions safely
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'player_position_enum') THEN
        CREATE TYPE player_position_enum AS ENUM ('PG', 'SG', 'SF', 'PF', 'C');
    END IF;
END$$;

-- Clean up empty strings to NULL before casting
UPDATE intake_submissions SET primary_position = NULL WHERE primary_position = '';
UPDATE intake_submissions SET secondary_position = NULL WHERE secondary_position = '';
UPDATE intake_submissions SET grad_class = NULL WHERE grad_class = '';

-- Alter columns
ALTER TABLE intake_submissions 
  ALTER COLUMN primary_position DROP DEFAULT,
  ALTER COLUMN primary_position TYPE player_position_enum USING (NULLIF(primary_position, '')::player_position_enum),
  ALTER COLUMN secondary_position DROP DEFAULT,
  ALTER COLUMN secondary_position TYPE player_position_enum USING (NULLIF(secondary_position, '')::player_position_enum),
  ALTER COLUMN grad_class DROP DEFAULT,
  ALTER COLUMN grad_class TYPE integer USING (NULLIF(grad_class, '')::integer);

-- 2. Create coach_evaluations table for scoring
CREATE TABLE IF NOT EXISTS coach_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intake_submission_id uuid REFERENCES intake_submissions(id) ON DELETE CASCADE,
  evaluator_name text NOT NULL,
  athleticism_score integer CHECK (athleticism_score >= 0 AND athleticism_score <= 10),
  skill_score integer CHECK (skill_score >= 0 AND skill_score <= 10),
  iq_score integer CHECK (iq_score >= 0 AND iq_score <= 10),
  -- Weighted composite score: 40% Ath, 40% Skill, 20% IQ
  composite_score numeric GENERATED ALWAYS AS ((athleticism_score * 0.4) + (skill_score * 0.4) + (iq_score * 0.2)) STORED,
  overall_grade text,
  recommendation text CHECK (recommendation IN ('offer', 'watch', 'pass')),
  internal_notes text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coach_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage coach evaluations" ON coach_evaluations FOR ALL TO authenticated USING (public.has_any_role(ARRAY['admin','service_specialist']));

CREATE INDEX IF NOT EXISTS idx_coach_evaluations_intake_id ON coach_evaluations(intake_submission_id);
