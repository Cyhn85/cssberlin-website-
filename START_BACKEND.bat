@echo off
echo ======================================
echo CSS Berlin - Backend Server
echo ======================================
echo.
echo Starting FastAPI backend on http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
