@echo off
echo ========================================
echo CSS Berlin - Production Deploy Helper
echo ========================================
echo.
echo Bu script tum degisiklikleri Git'e push eder.
echo.
pause

cd /d "%~dp0"

echo.
echo [1/4] Git status kontrol ediliyor...
git status

echo.
echo [2/4] Tum dosyalar staging'e ekleniyor...
git add .

echo.
echo [3/4] Commit olusturuluyor...
git commit -m "Production ready: Header centered, category dropdown, API fixes, backend categories endpoint"

echo.
echo [4/4] GitHub'a push ediliyor...
git push origin main

echo.
echo ========================================
echo TAMAMLANDI!
echo ========================================
echo.
echo Simdiki adimlar:
echo.
echo 1. Railway: https://railway.app
echo    - GitHub'dan cssberlin-website- repo'sunu bagla
echo    - Root directory: backend/
echo    - Environment variables ekle (DEPLOYMENT_READY.md'ye bak)
echo    - Deploy tikla!
echo.
echo 2. Cloudflare Pages: https://dash.cloudflare.com
echo    - GitHub'dan cssberlin-website- repo'sunu bagla
echo    - Framework: None (Static HTML)
echo    - Deploy tikla!
echo.
echo 3. Test: https://cssberlin.de
echo.
pause
