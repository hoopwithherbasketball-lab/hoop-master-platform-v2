
-- NIL and ConnectGBB tables

-- NIL partnerships
CREATE TABLE IF NOT EXISTS nil_partnerships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL DEFAULT '',
  deal_type text NOT NULL DEFAULT 'sponsorship' CHECK (deal_type IN ('sponsorship','endorsement','appearance','social_media','other')),
  value_cents integer NOT NULL DEFAULT 0,
  start_date date,
  end_date date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','pending','completed','cancelled')),
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE nil_partnerships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own nil partnerships" ON nil_partnerships FOR SELECT TO authenticated USING (athlete_id = auth.uid());
CREATE POLICY "Users can manage own nil partnerships" ON nil_partnerships FOR ALL TO authenticated USING (athlete_id = auth.uid());
CREATE POLICY "Admins can manage all nil partnerships" ON nil_partnerships FOR ALL TO authenticated USING (public.has_role('admin'));

-- NIL companies
CREATE TABLE IF NOT EXISTS nil_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  industry text NOT NULL DEFAULT '',
  contact_name text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '',
  website text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'prospect' CHECK (status IN ('prospect','outreach','negotiating','partner','inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE nil_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view nil companies" ON nil_companies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage nil companies" ON nil_companies FOR ALL TO authenticated USING (public.has_any_role(ARRAY['admin','service_specialist']));

-- NIL opportunities
CREATE TABLE IF NOT EXISTS nil_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES nil_companies(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  value_cents integer NOT NULL DEFAULT 0,
  deadline date,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','applied','in_review','offered','accepted','rejected','expired')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE nil_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view nil opportunities" ON nil_opportunities FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage nil opportunities" ON nil_opportunities FOR ALL TO authenticated USING (public.has_any_role(ARRAY['admin','service_specialist']));

-- NIL compliance queue
CREATE TABLE IF NOT EXISTS nil_compliance_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  partnership_id uuid REFERENCES nil_partnerships(id) ON DELETE CASCADE,
  school_name text NOT NULL DEFAULT '',
  conference text NOT NULL DEFAULT '',
  filing_status text NOT NULL DEFAULT 'pending' CHECK (filing_status IN ('pending','filed','approved','rejected')),
  filed_at timestamptz,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE nil_compliance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own compliance records" ON nil_compliance_records FOR SELECT TO authenticated USING (athlete_id = auth.uid());
CREATE POLICY "Admins can manage compliance records" ON nil_compliance_records FOR ALL TO authenticated USING (public.has_any_role(ARRAY['admin','service_specialist']));

-- NIL outreach
CREATE TABLE IF NOT EXISTS nil_outreach (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id uuid REFERENCES nil_companies(id) ON DELETE SET NULL,
  subject text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','sent','replied','ignored')),
  sent_at timestamptz,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE nil_outreach ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own nil outreach" ON nil_outreach FOR SELECT TO authenticated USING (athlete_id = auth.uid());
CREATE POLICY "Users can manage own nil outreach" ON nil_outreach FOR ALL TO authenticated USING (athlete_id = auth.uid());
CREATE POLICY "Admins can view all nil outreach" ON nil_outreach FOR SELECT TO authenticated USING (public.has_role('admin'));

-- NIL tasks
CREATE TABLE IF NOT EXISTS nil_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','done','cancelled')),
  due_date date,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE nil_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own nil tasks" ON nil_tasks FOR ALL TO authenticated USING (athlete_id = auth.uid());
CREATE POLICY "Admins can view all nil tasks" ON nil_tasks FOR SELECT TO authenticated USING (public.has_role('admin'));

-- ConnectGBB: member_profiles
CREATE TABLE IF NOT EXISTS member_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  avatar_url text NOT NULL DEFAULT '',
  role_label text NOT NULL DEFAULT 'player',
  graduation_year integer,
  position text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  is_verified boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE member_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own member_profile" ON member_profiles FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ConnectGBB: member_connections
CREATE TABLE IF NOT EXISTS member_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','declined')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(requester_id, target_id)
);
ALTER TABLE member_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own connections" ON member_connections FOR SELECT TO authenticated
  USING (requester_id = auth.uid() OR target_id = auth.uid());
CREATE POLICY "Users can manage own connections" ON member_connections FOR ALL TO authenticated
  USING (requester_id = auth.uid());

-- ConnectGBB: training_tracks
CREATE TABLE IF NOT EXISTS training_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'skills',
  level text NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner','intermediate','advanced')),
  duration_weeks integer NOT NULL DEFAULT 0,
  coach_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE training_tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view active training tracks" ON training_tracks FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admins can manage training tracks" ON training_tracks FOR ALL TO authenticated USING (public.has_any_role(ARRAY['admin','coach']));

-- ConnectGBB: community_posts
CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL DEFAULT '',
  author_role text NOT NULL DEFAULT 'player' CHECK (author_role IN ('player', 'parent', 'coach', 'club_admin', 'scout')),
  content text NOT NULL,
  media_url text,
  post_type text NOT NULL DEFAULT 'text' CHECK (post_type IN ('text','image','video','highlight')),
  like_count integer NOT NULL DEFAULT 0,
  comment_count integer NOT NULL DEFAULT 0,
  is_pinned boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view community_posts" ON community_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own community_posts" ON community_posts FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "Users can update own community_posts" ON community_posts FOR UPDATE TO authenticated
  USING (author_id = auth.uid() OR public.has_role('admin')) WITH CHECK (author_id = auth.uid() OR public.has_role('admin'));
CREATE POLICY "Users can delete own community_posts" ON community_posts FOR DELETE TO authenticated
  USING (author_id = auth.uid() OR public.has_role('admin'));

-- ConnectGBB: community_likes
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

-- ConnectGBB: conversations + messages
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_one uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_two uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT TO authenticated
  USING (participant_one = auth.uid() OR participant_two = auth.uid());
CREATE POLICY "Users can manage own conversations" ON conversations FOR ALL TO authenticated
  USING (participant_one = auth.uid() OR participant_two = auth.uid());

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in own conversations" ON messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM conversations c WHERE c.id = messages.conversation_id AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())));
CREATE POLICY "Users can insert messages in own conversations" ON messages FOR INSERT TO authenticated
  WITH CHECK (sender_id = auth.uid() AND EXISTS (SELECT 1 FROM conversations c WHERE c.id = messages.conversation_id AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())));
