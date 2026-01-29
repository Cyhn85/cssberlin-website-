@echo off
echo ========================================
echo FRONTEND ACILIYOR
echo ========================================
echo.

cd /d "%~dp0\frontend"

echo Frontend klasorunde HTTP server baslatiliyor...
echo Tarayicida ac: http://localhost:8080
echo.
echo Durdurmak icin CTRL+C basin
echo.

python -m http.server 8080

pause

