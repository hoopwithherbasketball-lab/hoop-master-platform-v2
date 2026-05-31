@echo off
cd /d "%~dp0apps\web"
echo Starting Hoop With Her dev server...
echo.
node ..\..\node_modules\vite\bin\vite.js --host
pause
