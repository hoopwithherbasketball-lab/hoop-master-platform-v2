
-- Harden ConnectGBB: community_memberships, comments, post_reports, audit_logs

CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END;
$$;

CREATE OR REPLACE FUNCTION public.is_admin_user(p_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p_user_id AND ur.role = 'admin'); $$;

CREATE TABLE IF NOT EXISTS community_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  tier text NOT NULL DEFAULT 'starter' CHECK (tier IN ('starter', 'pro', 'elite')),
  invited_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at timestamptz,
  expires_at timestamptz,
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_community_memberships_status_tier ON public.community_memberships(status, tier);
DROP TRIGGER IF EXISTS trg_community_memberships_updated_at ON public.community_memberships;
CREATE TRIGGER trg_community_memberships_updated_at BEFORE UPDATE ON public.community_memberships FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE OR REPLACE FUNCTION public.is_active_community_member(p_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT (
    EXISTS (SELECT 1 FROM public.community_memberships cm WHERE cm.user_id = p_user_id AND cm.status = 'active' AND (cm.expires_at IS NULL OR cm.expires_at > now()))
    OR public.is_admin_user(p_user_id)
  );
$$;

CREATE OR REPLACE FUNCTION public.ensure_community_membership()
RETURNS public.community_memberships LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_primary_role text;
  v_status text := 'pending';
  v_tier text := 'starter';
  v_membership public.community_memberships;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  SELECT ur.role INTO v_primary_role FROM public.user_roles ur WHERE ur.user_id = v_user_id
    ORDER BY CASE ur.role WHEN 'admin' THEN 1 WHEN 'coach' THEN 2 WHEN 'club_admin' THEN 3 WHEN 'service_specialist' THEN 4 ELSE 10 END LIMIT 1;
  IF v_primary_role IN ('admin', 'coach', 'club_admin', 'service_specialist') THEN
    v_status := 'active';
    v_tier := CASE WHEN v_primary_role = 'admin' THEN 'elite' ELSE 'pro' END;
  END IF;
  INSERT INTO public.community_memberships (user_id, status, tier, approved_at)
  VALUES (v_user_id, v_status, v_tier, CASE WHEN v_status = 'active' THEN now() ELSE NULL END)
  ON CONFLICT (user_id) DO UPDATE SET updated_at = now()
  RETURNING * INTO v_membership;
  RETURN v_membership;
END;
$$;

CREATE TABLE IF NOT EXISTS community_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  author_name text NOT NULL DEFAULT '',
  author_role text NOT NULL DEFAULT 'player' CHECK (author_role IN ('player', 'parent', 'coach', 'club_admin', 'scout')),
  parent_comment_id uuid REFERENCES public.community_comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_community_comments_post_created ON public.community_comments(post_id, created_at DESC);
DROP TRIGGER IF EXISTS trg_community_comments_updated_at ON public.community_comments;
CREATE TRIGGER trg_community_comments_updated_at BEFORE UPDATE ON public.community_comments FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE TABLE IF NOT EXISTS community_post_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  reporter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL CHECK (reason IN ('spam', 'abuse', 'harassment', 'misinformation', 'other')),
  details text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewing', 'resolved', 'rejected')),
  resolved_at timestamptz,
  resolved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(post_id, reporter_id)
);
CREATE INDEX IF NOT EXISTS idx_community_post_reports_status_created ON public.community_post_reports(status, created_at DESC);
DROP TRIGGER IF EXISTS trg_community_post_reports_updated_at ON public.community_post_reports;
CREATE TRIGGER trg_community_post_reports_updated_at BEFORE UPDATE ON public.community_post_reports FOR EACH ROW EXECUTE FUNCTION public.set_current_timestamp_updated_at();

CREATE TABLE IF NOT EXISTS community_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_community_audit_logs_entity ON public.community_audit_logs(entity_type, entity_id, created_at DESC);

-- Sync triggers
CREATE OR REPLACE FUNCTION public.sync_community_post_like_count() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_post_id uuid;
BEGIN
  v_post_id := COALESCE(NEW.post_id, OLD.post_id);
  UPDATE public.community_posts SET like_count = (SELECT COUNT(*)::integer FROM public.community_likes WHERE post_id = v_post_id) WHERE id = v_post_id;
  RETURN COALESCE(NEW, OLD);
END;
$$;
DROP TRIGGER IF EXISTS trg_sync_community_post_like_count ON public.community_likes;
CREATE TRIGGER trg_sync_community_post_like_count AFTER INSERT OR DELETE ON public.community_likes FOR EACH ROW EXECUTE FUNCTION public.sync_community_post_like_count();

