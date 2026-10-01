const fs = require('fs');
const sql = fs.readFileSync('ALL_MIGRATIONS.sql', 'utf8');

// Match everything from CREATE POLICY to the semicolon
const policyRegex = /CREATE\s+POLICY\s+"([^"]+)"\s+ON\s+([a-zA-Z0-9_]+)[\s\S]*?;/g;
let match;
let vulnerablePolicies = [];

while ((match = policyRegex.exec(sql)) !== null) {
  const policyStatement = match[0];
  const policyName = match[1];
  const tableName = match[2];
  
  const upperStatement = policyStatement.toUpperCase();
  
  const isWrite = upperStatement.includes('FOR INSERT') || upperStatement.includes('FOR UPDATE') || upperStatement.includes('FOR DELETE') || upperStatement.includes('FOR ALL');
  
  if (isWrite) {
    const hasAuth = upperStatement.includes('AUTH.UID()') || upperStatement.includes('AUTH.JWT()') || upperStatement.includes('CURRENT_USER');
    const isServiceRole = upperStatement.includes('TO SERVICE_ROLE') || policyName.toLowerCase().includes('service role');
    
    // We expect writes to check auth.uid or be service_role
    if (!hasAuth && !isServiceRole) {
      vulnerablePolicies.push({ policyName, tableName, policyStatement });
    }
  }
}

console.log('Potentially Vulnerable Write Policies:');
vulnerablePolicies.forEach(p => {
  console.log('---');
  console.log(`Table: ${p.tableName} | Policy: ${p.policyName}`);
  console.log(p.policyStatement.trim());
});
