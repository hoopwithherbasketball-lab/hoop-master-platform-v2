@echo off
cd /d "%~dp0apps\web"
echo Starting Hoop With Her dev server...
echo Press Ctrl+C to stop.
echo.
node ..\..\node_modules\vite\bin\vite.js --host
if errorlevel 1 (
  echo.
  echo Server crashed. Retrying in 3 seconds...
  timeout /t 3 /nobreak >nul
  node ..\..\node_modules\vite\bin\vite.js --host
)
