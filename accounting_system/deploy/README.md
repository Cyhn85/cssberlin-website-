# 🚀 HETZNER DEPLOYMENT REHBERİ

## 📋 Ön Gereksinimler

1. **Hetzner Server:**
   - Ubuntu 22.04 LTS
   - Minimum 2GB RAM
   - Root erişimi

2. **Domain:**
   - Domain adresi (örn: accounting.cssberlin.de)
   - DNS kayıtları Hetzner IP'ye yönlendirilmeli

---

## 🛠️ KURULUM ADIMLARI

### **1. Server'a Bağlan:**
```bash
ssh root@YOUR_SERVER_IP
```

### **2. Deployment Script'i Çalıştır:**
```bash
# Script'i indir
wget https://raw.githubusercontent.com/Cyhn85/cssberlin-website-/main/accounting_system/deploy/hetzner_deploy.sh

# Çalıştırılabilir yap
chmod +x hetzner_deploy.sh

# Çalıştır
./hetzner_deploy.sh
```

### **3. Manuel Kurulum (Alternatif):**

#### **A. Sistem Güncellemesi:**
```bash
sudo apt update && sudo apt upgrade -y
```

#### **B. Gereksinimler:**
```bash
sudo apt install -y python3.11 python3.11-venv python3-pip postgresql postgresql-contrib nginx git
```

#### **C. PostgreSQL:**
```bash
sudo -u postgres psql
CREATE DATABASE accounting_db;
CREATE USER accounting_user WITH PASSWORD 'GÜÇLÜ_ŞİFRE';
GRANT ALL PRIVILEGES ON DATABASE accounting_db TO accounting_user;
\q
```

#### **D. Uygulama:**
```bash
mkdir -p /var/www/css-berlin-accounting
cd /var/www/css-berlin-accounting
git clone https://github.com/Cyhn85/cssberlin-website-.git .
cd accounting_system
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### **E. Environment Variables:**
```bash
cat > .env << EOF
DATABASE_URL=postgresql://accounting_user:GÜÇLÜ_ŞİFRE@localhost:5432/accounting_db
SECRET_KEY=$(openssl rand -hex 32)
ENVIRONMENT=production
EOF
```

#### **F. Database Migration:**
```bash
export DATABASE_URL="postgresql://accounting_user:GÜÇLÜ_ŞİFRE@localhost:5432/accounting_db"
alembic upgrade head
```

#### **G. Systemd Service:**
```bash
sudo nano /etc/systemd/system/css-berlin-accounting.service
```

İçerik:
```ini
[Unit]
Description=CSS Berlin Muhasebe Sistemi
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/css-berlin-accounting/accounting_system
Environment="PATH=/var/www/css-berlin-accounting/accounting_system/venv/bin"
EnvironmentFile=/var/www/css-berlin-accounting/accounting_system/.env
ExecStart=/var/www/css-berlin-accounting/accounting_system/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable css-berlin-accounting
sudo systemctl start css-berlin-accounting
```

#### **H. Nginx:**
```bash
sudo nano /etc/nginx/sites-available/css-berlin-accounting
```

İçerik:
```nginx
server {
    listen 80;
    server_name accounting.cssberlin.de;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/css-berlin-accounting /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### **I. SSL (Let's Encrypt):**
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d accounting.cssberlin.de
```

---

## ✅ KONTROL

### **Service Durumu:**
```bash
sudo systemctl status css-berlin-accounting
```

### **Loglar:**
```bash
sudo journalctl -u css-berlin-accounting -f
```

### **Nginx Durumu:**
```bash
sudo systemctl status nginx
```

---

## 🔄 GÜNCELLEME

```bash
cd /var/www/css-berlin-accounting
git pull
cd accounting_system
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
sudo systemctl restart css-berlin-accounting
```

---

## 🔒 GÜVENLİK

1. **Firewall:**
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

2. **Şifre Değiştirme:**
- `.env` dosyasındaki şifreleri değiştir
- PostgreSQL şifresini değiştir

3. **Backup:**
```bash
# Database backup
pg_dump -U accounting_user accounting_db > backup_$(date +%Y%m%d).sql
```

---

**Durum:** Production Ready ✅

