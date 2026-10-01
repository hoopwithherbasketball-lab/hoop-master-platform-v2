const fs = require('fs');

const sql = fs.readFileSync('ALL_MIGRATIONS.sql', 'utf8');

const policyRegex = /CREATE\s+POLICY\s+"([^"]+)"\s+ON\s+([a-zA-Z0-9_]+)\s+FOR\s+(ALL|SELECT|INSERT|UPDATE|DELETE)\s*(?:TO\s+[a-zA-Z0-9_]+)?\s*(?:USING\s*\(([^)]+)\))?\s*(?:WITH\s+CHECK\s*\(([^)]+)\))?/gi;

let match;
const permissivePolicies = [];

while ((match = policyRegex.exec(sql)) !== null) {
  const policyName = match[1];
  const table = match[2];
  const operation = match[3].toUpperCase();
  const usingClause = (match[4] || '').trim().toLowerCase();
  const withCheckClause = (match[5] || '').trim().toLowerCase();
  
  if (operation !== 'SELECT' && (usingClause === 'true' || withCheckClause === 'true')) {
    permissivePolicies.push({ policyName, table, operation, usingClause, withCheckClause });
  }
}

console.log('Permissive Policies (true on INSERT/UPDATE/DELETE/ALL):');
if (permissivePolicies.length === 0) {
  console.log('None found.');
} else {
  permissivePolicies.forEach(p => console.log(JSON.stringify(p, null, 2)));
}
