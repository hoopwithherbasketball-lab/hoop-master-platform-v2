
-- Foundation: user_roles + helper functions (no profiles dependency)

CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('player', 'parent', 'coach', 'club_admin', 'admin', 'service_specialist')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, role)
);
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS user_roles_role_idx ON user_roles(role);

-- Security-definer helpers to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(check_role text)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = check_role); $$;

CREATE OR REPLACE FUNCTION public.has_any_role(check_roles text[])
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = ANY(check_roles)); $$;

CREATE OR REPLACE FUNCTION public.get_my_roles()
RETURNS text[] LANGUAGE sql SECURITY DEFINER SET search_path = public STABLE
AS $$ SELECT COALESCE(ARRAY_AGG(role), ARRAY[]::text[]) FROM public.user_roles WHERE user_id = auth.uid(); $$;

-- RLS policies for user_roles
CREATE POLICY "Users can view own role" ON user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own role" ON user_roles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can manage all roles" ON user_roles FOR ALL TO authenticated USING (public.has_role('admin'));
CREATE POLICY "Service role can manage roles" ON user_roles FOR ALL TO service_role USING (true);

GRANT EXECUTE ON FUNCTION public.has_role(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_any_role(text[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_my_roles() TO authenticated;
