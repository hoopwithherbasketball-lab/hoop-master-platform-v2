-- MIGRATION: Phase 8 Page Builder MVP

CREATE TABLE IF NOT EXISTS page_builder_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS page_builder_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES page_builder_pages(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('hero', 'text', 'features', 'cta', 'media')),
  order_index integer NOT NULL,
  content_json jsonb DEFAULT '{}'::jsonb,
  settings_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE page_builder_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_builder_blocks ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage page_builder_pages" ON page_builder_pages FOR ALL TO authenticated USING (public.has_any_role(ARRAY['admin']));
CREATE POLICY "Admins can manage page_builder_blocks" ON page_builder_blocks FOR ALL TO authenticated USING (public.has_any_role(ARRAY['admin']));

-- Anyone can read published pages and their blocks
CREATE POLICY "Anyone can read published pages" ON page_builder_pages FOR SELECT USING (status = 'published');
CREATE POLICY "Anyone can read published blocks" ON page_builder_blocks FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM page_builder_pages 
    WHERE page_builder_pages.id = page_builder_blocks.page_id 
    AND page_builder_pages.status = 'published'
  )
);

CREATE INDEX IF NOT EXISTS idx_page_builder_pages_slug ON page_builder_pages(slug);
CREATE INDEX IF NOT EXISTS idx_page_builder_blocks_page_id ON page_builder_blocks(page_id);
CREATE INDEX IF NOT EXISTS idx_page_builder_blocks_order ON page_builder_blocks(order_index);
