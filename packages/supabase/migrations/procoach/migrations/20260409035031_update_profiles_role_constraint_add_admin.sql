ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('parent', 'player', 'coach', 'trainer', 'admin', 'client'));
UPDATE profiles SET role = 'admin' WHERE id IN ('edb36acf-cfb2-4849-9905-2a43a322ec24','20d0e140-f3f1-4d23-a5bb-4c1e28bdf071','00c7be21-86ec-4107-a2b1-ac1d6ddf1375');
INSERT INTO profiles (id, role, full_name) VALUES ('20d0e140-f3f1-4d23-a5bb-4c1e28bdf071', 'admin', 'Lamont Revell'),('00c7be21-86ec-4107-a2b1-ac1d6ddf1375', 'admin', 'Lamont Revell') ON CONFLICT (id) DO UPDATE SET role = 'admin';
