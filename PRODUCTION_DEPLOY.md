# 🚀 CSS Berlin - Production Deployment Guide

## 📋 Overview

Bu sistem **AKILLI** - otomatik olarak environment algılar:
- **Local:** `localhost` veya `file://` → Backend: `http://localhost:8000`
- **Production:** `cssberlin.de` → Backend: `https://cssberlin-backend.up.railway.app`

---

## 🎯 Backend Deployment (Railway/Render)

### Option 1: Railway (Önerilen)

1. **Railway'e Git:** https://railway.app
2. **GitHub bağla** ve repo seç: `Cyhn85/cssberlin-website-`
3. **Root directory ayarla:** `backend/`
4. **Environment Variables Ekle:**

```env
SECRET_KEY=super_secret_key_css_berlin_production_2026
DATABASE_URL=postgresql://user:pass@host:5432/cssberlin
FRONTEND_URL=https://cssberlin.de
BACKEND_URL=https://cssberlin-backend.up.railway.app

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Apple Sign In (Optional)
APPLE_CLIENT_ID=com.cssberlin.web
APPLE_TEAM_ID=YOUR_TEAM_ID
APPLE_KEY_ID=YOUR_KEY_ID

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@cssberlin.de
SMTP_PASSWORD=your-gmail-app-password
FROM_EMAIL=noreply@cssberlin.de
```

5. **Deploy Command:**
```bash
cd backend && pip install -r requirements.txt && uvicorn main:app --host 0.0.0.0 --port $PORT
```

6. **Deploy!** → Railway otomatik başlatacak

---

### Option 2: Render

1. **Render'a Git:** https://render.com
2. **New Web Service** → GitHub repo bağla
3. **Settings:**
   - **Root Directory:** `backend/`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables** ekle (yukarıdaki gibi)
5. **Deploy!**

---

## 🌐 Frontend Deployment (Cloudflare Pages)

### Cloudflare Pages

1. **Cloudflare Dashboard:** https://dash.cloudflare.com
2. **Pages** → **Create a project**
3. **Connect GitHub:** `cssberlin-website-` repo seç
4. **Build settings:**
   - **Framework preset:** None (Static HTML)
   - **Build command:** (boş bırak)
   - **Build output directory:** `/`
5. **Environment Variables:**
```env
NODE_VERSION=18
```

6. **Deploy!** → URL: `https://cssberlin-website.pages.dev`

---

## 🔑 Google OAuth Setup

### 1. Google Cloud Console

1. Git: https://console.cloud.google.com
2. **Create Project** → "CSS Berlin"
3. **APIs & Services** → **Credentials**
4. **Create OAuth Client ID:**
   - Application type: **Web application**
   - Name: CSS Berlin Production
   - **Authorized JavaScript origins:**
     ```
     https://cssberlin.de
     https://www.cssberlin.de
     https://cssberlin-website.pages.dev
     ```
   - **Authorized redirect URIs:**
     ```
     https://cssberlin-backend.up.railway.app/api/auth/google/callback
     ```
5. **Copy:**
   - Client ID → `GOOGLE_CLIENT_ID`
   - Client Secret → `GOOGLE_CLIENT_SECRET`

6. **Railway/Render'da Environment Variables'a ekle!**

---

## 📧 Email Setup (Gmail App Password)

### Gmail SMTP

1. **Google Account Security:** https://myaccount.google.com/security
2. **2-Step Verification** → Aç
3. **App Passwords** → Oluştur
   - App: Mail
   - Device: Other → "CSS Berlin Backend"
4. **Generated Password'u kopyala** → `SMTP_PASSWORD`
5. Railway/Render'da environment variable olarak ekle

---

## ✅ Production Checklist

### Backend
- [ ] Railway/Render'da deploy edildi
- [ ] Environment variables eklendi
- [ ] Database (PostgreSQL) bağlandı
- [ ] Google OAuth credentials yapılandırıldı
- [ ] SMTP email ayarları yapıldı
- [ ] `/health` endpoint test edildi
- [ ] API Docs çalışıyor: `/docs`

### Frontend
- [ ] Cloudflare Pages deploy edildi
- [ ] Custom domain bağlandı (cssberlin.de)
- [ ] SSL certificate aktif (HTTPS)
- [ ] API_BASE otomatik production URL'sine geçiyor

### Testing
- [ ] Login: Email/Password ✓
- [ ] Magic Link: Email gönderimi ✓
- [ ] Google OAuth: Giriş çalışıyor ✓
- [ ] Şifremi Unuttum: Reset email geliyor ✓
- [ ] JWT Token: LocalStorage çalışıyor ✓

---

## 🧪 Production Test

### 1. Backend Health Check
```bash
curl https://cssberlin-backend.up.railway.app/health
```

Response:
```json
{"status":"healthy","timestamp":"2026-02-05T..."}
```

### 2. Magic Link Test
```bash
curl -X POST https://cssberlin-backend.up.railway.app/api/auth/magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"test@cssberlin.de"}'
```

### 3. Frontend Test
1. Aç: https://cssberlin.de
2. **Anmelden** → Modal açılır
3. **Magic Link** → Email gir → Gönder
4. Email kutusunu kontrol et!

---

## 🔄 Environment Detection Logic

**Frontend JavaScript:**
```javascript
const isLocalDevelopment = window.location.hostname === 'localhost'
    || window.location.hostname === '127.0.0.1'
    || window.location.hostname === ''
    || window.location.protocol === 'file:';

const API_BASE = isLocalDevelopment
    ? 'http://localhost:8000'
    : 'https://cssberlin-backend.up.railway.app';
```

**Otomatik olarak:**
- Local'de çalışırken → `localhost:8000`
- Production'da → Railway backend URL

---

## 🆘 Troubleshooting

### CORS Error
Backend CORS zaten şu domain'lere açık:
- `https://cssberlin.de`
- `https://www.cssberlin.de`
- `https://cssberlin-website.pages.dev`

Farklı domain kullanıyorsanız `backend/main.py`'ye ekleyin.

### Email Gönderilmiyor
- Gmail App Password doğru mu?
- 2-Step Verification aktif mi?
- `SMTP_USER` ve `SMTP_PASSWORD` doğru mu?

### Google OAuth Çalışmıyor
- Redirect URI doğru mu?
- Client ID/Secret doğru mu?
- Production URL'si authorized origins'de mi?

---

## 🎉 Done!

Frontend ve Backend production'da! 🚀

**Demo:** https://cssberlin.de
**API:** https://cssberlin-backend.up.railway.app/docs
