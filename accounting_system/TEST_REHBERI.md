# 🧪 MUHASEBE SİSTEMİ TEST REHBERİ

## 📋 Hızlı Başlangıç

### **1. Gereksinimler:**
```bash
# Python 3.11+ gerekli
python --version

# Virtual environment oluştur (önerilir)
python -m venv venv

# Windows'ta aktif et
venv\Scripts\activate

# Linux/Mac'te aktif et
source venv/bin/activate
```

### **2. Dependencies Yükle:**
```bash
pip install -r requirements.txt
```

### **3. Test Çalıştır:**
```bash
python test_system.py
```

---

## 🎯 Test Senaryoları

### **Test 1: Database Kurulumu**
- ✅ SQLite database oluşturulur
- ✅ Tablolar oluşturulur (Transaction, Report, Reminder)

### **Test 2: Transaction CRUD**
- ✅ Transaction oluşturma
- ✅ Transaction okuma
- ✅ Transaction güncelleme
- ✅ Transaction silme

### **Test 3: Compliance Checker**
- ✅ Kleinunternehmer limiti kontrolü
- ✅ Limit hesaplama
- ✅ Uyarı sistemi

### **Test 4: Reminder Service**
- ✅ Beyanname hatırlatmaları oluşturma
- ✅ Yaklaşan hatırlatmaları getirme
- ✅ Gecikmiş hatırlatmaları tespit etme

### **Test 5: Özet İstatistikler**
- ✅ Gelir/gider toplamları
- ✅ Net sonuç hesaplama
- ✅ Platform bazlı istatistikler

---

## 🚀 API Server Test

### **1. Server Başlat:**
```bash
# SQLite ile test (PostgreSQL gerekmez)
set DATABASE_URL=sqlite:///./test_accounting.db
python -m uvicorn app.main:app --reload
```

### **2. API Endpoint'lerini Test Et:**

#### **Health Check:**
```bash
curl http://localhost:8000/
```

#### **Transaction Ekle:**
```bash
curl -X POST "http://localhost:8000/api/transactions" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2025-12-15",
    "platform": "Vinted",
    "transaction_type": "Gelir",
    "description": "Test Satış",
    "amount": 50.00,
    "category": "Satış",
    "is_business": true
  }'
```

#### **Transaction Listesi:**
```bash
curl http://localhost:8000/api/transactions
```

#### **Compliance Check:**
```bash
curl http://localhost:8000/api/compliance/kleinunternehmer/2025
```

#### **Reminders:**
```bash
curl http://localhost:8000/api/reminders/upcoming
```

#### **Özet İstatistikler:**
```bash
curl http://localhost:8000/api/stats/summary?year=2025
```

---

## 🌐 Browser Test

### **Swagger UI:**
Tarayıcıda aç: `http://localhost:8000/docs`

### **ReDoc:**
Tarayıcıda aç: `http://localhost:8000/redoc`

---

## ✅ Beklenen Sonuçlar

### **Test Başarılı Olursa:**
```
✅ Database tabloları oluşturuldu
✅ Transaction oluşturuldu: ID=1, Amount=50.0€
✅ Transaction okundu: Test Satış
✅ Transaction güncellendi: Yeni amount=60.0€
✅ Transaction silindi
✅ Kleinunternehmer kontrolü: ...
✅ 13 hatırlatma oluşturuldu
✅ Yaklaşan hatırlatmalar: X adet
✅ İstatistikler: ...
✅ TÜM TESTLER BAŞARILI!
```

---

## 🐛 Sorun Giderme

### **Hata: ModuleNotFoundError**
```bash
# Dependencies'i tekrar yükle
pip install -r requirements.txt
```

### **Hata: Database connection**
```bash
# SQLite kullan (PostgreSQL gerekmez)
set DATABASE_URL=sqlite:///./test_accounting.db
```

### **Hata: Port already in use**
```bash
# Farklı port kullan
uvicorn app.main:app --reload --port 8001
```

---

## 📝 Notlar

- Test database SQLite kullanır (PostgreSQL gerekmez)
- Test sonrası database dosyası silinebilir
- Production için PostgreSQL kullanılmalı

---

**Test Tarihi:** 03.01.2026  
**Durum:** Hazır ✅

