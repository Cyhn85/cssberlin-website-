# 🚀 CSS Berlin - Nasıl Çalıştırılır

## ⚡ Hızlı Başlangıç

### 1. Backend'i Başlat

Çift tıkla: **`START_BACKEND.bat`**

Veya manuel olarak:
```bash
cd backend
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

✅ **Backend çalışıyor!** → http://localhost:8000
📚 **API Docs** → http://localhost:8000/docs

### 2. Frontend'i Aç

**index.html** dosyasını tarayıcıda aç veya:
- Live Server extension kullan (VSCode)
- Python HTTP server: `python -m http.server 5500`
- Direkt dosyayı aç: `index.html` (sağ tık → Open with Chrome)

---

## 🧪 Login Sistemini Test Et

### Test 1: Email/Password ile Kayıt

1. **Anmelden** butonuna tıkla
2. **Register** sekmesine geç
3. Bilgileri gir:
   - İsim: `Test User`
   - Email: `test@cssberlin.de`
   - Şifre: `test1234`
4. **Konto erstellen** tıkla
5. ✅ Başarılı! Sayfayı yenile → "Anmelden" → "👤 Test"

### Test 2: Magic Link

1. **Anmelden** → **Magic Link** sekmesi
2. Email gir: `magic@cssberlin.de`
3. **MAGIC LINK SENDEN** tıkla
4. ✅ Backend console'da magic link göreceksiniz!

**Console'da şuna benzer görünecek:**
```
============================================================
[DEV MODE] Magic Link Email
To: magic@cssberlin.de
Link: http://localhost:5500/magic-login?token=...
============================================================
```

5. Bu linki kopyala ve tarayıcıda aç → Otomatik giriş!

### Test 3: Şifremi Unuttum

1. **Anmelden** → "Passwort vergessen?" linki
2. Email gir ve **Reset-Link Senden** tıkla
3. Console'da reset linki göreceksiniz
4. Linki aç → Yeni şifre belirle → Başarılı!

---

## 📝 Gerekli Kurulum (İlk Kez)

Backend dependencies:
```bash
cd backend
pip install fastapi uvicorn sqlalchemy aiosqlite python-jose passlib python-multipart authlib itsdangerous
```

---

## 🎯 Önemli Notlar

### Backend MUTLAKA Çalışmalı!
- Frontend'in login, register, magic link özellikleri backend'e ihtiyaç duyar
- Eğer "Failed to fetch" hatası görüyorsanız → Backend'i başlatın!

### CORS Ayarları
Backend zaten `http://localhost:5500` ve `file://` için CORS açık.

### Email Gönderimi
**DEV MODE:** Email console'a yazdırılır (gerçek email gitmez)

**Production için:** `.env` dosyasına SMTP bilgileri ekleyin:
```
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@cssberlin.de
```

---

## 🔥 Production Deploy

### Backend (Railway/Render):
1. GitHub'a push et (✅ Zaten yapıldı!)
2. Railway/Render'a bağla
3. Environment variables ekle:
   ```
   SECRET_KEY=super_secret_key_2026
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-secret
   SMTP_USER=your-email
   SMTP_PASSWORD=your-password
   FRONTEND_URL=https://cssberlin.pages.dev
   ```

### Frontend (Cloudflare Pages):
1. GitHub'a push et ✅
2. Cloudflare Pages'e bağla
3. Build: None (static HTML)
4. Output directory: `/`

---

## 🎉 Tamamlandı!

**✅ Login Sistemi:**
- Email/Password ✓
- Magic Link ✓
- Şifremi Unuttum ✓
- Google OAuth (production'da) ✓
- Apple Sign In (yakında) ✓

**✅ Session Management:**
- JWT Token ✓
- LocalStorage ✓
- 7 gün persistent ✓
- Auto-login after OAuth ✓

**✅ UI/UX:**
- 520px büyütülmüş modal ✓
- 56px büyük social icons ✓
- Toast notifications ✓
- Error handling ✓

---

## 🆘 Sorun Çözüm

**"Failed to fetch" hatası:**
→ Backend'i başlat: `START_BACKEND.bat`

**"No module named authlib" hatası:**
→ `pip install authlib itsdangerous`

**Database hatası:**
→ `backend/cssberlin.db` dosyasını sil, backend tekrar başlat

**CORS hatası:**
→ Backend zaten localhost:5500 için açık, farklı port kullanıyorsanız `main.py`'de CORS'a ekleyin

---

🚀 **İyi çalışmalar!**
