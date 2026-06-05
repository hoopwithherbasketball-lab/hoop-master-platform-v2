
-- Media platform tables: channels, assets, schedules, ad_slots, epg, analytics

CREATE TABLE IF NOT EXISTS media_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  logo_url text NOT NULL DEFAULT '',
  cover_url text NOT NULL DEFAULT '',
  stream_url text NOT NULL DEFAULT '',
  channel_type text NOT NULL DEFAULT 'live' CHECK (channel_type IN ('live','vod','replay')),
  is_active boolean NOT NULL DEFAULT true,
  tenant_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE media_channels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active channels" ON media_channels FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Admins can manage channels" ON media_channels FOR ALL TO authenticated USING (public.has_role('admin'));
CREATE INDEX IF NOT EXISTS media_channels_slug_idx ON media_channels(slug);

CREATE TABLE IF NOT EXISTS media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES media_channels(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  asset_type text NOT NULL DEFAULT 'video' CHECK (asset_type IN ('video','thumbnail','banner','ad')),
  storage_path text NOT NULL DEFAULT '',
  cdn_url text NOT NULL DEFAULT '',
  duration_seconds integer NOT NULL DEFAULT 0,
  file_size_bytes bigint NOT NULL DEFAULT 0,
  mime_type text NOT NULL DEFAULT 'video/mp4',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view active media assets" ON media_assets FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admins can manage media assets" ON media_assets FOR ALL TO authenticated USING (public.has_role('admin'));
CREATE INDEX IF NOT EXISTS media_assets_channel_idx ON media_assets(channel_id);

CREATE TABLE IF NOT EXISTS channel_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES media_channels(id) ON DELETE CASCADE,
  asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  is_live boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE channel_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view schedules" ON channel_schedules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage schedules" ON channel_schedules FOR ALL TO authenticated USING (public.has_role('admin'));
CREATE INDEX IF NOT EXISTS channel_schedules_channel_time_idx ON channel_schedules(channel_id, start_time);

CREATE TABLE IF NOT EXISTS ad_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES media_channels(id) ON DELETE CASCADE,
  asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  slot_type text NOT NULL DEFAULT 'pre-roll' CHECK (slot_type IN ('pre-roll','mid-roll','post-roll','banner')),
  duration_seconds integer NOT NULL DEFAULT 30,
  sponsor_name text NOT NULL DEFAULT '',
  click_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  start_date date,
  end_date date,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE ad_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can view active ad slots" ON ad_slots FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Admins can manage ad slots" ON ad_slots FOR ALL TO authenticated USING (public.has_role('admin'));

CREATE TABLE IF NOT EXISTS epg_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES media_channels(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  category text NOT NULL DEFAULT 'general',
  is_live boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE epg_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view epg entries" ON epg_entries FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can manage epg entries" ON epg_entries FOR ALL TO authenticated USING (public.has_role('admin'));
CREATE INDEX IF NOT EXISTS epg_entries_channel_time_idx ON epg_entries(channel_id, start_time);

CREATE TABLE IF NOT EXISTS media_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES media_channels(id) ON DELETE SET NULL,
  asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  event_type text NOT NULL CHECK (event_type IN ('view','play','pause','complete','ad_view','ad_click')),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text NOT NULL DEFAULT '',
  duration_seconds integer NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE media_analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service can insert analytics" ON media_analytics FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view analytics" ON media_analytics FOR SELECT TO authenticated USING (public.has_role('admin'));
CREATE INDEX IF NOT EXISTS media_analytics_channel_created_idx ON media_analytics(channel_id, created_at DESC);
CREATE INDEX IF NOT EXISTS media_analytics_event_type_idx ON media_analytics(event_type, created_at DESC);
