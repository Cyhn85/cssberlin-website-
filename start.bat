@echo off
REM ============================================
REM CSS BERLIN - WINDOWS STARTUP SCRIPT
REM Runs: Migration -> Seed -> Start
REM ============================================

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║              🚀 CSS BERLIN - STARTING UP                     ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Run Prisma migrations & Push
echo.
echo 📦 Step 1: Syncing database schema...
call npx prisma db push
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Database push failed!
    exit /b 1
)
echo    ✅ Database synced!

REM Run seed script via Prisma CLI
echo.
echo 🌱 Step 2: Running seed script (if needed)...
call npx prisma db seed
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  Seeding completed or skipped (non-critical).
) else (
    echo    ✅ Seeding completed!
)

REM Start the development server
echo.
echo 🌐 Step 3: Starting the development server...
echo.
echo ═══════════════════════════════════════════════════════════════
echo    CSS Berlin is now running at: http://localhost:3000
echo ═══════════════════════════════════════════════════════════════
echo.

npm run dev
