# 🚀 HIZLI BAŞLANGIÇ

## ⚡ 2 ADIMDA TEST EKRANI

### **ADIM 1: API Server'ı Başlat**

**Seçenek A: Otomatik (Önerilen)**
- `baslat.bat` dosyasına **çift tıkla**
- Server otomatik başlayacak

**Seçenek B: Manuel**
```powershell
cd C:\Users\cyhnsrgc\Desktop\CSSberlin\accounting_system
$env:DATABASE_URL="sqlite:///./test_accounting.db"
python -m uvicorn app.main:app --reload --port 8000
```

---

### **ADIM 2: Frontend'i Aç**

**Seçenek A: Otomatik (Önerilen)**
- `frontend_ac.bat` dosyasına **çift tıkla**
- Tarayıcıda `http://localhost:8080` açılacak

**Seçenek B: Manuel**
- `frontend/index.html` dosyasına **çift tıkla**
- Tarayıcıda açılacak

**Seçenek C: Python HTTP Server**
```powershell
cd C:\Users\cyhnsrgc\Desktop\CSSberlin\accounting_system\frontend
python -m http.server 8080
```
Sonra tarayıcıda: `http://localhost:8080`

---

## 🌐 ERİŞİM ADRESLERİ

### **Frontend (Muhasebe Sistemi):**
```
http://localhost:8080
```
veya
```
file:///C:/Users/cyhnsrgc/Desktop/CSSberlin/accounting_system/frontend/index.html
```

### **Swagger UI (API Test):**
```
http://localhost:8000/docs
```

### **ReDoc (API Dokümantasyonu):**
```
http://localhost:8000/redoc
```

### **API Root:**
```
http://localhost:8000
```

---

## ✅ KONTROL

1. ✅ API server çalışıyor mu? → `http://localhost:8000` açılmalı
2. ✅ Frontend açıldı mı? → `index.html` veya `http://localhost:8080`
3. ✅ Dashboard verileri görünüyor mu?

---

## 🎯 ÖRNEK KULLANIM

### **1. Dashboard:**
- Toplam gelir/gider görüntüleme
- Net sonuç hesaplama
- KDV limit kullanımı

### **2. İşlemler:**
- Yeni işlem ekleme
- İşlem listeleme
- Tekrarları kontrol etme

### **3. Beyannameler:**
- EÜR beyannamesi oluşturma
- Platform T-cetveli oluşturma
- PDF indirme

### **4. Hatırlatmalar:**
- Yaklaşan beyanname tarihleri
- Ödeme hatırlatmaları
- Limit uyarıları

### **5. Uyumluluk:**
- Kleinunternehmer limiti kontrolü
- Muhasebeci zorunluluğu kontrolü

---

## 🔧 SORUN GİDERME

### **"ModuleNotFoundError"**
```powershell
pip install -r requirements.txt
```

### **"Port already in use"**
- Farklı port kullan veya mevcut process'i kapat

### **Frontend API'ye bağlanamıyor**
- API server'ın çalıştığından emin ol
- `app.js` dosyasında API URL'ini kontrol et

---

**Hazır! Test ekranınızı görebilirsiniz! 🎉**

