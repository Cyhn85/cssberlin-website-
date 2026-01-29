# Hetzner Otomatik Deployment Script
# CSS Berlin Muhasebe Sistemi

param(
    [string]$ServerIP = "195.201.146.224",
    [string]$ServerUser = "root",
    [string]$ServerPassword = "FmJ9caKAHFmM",
    [string]$AppName = "css-berlin-accounting"
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "HETZNER OTOMATIK DEPLOYMENT" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# SSH bağlantısı için plink kullan (PuTTY paketinden)
# Eğer yoksa, önce yüklenmeli: choco install putty

$ErrorActionPreference = "Stop"

# 1. SSH ile bağlan ve deployment script'ini çalıştır
Write-Host "[1/5] Server'a baglaniyor..." -ForegroundColor Yellow

# SSH komutlarını hazırla
$deployCommands = @"
#!/bin/bash
set -e

echo '=========================================='
echo 'DEPLOYMENT BASLIYOR'
echo '=========================================='

# Sistem güncellemesi
echo '[1/8] Sistem guncelleniyor...'
apt update && apt upgrade -y

# Gereksinimler
echo '[2/8] Gereksinimler kuruluyor...'
apt install -y python3.11 python3.11-venv python3-pip postgresql postgresql-contrib nginx git

# PostgreSQL
echo '[3/8] PostgreSQL yapilandiriliyor...'
sudo -u postgres psql -c "CREATE DATABASE accounting_db;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE USER accounting_user WITH PASSWORD 'CHANGE_THIS_PASSWORD';" 2>/dev/null || true
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE accounting_db TO accounting_user;"

# Uygulama dizini
echo '[4/8] Uygulama dizini olusturuluyor...'
mkdir -p /var/www/$AppName
cd /var/www/$AppName

# Git clone (eğer yoksa)
if [ ! -d "accounting_system" ]; then
    git clone https://github.com/Cyhn85/cssberlin-website-.git .
fi

cd accounting_system

# Virtual environment
echo '[5/8] Virtual environment olusturuluyor...'
python3.11 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Environment variables
echo '[6/8] Environment variables ayarlaniyor...'
cat > .env << EOF
DATABASE_URL=postgresql://accounting_user:CHANGE_THIS_PASSWORD@localhost:5432/accounting_db
SECRET_KEY=\$(openssl rand -hex 32)
ENVIRONMENT=production
EOF

# Database migration
echo '[7/8] Database migration calistiriliyor...'
export DATABASE_URL="postgresql://accounting_user:CHANGE_THIS_PASSWORD@localhost:5432/accounting_db"
alembic upgrade head

# Systemd service
echo '[8/8] Systemd service olusturuluyor...'
cat > /etc/systemd/system/$AppName.service << EOF
[Unit]
Description=CSS Berlin Muhasebe Sistemi
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/$AppName/accounting_system
Environment="PATH=/var/www/$AppName/accounting_system/venv/bin"
EnvironmentFile=/var/www/$AppName/accounting_system/.env
ExecStart=/var/www/$AppName/accounting_system/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable $AppName
systemctl restart $AppName

# Nginx
echo '[9/9] Nginx yapilandiriliyor...'
cat > /etc/nginx/sites-available/$AppName << EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

ln -sf /etc/nginx/sites-available/$AppName /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

echo '=========================================='
echo 'DEPLOYMENT TAMAMLANDI!'
echo '=========================================='
echo ''
echo "Server IP: $ServerIP"
echo "API URL: http://$ServerIP"
echo ''
echo "Service durumu: systemctl status $AppName"
"@

# SSH ile komutları çalıştır
Write-Host "[2/5] Deployment script'i server'a gonderiliyor..." -ForegroundColor Yellow

# SSH bağlantısı için expect script kullan veya manuel olarak
Write-Host ""
Write-Host "SSH baglantisi icin asagidaki komutlari calistirin:" -ForegroundColor Green
Write-Host ""
Write-Host "ssh root@$ServerIP" -ForegroundColor Cyan
Write-Host ""
Write-Host "Baglandiktan sonra asagidaki komutlari calistirin:" -ForegroundColor Green
Write-Host ""

# Komutları dosyaya kaydet
$deployCommands | Out-File -FilePath "deploy_remote.sh" -Encoding UTF8

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "DEPLOYMENT SCRIPT HAZIR!" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 'deploy_remote.sh' dosyasi olusturuldu" -ForegroundColor Green
Write-Host "2. Bu dosyayi server'a yukleyin:" -ForegroundColor Yellow
Write-Host "   scp deploy_remote.sh root@$ServerIP:/root/" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Server'a baglanin:" -ForegroundColor Yellow
Write-Host "   ssh root@$ServerIP" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Script'i calistirin:" -ForegroundColor Yellow
Write-Host "   chmod +x deploy_remote.sh" -ForegroundColor Cyan
Write-Host "   ./deploy_remote.sh" -ForegroundColor Cyan
Write-Host ""
Write-Host "VEYA" -ForegroundColor Yellow
Write-Host ""
Write-Host "Manuel adimlar icin 'HETZNER_MANUAL_DEPLOY.md' dosyasina bakin" -ForegroundColor Green

