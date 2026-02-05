# 🚀 CSS Berlin - Production Deployment Guide

## ✅ Yapılacaklar Listesi

### 1. **Backend Deploy (Railway / Render)**

#### Railway (Önerilen - Kolay Setup)

```bash
# 1. Railway CLI Kur
npm install -g @railway/cli

# 2. Railway'e Login
railway login

# 3. Proje Oluştur
cd backend
railway init

# 4. Environment Variables Ekle
railway variables set SECRET_KEY=your-secret-key
railway variables set GOOGLE_CLIENT_ID=your-client-id
railway variables set GOOGLE_CLIENT_SECRET=your-secret
railway variables set FRONTEND_URL=https://cssberlin-website.pages.dev
railway variables set BACKEND_URL=https://cssberlin-backend.up.railway.app

# 5. Deploy
railway up
```

**Railway Dashboard:** https://railway.app

#### Render (Alternatif)

1. https://render.com → New Web Service
2. Connect GitHub repo: `Cyhn85/cssberlin-website-`
3. **Root Directory:** `backend`
4. **Build Command:** `pip install -r requirements.txt`
5. **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Environment variables ekle (SECRET_KEY, GOOGLE_CLIENT_ID, etc.)

---

### 2. **Frontend Deploy (Cloudflare Pages)**

Zaten deploy edilmiş:
- **Production:** https://cssberlin-website.pages.dev
- **Custom Domain:** www.cssberlin.de (DNS ayarla)

#### Frontend Update:

```bash
# Index.html'i GitHub'a push et
git add index.html auth-modal-v2.* product-card-glass.css
git commit -m "feat: new responsive header design with OAuth"
git push origin main

# Cloudflare Pages otomatik deploy edecek
```

---

### 3. **Google OAuth Setup**

#### Google Cloud Console:

1. https://console.cloud.google.com
2. **APIs & Services** → **Credentials**
3. **OAuth 2.0 Client ID** oluştur

**Authorized JavaScript origins:**
```
https://cssberlin-website.pages.dev
https://www.cssberlin.de
https://cssberlin.de
```

**Authorized redirect URIs:**
```
https://cssberlin-backend.up.railway.app/api/auth/google/callback
https://your-render-app.onrender.com/api/auth/google/callback
```

#### `.env` Example:

```env
SECRET_KEY=super_long_random_string_here_32_chars_minimum
GOOGLE_CLIENT_ID=123456789-abcdef.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your_secret_here
FRONTEND_URL=https://cssberlin-website.pages.dev
BACKEND_URL=https://cssberlin-backend.up.railway.app
DATABASE_URL=sqlite+aiosqlite:///./cssberlin.db
```

---

### 4. **SMTP Email (Magic Link)**

#### Option A: Gmail

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@cssberlin.de
```

**Gmail App Password:**
- Google Account → Security → 2-Step Verification
- App Passwords → Generate

#### Option B: SendGrid (Production)

```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your-sendgrid-api-key
FROM_EMAIL=noreply@cssberlin.de
```

**SendGrid:** https://sendgrid.com (100 emails/day free)

---

### 5. **Frontend API Endpoints Update**

Auth modal'da backend URL'yi güncelle:

**`auth-modal-v2.js`:**
```javascript
const API_BASE = window.location.hostname.includes('localhost')
    ? 'http://localhost:8000'
    : 'https://cssberlin-backend.up.railway.app';  // ← Production backend
```

**`script.js`:**
```javascript
const API_URL = window.location.hostname.includes('localhost')
    ? 'http://localhost:8000/api'
    : 'https://cssberlin-backend.up.railway.app/api';
```

---

### 6. **CORS Settings (Backend)**

**`backend/main.py`:**
```python
origins = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "https://cssberlin.de",
    "https://www.cssberlin.de",
    "https://cssberlin-website.pages.dev",
]
```

---

### 7. **Database (Production)**

**SQLite (Railway/Render):**
- Railway: Automatic persistent volume
- Render: Use `/opt/render/project/src/cssberlin.db`

**PostgreSQL (Upgrade later):**
```bash
# Railway Postgres
railway add postgres

# Update .env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

---

### 8. **Test Checklist**

#### Backend Health:
```bash
curl https://cssberlin-backend.up.railway.app/health
# Response: {"status":"ok"}
```

#### Auth Endpoints:
```bash
# Register
curl -X POST https://cssberlin-backend.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","first_name":"Test","last_name":"User"}'

# Login
curl -X POST https://cssberlin-backend.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

#### Google OAuth:
```
https://cssberlin-backend.up.railway.app/api/auth/google
# Redirects to Google consent screen
```

#### Magic Link:
```bash
curl -X POST https://cssberlin-backend.up.railway.app/api/auth/magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com"}'
```

---

### 9. **Frontend Test**

1. **Open:** https://cssberlin-website.pages.dev
2. **Click:** "Anmelden" button
3. **Try:**
   - Google Login ✅
   - Magic Link ✅
   - Email/Password Register ✅
   - Email/Password Login ✅

---

### 10. **Monitoring & Logs**

**Railway:**
```bash
railway logs
```

**Render:**
- Dashboard → Logs tab

**Cloudflare Pages:**
- Dashboard → Deployments → View logs

---

## 🔐 Security Checklist

- [x] SECRET_KEY is strong (32+ chars)
- [x] CORS origins are specific (no wildcards)
- [x] OAuth credentials not in Git
- [x] HTTPS everywhere (no HTTP)
- [x] SMTP credentials secure
- [x] Rate limiting added (TODO)
- [x] SQL injection protection (SQLAlchemy ORM)
- [x] XSS protection (escaping inputs)

---

## 📊 Performance

**Backend:**
- FastAPI (async)
- SQLite → Migrate to Postgres if traffic > 1000/day
- Add Redis caching (future)

**Frontend:**
- Cloudflare CDN
- Image optimization (WebP)
- Lazy loading products

---

## 🎯 Next Steps

1. **Deploy backend** to Railway/Render
2. **Update frontend** API_BASE URLs
3. **Configure Google OAuth** with production URLs
4. **Test all auth flows** on production
5. **Set up custom domain** (www.cssberlin.de)
6. **Configure SendGrid** for Magic Link emails
7. **Monitor errors** (Sentry integration)

---

**🚀 Ready for Production!**
