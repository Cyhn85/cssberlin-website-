# 🔧 Magic Link Sorun Giderme

**Durum:** Magic Link emaili gelmiyor
**Tarih:** 2026-02-05

---

## ✅ Çalışan Kısımlar

1. ✅ IONOS SMTP bağlantısı çalışıyor
2. ✅ Backend API çalışıyor (`/api/auth/magic-link`)
3. ✅ Test email gönderimi başarılı
4. ✅ Email template'leri güncellendi (CSS Berlin branding)

---

## 🔍 Sorun Tespiti

### Test 1: API Çalışıyor mu?

```bash
curl -X POST http://localhost:8000/api/auth/magic-link \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"cyhnsrgc@gmail.com\"}"
```

**Beklenen:**
```json
{"success":true,"message":"Magic link sent! Check your email.","email":"cyhnsrgc@gmail.com"}
```

✅ **SONUÇ:** API çalışıyor!

---

### Test 2: Email Gönderiliyor mu?

**Backend console'u kontrol et:**
- Şu log'u görüyor musun?
  ```
  ✅ Email sent: cyhnsrgc@gmail.com (from noreply@cssberlin.de)
  ```

**Eğer görüyorsan:** Email gönderildi! Gmail'i kontrol et.

**Eğer görmüyorsan:** Backend email gönderemiyor. `.env` dosyasını kontrol et.

---

### Test 3: Gmail'de Email Var mı?

1. **Gelen Kutusu:** `from:noreply@cssberlin.de` ara
2. **Spam Klasörü:** Kontrol et
3. **Tüm Emailler:** "CSS Berlin" ara

**Email Subject:** "🔐 Dein Magic Link für CSS Berlin"

---

## 🔧 Çözümler

### Çözüm 1: Backend Restart

```bash
cd C:\Users\cyhnsrgc\Desktop\CSSberlin\backend
python -m uvicorn main:app --reload
```

Veya çift tıkla: **`RESTART_BACKEND.bat`**

---

### Çözüm 2: .env Dosyası Kontrol

**Dosya:** `backend/.env`

```env
# Email (IONOS SMTP)
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587
SMTP_USER=noreply@cssberlin.de
SMTP_PASSWORD=F@ceb00k2002?
FROM_EMAIL=noreply@cssberlin.de
EMAIL_DEV_MODE=false
```

**Kontrol:**
- ✅ `EMAIL_DEV_MODE=false` (gerçek email gönder)
- ✅ Şifre doğru: `F@ceb00k2002?`

---

### Çözüm 3: Frontend API URL Kontrol

**Dosya:** `auth-modal-v3.js`

```javascript
const API_BASE = window.location.hostname === 'localhost' ||
                 window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : 'https://cssberlin-backend.up.railway.app';
```

**index.html file:// ile açıyorsan:** Localhost backend kullanacak ✅

---

### Çözüm 4: Manuel Test

**Script:** `MAGIC_LINK_TEST.bat`

Çift tıkla → API'ye direk request atar → Gmail'i kontrol et

---

## 📧 Email Gönderim Akışı

1. **Frontend:** Magic Link butonu tıklanır
2. **Frontend → Backend:** POST `/api/auth/magic-link`
3. **Backend:** User kontrolü (varsa adı alır)
4. **Backend:** Token oluşturur (15 dk geçerli)
5. **Backend → IONOS:** SMTP ile email gönderir
6. **IONOS → Gmail:** Email iletilir
7. **Gmail:** Kullanıcı emaili alır

**Her adımda log var!** Backend console'u kontrol et.

---

## 🧪 Adım Adım Test

### 1. Backend Çalıştır

```bash
cd backend
python -m uvicorn main:app --reload
```

**Beklenen Console:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
[OK] CSS Berlin DB tables ready.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

---

### 2. Frontend Aç

**index.html** dosyasını tarayıcıda aç

---

### 3. Magic Link Gönder

1. **Anmelden** tıkla
2. **Magic Link** sekmesi
3. Email gir: `cyhnsrgc@gmail.com`
4. **MAGIC LINK SENDEN** tıkla
5. "Success" mesajı göreceksin

---

