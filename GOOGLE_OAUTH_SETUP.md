# 🔐 Google OAuth Setup Guide - CSS Berlin

## Google OAuth Credentials Edinme

### 1. Google Cloud Console'a Giriş
1. [Google Cloud Console](https://console.cloud.google.com/) adresine gidin
2. Google hesabınızla giriş yapın

### 2. Yeni Proje Oluştur
1. Sol üst köşedeki proje seçiciyi tıklayın
2. "NEW PROJECT" (Yeni Proje) butonuna tıklayın
3. Proje adı: `CSS Berlin Auth`
4. "CREATE" (Oluştur) butonuna tıklayın

### 3. OAuth Consent Screen Yapılandırma
1. Sol menüden **APIs & Services** > **OAuth consent screen** seçin
2. **External** (Harici) seçin ve "CREATE" butonuna tıklayın
3. Aşağıdaki bilgileri doldurun:
   - **App name**: CSS Berlin
   - **User support email**: Kendi email adresiniz
   - **Developer contact information**: Kendi email adresiniz
4. "SAVE AND CONTINUE" butonuna tıklayın
5. **Scopes** sayfasında "SAVE AND CONTINUE" yapın
6. **Test users** sayfasında kendi email'inizi ekleyin
7. "SAVE AND CONTINUE" yapın

### 4. OAuth Client ID Oluştur
1. Sol menüden **APIs & Services** > **Credentials** seçin
2. Üst menüden "+ CREATE CREDENTIALS" > **OAuth client ID** seçin
3. **Application type**: Web application
4. **Name**: CSS Berlin Web App
5. **Authorized JavaScript origins** ekleyin:
   ```
   http://localhost:5500
   http://127.0.0.1:5500
   https://www.cssberlin.de
   https://cssberlin.de
   ```
6. **Authorized redirect URIs** ekleyin:
   ```
   http://localhost:8000/api/auth/google/callback
   https://api.cssberlin.de/api/auth/google/callback
   ```
7. "CREATE" butonuna tıklayın

### 5. Credentials'ı Kopyala
Oluşturulduktan sonra bir popup açılacak:
- **Your Client ID**: `123456789-abcdefg.apps.googleusercontent.com`
- **Your Client Secret**: `GOCSPX-xxxxxxxxxxxxxxxx`

Bu bilgileri güvenli bir yere kopyalayın.

### 6. .env Dosyasını Güncelle
`backend/.env` dosyasını açın ve şu satırları güncelleyin:

```bash
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxx
```

### 7. Backend'i Yeniden Başlat
```bash
cd backend
python main.py
```

## ✅ Test Etme

1. `test-auth.html` dosyasını tarayıcıda açın
2. "Login Modal" butonuna tıklayın
3. Google ikonu ile giriş yapmayı deneyin
4. Google hesabınızla giriş yapın
5. Başarılı olursa ana sayfaya yönlendirileceksiniz

## 🔒 Güvenlik Notları

- **Client Secret**'ı asla GitHub'a pushlama
- `.env` dosyası zaten `.gitignore` içinde
- Production'da mutlaka HTTPS kullan
- Test users listesine sadece güvendiğiniz kişileri ekle

## 🐛 Sorun Giderme

### "Access blocked: Authorization Error"
- OAuth consent screen'i tamamladığınızdan emin olun
- Test users listesine email'inizi ekleyin

### "Redirect URI mismatch"
- Authorized redirect URIs listesini kontrol edin
- Backend URL'in doğru olduğundan emin olun
- Callback URL: `http://localhost:8000/api/auth/google/callback`

### CORS Error
- `backend/main.py` içinde origins listesine frontend URL'ini ekleyin
- Backend'in çalıştığından emin olun

## 📱 Apple Sign In (İsteğe Bağlı)

Apple Sign In için:
1. [Apple Developer](https://developer.apple.com/) hesabı gerekli (paid)
2. App ID oluştur
3. Services ID (Sign In with Apple) yapılandır
4. Keys oluştur ve indir
5. `.env` dosyasına credentials ekle

---

**💡 İpucu**: Development için Google OAuth yeterli. Apple Sign In production'da eklenebilir.
