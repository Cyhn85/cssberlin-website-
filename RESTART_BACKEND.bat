@echo off
echo ========================================
echo CSS Berlin - Backend Restart
echo ========================================
echo.
echo ADIM 1: Onceki backend process'i kapat
echo        (CTRL+C ile durdur)
echo.
echo ADIM 2: Bu script'i tekrar calistir
echo.
pause

cd /d "%~dp0backend"

echo.
echo Backend baslatiliyor...
echo.
echo Email sistemi:
echo - noreply@cssberlin.de (Magic Link, Password Reset)
echo - info@cssberlin.de (Welcome, Orders)
echo.
echo IONOS SMTP: smtp.ionos.de:587
echo.
echo ========================================
echo Backend hazir! Magic Link testi icin:
echo - Frontend: index.html ac
echo - Anmelden tikla
echo - Magic Link sekmesi
echo - Email gir ve MAGIC LINK SENDEN tikla
echo ========================================
echo.

python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
