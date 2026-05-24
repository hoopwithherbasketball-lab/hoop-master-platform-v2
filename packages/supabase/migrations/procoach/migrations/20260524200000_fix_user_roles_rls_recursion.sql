-- Fix infinite RLS recursion on user_roles table
-- The "Admins can manage all roles" policy referenced user_roles itself, causing recursion

-- Create security definer helper functions to check roles without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(check_role text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = check_role
  );
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(check_roles text[])
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = ANY(check_roles)
  );
$$;

-- Drop the recursive policy on user_roles
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;

-- Recreate using the security definer function to avoid recursion
CREATE POLICY "Admins can manage all roles" ON user_roles
  FOR ALL TO authenticated
  USING (public.has_role('admin'));
