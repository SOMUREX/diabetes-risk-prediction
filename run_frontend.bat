@echo off
title DiabeteRisk AI Frontend Server
echo =====================================================================
echo    Starting DiabeteRisk AI React Frontend Server (Port 3000)
echo =====================================================================
cd /d "%~dp0frontend"
npm run dev
pause
