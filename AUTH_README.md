# 🔐 CSS Berlin - Authentication System

## 🎯 Sistem Durumu

✅ **Backend**: Running on `http://localhost:8000`  
✅ **Database**: SQLite (`cssberlin.db`) - OAuth support added  
✅ **Frontend Modal**: Auth Modal v3 integrated  
✅ **API Integration**: Fully functional  
⚠️ **Google OAuth**: Credentials needed (see setup guide)  
⏳ **SMTP Email**: Optional (dev mode active)

---

## 🚀 Hızlı Başlangıç

### 1. Backend'i Başlat

```bash
cd backend
python main.py
```

Backend `http://localhost:8000` adresinde çalışacak.

### 2. Frontend'i Test Et

Tarayıcınızda açın:
- **Ana Sayfa**: `http://localhost:5500/index.html`
- **Test Sayfası**: `http://localhost:5500/test-auth.html`

### 3. Auth Modal'ı Kullan

```javascript
// Login modal
window.authModalV3.open('login');

// Register modal
window.authModalV3.open('register');

// Magic Link modal
window.authModalV3.open('magiclink');

// Forgot Password modal
window.authModalV3.open('forgot');
```

---

## 📋 Önemli Dosyalar

### Backend
- `backend/main.py` - FastAPI application entry
- `backend/auth.py` - Standard authentication (login/register)
- `backend/auth_oauth.py` - OAuth & Magic Link
- `backend/models.py` - User model with OAuth support
- `backend/.env` - Environment variables **[YENİ: Güncellendi]**

### Frontend
- `auth-modal-v3.js` - Authentication modal (login/register/magic/forgot)
- `auth-modal-v3.css` - Modal styles
- `api-config.js` - API base URL configuration
- `test-auth.html` - **[YENİ]** Test sayfası

### Belgeler
- `AUTH_IMPLEMENTATION_SUMMARY.md` - **[YENİ]** Detaylı implementation özeti
- `GOOGLE_OAUTH_SETUP.md` - **[YENİ]** Google OAuth setup rehberi

---

## 🔑 Google OAuth Setup (5 dakika)

