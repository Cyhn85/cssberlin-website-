@echo off
echo ========================================
echo CSS Berlin - Email Test
echo ========================================
echo.
echo 1. Backend restart ediliyor...
echo CTRL+C ile onceki backend'i durdur
echo Sonra bu script'i tekrar calistir
echo.
pause

cd /d "%~dp0backend"

echo.
echo 2. Backend baslatiliyor...
echo.
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
