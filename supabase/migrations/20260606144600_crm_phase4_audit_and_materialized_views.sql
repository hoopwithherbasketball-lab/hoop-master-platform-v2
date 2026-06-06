-- Phase 4.2 & 4.3: CRM Hardening & Scaling

-- 1. Create Audit Logs table
CREATE TABLE IF NOT EXISTS crm_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
  old_data jsonb,
  new_data jsonb,
  changed_by uuid,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE crm_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs" ON crm_audit_logs 
  FOR SELECT TO authenticated 
  USING (public.has_role('admin'));

-- 2. Audit triggers capture function
CREATE OR REPLACE FUNCTION process_crm_audit()
RETURNS trigger AS $$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO crm_audit_logs (table_name, record_id, action, old_data, new_data, changed_by)
    VALUES (TG_TABLE_NAME, OLD.id, TG_OP, row_to_json(OLD)::jsonb, NULL, auth.uid());
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO crm_audit_logs (table_name, record_id, action, old_data, new_data, changed_by)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb, auth.uid());
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO crm_audit_logs (table_name, record_id, action, old_data, new_data, changed_by)
    VALUES (TG_TABLE_NAME, NEW.id, TG_OP, NULL, row_to_json(NEW)::jsonb, auth.uid());
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach triggers to CRM tables
DROP TRIGGER IF EXISTS audit_nil_partnerships ON nil_partnerships;
CREATE TRIGGER audit_nil_partnerships
  AFTER INSERT OR UPDATE OR DELETE ON nil_partnerships
  FOR EACH ROW EXECUTE FUNCTION process_crm_audit();

DROP TRIGGER IF EXISTS audit_nil_companies ON nil_companies;
CREATE TRIGGER audit_nil_companies
  AFTER INSERT OR UPDATE OR DELETE ON nil_companies
  FOR EACH ROW EXECUTE FUNCTION process_crm_audit();

DROP TRIGGER IF EXISTS audit_nil_opportunities ON nil_opportunities;
CREATE TRIGGER audit_nil_opportunities
  AFTER INSERT OR UPDATE OR DELETE ON nil_opportunities
  FOR EACH ROW EXECUTE FUNCTION process_crm_audit();

DROP TRIGGER IF EXISTS audit_nil_compliance_records ON nil_compliance_records;
CREATE TRIGGER audit_nil_compliance_records
  AFTER INSERT OR UPDATE OR DELETE ON nil_compliance_records
  FOR EACH ROW EXECUTE FUNCTION process_crm_audit();

-- 3. Materialized View for Scaled Reporting
CREATE MATERIALIZED VIEW IF NOT EXISTS crm_athlete_earnings_summary AS
SELECT
  p.sport,
  p.state,
  COALESCE(SUM(part.value_cents), 0) as total_earnings_cents,
  COUNT(part.id) as total_deals_count,
  COUNT(CASE WHEN part.status = 'pending' THEN 1 END) as pending_deals_count,
  COUNT(CASE WHEN part.status = 'active' THEN 1 END) as active_deals_count
FROM player_profiles p
LEFT JOIN nil_partnerships part ON part.athlete_id = p.user_id
GROUP BY p.sport, p.state;

CREATE UNIQUE INDEX IF NOT EXISTS crm_earnings_summary_idx ON crm_athlete_earnings_summary(sport, state);

-- Materialized View Refresh utility
CREATE OR REPLACE FUNCTION refresh_crm_earnings_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY crm_athlete_earnings_summary;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
