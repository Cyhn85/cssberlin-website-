# 🚀 GOOGLE OAUTH SETUP - STEP BY STEP (5 MIN)

## 📋 HIZLI BAŞLANGIÇ

### 1️⃣ Google Cloud Console'a Git
🔗 **URL**: https://console.cloud.google.com/

### 2️⃣ Yeni Proje Oluştur
1. Sol üstteki **"Select a project"** dropdown'ı tıkla
2. **"NEW PROJECT"** butonuna tıkla
3. **Project Name**: `CSS Berlin Auth`
4. **CREATE** butonuna tıkla
5. Proje oluşturulunca, projeyi seç (dropdown'dan)

### 3️⃣ OAuth Consent Screen Ayarla
1. Sol menüden **"APIs & Services"** → **"OAuth consent screen"**
2. **External** seçeneğini seç
3. **CREATE** butonuna tıkla
4. Formu doldur:
   - **App name**: `CSS Berlin`
   - **User support email**: Kendi email'in
   - **Developer contact information**: Kendi email'in
5. **SAVE AND CONTINUE**
6. **Scopes** sayfasında:
   - **ADD OR REMOVE SCOPES** tıkla
   - Şunları seç:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
   - **UPDATE**
   - **SAVE AND CONTINUE**
7. **Test users** sayfasında:
   - **+ ADD USERS**
   - Kendi email adresini ekle (Google ile test için)
   - **ADD**
   - **SAVE AND CONTINUE**
8. **Summary** sayfasında **BACK TO DASHBOARD**

### 4️⃣ OAuth Client ID Oluştur
1. Sol menüden **"APIs & Services"** → **"Credentials"**
2. Üstteki **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. **Application type**: `Web application`
4. **Name**: `CSS Berlin Web App`
5. **Authorized JavaScript origins** ekle:
   ```
   http://localhost:5500
   http://127.0.0.1:5500
   http://localhost:8000
   ```
   Her birini **+ ADD URI** ile tek tek ekle

6. **Authorized redirect URIs** ekle:
   ```
   http://localhost:8000/api/auth/google/callback
   ```
   **+ ADD URI** ile ekle

7. **CREATE** butonuna tıkla

### 5️⃣ Credentials Kopyala
Bir popup açılacak:
- **Your Client ID**: `1234567890-abcdefgh.apps.googleusercontent.com`
- **Your Client Secret**: `GOCSPX-xxxxxxxxxxxxxxxx`

✅ **Bu bilgileri kopyala ve bir yere yapıştır!**

---

## 🔧 .ENV DOSYASINI GÜNCELLE

### Dosyayı Aç
```bash
C:\Users\cyhnsrgc\Desktop\CSSberlin\.env
```

### Şu Satırları Güncelle (Satır 25-26)
```bash
# ÖNCE (placeholder):
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# SONRA (gerçek credentials):
GOOGLE_CLIENT_ID=1234567890-abcdefgh.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxx
```

### Kaydet (CTRL+S)

---

## 🔄 BACKEND'İ YENİDEN BAŞLAT

### Terminal'de:
1. Backend terminaline git
2. **CTRL+C** ile durdur
3. Tekrar başlat:
   ```bash
   cd backend
   python main.py
   ```

---

## ✅ TEST ET

### 1. Frontend'i Aç
```
http://localhost:5500/test-auth.html
```

### 2. "Login Modal" Butonuna Tıkla

### 3. Google Icon'una Tıkla

### 4. Beklenecek Davranış:
1. Google login sayfası açılmalı
2. Hesabını seç
3. "CSS Berlin wants to access your Google Account" izin ver
4. Geri yönlendirileceksin → `http://localhost:5500/?auth_token=xxx&user_name=xxx`
5. Sayfa yenilecek ve giriş yapmış olacaksın! ✅

---

## 🐛 SORUN GİDERME

### "Access blocked: Authorization Error"
**Çözüm**: OAuth consent screen'de **Test users** listesine email'ini ekle

### "redirect_uri_mismatch"
**Çözüm**: 
1. Google Cloud Console → Credentials
2. OAuth 2.0 Client ID'yi aç
3. Authorized redirect URIs'e tam olarak şunu ekle:
   ```
   http://localhost:8000/api/auth/google/callback
   ```

### "Google OAuth not configured"
**Çözüm**: `.env` dosyasında credentials'ı doğru yazdığına emin ol ve backend'i restart et

---

## 📸 SCREENSHOTS (Yardımcı Olur)

### OAuth Consent Screen
- User Type: **External** ✅
- App name: `CSS Berlin`
- Scopes: `userinfo.email`, `userinfo.profile`
- Test users: Kendi email'in ekli

### Credentials
- Type: **OAuth 2.0 Client ID**
- Application type: **Web application**
- Authorized JavaScript origins: `http://localhost:5500`, `http://localhost:8000`
- Authorized redirect URIs: `http://localhost:8000/api/auth/google/callback`

---

## ⏱️ TOPLAM SÜRE: 5-7 DAKİKA

Tek seferde yapılır, sonsuza kadar çalışır! 🎉

---

**SON ADIM**: Credentials aldığında bana söyle, `.env` dosyasını güncelleyelim!
