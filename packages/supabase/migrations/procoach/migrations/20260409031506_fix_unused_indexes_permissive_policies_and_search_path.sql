/*
  # Fix Unused Indexes, Multiple Permissive Policies, and is_admin Search Path

  ## Summary
  Resolves all flagged security and performance issues from the Supabase advisor:
  1. Drops 23 unused indexes that add write overhead without benefiting reads
  2. Consolidates duplicate permissive RLS policies into single merged policies
  3. Fixes the is_admin() function to use a fixed search_path (prevents search_path injection)
*/

-- 1. Drop unused indexes
DROP INDEX IF EXISTS videos_category_idx;
DROP INDEX IF EXISTS videos_created_by_idx;
DROP INDEX IF EXISTS video_assignments_player_id_idx;
DROP INDEX IF EXISTS video_assignments_video_id_idx;
DROP INDEX IF EXISTS evaluation_packets_user_id_idx;
DROP INDEX IF EXISTS goals_client_id_idx;
DROP INDEX IF EXISTS goals_coach_id_idx;
DROP INDEX IF EXISTS notifications_actor_id_idx;
DROP INDEX IF EXISTS notifications_post_id_idx;
DROP INDEX IF EXISTS sessions_client_id_idx;
DROP INDEX IF EXISTS sessions_coach_id_idx;
DROP INDEX IF EXISTS video_assignments_assigned_by_idx;
DROP INDEX IF EXISTS social_posts_user_id_idx;
DROP INDEX IF EXISTS social_posts_created_at_idx;
DROP INDEX IF EXISTS social_posts_post_type_idx;
DROP INDEX IF EXISTS post_likes_post_id_idx;
DROP INDEX IF EXISTS post_likes_user_id_idx;
DROP INDEX IF EXISTS post_comments_post_id_idx;
DROP INDEX IF EXISTS post_comments_user_id_idx;
DROP INDEX IF EXISTS follows_follower_id_idx;
DROP INDEX IF EXISTS follows_following_id_idx;
DROP INDEX IF EXISTS notifications_is_read_idx;
DROP INDEX IF EXISTS notifications_created_at_idx;

-- 2. Fix is_admin() search path
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'); $$;

-- 3. Consolidate multiple permissive policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Admins or owners can update profile" ON profiles FOR UPDATE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = id) WITH CHECK (is_admin() OR (SELECT auth.uid()) = id);
DROP POLICY IF EXISTS "Admins can view all coaches" ON coaches;
DROP POLICY IF EXISTS "Admins can update any coach" ON coaches;
DROP POLICY IF EXISTS "Coaches can update own coach record" ON coaches;
CREATE POLICY "Admins or coaches can update coach record" ON coaches FOR UPDATE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = user_id) WITH CHECK (is_admin() OR (SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "Admins can view all evaluation packets" ON evaluation_packets;
DROP POLICY IF EXISTS "Users can view their own evaluation packets" ON evaluation_packets;
CREATE POLICY "Admins or owners can view evaluation packets" ON evaluation_packets FOR SELECT TO authenticated USING (is_admin() OR (SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "Admins can delete any evaluation packet" ON evaluation_packets;
DROP POLICY IF EXISTS "Users can delete their own evaluation packets" ON evaluation_packets;
CREATE POLICY "Admins or owners can delete evaluation packets" ON evaluation_packets FOR DELETE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "Admins can view all follows" ON follows;
DROP POLICY IF EXISTS "Admins can view all goals" ON goals;
DROP POLICY IF EXISTS "Clients can view own goals" ON goals;
CREATE POLICY "Admins or participants can view goals" ON goals FOR SELECT TO authenticated USING (is_admin() OR (SELECT auth.uid()) = client_id OR (SELECT auth.uid()) = coach_id);
DROP POLICY IF EXISTS "Admins can update any goal" ON goals;
DROP POLICY IF EXISTS "Participants can update goals" ON goals;
CREATE POLICY "Admins or participants can update goals" ON goals FOR UPDATE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = client_id OR (SELECT auth.uid()) = coach_id) WITH CHECK (is_admin() OR (SELECT auth.uid()) = client_id OR (SELECT auth.uid()) = coach_id);
DROP POLICY IF EXISTS "Admins can delete any goal" ON goals;
DROP POLICY IF EXISTS "Clients can delete own goals" ON goals;
CREATE POLICY "Admins or clients can delete goals" ON goals FOR DELETE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = client_id);
DROP POLICY IF EXISTS "Admins can view all notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Admins or owners can view notifications" ON notifications FOR SELECT TO authenticated USING (is_admin() OR (SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "Admins can view all post comments" ON post_comments;
DROP POLICY IF EXISTS "Admins can delete any post comment" ON post_comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON post_comments;
CREATE POLICY "Admins or owners can delete post comments" ON post_comments FOR DELETE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "Admins can view all post likes" ON post_likes;
DROP POLICY IF EXISTS "Admins can view all sessions" ON sessions;
DROP POLICY IF EXISTS "Participants can view their sessions" ON sessions;
CREATE POLICY "Admins or participants can view sessions" ON sessions FOR SELECT TO authenticated USING (is_admin() OR (SELECT auth.uid()) = coach_id OR (SELECT auth.uid()) = client_id);
DROP POLICY IF EXISTS "Admins can update any session" ON sessions;
DROP POLICY IF EXISTS "Participants can update their sessions" ON sessions;
CREATE POLICY "Admins or participants can update sessions" ON sessions FOR UPDATE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = coach_id OR (SELECT auth.uid()) = client_id) WITH CHECK (is_admin() OR (SELECT auth.uid()) = coach_id OR (SELECT auth.uid()) = client_id);
DROP POLICY IF EXISTS "Admins can view all social posts" ON social_posts;
DROP POLICY IF EXISTS "Admins can delete any social post" ON social_posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON social_posts;
CREATE POLICY "Admins or owners can delete social posts" ON social_posts FOR DELETE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = user_id);
DROP POLICY IF EXISTS "Admins can view all video assignments" ON video_assignments;
DROP POLICY IF EXISTS "Players can view own assignments" ON video_assignments;
CREATE POLICY "Admins or participants can view video assignments" ON video_assignments FOR SELECT TO authenticated USING (is_admin() OR (SELECT auth.uid()) = player_id OR (SELECT auth.uid()) = assigned_by);
DROP POLICY IF EXISTS "Admins can delete any video assignment" ON video_assignments;
DROP POLICY IF EXISTS "Coaches can delete assignments they created" ON video_assignments;
CREATE POLICY "Admins or coaches can delete video assignments" ON video_assignments FOR DELETE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = assigned_by);
DROP POLICY IF EXISTS "Admins can view all videos" ON videos;
DROP POLICY IF EXISTS "Authenticated users can view public videos" ON videos;
CREATE POLICY "Admins or authorized users can view videos" ON videos FOR SELECT TO authenticated USING (is_admin() OR is_public = true OR created_by = (SELECT auth.uid()));
DROP POLICY IF EXISTS "Admins can update any video" ON videos;
DROP POLICY IF EXISTS "Coaches can update own videos" ON videos;
CREATE POLICY "Admins or coaches can update videos" ON videos FOR UPDATE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = created_by) WITH CHECK (is_admin() OR (SELECT auth.uid()) = created_by);
DROP POLICY IF EXISTS "Admins can delete any video" ON videos;
DROP POLICY IF EXISTS "Coaches can delete own videos" ON videos;
CREATE POLICY "Admins or coaches can delete videos" ON videos FOR DELETE TO authenticated USING (is_admin() OR (SELECT auth.uid()) = created_by);
