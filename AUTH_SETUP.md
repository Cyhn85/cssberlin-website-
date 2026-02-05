# 🔐 CSS Berlin - Auth System Setup Guide

## ✅ Tamamlanan Özellikler

### 1. **Modern Login Modal**
- ✅ Glassmorphism tasarım
- ✅ Compact layout (scroll yok, tek ekran)
- ✅ Tab sistemi: Anmelden ↔ Registrieren
- ✅ Auto-focus (first input)
- ✅ Enter key support
- ✅ Loading states
- ✅ Error/success messages

### 2. **OAuth Entegrasyonları**
- ✅ Google OAuth 2.0
- ✅ Apple Sign In (placeholder)
- ✅ Magic Link (email-based)

### 3. **Backend API**
- ✅ `/api/auth/register` - Yeni kullanıcı kaydı
- ✅ `/api/auth/login` - Email/password girişi
- ✅ `/api/auth/me` - Kullanıcı bilgisi
- ✅ `/api/auth/google` - Google OAuth redirect
- ✅ `/api/auth/google/callback` - OAuth callback
- ✅ `/api/auth/magic-link` - Magic link gönderme
- ✅ `/api/auth/magic-link/verify` - Magic link doğrulama

---

## 🚀 Backend Kurulum

### 1. Python Virtual Environment

```bash
cd backend

# Virtual environment oluştur
python -m venv venv

# Aktif et (Windows)
venv\Scripts\activate

# Aktif et (Mac/Linux)
source venv/bin/activate

# Dependencies yükle
pip install -r requirements.txt
```

### 2. Environment Variables (.env)

`.env.example` dosyasını `.env` olarak kopyalayın:

```bash
cp .env.example .env
```

Şimdi `.env` dosyasını düzenleyin:

```env
# JWT Secret (üretim için değiştirin!)
SECRET_KEY=your-random-secret-key-here

# URLs
FRONTEND_URL=http://localhost:5500
BACKEND_URL=http://localhost:8000

# Google OAuth (aşağıda nasıl alınır)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Email (Magic Link için)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### 3. Backend Çalıştırma

```bash
cd backend
python main.py

# Veya
uvicorn main:app --reload
```

Backend şimdi çalışıyor: **http://localhost:8000**

API Docs: **http://localhost:8000/docs**

---

## 🔑 Google OAuth Setup

### 1. Google Cloud Console

1. **Git:** https://console.cloud.google.com
2. **Yeni Proje Oluştur:** "CSS Berlin"
3. **APIs & Services** → **Credentials**
4. **Create Credentials** → **OAuth 2.0 Client ID**

### 2. OAuth Consent Screen

- **Application name:** CSS Berlin
- **User support email:** Your email
- **Authorized domains:**
  - `localhost` (development)
  - `cssberlin.de` (production)
  - `cssberlin-website.pages.dev` (staging)

### 3. OAuth Client ID

**Application type:** Web application

**Authorized JavaScript origins:**
```
http://localhost:8000
http://localhost:5500
https://cssberlin.de
https://www.cssberlin.de
https://cssberlin-website.pages.dev
```

**Authorized redirect URIs:**
```
http://localhost:8000/api/auth/google/callback
https://cssberlin.de/api/auth/google/callback
https://www.cssberlin.de/api/auth/google/callback
```

### 4. Copy Credentials

Google size **Client ID** ve **Client Secret** verecek:

```
Client ID: 123456789-abc.apps.googleusercontent.com
Client Secret: GOCSPX-xyz123
```

Bunları `.env` dosyasına yapıştırın.

---

## 📧 Email (Magic Link) Setup

### Option 1: Gmail (Development)

1. Gmail hesabınıza gidin
2. **Settings** → **Security**
3. **2-Step Verification** aktif et
4. **App Passwords** oluştur
5. "Mail" seçin, cihaz adı girin
6. 16 haneli şifreyi kopyalayın

`.env` dosyasına:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=abcd efgh ijkl mnop
FROM_EMAIL=noreply@cssberlin.de
```

### Option 2: SendGrid (Production)

