#!/bin/bash
# ============================================================================
# CSS BERLIN - PROD DEPLOYMENT SCRIPT (2026)
# ============================================================================
# This script updates the backend on the Hetzner server.
# Run this on your Hetzner server:
# curl -fsSL https://raw.githubusercontent.com/Cyhn85/cssberlin-website-/main/deploy_hetzner.sh | bash

set -e

APP_DIR="/var/www/cssberlin"
BACKEND_DIR="$APP_DIR/backend"
REPO_URL="https://github.com/Cyhn85/cssberlin-website-.git"

echo "🚀 Starting CSS Berlin Deployment..."

# 1. Ensure Directory & Repo
if [ ! -d "$APP_DIR" ]; then
    echo "📁 Creating app directory..."
    sudo mkdir -p $APP_DIR
    sudo chown -R $USER:$USER $APP_DIR
    git clone $REPO_URL $APP_DIR
else
    echo "🔄 Pulling latest changes from GitHub..."
    cd $APP_DIR
    git fetch origin
    git reset --hard origin/main
fi

# 2. Setup Backend
echo "⚙️ Setting up Python environment..."
cd $BACKEND_DIR

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 3. Create/Update Systemd Service
echo "🔧 Configuring system service..."
sudo tee /etc/systemd/system/cssberlin-backend.service > /dev/null << EOF
[Unit]
Description=CSS Berlin FastAPI Backend
After=network.target

[Service]
User=$USER
Group=www-data
WorkingDirectory=$BACKEND_DIR
Environment="PATH=$BACKEND_DIR/venv/bin"
ExecStart=$BACKEND_DIR/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# 4. Restart Service
echo "🔄 Restarting backend service..."
sudo systemctl daemon-reload
sudo systemctl enable cssberlin-backend
sudo systemctl restart cssberlin-backend

# 5. Initialize Database (Safe)
echo "🗄️ Initializing database tables..."
python - <<'PY'
import asyncio

from database import Base, engine
import models  # noqa: F401


async def main() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


asyncio.run(main())
PY

echo "✅ Deployment Successful!"
echo "📡 Backend is running on port 8000"
echo "🌐 Check status: sudo systemctl status cssberlin-backend"
