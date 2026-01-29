#!/bin/bash
# Hetzner Server Deployment Script
# CSS Berlin Muhasebe Sistemi

set -e

echo "=========================================="
echo "HETZNER DEPLOYMENT BAŞLIYOR"
echo "=========================================="

# Renkler
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Değişkenler
APP_NAME="css-berlin-accounting"
APP_DIR="/var/www/$APP_NAME"
SERVICE_NAME="css-berlin-accounting"
DB_NAME="accounting_db"
DB_USER="accounting_user"

# 1. Sistem güncellemesi
echo -e "${YELLOW}[1/8] Sistem güncelleniyor...${NC}"
sudo apt update && sudo apt upgrade -y

# 2. Gereksinimlerin kurulumu
echo -e "${YELLOW}[2/8] Gereksinimler kuruluyor...${NC}"
sudo apt install -y python3.11 python3.11-venv python3-pip postgresql postgresql-contrib nginx git

# 3. PostgreSQL kurulumu
echo -e "${YELLOW}[3/8] PostgreSQL yapılandırılıyor...${NC}"
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD 'CHANGE_THIS_PASSWORD';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"

# 4. Uygulama dizini oluştur
echo -e "${YELLOW}[4/8] Uygulama dizini oluşturuluyor...${NC}"
sudo mkdir -p $APP_DIR
sudo chown -R $USER:$USER $APP_DIR

# 5. Git repository clone
echo -e "${YELLOW}[5/8] Git repository clone ediliyor...${NC}"
cd $APP_DIR
git clone https://github.com/Cyhn85/cssberlin-website-.git .
cd accounting_system

# 6. Virtual environment
echo -e "${YELLOW}[6/8] Virtual environment oluşturuluyor...${NC}"
python3.11 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 7. Environment variables
echo -e "${YELLOW}[7/8] Environment variables ayarlanıyor...${NC}"
cat > .env << EOF
DATABASE_URL=postgresql://$DB_USER:CHANGE_THIS_PASSWORD@localhost:5432/$DB_NAME
SECRET_KEY=$(openssl rand -hex 32)
ENVIRONMENT=production
EOF

# 8. Database migration
echo -e "${YELLOW}[8/8] Database migration çalıştırılıyor...${NC}"
export DATABASE_URL="postgresql://$DB_USER:CHANGE_THIS_PASSWORD@localhost:5432/$DB_NAME"
alembic upgrade head

# 9. Systemd service oluştur
echo -e "${YELLOW}[9/10] Systemd service oluşturuluyor...${NC}"
sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null << EOF
[Unit]
Description=CSS Berlin Muhasebe Sistemi
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$APP_DIR/accounting_system
Environment="PATH=$APP_DIR/accounting_system/venv/bin"
EnvironmentFile=$APP_DIR/accounting_system/.env
ExecStart=$APP_DIR/accounting_system/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable $SERVICE_NAME
sudo systemctl start $SERVICE_NAME

# 10. Nginx yapılandırması
echo -e "${YELLOW}[10/10] Nginx yapılandırılıyor...${NC}"
sudo tee /etc/nginx/sites-available/$APP_NAME > /dev/null << EOF
server {
    listen 80;
    server_name YOUR_DOMAIN.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL sertifikası (Let's Encrypt)
echo -e "${YELLOW}SSL sertifikası kuruluyor...${NC}"
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d YOUR_DOMAIN.com

echo -e "${GREEN}=========================================="
echo "DEPLOYMENT TAMAMLANDI!"
echo "==========================================${NC}"
echo ""
echo "Service durumu: sudo systemctl status $SERVICE_NAME"
echo "Loglar: sudo journalctl -u $SERVICE_NAME -f"
echo "Nginx durumu: sudo systemctl status nginx"

