@echo off
echo ========================================
echo CSS BERLIN MUHASEBE SISTEMI
echo API Server Baslatiyor...
echo ========================================
echo.

cd /d "%~dp0"
set DATABASE_URL=sqlite:///./test_accounting.db

echo Database: SQLite
echo Port: 8000
echo.
echo Server baslatiliyor...
echo Tarayicida ac: http://localhost:8000/docs
echo.
echo Durdurmak icin CTRL+C basin
echo.

python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

pause