CREATE OR REPLACE FUNCTION public.sync_community_post_comment_count() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_post_id uuid;
BEGIN
  v_post_id := COALESCE(NEW.post_id, OLD.post_id);
  UPDATE public.community_posts SET comment_count = (SELECT COUNT(*)::integer FROM public.community_comments WHERE post_id = v_post_id) WHERE id = v_post_id;
  RETURN COALESCE(NEW, OLD);
END;
$$;
DROP TRIGGER IF EXISTS trg_sync_community_post_comment_count ON public.community_comments;
CREATE TRIGGER trg_sync_community_post_comment_count AFTER INSERT OR DELETE ON public.community_comments FOR EACH ROW EXECUTE FUNCTION public.sync_community_post_comment_count();

CREATE OR REPLACE FUNCTION public.log_community_event() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_entity_id uuid;
BEGIN
  v_entity_id := COALESCE(NEW.id, OLD.id);
  INSERT INTO public.community_audit_logs (actor_user_id, action, entity_type, entity_id, metadata)
  VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, v_entity_id, jsonb_build_object('table', TG_TABLE_NAME));
  RETURN COALESCE(NEW, OLD);
END;
$$;
DROP TRIGGER IF EXISTS trg_log_community_posts ON public.community_posts;
CREATE TRIGGER trg_log_community_posts AFTER INSERT OR UPDATE OR DELETE ON public.community_posts FOR EACH ROW EXECUTE FUNCTION public.log_community_event();
DROP TRIGGER IF EXISTS trg_log_community_reports ON public.community_post_reports;
CREATE TRIGGER trg_log_community_reports AFTER INSERT OR UPDATE OR DELETE ON public.community_post_reports FOR EACH ROW EXECUTE FUNCTION public.log_community_event();

CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_unique_pair ON public.conversations(LEAST(participant_one, participant_two), GREATEST(participant_one, participant_two));

-- RLS
ALTER TABLE public.community_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_post_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_audit_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own membership" ON public.community_memberships;
DROP POLICY IF EXISTS "Admins can manage memberships" ON public.community_memberships;
CREATE POLICY "Users can view own membership" ON public.community_memberships FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_admin_user(auth.uid()));
CREATE POLICY "Admins can manage memberships" ON public.community_memberships FOR ALL TO authenticated USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));

-- Harden community_posts RLS to require active membership
DROP POLICY IF EXISTS "Anyone can view community_posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can insert own community_posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can update own community_posts" ON public.community_posts;
DROP POLICY IF EXISTS "Users can delete own community_posts" ON public.community_posts;
CREATE POLICY "Members can view community_posts" ON public.community_posts FOR SELECT TO authenticated USING (public.is_active_community_member(auth.uid()));
CREATE POLICY "Members can insert own community_posts" ON public.community_posts FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid() AND public.is_active_community_member(auth.uid()));
CREATE POLICY "Members can update own community_posts" ON public.community_posts FOR UPDATE TO authenticated USING ((author_id = auth.uid() AND public.is_active_community_member(auth.uid())) OR public.is_admin_user(auth.uid())) WITH CHECK ((author_id = auth.uid() AND public.is_active_community_member(auth.uid())) OR public.is_admin_user(auth.uid()));
CREATE POLICY "Members can delete own community_posts" ON public.community_posts FOR DELETE TO authenticated USING ((author_id = auth.uid() AND public.is_active_community_member(auth.uid())) OR public.is_admin_user(auth.uid()));

DROP POLICY IF EXISTS "Anyone can view community_likes" ON public.community_likes;
DROP POLICY IF EXISTS "Users can manage own likes" ON public.community_likes;
CREATE POLICY "Members can view community_likes" ON public.community_likes FOR SELECT TO authenticated USING (public.is_active_community_member(auth.uid()));
CREATE POLICY "Members can manage own likes" ON public.community_likes FOR ALL TO authenticated USING (user_id = auth.uid() AND public.is_active_community_member(auth.uid())) WITH CHECK (user_id = auth.uid() AND public.is_active_community_member(auth.uid()));

