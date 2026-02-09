#!/bin/bash
# Auto-generated deployment script for CSS Berlin (Docker)
set -e

REPO_URL="https://github.com/Cyhn85/cssberlin-website-.git"
# Use a distinct directory to avoid conflict with existing 'cssberlin' dir
TARGET_DIR="/root/cssberlin-website-"

echo "🚀 Starting Docker Deployment..."

# Ensure we have the correct repo
if [ -d "$TARGET_DIR" ]; then
    cd "$TARGET_DIR"
    REMOTE=$(git remote get-url origin 2>/dev/null || echo "")
    # Check if remote matches our expectation
    if [[ "$REMOTE" != *"cssberlin-website-"* ]]; then
        echo "⚠️  Existing directory points to wrong repo ($REMOTE)."
        echo "♻️  Backing up and re-cloning..."
        cd ..
        mv "$TARGET_DIR" "${TARGET_DIR}_backup_$(date +%s)"
        git clone "$REPO_URL" "$TARGET_DIR"
    else
        echo "✅ Directory exists and points to correct repo."
    fi
else
    echo "📂 Cloning project to $TARGET_DIR..."
    git clone "$REPO_URL" "$TARGET_DIR"
fi

cd "$TARGET_DIR"
echo "📂 Working in $(pwd)"

echo "⬇️  Fetching latest changes..."
git fetch origin
git reset --hard origin/main

echo "📂 Verifying files..."
# Move uploaded .env if exists
if [ -f "/tmp/.env" ]; then
    echo "📄 Found new .env in /tmp, moving to project root..."
    mv /tmp/.env .env
fi

ls -la docker-compose.yml || echo "❌ docker-compose.yml missing!"
ls -la .env || echo "⚠️ .env missing!"

echo "🐳 Restarting Container..."
# Check for docker-compose
if command -v docker-compose &> /dev/null; then
    docker-compose down --remove-orphans || true
    docker-compose up -d --build backend
else
    if command -v docker &> /dev/null; then
         docker compose down --remove-orphans || true
         docker compose up -d --build backend
    else
        echo "❌ Docker Compose not found!"
        exit 1
    fi
fi

echo "✅  Deployment Script Finished."
docker ps | grep backend
