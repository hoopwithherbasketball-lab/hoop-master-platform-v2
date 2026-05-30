$migrationsDir = "C:\Users\Lamont\AppData\Local\Temp\opencode\hoop-master-platform-v2\packages\supabase\migrations\procoach\migrations"
$outputFile = "C:\Users\Lamont\AppData\Local\Temp\opencode\hoop-master-platform-v2\REMAINING_MIGRATIONS.sql"

$files = @(
    "20260527000000_create_nil_and_connectgbb_tables.sql",
    "20260528000000_create_intake_submissions.sql",
    "20260529000000_create_game_stats_and_film_entries.sql",
    "20260530000000_create_coach_referral_notes.sql",
    "20260531000000_audit_fixes.sql",
    "20260601000000_seed_demo_data.sql",
    "20260602000000_create_media_platform_tables.sql"
)

$output = ""
foreach ($file in $files) {
    $path = Join-Path $migrationsDir $file
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        $output += "-- ============================================================" + [Environment]::NewLine
        $output += "-- MIGRATION: $file" + [Environment]::NewLine
        $output += "-- ============================================================" + [Environment]::NewLine
        $output += $content + [Environment]::NewLine
        $output += [Environment]::NewLine
    } else {
        Write-Host "WARNING: $file not found"
    }
}

Set-Content -Path $outputFile -Value $output -Encoding UTF8
Write-Host "Created $outputFile"
