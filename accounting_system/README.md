# 🏗️ PROFESYONEL MUHASEBE SİSTEMİ
## Berlin Finanzamt Uyumlu - Hetzner Deploy Ready

---

## 📋 ÖZELLİKLER

✅ **Gelir-Gider Yönetimi**
- Platform bazlı işlem takibi (Vinted, eBay, Kleinanzeigen, Amazon Flex)
- Otomatik tekrar tespiti ve temizleme
- İş/Özel ayrımı (Tipico, Booking.com otomatik filtreleme)

✅ **Beyanname Modülü**
- EÜR (Einnahmenüberschussrechnung) otomatik oluşturma
- Finanzamt'a gönderim için PDF çıktı
- Platform bazlı T-cetvelleri

✅ **Hatırlatma Sistemi**
- Beyanname tarihleri (aylık/üç aylık)
- Ödeme tarihleri (Klarna, banka)
- KDV limiti uyarıları (22.500€/yıl)
- Muhasebeci zorunluluğu kontrolü

✅ **Yasal Uyumluluk**
- Kleinunternehmer limiti (22.500€/yıl)
- KDV faturası kesme zorunluluğu kontrolü
- Muhasebeci tutma zorunluluğu (600.000€ ciro veya 60.000€ kar)
- Berlin Finanzamt yasalarına uygunluk

---

## 🚀 KURULUM

### **1. Gereksinimler:**
```bash
pip install -r requirements.txt
```

### **2. Database Kurulumu:**
```bash
# PostgreSQL database oluştur
createdb accounting_db

# Environment variables
export DATABASE_URL="postgresql://user:password@localhost/accounting_db"
export SECRET_KEY="your-secret-key"
```

### **3. Migration:**
```bash
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### **4. Server Başlatma:**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## 🌐 HETZNER DEPLOYMENT

### **Server Gereksinimleri:**
- Ubuntu 22.04 LTS
- PostgreSQL 14+
- Python 3.11+
- Nginx (reverse proxy)
- SSL sertifikası (Let's Encrypt)

### **Deployment Adımları:**
1. Server'a bağlan
2. Git repository'yi clone et
3. Virtual environment oluştur
4. Dependencies yükle
5. Database kur
6. Nginx konfigürasyonu
7. SSL sertifikası
8. Systemd service oluştur

---

## 📊 API ENDPOINTS

### **Transactions:**
- `GET /api/transactions` - Tüm işlemler
- `POST /api/transactions` - Yeni işlem ekle
- `GET /api/transactions/{id}` - İşlem detayı
- `PUT /api/transactions/{id}` - İşlem güncelle
- `DELETE /api/transactions/{id}` - İşlem sil

### **Reports:**
- `GET /api/reports` - Tüm beyannameler
- `POST /api/reports/generate` - Yeni beyanname oluştur
- `GET /api/reports/{id}/pdf` - PDF indir

### **Reminders:**
- `GET /api/reminders` - Tüm hatırlatmalar
- `GET /api/reminders/upcoming` - Yaklaşan hatırlatmalar
- `POST /api/reminders/{id}/complete` - Tamamlandı işaretle

### **Compliance:**
- `GET /api/compliance/kleinunternehmer/{year}` - Limit kontrolü
- `GET /api/compliance/accountant/{year}` - Muhasebeci zorunluluğu

---

## 🔒 GÜVENLİK

- JWT token authentication
- Password hashing (bcrypt)
- SQL injection koruması (SQLAlchemy ORM)
- CORS yapılandırması
- Rate limiting

---

## 📝 LİSANS

Bu proje özel kullanım içindir.

---

**Durum:** Geliştirme Aşamasında 🚀