### Adım 1: Google Cloud Console
1. [Google Cloud Console](https://console.cloud.google.com/) → Yeni proje oluştur
2. **APIs & Services** → **OAuth consent screen**
3. External seç → App bilgilerini doldur

### Adım 2: Credentials Oluştur
1. **Credentials** → **+ CREATE CREDENTIALS** → **OAuth client ID**
2.Application type: **Web application**
3. **Authorized redirect URIs** ekle:
   ```
   http://localhost:8000/api/auth/google/callback
   ```
4. **CREATE** → Client ID ve Secret kopyala

### Adım 3: .env Dosyasını Güncelle
```bash
nano backend/.env
```

Şu satırları bul ve güncelle:
```bash
GOOGLE_CLIENT_ID=YOUR_ACTUAL_CLIENT_ID_HERE.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_ACTUAL_SECRET_HERE
```

### Adım 4: Backend'i Yeniden Başlat
```bash
cd backend
# CTRL+C ile durdur
python main.py
```

**Detaylı rehber**: `GOOGLE_OAUTH_SETUP.md` dosyasını okuyun.

---

## 🧪 Test Senaryoları

### Senaryo 1: Normal Kayıt ve Giriş
1. `test-auth.html` sayfasını aç
2. **Register Modal** butonuna tıkla
3. Ad, email, şifre gir
4. Kayıt ol
5. Otomatik giriş yap ✅

### Senaryo 2: Email + Password Login
1. **Login Modal** butonuna tıkla
2. Demo credentials kullan:
   - Email: `demo@cssberlin.de`
   - Password: `demo123`
3. Giriş yap ✅

### Senaryo 3: Google OAuth (credentials ekledikten sonra)
1. **Login Modal** aç
2. Google icon'una tıkla
3. Google hesabınla giriş yap
4. Backend'e callback oluşur
5. Otomatik giriş yap ✅

### Senaryo 4: Magic Link (Passwordless)
1 **Magic Link Modal** aç
2. Email adresini gir
3. **Dev Mode**: Console'da link görüntülenecek
4. Link'i kopyalayıp tarayıcıda aç
5. Otomatik giriş yap ✅

### Senaryo 5: Forgot Password
1. **Login Modal** → "Passwort vergessen?"
2. Email gir
3. **Dev Mode**: Console'da reset link görüntülenecek
4. Link'i aç → Yeni şifre belirle
5. Yeni şifre ile giriş yap ✅

---

## 🌐 API Endpoints

### Auth Endpoints
```
POST   /api/auth/register              # Kayıt
POST   /api/auth/login                 # Giriş
GET    /api/auth/me                    # Kullanıcı bilgisi
POST   /api/auth/token                 # OAuth2 token

# Google OAuth
GET    /api/auth/google                # Google login başlat
GET    /api/auth/google/callback       # Google callback

# Magic Link
POST   /api/auth/magic-link            # Magic link gönder
GET    /api/auth/magic-link/verify     # Magic link doğrula

# Password Reset
POST   /api/auth/forgot-password       # Reset link gönder
POST   /api/auth/reset-password        # Şifreyi sıfırla

# Health Check
GET    /health                         # Backend status
```

**API Docs**: `http://localhost:8000/docs` (Swagger UI)

---

## 🎨 Frontend Entegrasyonu

### index.html'de Modal Açma

```html
<!-- Header'da Anmelden butonu -->
<button onclick="window.authModalV3.open('login')">Anmelden</button>

<!-- Registrieren butonu -->
<button onclick="window.authModalV3.open('register')">Registrieren</button>
```

### JavaScript'ten Modal Açma

```javascript
// Giriş modalı
window.authModalV3.open('login');

// Kayıt modalı
window.authModalV3.open('register');

// Magic Link
window.authModalV3.open('magiclink');

// Şifre unutma
window.authModalV3.open('forgot');
```

### Token Yönetimi

Başarılı giriş sonrası:
```javascript
// Token localStorage'a kaydedilir
localStorage.getItem('auth_token')

// User bilgisi
localStorage.getItem('css_user')
```

Çıkış:
```javascript
localStorage.removeItem('auth_token');
localStorage.removeItem('css_user');
window.location.reload();
```

---

## 📂 Database Schema

### Users Tablosu (Updated)

```python
class User(Base):  
    id: int
    email: str (unique)
    hashed_password: str
    first_name: str
    last_name: str
    is_active: bool
    is_verified: bool
    
    # NEW: OAuth fields
    oauth_provider: str  # 'google', 'apple', 'magic_link', None
    profile_picture: str # Profile photo URL
    
    created_at: datetime
    updated_at: datetime
```

---

## 🔒 Güvenlik

✅ **Password Hashing**: bcrypt  
✅ **JWT Tokens**: HS256, 7 gün geçerli  
✅ **CORS**: Sadece belirlenen origins  
✅ **Token Expiry**: Magic link 15dk, Reset link 30dk  
✅ **SQL Injection**: SQLAlchemy ORM  
✅ **XSS Protection**: Input validation  

---

## 🐛 Troubleshooting

### Backend başlamıyor
```bash
# Dependencies eksik
pip install -r requirements.txt

# Port zaten kullanımda
lsof -ti:8000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :8000   # Windows
```

### CORS Hatası
`.env` dosyasında `FRONTEND_URL` kontrol edin:
```bash
FRONTEND_URL=http://localhost:5500
```

### Google OAuth Çalışmıyor
1. Client ID ve Secret doğru mu?
2. Redirect URI backend'de ayarlı mı?
3. Test users listesinde email var mı?

### Magic Link Email Gelmiyor
**Normal!** Dev mode'da email göndermiyor.
Console'da (F12) linki görebilirsiniz.

SMTP production için gerekli - `.env` dosyasında yapılandırın.

---

## 📊 Environment Variables

### Backend .env

```bash
# Required
SECRET_KEY=css_berlin_super_secret_key_2026_production_ready
DATABASE_URL=sqlite+aiosqlite:///./cssberlin.db
ENVIRONMENT=development

# URLs
FRONTEND_URL=http://localhost:5500
BACKEND_URL=http://localhost:8000

# Google OAuth (TODO: Add your credentials)
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret

# SMTP (Optional - for production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_EMAIL=noreply@cssberlin.de
```

---

## 🚢 Production Deployment

### Backend (Railway/Render)
1. PostgreSQL database ekle
2. Environment variables ayarla
3. Google OAuth redirect URI güncelle:
   ```
   https://api.cssberlin.de/api/auth/google/callback
   ```
4. SMTP ayarla (Gmail App Password)
5. HTTPS zorunlu!

### Frontend
1. `api-config.js` production URL'e güncelle:
   ```javascript
   BASE_URL: 'https://api.cssberlin.de'
   ```
2. Google OAuth Client ID production version kullan

---

## 📞 Demo Credentials

```
Email: demo@cssberlin.de
Password: demo123
```

Backend ilk başlatıldığında otomatik oluşturulur.

---

## 📚 Daha Fazla Bilgi

- **Implementation Summary**: `AUTH_IMPLEMENTATION_SUMMARY.md`
- **Google OAuth Setup**: `GOOGLE_OAUTH_SETUP.md`
- **FastAPI Docs**: `http://localhost:8000/docs`
- **Backend README**: `backend/README.md`

---

## ✅ Checklist

- [x] Backend çalışıyor (`http://localhost:8000`)
- [x] Database tabloları oluşturuldu
- [x] Auth Modal v3 entegre edildi
- [x] API bağlantısı test edildi
- [ ] Google OAuth credentials eklendi
- [ ] Production deployment yapıldı
- [ ] SMTP email servisi ayarlandı

---

## 🎉 Sonuç

Login sistemi **hazır ve çalışıyor**! 

Google OAuth için sadece credentials eklenmesi gerekiyor.

**Test için**: `http://localhost:5500/test-auth.html`

---

**Hazırlayan**: Antigravity AI  
**Tarih**: 2026-02-05  
**Version**: 3.0.0
