-- CRM Partners Table
CREATE TABLE crm_partners (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_name TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  status TEXT NOT NULL DEFAULT 'Lead' CHECK (status IN ('Lead', 'Pitched', 'Negotiating', 'Closed Won', 'Lost')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sponsorship Inventory Table
CREATE TABLE sponsorship_inventory (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slot_name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  partner_id UUID REFERENCES crm_partners(id) ON DELETE SET NULL,
  
  -- The Media Bridge: Connecting inventory directly to Roku/Web broadcast assets
  target_channel_id UUID REFERENCES channels(id) ON DELETE SET NULL,
  target_asset_id UUID REFERENCES media_assets(id) ON DELETE SET NULL,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE crm_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsorship_inventory ENABLE ROW LEVEL SECURITY;

-- Strict Admin-Only Policies
CREATE POLICY "Enable read/write for admins only" ON crm_partners 
FOR ALL USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');

CREATE POLICY "Enable read/write for admins only" ON sponsorship_inventory 
FOR ALL USING (auth.jwt() -> 'user_metadata' ->> 'role' = 'admin');