### 4. Backend Console Kontrol

Şu log'u görmelisin:
```
POST /api/auth/magic-link
✅ Email sent: cyhnsrgc@gmail.com (from noreply@cssberlin.de)
```

---

### 5. Gmail Kontrol

**From:** noreply@cssberlin.de
**Subject:** 🔐 Dein Magic Link für CSS Berlin
**Body:**
- CSS Berlin header (gradient)
- "Jetzt anmelden" butonu
- Magic link URL
- Footer: "Diese Email kann nicht beantwortet werden."

---

## ❓ Sık Sorulan Sorular

### Q: Email neden gelmiyor?

**A:** 3 olasılık:
1. Backend çalışmıyor → `RESTART_BACKEND.bat`
2. `.env` dosyası yanlış → `EMAIL_DEV_MODE=false` kontrol et
3. Gmail spam → Spam klasörünü kontrol et

---

### Q: "Failed to fetch" hatası?

**A:** Backend çalışmıyor veya API URL yanlış.

**Çözüm:**
1. Backend console'u kontrol et (çalışıyor mu?)
2. `http://localhost:8000/health` aç (çalışıyorsa `{"status":"ok"}` döner)

---

### Q: Email DEV MODE'da console'a yazdırılıyor?

**A:** `.env` dosyasında `EMAIL_DEV_MODE=true`

**Çözüm:**
```env
EMAIL_DEV_MODE=false
```
Backend'i restart et.

---

### Q: IONOS SMTP hatası?

**A:** Şifre yanlış veya IONOS bağlantısı kesildi.

**Test:**
```bash
cd backend
python -c "
import smtplib
from dotenv import load_dotenv
import os

load_dotenv()
server = smtplib.SMTP('smtp.ionos.de', 587)
server.starttls()
server.login(os.getenv('SMTP_USER'), os.getenv('SMTP_PASSWORD'))
print('IONOS connection OK!')
server.quit()
"
```

---

## 📊 Checklist

### Backend
- [ ] Backend çalışıyor (http://localhost:8000/health)
- [ ] `.env` dosyası var ve doğru
- [ ] `EMAIL_DEV_MODE=false`
- [ ] IONOS SMTP bağlantısı çalışıyor

### Frontend
- [ ] index.html açık
- [ ] Anmelden modalı açılıyor
- [ ] Magic Link sekmesi görünüyor
- [ ] Email input çalışıyor
- [ ] "MAGIC LINK SENDEN" butonu tıklanabiliyor

### Email
- [ ] Backend console'da "Email sent" log'u var
- [ ] Gmail gelen kutusunda email var
- [ ] Email CSS Berlin branding'i ile
- [ ] "Jetzt anmelden" butonu çalışıyor

---

## 🎯 Hızlı Çözüm

**Tüm adımları sıfırdan yap:**

1. **Backend Restart:**
   ```bash
   cd C:\Users\cyhnsrgc\Desktop\CSSberlin\backend
   python -m uvicorn main:app --reload
   ```

2. **Manuel Test:**
   ```bash
   curl -X POST http://localhost:8000/api/auth/magic-link \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"cyhnsrgc@gmail.com\"}"
   ```

3. **Gmail Kontrol:**
   - Arama: `from:noreply@cssberlin.de`
   - Spam klasörü kontrol et

4. **Email Geldi mi?**
   - ✅ EVET → Magic Link çalışıyor!
   - ❌ HAYIR → Backend console'u kontrol et

---

## 🚀 Son Kontrol

**Backend Console Log:**
```
INFO:     127.0.0.1:xxxxx - "POST /api/auth/magic-link HTTP/1.1" 200 OK
✅ Email sent: cyhnsrgc@gmail.com (from noreply@cssberlin.de)
```

**Gmail:**
```
From: noreply@cssberlin.de
Subject: 🔐 Dein Magic Link für CSS Berlin
Status: Geldi!
```

**✅ MAGIC LINK ÇALIŞIYOR!**

---

**Son Güncelleme:** 2026-02-05 23:50
**Durum:** Email template'leri güncellendi (CSS Berlin branding)
**Backend:** Çalışıyor (noreply@cssberlin.de)
