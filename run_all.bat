@echo off
echo ========================================================
echo  Launching DiabeteRisk AI Full-Stack Platform
echo ========================================================
start "DiabetesAI Backend (FastAPI)" cmd /k "cd backend && python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload"
timeout /t 3 /nobreak >nul
start "DiabetesAI Frontend (React)" cmd /k "cd frontend && npm run dev"
echo Backend and Frontend instances started!
echo Frontend will be accessible at: http://localhost:3000
echo Backend API Docs accessible at: http://127.0.0.1:8000/docs
pause

