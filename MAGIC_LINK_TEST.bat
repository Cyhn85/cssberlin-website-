@echo off
echo ========================================
echo CSS Berlin - Magic Link Test
echo ========================================
echo.
echo Test Magic Link email gonderimi...
echo.

curl -X POST http://localhost:8000/api/auth/magic-link -H "Content-Type: application/json" -d "{\"email\":\"cyhnsrgc@gmail.com\"}"

echo.
echo.
echo ========================================
echo Gmail kutunu kontrol et!
echo From: noreply@cssberlin.de
echo Subject: "Dein Magic Link fur CSS Berlin"
echo ========================================
pause
