#!/bin/bash
# ============================================
# CSS BERLIN - STARTUP SCRIPT
# Runs: Migration -> Seed -> Start
# ============================================

set -e

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              🚀 CSS BERLIN - STARTING UP                     ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Wait for database to be ready (extra safety)
echo "⏳ Waiting for database connection..."
sleep 2

# Synch database
echo ""
echo "📦 Step 1: Syncing database schema..."
npx prisma db push
echo "   ✅ Database synced!"

# Run seed script
echo ""
echo "🌱 Step 2: Seeding database..."
npx prisma db seed || echo "⚠️ Seeding skipped or failed (check logs)"
echo "   ✅ Seed step done."

# Start the application
echo ""
echo "🌐 Step 3: Starting the application..."
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "   CSS Berlin is now running at: http://localhost:3000"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Start Node.js server
exec npm run dev
