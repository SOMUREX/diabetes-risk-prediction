@echo off
echo ========================================================
echo  Starting DiabetesAI FastAPI Prediction Server (Port 8000)
echo ========================================================
cd backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
pause

