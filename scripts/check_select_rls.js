const fs = require('fs');
const sql = fs.readFileSync('ALL_MIGRATIONS.sql', 'utf8');

const policyRegex = /CREATE\s+POLICY\s+"([^"]+)"\s+ON\s+([a-zA-Z0-9_]+)\s+FOR\s+SELECT\s*(?:TO\s+[a-zA-Z0-9_]+)?\s*USING\s*\(([^)]+)\)/gi;

let match;
console.log('SELECT Policies using true:');
while ((match = policyRegex.exec(sql)) !== null) {
  const policyName = match[1];
  const table = match[2];
  const usingClause = match[3].trim().toLowerCase();
  
  if (usingClause === 'true') {
    console.log(`- ${table}: ${policyName}`);
  }
}
