
-- Notifications, coach_profiles, site_content, assistant tables

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
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "System can insert notifications" ON notifications FOR INSERT TO authenticated, service_role WITH CHECK (true);
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_is_read_created_idx ON notifications(user_id, is_read, created_at DESC);

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
CREATE POLICY "Users can view own coach profile" ON coach_profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can manage own coach profile" ON coach_profiles FOR ALL TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can view all coach profiles" ON coach_profiles FOR SELECT TO authenticated USING (public.has_role('admin'));

CREATE TABLE IF NOT EXISTS site_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  key text NOT NULL,
  value text NOT NULL DEFAULT '',
  content_type text NOT NULL DEFAULT 'text',
  label text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(section, key)
);
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read site content" ON site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage site content" ON site_content FOR ALL TO authenticated USING (public.has_role('admin'));
CREATE INDEX IF NOT EXISTS site_content_section_idx ON site_content(section);

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
CREATE POLICY "Coaches can view messages in own sessions" ON assistant_messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM assistant_sessions s WHERE s.id = session_id AND s.coach_id = (SELECT auth.uid())));
CREATE POLICY "Coaches can insert messages in own sessions" ON assistant_messages FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM assistant_sessions s WHERE s.id = session_id AND s.coach_id = (SELECT auth.uid())));
CREATE POLICY "Coaches can delete messages in own sessions" ON assistant_messages FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM assistant_sessions s WHERE s.id = session_id AND s.coach_id = (SELECT auth.uid())));
CREATE INDEX IF NOT EXISTS assistant_sessions_coach_id_idx ON assistant_sessions(coach_id);
CREATE INDEX IF NOT EXISTS assistant_messages_session_id_idx ON assistant_messages(session_id);
