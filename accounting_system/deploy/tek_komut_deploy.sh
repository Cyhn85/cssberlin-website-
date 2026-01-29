#!/bin/bash
# Hetzner Tek Komut Deployment
# Bu script'i server'da direkt çalıştırabilirsiniz

set -e

echo "=========================================="
echo "CSS BERLIN MUHASEBE SISTEMI DEPLOYMENT"
echo "=========================================="
echo ""

# Server bilgileri
SERVER_IP="195.201.146.224"
APP_NAME="css-berlin-accounting"
APP_DIR="/var/www/$APP_NAME"
DB_NAME="accounting_db"
DB_USER="accounting_user"
DB_PASSWORD="CSSBerlin2026!"

# 1. Sistem güncellemesi
echo "[1/10] Sistem guncelleniyor..."
apt update && apt upgrade -y

# 2. Gereksinimler
echo "[2/10] Gereksinimler kuruluyor..."
apt install -y python3.11 python3.11-venv python3-pip postgresql postgresql-contrib nginx git curl ufw

# 3. PostgreSQL
echo "[3/10] PostgreSQL yapilandiriliyor..."
systemctl start postgresql
systemctl enable postgresql

sudo -u postgres psql << PSQL
CREATE DATABASE $DB_NAME;
\c $DB_NAME
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;
ALTER DATABASE $DB_NAME OWNER TO $DB_USER;
\q
PSQL

# 4. Uygulama dizini
echo "[4/10] Uygulama dizini olusturuluyor..."
mkdir -p $APP_DIR
cd $APP_DIR

# 5. Git clone
if [ ! -d ".git" ]; then
    echo "Git repository clone ediliyor..."
    git clone https://github.com/Cyhn85/cssberlin-website-.git .
else
    echo "Git repository guncelleniyor..."
    git pull
fi

cd accounting_system

# 6. Virtual environment
echo "[5/10] Virtual environment olusturuluyor..."
if [ ! -d "venv" ]; then
    python3.11 -m venv venv
fi
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 7. Environment variables
echo "[6/10] Environment variables ayarlaniyor..."
SECRET_KEY=$(openssl rand -hex 32)
cat > .env << EOF
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME
SECRET_KEY=$SECRET_KEY
ENVIRONMENT=production
EOF

# 8. Database migration
echo "[7/10] Database migration calistiriliyor..."
export DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME"

# Alembic klasörü yoksa oluştur
if [ ! -d "alembic" ]; then
    alembic init alembic
    # env.py'yi güncelle
    sed -i "s|sqlalchemy.url = .*|sqlalchemy.url = \$DATABASE_URL|" alembic.ini
fi

# İlk migration oluştur
if [ ! -f "alembic/versions/001_initial.py" ]; then
    alembic revision --autogenerate -m "Initial migration"
fi

alembic upgrade head

# 9. Systemd service
echo "[8/10] Systemd service olusturuluyor..."
cat > /etc/systemd/system/$APP_NAME.service << EOF
[Unit]
Description=CSS Berlin Muhasebe Sistemi
After=network.target postgresql.service

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR/accounting_system
Environment="PATH=$APP_DIR/accounting_system/venv/bin"
EnvironmentFile=$APP_DIR/accounting_system/.env
ExecStart=$APP_DIR/accounting_system/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable $APP_NAME
systemctl restart $APP_NAME

# 10. Nginx
echo "[9/10] Nginx yapilandiriliyor..."
cat > /etc/nginx/sites-available/$APP_NAME << EOF
server {
    listen 80;
    server_name _;

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    location /static {
        alias $APP_DIR/accounting_system/static;
    }
}
EOF

ln -sf /etc/nginx/sites-available/$APP_NAME /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default 2>/dev/null || true
nginx -t
systemctl reload nginx

# 11. Firewall
echo "[10/10] Firewall yapilandiriliyor..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo ""
echo "=========================================="
echo "DEPLOYMENT TAMAMLANDI!"
echo "=========================================="
echo ""
echo "Server IP: $SERVER_IP"
echo "API URL: http://$SERVER_IP"
echo "Swagger UI: http://$SERVER_IP/docs"
echo "ReDoc: http://$SERVER_IP/redoc"
echo ""
echo "Service durumu: systemctl status $APP_NAME"
echo "Loglar: journalctl -u $APP_NAME -f"
echo ""
echo "Database bilgileri:"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Password: $DB_PASSWORD"
echo ""
echo "=========================================="

