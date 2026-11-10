@echo off
title DiabeteRisk AI Launcher
echo =====================================================================
echo           Launching DiabeteRisk AI Full-Stack Platform
echo =====================================================================
echo.

:: 1. Launch FastAPI Backend + Integrated UI (Port 8000)
echo [1/3] Starting Backend Server (Port 8000)...
start "DiabeteRisk Backend (Port 8000)" /D "%~dp0backend" cmd /k "python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"

:: 2. Wait 3 seconds
echo [2/3] Waiting for Backend to initialize...
timeout /t 3 /nobreak >nul

:: 3. Launch React Frontend Dev Server (Port 3000)
echo [3/3] Starting Frontend Dev Server (Port 3000)...
start "DiabeteRisk Frontend (Port 3000)" /D "%~dp0frontend" cmd /k "npm run dev"

:: 4. Wait 2 seconds and open browser
timeout /t 2 /nobreak >nul
echo Opening application in your default browser...
start http://localhost:3000

echo.
echo =====================================================================
echo  DiabeteRisk AI is now running!
echo  * React Dev UI:          http://localhost:3000
echo  * Integrated Single-App: http://localhost:8000
echo  * API Documentation:     http://localhost:8000/docs
echo =====================================================================
echo.
echo NOTE: Keep the two opened command prompt windows open while using the app.
pause
