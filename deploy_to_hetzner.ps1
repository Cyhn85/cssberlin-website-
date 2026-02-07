# Deploy to Hetzner Server (Manual Script)
# Run this script to deploy latest changes!

$HostName = "195.201.146.224"
$User = "root"
$Password = "iuFnHFNBvkae"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 STARTING DEPLOYMENT TO HETZNER" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Connect and Execute Update Logic
Write-Host "Connecting to $User@$HostName..."

# Note: We use ssh directly. You might need to type the password if keys are not set up.
# We attempt to find the directory and pull.

$RemoteScript = @'
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

echo "📦 Installing dependencies..."
if [ -f "backend/requirements.txt" ]; then
    pip install -r backend/requirements.txt
fi

echo "🔄 Resetting Database (for schema update)..."
rm -f backend/cssberlin.db

echo "🌱 Seeding Showcase Products..."
python3 -m backend.seed_vitrin

echo "🔄 Restarting Backend..."
# Try to restart systemd service if it exists
if systemctl list-units --full -all | grep -Fq "cssberlin-backend.service"; then
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
        nohup python3 backend/main.py > app.log 2>&1 &
        echo "✅ Process restarted manually."
    fi
fi

echo "🎉 DEPLOYMENT COMPLETE!"
'@
 
# Create temporary local script with LF line endings
$RemoteScriptLF = $RemoteScript -replace "`r`n", "`n"
[System.IO.File]::WriteAllText("deploy_temp.sh", $RemoteScriptLF)
 
echo "📤 Uploading deployment script..."
scp deploy_temp.sh $User@${HostName}:/tmp/deploy_temp.sh
 
echo "🚀 Executing on remote server..."
ssh $User@$HostName "bash /tmp/deploy_temp.sh; rm /tmp/deploy_temp.sh"

# Cleanup local temp file
Remove-Item deploy_temp.sh

echo "🎉 DEPLOYMENT COMPLETE!"
Write-Host "Script execution finished." -ForegroundColor Green
pause
