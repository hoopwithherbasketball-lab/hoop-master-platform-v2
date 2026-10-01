const fs = require('fs');
const sql = fs.readFileSync('ALL_MIGRATIONS.sql', 'utf8');

const functionRegex = /CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+[a-zA-Z0-9_.]+\s*\([\s\S]*?\)\s+RETURNS\s+[a-zA-Z0-9_]+\s+LANGUAGE\s+[a-zA-Z]+\s+(?:SECURITY\s+(?:DEFINER|INVOKER)\s+)?(?:STABLE\s+|IMMUTABLE\s+|VOLATILE\s+)?(?:AS\s+\$\$[\s\S]*?\$\$;|AS\s+'[\s\S]*?';|[\s\S]*?^;)/gim;

let match;
let functions = [];

while ((match = functionRegex.exec(sql)) !== null) {
  functions.push(match[0]);
}

// Alternatively, just split by CREATE FUNCTION and read up to the next $$;
const chunks = sql.split(/CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+/i);
chunks.shift(); // remove first part before any function

const extracted = chunks.map(chunk => {
  const endIdx = chunk.indexOf('$$;');
  if (endIdx > -1) {
    return 'CREATE OR REPLACE FUNCTION ' + chunk.substring(0, endIdx + 3);
  }
  return null;
}).filter(Boolean);

console.log(`Found ${extracted.length} functions using $$ delimiters.`);
fs.writeFileSync('scripts/extracted_functions.sql', extracted.join('\n\n--================--\n\n'));