CREATE POLICY "Members can view community_comments" ON public.community_comments FOR SELECT TO authenticated USING (public.is_active_community_member(auth.uid()));
CREATE POLICY "Members can insert own community_comments" ON public.community_comments FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid() AND public.is_active_community_member(auth.uid()));
CREATE POLICY "Members can update own community_comments" ON public.community_comments FOR UPDATE TO authenticated USING ((author_id = auth.uid() AND public.is_active_community_member(auth.uid())) OR public.is_admin_user(auth.uid())) WITH CHECK ((author_id = auth.uid() AND public.is_active_community_member(auth.uid())) OR public.is_admin_user(auth.uid()));
CREATE POLICY "Members can delete own community_comments" ON public.community_comments FOR DELETE TO authenticated USING ((author_id = auth.uid() AND public.is_active_community_member(auth.uid())) OR public.is_admin_user(auth.uid()));

CREATE POLICY "Members can report community_posts" ON public.community_post_reports FOR INSERT TO authenticated WITH CHECK (reporter_id = auth.uid() AND public.is_active_community_member(auth.uid()));
CREATE POLICY "Members can view own community_reports" ON public.community_post_reports FOR SELECT TO authenticated USING (reporter_id = auth.uid() OR public.is_admin_user(auth.uid()));
CREATE POLICY "Admins can manage community_reports" ON public.community_post_reports FOR UPDATE TO authenticated USING (public.is_admin_user(auth.uid())) WITH CHECK (public.is_admin_user(auth.uid()));
CREATE POLICY "Admins can delete community_reports" ON public.community_post_reports FOR DELETE TO authenticated USING (public.is_admin_user(auth.uid()));

-- P0 fix: community_audit_logs RLS
CREATE POLICY "Admins can read community_audit_logs" ON public.community_audit_logs FOR SELECT TO authenticated USING (public.is_admin_user(auth.uid()));
CREATE POLICY "Members can write community_audit_logs" ON public.community_audit_logs FOR INSERT TO authenticated WITH CHECK (public.is_active_community_member(auth.uid()) OR public.is_admin_user(auth.uid()));

-- Harden conversations/messages with membership check
DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can manage own conversations" ON public.conversations;
CREATE POLICY "Members can view own conversations" ON public.conversations FOR SELECT TO authenticated USING ((participant_one = auth.uid() OR participant_two = auth.uid()) AND public.is_active_community_member(auth.uid()));
CREATE POLICY "Members can insert own conversations" ON public.conversations FOR INSERT TO authenticated WITH CHECK (participant_one = auth.uid() AND participant_one <> participant_two AND public.is_active_community_member(auth.uid()));
CREATE POLICY "Members can update own conversations" ON public.conversations FOR UPDATE TO authenticated USING ((participant_one = auth.uid() OR participant_two = auth.uid()) AND public.is_active_community_member(auth.uid())) WITH CHECK ((participant_one = auth.uid() OR participant_two = auth.uid()) AND public.is_active_community_member(auth.uid()));

DROP POLICY IF EXISTS "Users can view messages in own conversations" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages in own conversations" ON public.messages;
CREATE POLICY "Members can view messages in own conversations" ON public.messages FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = messages.conversation_id AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())) AND public.is_active_community_member(auth.uid()));
CREATE POLICY "Members can insert messages in own conversations" ON public.messages FOR INSERT TO authenticated WITH CHECK (sender_id = auth.uid() AND public.is_active_community_member(auth.uid()) AND EXISTS (SELECT 1 FROM public.conversations c WHERE c.id = messages.conversation_id AND (c.participant_one = auth.uid() OR c.participant_two = auth.uid())));

-- member_profiles: harden to require membership for browsing
DROP POLICY IF EXISTS "Users can manage own member_profile" ON public.member_profiles;
CREATE POLICY "Members can view member_profiles" ON public.member_profiles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_active_community_member(auth.uid()) OR public.is_admin_user(auth.uid()));
CREATE POLICY "Users can manage own member_profile" ON public.member_profiles FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view own connections" ON public.member_connections;
DROP POLICY IF EXISTS "Users can manage own connections" ON public.member_connections;
CREATE POLICY "Members can view own connections" ON public.member_connections FOR SELECT TO authenticated USING ((requester_id = auth.uid() OR target_id = auth.uid()) AND public.is_active_community_member(auth.uid()));
CREATE POLICY "Members can create own connections" ON public.member_connections FOR INSERT TO authenticated WITH CHECK (requester_id = auth.uid() AND public.is_active_community_member(auth.uid()));
CREATE POLICY "Members can update own outgoing connections" ON public.member_connections FOR UPDATE TO authenticated USING (requester_id = auth.uid() AND public.is_active_community_member(auth.uid())) WITH CHECK (requester_id = auth.uid() AND public.is_active_community_member(auth.uid()));

GRANT EXECUTE ON FUNCTION public.is_admin_user(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_active_community_member(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.ensure_community_membership() TO authenticated;
