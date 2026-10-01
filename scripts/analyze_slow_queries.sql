-- Identify the top 5 most expensive queries by mean execution time
SELECT 
    calls,
    round(total_exec_time::numeric, 2) as total_time_ms,
    round(mean_exec_time::numeric, 2) as mean_time_ms,
    round((100 * total_exec_time / sum(total_exec_time) OVER ())::numeric, 2) as percentage_overall,
    query
FROM 
    pg_stat_statements
ORDER BY 
    mean_exec_time DESC
LIMIT 5;

-- Note: In Supabase, you must enable the pg_stat_statements extension first:
-- CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
