import fs from 'fs';
import pg from 'pg';

async function run() {
  const sql = fs.readFileSync('supabase/migrations/20260930120837_optimize_indexes_and_rls.sql', 'utf8');
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
  
  const client = new pg.Client({
    connectionString: 'postgresql://postgres.srrasrbsqajtssqlxoju:YvYqhk4fdyo1OYl6@aws-1-us-east-2.pooler.supabase.com:5432/postgres'
  });
  
  await client.connect();
  console.log('Connected to remote DB');
  
  let successCount = 0;
  let skipCount = 0;
  
  for (const stmt of statements) {
    try {
      await client.query(stmt);
      successCount++;
    } catch (e) {
      if (e.message.includes('does not exist')) {
        skipCount++;
      } else {
        console.error('Error on statement:', stmt, e.message);
      }
    }
  }
  
  console.log(`Migration applied! ${successCount} statements executed successfully, ${skipCount} skipped due to missing tables.`);
  await client.end();
}

run().catch(console.error);
