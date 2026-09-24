-- Proposals Table
CREATE TABLE proposals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  partner_id UUID REFERENCES crm_partners(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Sent', 'Viewed', 'Accepted', 'Declined')),
  package_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

-- STRICT CONSTRAINT 1: Admin Full Access ONLY. Absolutely no public RLS policies.
CREATE POLICY "Enable full access for admins" ON proposals 
FOR ALL USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');
