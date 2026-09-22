-- Courtside communication drill tracking for live HOOP WITH HER floor-general development.
-- Stores fast-tap rubric data for Offensive PG, Defensive QB, and Hardwood Chess variations.

DO $$ BEGIN
  CREATE TYPE courtside_drill_type AS ENUM (
    'OFFENSIVE_PG',
    'RELAY_PG',
    'SNAPSHOT_PG',
    'LATE_CLOCK_PG',
    'DEFENSIVE_QB',
    'HARDWOOD_CHESS'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE courtside_eval_role AS ENUM (
    'POINT_GUARD',
    'RECEIVER_FLOOR_GENERAL',
    'DEFENSIVE_QUARTERBACK',
    'OFFENSIVE_CAPTAIN',
    'DEFENSIVE_CAPTAIN'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE courtside_outcome AS ENUM (
    'CHECKMATE',
    'ADVANTAGE',
    'STALEMATE',
    'TURNOVER',
    'LOCKDOWN',
    'CONTESTED',
    'BREAKDOWN',
    'GRANDMASTER',
    'TACTICIAN',
    'NOVICE'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS courtside_communication_evaluations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_profile_id uuid NOT NULL REFERENCES player_profiles(id) ON DELETE CASCADE,
  evaluator_id uuid REFERENCES auth.users(id) ON DELETE SET NULL DEFAULT auth.uid(),
  drill_type courtside_drill_type NOT NULL,
  evaluated_role courtside_eval_role NOT NULL,
  outcome courtside_outcome NOT NULL,
  event_name text NOT NULL DEFAULT '',
  defense_scheme text NOT NULL DEFAULT '',
  offensive_set text NOT NULL DEFAULT '',
  shot_clock_seconds integer NOT NULL DEFAULT 24 CHECK (shot_clock_seconds > 0 AND shot_clock_seconds <= 30),
  decision_window_seconds integer NOT NULL DEFAULT 3 CHECK (decision_window_seconds > 0 AND decision_window_seconds <= 10),
  communication_score integer NOT NULL CHECK (communication_score BETWEEN 1 AND 3),
  processing_score integer NOT NULL CHECK (processing_score BETWEEN 1 AND 3),
  command_score integer CHECK (command_score BETWEEN 1 AND 3),
  spacing_score integer CHECK (spacing_score BETWEEN 1 AND 3),
  advantage_creation_score integer CHECK (advantage_creation_score BETWEEN 1 AND 3),
  defensive_read_score integer CHECK (defensive_read_score BETWEEN 1 AND 3),
  composure_score integer CHECK (composure_score BETWEEN 1 AND 3),
  rubric_scores jsonb NOT NULL DEFAULT '{}'::jsonb,
  coach_notes text NOT NULL DEFAULT '',
  event_date timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE courtside_communication_evaluations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can insert courtside communication evaluations"
  ON courtside_communication_evaluations
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_any_role(ARRAY['admin','coach','club_admin','service_specialist']));

CREATE POLICY "Staff can view courtside communication evaluations"
  ON courtside_communication_evaluations
  FOR SELECT
  TO authenticated
  USING (public.has_any_role(ARRAY['admin','coach','club_admin','service_specialist']));

CREATE POLICY "Admins can manage courtside communication evaluations"
  ON courtside_communication_evaluations
  FOR ALL
  TO authenticated
  USING (public.has_role('admin'))
  WITH CHECK (public.has_role('admin'));

CREATE INDEX IF NOT EXISTS courtside_eval_player_date_idx
  ON courtside_communication_evaluations(player_profile_id, event_date DESC);

CREATE INDEX IF NOT EXISTS courtside_eval_drill_date_idx
  ON courtside_communication_evaluations(drill_type, event_date DESC);

CREATE INDEX IF NOT EXISTS courtside_eval_evaluator_date_idx
  ON courtside_communication_evaluations(evaluator_id, event_date DESC);
