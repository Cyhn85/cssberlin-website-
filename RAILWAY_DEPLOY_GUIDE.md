# 🚀 CSS Berlin - Railway Backend Deployment

**Durum:** ✅ GitHub pushed - Ready for Railway!
**Commit:** `809f0d5` - Production ready

---

## 📋 Deployment Checklist

### Ön Hazırlık
- [x] GitHub'a push edildi
- [x] client_secret.json kaldırıldı
- [x] Email system test edildi (noreply@cssberlin.de)
- [x] Magic Link çalışıyor
- [x] Backend localhost'ta çalışıyor

---

## 🚂 ADIM 1: Railway Project Oluştur

### 1.1 Railway Dashboard
1. **https://railway.app** adresine git
2. **Sign in with GitHub** (Cyhn85 hesabı)
3. **New Project** tıkla

### 1.2 GitHub Repo Bağla
1. **Deploy from GitHub repo** seç
2. Repo ara: **cssberlin-website-**
3. Repo'yu seç ve **Deploy Now**

### 1.3 Service Ayarları
1. Service adı: **cssberlin-backend**
2. Root Directory: **`backend/`** (ÖNEMLİ!)
3. Branch: **main**

---

## ⚙️ ADIM 2: Environment Variables

Railway dashboard → Service → Variables → **Raw Editor**

Aşağıdaki tüm environment variables'ı kopyala yapıştır:

```env
# ═══════════════════════════════════════════════════════════
# CSS Berlin Backend - Railway Production Environment
# ═══════════════════════════════════════════════════════════

# ─── JWT Secret Key ─────────────────────────────────────────
SECRET_KEY=super_secret_key_css_berlin_production_2026_change_me

# ─── Frontend & Backend URLs ────────────────────────────────
FRONTEND_URL=https://cssberlin.de
BACKEND_URL=https://cssberlin-backend.up.railway.app

# ─── Database (PostgreSQL - Railway) ────────────────────────
DATABASE_URL=${{Postgres.DATABASE_URL}}

# ─── Email (IONOS SMTP) ─────────────────────────────────────
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587

# Magic Link & Password Reset → noreply@cssberlin.de
SMTP_USER_MAGIC=noreply@cssberlin.de
SMTP_PASSWORD_MAGIC=F@ceb00k2002?
FROM_EMAIL_MAGIC=noreply@cssberlin.de

# General Info & Notifications → info@cssberlin.de
SMTP_USER_INFO=info@cssberlin.de
SMTP_PASSWORD_INFO=F@ceb00k2002?
FROM_EMAIL_INFO=info@cssberlin.de

# Default sender
SMTP_USER=noreply@cssberlin.de
SMTP_PASSWORD=F@ceb00k2002?
FROM_EMAIL=noreply@cssberlin.de

# Email mode (production)
EMAIL_DEV_MODE=false

# ─── Google OAuth (Optional) ────────────────────────────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ─── Apple Sign In (Optional) ───────────────────────────────
APPLE_CLIENT_ID=
APPLE_TEAM_ID=
APPLE_KEY_ID=
```

**ÖNEMLİ NOTLAR:**
- `DATABASE_URL=${{Postgres.DATABASE_URL}}` → Railway otomatik PostgreSQL bağlantısı
- `BACKEND_URL` → Deploy sonrası Railway URL'i ile güncellenecek
- `EMAIL_DEV_MODE=false` → Production'da gerçek email gönderir

---

## 🗄️ ADIM 3: PostgreSQL Ekle

### 3.1 Database Oluştur
1. Railway dashboard → **New** → **Database** → **Add PostgreSQL**
2. PostgreSQL servisi otomatik oluşacak
3. Otomatik olarak `DATABASE_URL` variable'ı eklenecek

### 3.2 Database Connection Test
Deploy sonrası logs'da göreceksin:
```
[OK] CSS Berlin DB tables ready.
INFO: Application startup complete.
```

---

## 🔧 ADIM 4: Build & Deploy Settings

### 4.1 Build Command
Railway otomatik detect edecek:
```bash
pip install -r requirements.txt
```

### 4.2 Start Command
```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

### 4.3 Health Check
Railway otomatik health check yapacak:
- Endpoint: `/health`
- Expected: `{"status":"ok"}`

---

## 🚀 ADIM 5: Deploy!

1. **Deploy** butonu tıkla
2. Build logs izle:
   ```
   Building...
   Installing dependencies...
   Starting application...
   ```
3. Deploy tamamlanınca Railway URL'i al:
   - Örnek: `https://cssberlin-backend-production-xxxx.up.railway.app`

---

## ✅ ADIM 6: Production Test

