$migrationsDir = "C:\Users\Lamont\AppData\Local\Temp\opencode\hoop-master-platform-v2\packages\supabase\migrations\procoach\migrations"
$outputFile = "C:\Users\Lamont\AppData\Local\Temp\opencode\hoop-master-platform-v2\ALL_MIGRATIONS.sql"

$files = Get-ChildItem "$migrationsDir\*.sql" | Sort-Object Name
$output = ""

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $output += "-- ============================================================" + [Environment]::NewLine
    $output += "-- MIGRATION: $($file.Name)" + [Environment]::NewLine
    $output += "-- ============================================================" + [Environment]::NewLine
    $output += $content + [Environment]::NewLine
    $output += [Environment]::NewLine
}

Set-Content -Path $outputFile -Value $output -Encoding UTF8
Write-Host "Created $outputFile with $($files.Count) migrations"
