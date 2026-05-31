@echo off
title Hoop With Her - Dev Server
cd /d "%~dp0apps\web"
echo ========================================
echo   Hoop With Her Dev Server
echo   http://localhost:5173
echo ========================================
echo.
node ..\..\node_modules\vite\bin\vite.js --host
pause
