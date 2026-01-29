# 🖥️ TEST EKRANI GÖRÜNTÜLEME REHBERİ

## 📋 Hızlı Başlangıç

### **1. API Server'ı Başlat:**

**PowerShell'de:**
```powershell
# 1. Klasöre git
cd C:\Users\cyhnsrgc\Desktop\CSSberlin\accounting_system

# 2. Environment variable ayarla (SQLite için)
$env:DATABASE_URL="sqlite:///./test_accounting.db"

# 3. Server'ı başlat
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Server başladığında şunu göreceksiniz:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
✅ Database initialized
INFO:     Application startup complete.
```

---

### **2. Frontend'i Aç:**

**Seçenek 1: Doğrudan HTML Dosyası**
1. Windows Explorer'da şu klasöre git:
   ```
   C:\Users\cyhnsrgc\Desktop\CSSberlin\accounting_system\frontend
   ```
2. `index.html` dosyasına **çift tıkla**
3. Tarayıcıda açılacak

**Seçenek 2: Python HTTP Server (Önerilen)**
```powershell
# Yeni bir PowerShell penceresi aç
cd C:\Users\cyhnsrgc\Desktop\CSSberlin\accounting_system\frontend

# Python HTTP server başlat
python -m http.server 8080
```

Sonra tarayıcıda aç:
```
http://localhost:8080
```

---

### **3. Swagger UI (API Test):**

API'yi test etmek için:
```
http://localhost:8000/docs
```

Bu sayfada:
- ✅ Tüm endpoint'leri görebilirsiniz
- ✅ API'yi interaktif test edebilirsiniz
- ✅ Request/Response örneklerini görebilirsiniz

---

## 🎯 ADIM ADIM

### **ADIM 1: Terminal 1 - API Server**

```powershell
cd C:\Users\cyhnsrgc\Desktop\CSSberlin\accounting_system
$env:DATABASE_URL="sqlite:///./test_accounting.db"
python -m uvicorn app.main:app --reload --port 8000
```

**Beklenen çıktı:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
✅ Database initialized
```

---

### **ADIM 2: Terminal 2 - Frontend Server (Opsiyonel)**

```powershell
cd C:\Users\cyhnsrgc\Desktop\CSSberlin\accounting_system\frontend
python -m http.server 8080
```

**Veya sadece HTML dosyasını aç:**
- `frontend/index.html` dosyasına çift tıkla

---

### **ADIM 3: Tarayıcıda Aç**

1. **Frontend:** `http://localhost:8080` veya `index.html` dosyasını aç
2. **Swagger UI:** `http://localhost:8000/docs`
3. **ReDoc:** `http://localhost:8000/redoc`

---

## 🔧 SORUN GİDERME

### **Hata: "ModuleNotFoundError"**
```powershell
# Dependencies yükle
pip install -r requirements.txt
```

### **Hata: "Port already in use"**
```powershell
# Farklı port kullan
python -m uvicorn app.main:app --reload --port 8001
```

### **Hata: "Database connection failed"**
```powershell
# SQLite kullan (PostgreSQL gerekmez)
$env:DATABASE_URL="sqlite:///./test_accounting.db"
```

### **Frontend API'ye bağlanamıyor:**
`frontend/app.js` dosyasında API URL'ini kontrol et:
```javascript
const API_BASE = 'http://localhost:8000';
```

---

## ✅ KONTROL LİSTESİ

- [ ] API server çalışıyor (`http://localhost:8000`)
- [ ] Frontend açıldı (`index.html` veya `http://localhost:8080`)
- [ ] Swagger UI açıldı (`http://localhost:8000/docs`)
- [ ] Dashboard verileri görünüyor
- [ ] İşlemler listeleniyor

---

## 🎉 BAŞARILI!

Artık muhasebe sisteminizi test edebilirsiniz:
- ✅ Dashboard'da istatistikleri görebilirsiniz
- ✅ İşlem ekleyebilir, düzenleyebilir, silebilirsiniz
- ✅ Beyanname oluşturabilirsiniz
- ✅ Hatırlatmaları görebilirsiniz
- ✅ Uyumluluk kontrollerini yapabilirsiniz

---

**Not:** API server çalışırken terminal penceresini kapatmayın!