### 6.1 Health Check
```bash
curl https://YOUR-RAILWAY-URL.up.railway.app/health
```
**Beklenen:**
```json
{"status":"ok"}
```

### 6.2 API Docs
Tarayıcıda aç:
```
https://YOUR-RAILWAY-URL.up.railway.app/docs
```
FastAPI Swagger UI açılacak!

### 6.3 Products API
```bash
curl https://YOUR-RAILWAY-URL.up.railway.app/api/products?limit=5
```

### 6.4 Categories API
```bash
curl https://YOUR-RAILWAY-URL.up.railway.app/api/products/categories
```

### 6.5 Magic Link Test
```bash
curl -X POST https://YOUR-RAILWAY-URL.up.railway.app/api/auth/magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"cyhnsrgc@gmail.com"}'
```

**Beklenen:**
```json
{"success":true,"message":"Magic link sent! Check your email."}
```

**Gmail'de email gelecek:**
- From: noreply@cssberlin.de
- Subject: 🔐 Dein Magic Link für CSS Berlin

---

## 🔄 ADIM 7: Backend URL'i Güncelle

Deploy sonrası Railway URL'i aldıktan sonra:

### 7.1 Environment Variable Güncelle
Railway dashboard → Variables → `BACKEND_URL` değiştir:
```env
BACKEND_URL=https://cssberlin-backend-production-xxxx.up.railway.app
```

### 7.2 CORS Origins Kontrol
`backend/main.py` dosyasında CORS origins doğru mu kontrol et:
```python
origins = [
    "https://cssberlin.de",
    "https://www.cssberlin.de",
    "https://cssberlin-website.pages.dev",
]
```

Gerekirse Railway'de yeni bir commit sonrası otomatik redeploy olur.

---

## 🐛 Troubleshooting

### Problem 1: Build Failed

**Sebep:** `requirements.txt` eksik bağımlılık
**Çözüm:**
```bash
# Local'de test et
cd backend
pip install -r requirements.txt
```

### Problem 2: Database Connection Error

**Sebep:** PostgreSQL servisi eklenmemiş
**Çözüm:**
- Railway → New → Database → PostgreSQL
- `DATABASE_URL` variable otomatik eklenecek

### Problem 3: Email Gönderilmiyor

**Sebep:** `EMAIL_DEV_MODE=true` veya SMTP credentials yanlış
**Çözüm:**
- Environment variables kontrol et
- `EMAIL_DEV_MODE=false` olmalı
- SMTP şifre doğru mu kontrol et

### Problem 4: CORS Error

**Sebep:** Frontend origin allowed değil
**Çözüm:**
- `backend/main.py` → `origins` listesine ekle:
  ```python
  origins = [
      "https://cssberlin.de",
      "https://www.cssberlin.de",
      "https://cssberlin-website.pages.dev",
  ]
  ```

---

## 📊 Railway Monitoring

### Logs
Railway dashboard → Service → **Logs**
- Real-time logs
- Email gönderim logları:
  ```
  [OK] Email sent: user@example.com (from noreply@cssberlin.de)
  ```

### Metrics
- CPU usage
- Memory usage
- Request count
- Response times

### Alerts
Railway otomatik:
- Deploy başarısız olursa email gönderir
- Service down olursa alert verir

---

## 💰 Railway Pricing

**Free Tier:**
- $5 worth of usage/month
- Enough for testing

**Hobby Plan:**
- $5/month
- Recommended for production

---

## 🎯 Post-Deployment

Deploy başarılı olduktan sonra:

1. **Railway URL'i kaydet:**
   ```
   Backend: https://cssberlin-backend-production-xxxx.up.railway.app
   ```

2. **Frontend'i güncelle:**
   - `script.js` → API_BASE_URL production URL'i kullanacak (otomatik)
   - `auth-modal-v3.js` → API_BASE URL'i kullanacak (otomatik)

3. **Cloudflare Pages Deploy:**
   - Frontend'i deploy et
   - Domain bağla: cssberlin.de

4. **Production Test:**
   - Magic Link gönder
   - Gmail'de email kontrol et
   - Login test et

---

## ✅ Success Checklist

- [ ] Railway project oluşturuldu
- [ ] GitHub repo bağlandı
- [ ] Root directory: `backend/` ayarlandı
- [ ] Environment variables eklendi
- [ ] PostgreSQL database eklendi
- [ ] Deploy başarılı
- [ ] Health check: OK
- [ ] API docs açılıyor
- [ ] Products API çalışıyor
- [ ] Categories API çalışıyor
- [ ] Magic Link email gönderimi çalışıyor
- [ ] Gmail'de email alındı

---

**🚀 RAILWAY DEPLOYMENT READY!**

**Sıradaki:** Cloudflare Pages frontend deployment
