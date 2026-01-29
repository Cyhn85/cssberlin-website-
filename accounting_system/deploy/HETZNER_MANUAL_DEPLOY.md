# 🚀 HETZNER MANUEL DEPLOYMENT REHBERİ
## Server Bilgileri: ubuntu-4gb-nbg1-1

---

## 📋 SERVER BİLGİLERİ

- **IP Adresi:** 195.201.146.224
- **Kullanıcı:** root
- **Şifre:** FmJ9caKAHFmM
- **Server Adı:** ubuntu-4gb-nbg1-1

---

## 🔐 ADIM 1: Server'a Bağlan

### **Windows PowerShell'de:**
```powershell
ssh root@195.201.146.224
```

**Şifre sorduğunda:** `FmJ9caKAHFmM` yazın

---

## 🛠️ ADIM 2: Deployment Script'ini Çalıştır

### **Seçenek A: Otomatik Script (Önerilen)**

Server'a bağlandıktan sonra:

```bash
# 1. Script'i indir
wget https://raw.githubusercontent.com/Cyhn85/cssberlin-website-/main/accounting_system/deploy/hetzner_deploy.sh

# 2. Çalıştırılabilir yap
chmod +x hetzner_deploy.sh

# 3. Çalıştır
./hetzner_deploy.sh
```

### **Seçenek B: Manuel Adımlar**

#### **2.1 Sistem Güncellemesi:**
```bash
apt update && apt upgrade -y
```

#### **2.2 Gereksinimler:**
```bash
apt install -y python3.11 python3.11-venv python3-pip postgresql postgresql-contrib nginx git
```

#### **2.3 PostgreSQL:**
```bash
sudo -u postgres psql
```

PostgreSQL içinde:
```sql
CREATE DATABASE accounting_db;
CREATE USER accounting_user WITH PASSWORD 'GÜÇLÜ_ŞİFRE_BURAYA';
GRANT ALL PRIVILEGES ON DATABASE accounting_db TO accounting_user;
\q
```

#### **2.4 Uygulama:**
```bash
mkdir -p /var/www/css-berlin-accounting
cd /var/www/css-berlin-accounting
git clone https://github.com/Cyhn85/cssberlin-website-.git .
cd accounting_system
```

#### **2.5 Virtual Environment:**
```bash
python3.11 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

#### **2.6 Environment Variables:**
```bash
cat > .env << EOF
DATABASE_URL=postgresql://accounting_user:GÜÇLÜ_ŞİFRE_BURAYA@localhost:5432/accounting_db
SECRET_KEY=$(openssl rand -hex 32)
ENVIRONMENT=production
EOF
```

#### **2.7 Database Migration:**
```bash
export DATABASE_URL="postgresql://accounting_user:GÜÇLÜ_ŞİFRE_BURAYA@localhost:5432/accounting_db"
alembic upgrade head
```

#### **2.8 Systemd Service:**
```bash
cat > /etc/systemd/system/css-berlin-accounting.service << EOF
[Unit]
Description=CSS Berlin Muhasebe Sistemi
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/var/www/css-berlin-accounting/accounting_system
Environment="PATH=/var/www/css-berlin-accounting/accounting_system/venv/bin"
EnvironmentFile=/var/www/css-berlin-accounting/accounting_system/.env
ExecStart=/var/www/css-berlin-accounting/accounting_system/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable css-berlin-accounting
systemctl start css-berlin-accounting
```

#### **2.9 Nginx:**
```bash
cat > /etc/nginx/sites-available/css-berlin-accounting << EOF
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

ln -s /etc/nginx/sites-available/css-berlin-accounting /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

## ✅ ADIM 3: Kontrol

### **Service Durumu:**
```bash
systemctl status css-berlin-accounting
```

### **Loglar:**
```bash
journalctl -u css-berlin-accounting -f
```

### **API Test:**
```bash
curl http://localhost:8000
```

### **Tarayıcıda:**
```
http://195.201.146.224
```

---

## 🔒 ADIM 4: Güvenlik

### **Firewall:**
```bash
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### **SSL Sertifikası (Let's Encrypt):**
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d YOUR_DOMAIN.com
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
systemctl restart css-berlin-accounting
```

---

## 📝 NOTLAR

- **Şifre Değiştirme:** `.env` dosyasındaki şifreleri değiştirin
- **Backup:** Düzenli database backup alın
- **Monitoring:** Logları düzenli kontrol edin

---

**Durum:** Deployment Hazır ✅

