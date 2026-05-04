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
