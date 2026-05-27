-- NIL and ConnectGBB feature tables
-- Run in Supabase Dashboard -> SQL Editor

-- === NIL TABLES ===

CREATE TABLE IF NOT EXISTS nil_companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  stage text NOT NULL DEFAULT 'prospecting' CHECK (stage IN ('prospecting','matched','outreach','negotiation','active')),
  logo_url text DEFAULT '',
  website text DEFAULT '',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE nil_companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage nil_companies" ON nil_companies FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Anyone can view nil_companies" ON nil_companies FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS nil_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_name text NOT NULL DEFAULT '',
  brand text NOT NULL DEFAULT '',
  value_cents integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'matched' CHECK (status IN ('matched','review','negotiation','active','completed','cancelled')),
  athlete_profile_id uuid REFERENCES player_profiles(id) ON DELETE SET NULL,
  company_id uuid REFERENCES nil_companies(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE nil_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage nil_opportunities" ON nil_opportunities FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Anyone can view nil_opportunities" ON nil_opportunities FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS nil_athlete_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_profile_id uuid NOT NULL REFERENCES player_profiles(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  position text DEFAULT '',
  class_year integer,
  followers text DEFAULT '0',
  readiness_score integer DEFAULT 0,
  tier text NOT NULL DEFAULT 'bronze' CHECK (tier IN ('bronze','silver','gold','platinum')),
  opted_in boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE nil_athlete_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage nil_athlete_profiles" ON nil_athlete_profiles FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Anyone can view nil_athlete_profiles" ON nil_athlete_profiles FOR SELECT TO anon, authenticated USING (opted_in = true);

CREATE TABLE IF NOT EXISTS nil_outreach (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_entity text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  body text DEFAULT '',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','pending','replied','closed')),
  athlete_profile_id uuid REFERENCES nil_athlete_profiles(id) ON DELETE SET NULL,
  company_id uuid REFERENCES nil_companies(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE nil_outreach ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage nil_outreach" ON nil_outreach FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));
CREATE POLICY "Anyone can view nil_outreach" ON nil_outreach FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS nil_compliance_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_name text NOT NULL DEFAULT '',
  opportunity_name text NOT NULL DEFAULT '',
  items text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','error')),
  athlete_profile_id uuid REFERENCES nil_athlete_profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE nil_compliance_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage nil_compliance_items" ON nil_compliance_items FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS nil_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  target text NOT NULL DEFAULT '',
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low','medium','high','urgent')),
  status text NOT NULL DEFAULT 'todo' CHECK (status IN ('todo','in_progress','completed')),
  due_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE nil_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage nil_tasks" ON nil_tasks FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

-- === ConnectGBB TABLES ===

CREATE TABLE IF NOT EXISTS community_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL DEFAULT '',
  author_role text NOT NULL DEFAULT 'player' CHECK (author_role IN ('player','parent','coach','club_admin')),
  content text NOT NULL,
  image_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  like_count integer DEFAULT 0,
  comment_count integer DEFAULT 0
);
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view community_posts" ON community_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own community_posts" ON community_posts FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());
CREATE POLICY "Users can update own community_posts" ON community_posts FOR UPDATE TO authenticated USING (author_id = auth.uid());

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

CREATE TABLE IF NOT EXISTS training_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  category text NOT NULL DEFAULT 'skill' CHECK (category IN ('skill','strength','film','recruiting','ball_handling','shooting','defense','conditioning','recruiting_ed')),
  level text NOT NULL DEFAULT 'beginner' CHECK (level IN ('beginner','intermediate','advanced')),
  duration_minutes integer DEFAULT 0,
  thumbnail_url text DEFAULT '',
  video_url text DEFAULT '',
  lesson_count integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE training_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view training_videos" ON training_videos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage training_videos" ON training_videos FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS member_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','blocked')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(requester_id, target_id)
);
ALTER TABLE member_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own connections" ON member_connections FOR SELECT TO authenticated USING (requester_id = auth.uid() OR target_id = auth.uid());
CREATE POLICY "Users can manage own connections" ON member_connections FOR ALL TO authenticated USING (requester_id = auth.uid()) WITH CHECK (requester_id = auth.uid());

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_one uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  participant_two uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_message text DEFAULT '',
  last_timestamp timestamptz DEFAULT now(),
  participant_one_unread integer DEFAULT 0,
  participant_two_unread integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(participant_one, participant_two)
);
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT TO authenticated USING (participant_one = auth.uid() OR participant_two = auth.uid());
CREATE POLICY "Users can manage own conversations" ON conversations FOR ALL TO authenticated USING (participant_one = auth.uid() OR participant_two = auth.uid());

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages in own conversations" ON messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM conversations c WHERE c.id = conversation_id AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())));
CREATE POLICY "Users can insert messages in own conversations" ON messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid());

CREATE TABLE IF NOT EXISTS member_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT 'player' CHECK (role IN ('player','parent','coach','scout')),
  bio text DEFAULT '',
  avatar_url text DEFAULT '',
  location text DEFAULT '',
  email_visibility text NOT NULL DEFAULT 'connections' CHECK (email_visibility IN ('public','connections','private')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE member_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own member_profile" ON member_profiles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can manage own member_profile" ON member_profiles FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Anyone can view public member_profiles" ON member_profiles FOR SELECT TO authenticated USING (true);
