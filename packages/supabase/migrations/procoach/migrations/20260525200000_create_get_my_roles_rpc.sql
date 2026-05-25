-- SECURITY DEFINER function to get current user's roles, bypassing RLS
CREATE OR REPLACE FUNCTION public.get_my_roles()
RETURNS text[]
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT COALESCE(ARRAY_AGG(role), ARRAY[]::text[]) FROM public.user_roles WHERE user_id = auth.uid();
$$;