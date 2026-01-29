# 🚀 HETZNER OTOMATİK DEPLOYMENT
## Tek Komutla Deployment

---

## ⚡ HIZLI YÖNTEM

### **ADIM 1: Server'a Bağlan**

```powershell
ssh root@195.201.146.224
```

**Şifre:** `FmJ9caKAHFmM`

---

### **ADIM 2: Deployment Script'ini Çalıştır**

Server'a bağlandıktan sonra:

```bash
# Tek komutla deployment
curl -fsSL https://raw.githubusercontent.com/Cyhn85/cssberlin-website-/main/accounting_system/deploy/tek_komut_deploy.sh | bash
```

**VEYA**

```bash
# Script'i indir ve çalıştır
wget https://raw.githubusercontent.com/Cyhn85/cssberlin-website-/main/accounting_system/deploy/tek_komut_deploy.sh
chmod +x tek_komut_deploy.sh
./tek_komut_deploy.sh
```

---

## 📋 MANUEL YÖNTEM

### **PowerShell'den Tek Komut:**

```powershell
# SSH ile bağlan ve script'i çalıştır
ssh root@195.201.146.224 "bash -s" < deploy/tek_komut_deploy.sh
```

**Şifre sorduğunda:** `FmJ9caKAHFmM`

---

## ✅ DEPLOYMENT SONRASI

### **Kontrol:**

```bash
# Service durumu
systemctl status css-berlin-accounting

# Loglar
journalctl -u css-berlin-accounting -f

# API test
curl http://localhost:8000
```

### **Tarayıcıda:**

- **API:** http://195.201.146.224
- **Swagger UI:** http://195.201.146.224/docs
- **ReDoc:** http://195.201.146.224/redoc

---

## 🔒 GÜVENLİK NOTLARI

1. **Şifre Değiştirme:**
   - `.env` dosyasındaki şifreleri değiştirin
   - PostgreSQL şifresini değiştirin

2. **Firewall:**
   - Sadece gerekli portlar açık (22, 80, 443)

3. **SSL:**
   - Domain bağlandıktan sonra Let's Encrypt ile SSL ekleyin

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

**Durum:** Deployment Hazır ✅

