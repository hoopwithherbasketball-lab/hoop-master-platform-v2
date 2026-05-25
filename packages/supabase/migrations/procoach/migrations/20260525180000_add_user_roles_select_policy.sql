-- Allow users to SELECT their own role from user_roles
-- Without this, loadRoles() returns empty for non-admin users
DROP POLICY IF EXISTS "Users can view own role" ON user_roles;
CREATE POLICY "Users can view own role" ON user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());