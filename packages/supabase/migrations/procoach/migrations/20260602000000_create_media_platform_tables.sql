-- ============================================================
-- Phase 7: Media Platform Tables
-- Core tables for the Hoop With Her media platform:
-- channels, assets, schedules, ad slots, EPG, analytics, white-label
-- ============================================================

-- ======== MEDIA CHANNELS ========
CREATE TABLE IF NOT EXISTS media_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text DEFAULT '',
  channel_type text NOT NULL CHECK (channel_type IN ('live', 'linear', 'vod')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'archived')),
  branding jsonb NOT NULL DEFAULT '{"logo_url": "", "primary_color": "#0134BD", "secondary_color": "#ffffff", "font_family": "Inter"}',
  custom_domain text,
  cname_target text,
  stream_url text,
  thumbnail_url text DEFAULT '',
  is_public boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE media_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public channels" ON media_channels
  FOR SELECT USING (is_public = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage channels" ON media_channels
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS media_channels_slug_idx ON media_channels(slug);
CREATE INDEX IF NOT EXISTS media_channels_status_idx ON media_channels(status);
CREATE INDEX IF NOT EXISTS media_channels_type_idx ON media_channels(channel_type);

-- ======== MEDIA ASSETS ========
CREATE TABLE IF NOT EXISTS media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  duration_seconds integer NOT NULL DEFAULT 0,
  storage_path text NOT NULL DEFAULT '',
  thumbnail_url text DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'ready', 'failed', 'archived')),
  category text DEFAULT 'uncategorized',
  tags text[] NOT NULL DEFAULT '{}',
  metadata jsonb NOT NULL DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view ready assets" ON media_assets
  FOR SELECT USING (status = 'ready' OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage assets" ON media_assets
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS media_assets_status_idx ON media_assets(status);
CREATE INDEX IF NOT EXISTS media_assets_category_idx ON media_assets(category);
CREATE INDEX IF NOT EXISTS media_assets_tags_idx ON media_assets USING gin(tags);

-- ======== CHANNEL SCHEDULES ========
CREATE TABLE IF NOT EXISTS channel_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES media_channels(id) ON DELETE CASCADE,
  asset_id uuid NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  scheduled_start timestamptz NOT NULL,
  scheduled_end timestamptz NOT NULL,
  position integer NOT NULL DEFAULT 0,
  repeat_rule text NOT NULL DEFAULT 'none' CHECK (repeat_rule IN ('none', 'daily', 'weekly')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (scheduled_end > scheduled_start)
);

ALTER TABLE channel_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active schedules" ON channel_schedules
  FOR SELECT USING (is_active = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage schedules" ON channel_schedules
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS channel_schedules_channel_idx ON channel_schedules(channel_id);
CREATE INDEX IF NOT EXISTS channel_schedules_asset_idx ON channel_schedules(asset_id);
CREATE INDEX IF NOT EXISTS channel_schedules_start_idx ON channel_schedules(scheduled_start);
CREATE INDEX IF NOT EXISTS channel_schedules_channel_start_idx ON channel_schedules(channel_id, scheduled_start);

-- ======== AD SLOTS ========
CREATE TABLE IF NOT EXISTS ad_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES media_channels(id) ON DELETE CASCADE,
  position text NOT NULL CHECK (position IN ('pre', 'mid', 'post')),
  duration_seconds integer NOT NULL DEFAULT 30,
  ad_tag_url text NOT NULL DEFAULT '',
  scte35_cue text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ad_slots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active ad slots" ON ad_slots
  FOR SELECT USING (is_active = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage ad slots" ON ad_slots
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS ad_slots_channel_idx ON ad_slots(channel_id);

-- ======== EPG PROGRAMS ========
CREATE TABLE IF NOT EXISTS epg_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL REFERENCES media_channels(id) ON DELETE CASCADE,
  asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  episode_number integer,
  season_number integer,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);

ALTER TABLE epg_programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view EPG programs" ON epg_programs
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage EPG programs" ON epg_programs
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS epg_programs_channel_idx ON epg_programs(channel_id);
CREATE INDEX IF NOT EXISTS epg_programs_start_idx ON epg_programs(start_time);
CREATE INDEX IF NOT EXISTS epg_programs_channel_time_idx ON epg_programs(channel_id, start_time, end_time);

-- ======== ANALYTICS EVENTS ========
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES media_channels(id) ON DELETE SET NULL,
  asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  viewer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text NOT NULL DEFAULT '',
  event_type text NOT NULL CHECK (event_type IN ('play', 'pause', 'stop', 'heartbeat', 'seek', 'ad_start', 'ad_end', 'fullscreen', 'quality_change')),
  watch_seconds numeric NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- No RLS on analytics_events — server-side ingestion only
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage analytics" ON analytics_events
  FOR ALL TO service_role
  USING (true);

CREATE POLICY "Admins can view analytics" ON analytics_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS analytics_events_channel_idx ON analytics_events(channel_id);
CREATE INDEX IF NOT EXISTS analytics_events_asset_idx ON analytics_events(asset_id);
CREATE INDEX IF NOT EXISTS analytics_events_type_idx ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS analytics_events_created_idx ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS analytics_events_channel_time_idx ON analytics_events(channel_id, created_at);

-- ======== ANALYTICS AGGREGATES (hourly rollups) ========
CREATE TABLE IF NOT EXISTS analytics_aggregates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid REFERENCES media_channels(id) ON DELETE SET NULL,
  asset_id uuid REFERENCES media_assets(id) ON DELETE SET NULL,
  hour_bucket timestamptz NOT NULL,
  total_plays integer NOT NULL DEFAULT 0,
  total_watch_seconds numeric NOT NULL DEFAULT 0,
  unique_viewers integer NOT NULL DEFAULT 0,
  peak_concurrent integer NOT NULL DEFAULT 0,
  ad_plays integer NOT NULL DEFAULT 0,
  ad_completions integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE analytics_aggregates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view aggregates" ON analytics_aggregates
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS analytics_agg_channel_idx ON analytics_aggregates(channel_id);
CREATE INDEX IF NOT EXISTS analytics_agg_hour_idx ON analytics_aggregates(hour_bucket);
CREATE INDEX IF NOT EXISTS analytics_agg_channel_hour_idx ON analytics_aggregates(channel_id, hour_bucket);

-- ======== WHITE LABEL TENANTS ========
CREATE TABLE IF NOT EXISTS white_label_tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  custom_domain text,
  cname_target text,
  player_branding jsonb NOT NULL DEFAULT '{"logo_url": "", "primary_color": "#0134BD", "secondary_color": "#ffffff", "accent_color": "#ff6b35", "font_family": "Inter", "watermark_url": ""}',
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived')),
  max_channels integer NOT NULL DEFAULT 5,
  max_storage_gb integer NOT NULL DEFAULT 50,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE white_label_tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage tenants" ON white_label_tenants
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS white_label_tenants_slug_idx ON white_label_tenants(slug);
CREATE INDEX IF NOT EXISTS white_label_tenants_domain_idx ON white_label_tenants(custom_domain);

-- ======== TENANT CHANNEL MAPPING ========
CREATE TABLE IF NOT EXISTS tenant_channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES white_label_tenants(id) ON DELETE CASCADE,
  channel_id uuid NOT NULL REFERENCES media_channels(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, channel_id)
);

ALTER TABLE tenant_channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage tenant channels" ON tenant_channels
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS tenant_channels_tenant_idx ON tenant_channels(tenant_id);
CREATE INDEX IF NOT EXISTS tenant_channels_channel_idx ON tenant_channels(channel_id);
