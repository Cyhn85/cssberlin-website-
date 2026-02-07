echo "Testing directory access..."
TARGET_DIR=""

if [ -d "/root/cssberlin-website-" ]; then
    TARGET_DIR="/root/cssberlin-website-"
fi

if [ -z "$TARGET_DIR" ] && [ -d "/var/www/cssberlin-website-" ]; then
    TARGET_DIR="/var/www/cssberlin-website-"
fi

if [ -z "$TARGET_DIR" ]; then
    echo "❌ Cannot find project directory! Attempting to clone to /root/cssberlin-website-..."
    git clone https://github.com/Cyhn85/cssberlin-website-.git /root/cssberlin-website-
    TARGET_DIR="/root/cssberlin-website-"
fi

cd "$TARGET_DIR"
echo "📂 Working in: $TARGET_DIR"

echo "⬇️ Pulling latest code..."
git pull origin main

echo "📦 Setting up Python Virtual Environment..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Created venv"
fi

# Activate venv
source venv/bin/activate

echo "📦 Installing dependencies (in venv)..."
if [ -f "backend/requirements.txt" ]; then
    pip install -r backend/requirements.txt
fi

echo "🔄 Resetting Database (for schema update)..."
rm -f backend/cssberlin.db

echo "🌱 Seeding Showcase Products..."
# Use python from venv context
python -m backend.seed_vitrin

echo "🔄 Restarting Backend..."
# Update service file to point to venv python if needed
# We assume the service file is already correct or we update it now
if [ -f "backend/cssberlin-backend.service" ]; then
    # Update the ExecStart line to use the venv python
    sed -i 's|ExecStart=/usr/bin/python3|ExecStart=/root/cssberlin-website-/venv/bin/python|g' backend/cssberlin-backend.service
fi

# Try to restart systemd service if it exists
if systemctl list-units --full -all | grep -Fq "cssberlin-backend.service"; then
    # Reload daemon in case we changed the service file
    systemctl daemon-reload
    systemctl restart cssberlin-backend
    echo "✅ Service restarted."
else
    echo "⚙️ Service not found. Installing systemd service for 24/7 reliability..."
    if [ -f "backend/cssberlin-backend.service" ]; then
        cp backend/cssberlin-backend.service /etc/systemd/system/
        systemctl daemon-reload
        systemctl enable cssberlin-backend
        systemctl start cssberlin-backend
        echo "✅ Service installed and started!"
    else
        # Fallback: Kill uvicorn and restart
        echo "⚠️ Systemd service file missing. Using fallback restart method."
        pkill -f "uvicorn backend.main:app" || true
        sleep 2
        nohup python backend/main.py > app.log 2>&1 &
        echo "✅ Process restarted manually."
    fi
fi

echo "🎉 DEPLOYMENT COMPLETE!"
