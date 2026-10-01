const fs = require('fs');

const sql = fs.readFileSync('ALL_MIGRATIONS.sql', 'utf8');

const tables = [];
const tableRegex = /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)/gi;
let match;
while ((match = tableRegex.exec(sql)) !== null) {
  tables.push(match[1]);
}

const rlsEnabled = new Set();
const rlsRegex = /ALTER\s+TABLE\s+([a-zA-Z0-9_]+)\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY/gi;
while ((match = rlsRegex.exec(sql)) !== null) {
  rlsEnabled.add(match[1]);
}

const uniqueTables = [...new Set(tables)];
const missingRls = uniqueTables.filter(t => !rlsEnabled.has(t));

console.log('Total Tables:', uniqueTables.length);
console.log('Tables with RLS:', rlsEnabled.size);
console.log('Tables missing RLS:');
missingRls.forEach(t => console.log(' - ' + t));
