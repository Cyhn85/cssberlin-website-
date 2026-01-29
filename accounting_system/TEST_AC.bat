@echo off
echo ========================================
echo CSS BERLIN MUHASEBE SISTEMI
echo TEST EKRANI ACILIYOR
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] API Server baslatiliyor...
start "API Server" cmd /k "set DATABASE_URL=sqlite:///./test_accounting.db && python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

timeout /t 5 /nobreak >nul

echo [2/3] Swagger UI aciliyor...
start http://localhost:8000/docs

echo [3/3] Frontend aciliyor...
cd frontend
start index.html

echo.
echo ========================================
echo TEST EKRANI HAZIR!
echo ========================================
echo.
echo API Server: http://localhost:8000
echo Swagger UI: http://localhost:8000/docs
echo Frontend: index.html acildi
echo.
echo API Server penceresini kapatmayin!
echo.
pause