1. **Git:** https://sendgrid.com
2. Ücretsiz hesap oluştur (100 email/day free)
3. **Settings** → **API Keys** → Create API Key
4. API key'i kopyala

`.env` dosyasına:
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your-sendgrid-api-key
FROM_EMAIL=noreply@cssberlin.de
```

---

## 🧪 Test Etme

### 1. Demo Kullanıcı (Backend built-in)

```
Email: demo@cssberlin.de
Password: demo123
```

### 2. Yeni Kullanıcı Kaydı

1. Frontend'i aç: http://localhost:5500
2. **Anmelden** → **Registrieren**
3. Form doldur:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Password Confirm: password123
4. **Registrieren** tıkla

### 3. Google Login

1. **Anmelden** butonuna tıkla
2. **Mit Google anmelden**
3. Google hesabınızı seçin
4. İzinleri onaylayın
5. Otomatik yönlendirileceksiniz

### 4. Magic Link

1. **Anmelden** butonuna tıkla
2. Email adresinizi girin
3. **Mit Magic Link anmelden**
4. Email'inizi kontrol edin (spam'e bakın!)
5. Link'e tıklayın
6. Otomatik giriş yapılacak

---

## 🔄 Frontend Integration

Auth token'ı localStorage'da saklayın:

```javascript
// Login başarılı olunca
localStorage.setItem('cssberlin_user', JSON.stringify({
    email: 'user@example.com',
    name: 'John Doe',
    token: 'jwt-token-here'
}));

// Token'ı API isteklerinde kullan
fetch('http://localhost:8000/api/products', {
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

// Logout
localStorage.removeItem('cssberlin_user');
```

---

## 📊 Database

Backend otomatik olarak SQLite database oluşturur:

```
backend/cssberlin.db
```

**Tables:**
- `users` - Kullanıcı bilgileri
- `products` - Ürünler
- `offers` - Teklifler
- `payments` - Ödemeler

Database'i görmek için:
```bash
sqlite3 backend/cssberlin.db
.tables
SELECT * FROM users;
```

---

## 🚨 Troubleshooting

### Backend başlamıyor?

```bash
# Dependencies eksik olabilir
pip install -r requirements.txt

# Port kullanımda olabilir
lsof -i :8000
kill -9 <PID>
```

### Google OAuth çalışmıyor?

1. Redirect URI'ları kontrol edin
2. Authorized origins'i kontrol edin
3. OAuth consent screen'i **External** → **Production** yap
4. Test users ekleyin (development modunda)

### Magic Link email gelmiyor?

1. Spam'e bakın
2. SMTP credentials'ı kontrol edin
3. Backend console'da email link'i göreceksiniz (dev mode)

### CORS hatası?

`backend/main.py` → `origins` listesine frontend URL'inizi ekleyin:

```python
origins = [
    "http://localhost:5500",  # ← Sizin frontend URL'niz
    ...
]
```

---

## 📝 Next Steps

1. ✅ Backend'i çalıştır
2. ✅ `.env` dosyasını yapılandır
3. ✅ Google OAuth credentials al
4. ✅ Email (SMTP) ayarla
5. ⏳ Production'a deploy et (Cloudflare Pages + Railway/Render)
6. ⏳ Custom email domain (SendGrid verified sender)
7. ⏳ SSL certificates (production için)

---

## 🔒 Güvenlik Notları

**Production'da MUTLAKA değiştirin:**
- ✅ `SECRET_KEY` - Rastgele 32+ karakter
- ✅ `GOOGLE_CLIENT_SECRET` - Asla commit etmeyin
- ✅ `SMTP_PASSWORD` - App password veya SendGrid key
- ✅ HTTPS kullanın (HTTP değil)
- ✅ Rate limiting ekleyin (brute force için)

**Asla GitHub'a commit etmeyin:**
```
.env
*.db
__pycache__/
venv/
```

---

## 📞 Destek

Sorun mu var? Şunları kontrol edin:
- Backend logs: Terminal'de hata mesajları
- Browser console: Network tab
- API Docs: http://localhost:8000/docs

---

**🎉 Auth sisteminiz hazır! Başarılar!**
