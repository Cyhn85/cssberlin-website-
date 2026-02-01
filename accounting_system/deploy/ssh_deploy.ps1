# Hetzner SSH Deployment Script
# Otomatik bağlanma ve deployment

param(
    [string]$ServerIP = "195.201.146.224",
    [string]$ServerUser = "root",
    [string]$ServerPassword = $env:CSSBERLIN_HETZNER_ROOT_PASSWORD,
    [string]$AccountingDbPassword = $env:CSSBERLIN_ACCOUNTING_DB_PASSWORD
)

if (-not $ServerPassword) {
    throw "Missing ServerPassword. Provide -ServerPassword or set env var CSSBERLIN_HETZNER_ROOT_PASSWORD."
}

if (-not $AccountingDbPassword) {
    throw "Missing AccountingDbPassword. Provide -AccountingDbPassword or set env var CSSBERLIN_ACCOUNTING_DB_PASSWORD."
}

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "HETZNER SSH DEPLOYMENT" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# SSH bağlantısı için plink kullan (PuTTY paketinden)
# Eğer yoksa: choco install putty

$ErrorActionPreference = "Stop"

# SSH komutlarını hazırla
$deployScript = @"
#!/bin/bash
set -e

: "${CSSBERLIN_ACCOUNTING_DB_PASSWORD:?Missing CSSBERLIN_ACCOUNTING_DB_PASSWORD}" 

echo '=========================================='
echo 'DEPLOYMENT BASLIYOR'
echo '=========================================='

# 1. Sistem güncellemesi
echo '[1/9] Sistem guncelleniyor...'
apt update && apt upgrade -y

# 2. Gereksinimler
echo '[2/9] Gereksinimler kuruluyor...'
apt install -y python3.11 python3.11-venv python3-pip postgresql postgresql-contrib nginx git curl

# 3. PostgreSQL
echo '[3/9] PostgreSQL yapilandiriliyor...'
sudo -u postgres psql -c "CREATE DATABASE accounting_db;" 2>/dev/null || echo "Database zaten var"
sudo -u postgres psql -c "DROP USER IF EXISTS accounting_user;" 2>/dev/null || true
sudo -u postgres psql -c "CREATE USER accounting_user WITH PASSWORD '$CSSBERLIN_ACCOUNTING_DB_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE accounting_db TO accounting_user;"

# 4. Uygulama dizini
echo '[4/9] Uygulama dizini olusturuluyor...'
mkdir -p /var/www/css-berlin-accounting
cd /var/www/css-berlin-accounting

# 5. Git clone
if [ ! -d ".git" ]; then
    echo 'Git repository clone ediliyor...'
    git clone https://github.com/Cyhn85/cssberlin-website-.git .
else
    echo 'Git repository guncelleniyor...'
    git pull
fi

cd accounting_system

# 6. Virtual environment
echo '[5/9] Virtual environment olusturuluyor...'
if [ ! -d "venv" ]; then
    python3.11 -m venv venv
fi
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 7. Environment variables
echo '[6/9] Environment variables ayarlaniyor...'
cat > .env << ENVEOF
DATABASE_URL=postgresql://accounting_user:$CSSBERLIN_ACCOUNTING_DB_PASSWORD@localhost:5432/accounting_db
SECRET_KEY=
ENVIRONMENT=production
CSSBERLIN_ACCOUNTING_DB_PASSWORD=$CSSBERLIN_ACCOUNTING_DB_PASSWORD
ENVEOF

# 8. Database migration
echo '[7/9] Database migration calistiriliyor...'
export DATABASE_URL="postgresql://accounting_user:$CSSBERLIN_ACCOUNTING_DB_PASSWORD@localhost:5432/accounting_db"
if [ ! -d "alembic/versions" ]; then
    alembic revision --autogenerate -m "Initial migration"
fi
alembic upgrade head

# 9. Systemd service
echo '[8/9] Systemd service olusturuluyor...'
cat > /etc/systemd/system/css-berlin-accounting.service << 'EOF'
[Unit]
Description=CSS Berlin Muhasebe Sistemi
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/css-berlin-accounting/accounting_system
Environment="PATH=/var/www/css-berlin-accounting/accounting_system/venv/bin"
EnvironmentFile=/var/www/css-berlin-accounting/accounting_system/.env
ExecStart=/var/www/css-berlin-accounting/accounting_system/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable css-berlin-accounting
systemctl restart css-berlin-accounting

# 10. Nginx
echo '[9/9] Nginx yapilandiriliyor...'
cat > /etc/nginx/sites-available/css-berlin-accounting << 'EOF'
server {
    listen 80;
    server_name _;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    location /static {
        alias /var/www/css-berlin-accounting/accounting_system/static;
    }
}
EOF

ln -sf /etc/nginx/sites-available/css-berlin-accounting /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

# Firewall
echo 'Firewall yapilandiriliyor...'
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo '=========================================='
echo 'DEPLOYMENT TAMAMLANDI!'
echo '=========================================='
echo ''
echo "Server IP: $ServerIP"
echo "API URL: http://$ServerIP"
echo "Swagger UI: http://$ServerIP/docs"
echo ''
echo "Service durumu: systemctl status css-berlin-accounting"
echo "Loglar: journalctl -u css-berlin-accounting -f"
"@

# Script'i dosyaya kaydet
$deployScript | Out-File -FilePath "deploy_remote.sh" -Encoding UTF8 -NoNewline

Write-Host "[1/3] Deployment script hazirlandi" -ForegroundColor Green
Write-Host ""

# Script'i server'a yükle
Write-Host "[2/3] Script server'a yukleniyor..." -ForegroundColor Yellow

# SSH ile script'i yükle ve çalıştır
$sshCommand = "echo '$ServerPassword' | sshpass -p '$ServerPassword' ssh -o StrictHostKeyChecking=no root@$ServerIP 'export CSSBERLIN_ACCOUNTING_DB_PASSWORD=\"$AccountingDbPassword\"; bash -s' < deploy_remote.sh"

# Alternatif: Manuel adımlar
Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "MANUEL DEPLOYMENT ADIMLARI" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Server'a baglanin:" -ForegroundColor Yellow
Write-Host "   ssh root@$ServerIP" -ForegroundColor Cyan
Write-Host "   Sifre: $ServerPassword" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Script'i yukleyin:" -ForegroundColor Yellow
Write-Host "   scp deploy_remote.sh root@$ServerIP:/root/" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Server'da calistirin:" -ForegroundColor Yellow
Write-Host "   ssh root@$ServerIP" -ForegroundColor Cyan
Write-Host "   chmod +x deploy_remote.sh" -ForegroundColor Cyan
Write-Host "   ./deploy_remote.sh" -ForegroundColor Cyan
Write-Host ""
Write-Host "VEYA" -ForegroundColor Yellow
Write-Host ""
Write-Host "Tek komutla (PowerShell'de):" -ForegroundColor Green
Write-Host ""
Write-Host '$session = New-PSSession -HostName '$ServerIP' -UserName root -Password (ConvertTo-SecureString "'$ServerPassword'" -AsPlainText -Force)' -ForegroundColor Cyan
Write-Host 'Invoke-Command -Session $session -ScriptBlock { bash -c "$(curl -fsSL https://raw.githubusercontent.com/Cyhn85/cssberlin-website-/main/accounting_system/deploy/hetzner_deploy.sh)" }' -ForegroundColor Cyan
Write-Host ""

Write-Host "[3/3] Hazir!" -ForegroundColor Green
Write-Host ""
Write-Host "Detayli rehber: HETZNER_MANUAL_DEPLOY.md" -ForegroundColor Yellow

