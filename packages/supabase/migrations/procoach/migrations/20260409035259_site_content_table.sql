-- Site Content Management Table with seed data
CREATE TABLE IF NOT EXISTS site_content (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), section text NOT NULL, key text NOT NULL, value text NOT NULL DEFAULT '', content_type text NOT NULL DEFAULT 'text', label text NOT NULL DEFAULT '', updated_at timestamptz DEFAULT now(), updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL, UNIQUE(section, key));
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read site content" ON site_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert site content" ON site_content FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE POLICY "Admins can update site content" ON site_content FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin')) WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE POLICY "Admins can delete site content" ON site_content FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM profiles WHERE id = (SELECT auth.uid()) AND role = 'admin'));
CREATE INDEX IF NOT EXISTS site_content_section_idx ON site_content(section);
