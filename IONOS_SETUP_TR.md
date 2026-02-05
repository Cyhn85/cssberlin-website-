# 🔐 IONOS Email Şifrelerini Alma Rehberi

## 📧 Mevcut Email Adresleri

Senin görselden:
- ✅ `magic@cssberlin.de` → cyhnsrgc@gmail.com (+1)
- ✅ `info@cssberlin.de` → noreply@cssberlin.de (ceyhuns.sorguc@gmail.com)

---

## 🔑 Adım 1: IONOS Dashboard'a Giriş

1. **Tarayıcıda aç:** https://login.ionos.de
2. **Login bilgilerin ile giriş yap**
3. Ana dashboard açılacak

---

## 📨 Adım 2: Email Şifrelerini Al

### Option A: IONOS Control Panel

1. Dashboard'da **"Email & Office"** veya **"E-Mail"** bölümüne git
2. **"Email Accounts"** veya **"E-Mail-Konten"** seç
3. Email listesinde **`magic@cssberlin.de`** bul
4. Yanındaki **⚙️ Ayarlar** veya **"Bearbeiten"** (Edit) tıkla
5. **"Passwort anzeigen"** (Show Password) veya **"Neues Passwort"** (New Password)
6. Şifreyi kopyala → Not defterine yapıştır
7. Aynı işlemi **`info@cssberlin.de`** için tekrarla

### Option B: Webmail Üzerinden

1. https://webmail.ionos.de adresine git
2. `magic@cssberlin.de` ile login yap
3. Ayarlar → Güvenlik → Uygulama Şifresi Oluştur
4. "CSS Berlin Backend" adında uygulama şifresi oluştur
5. Kopyala

**NOT:** Eğer şifreleri bilmiyorsan, yeni şifre oluşturman gerekebilir.

---

## 🔧 Adım 3: Backend .env Dosyası Oluştur

Kopyala ve düzenle:

```env
# ═══════════════════════════════════════════════════════════════
# CSS Berlin Backend Environment Variables
# ═══════════════════════════════════════════════════════════════

# ─── JWT Secret Key ─────────────────────────────────────────
SECRET_KEY=super_secret_key_css_berlin_2026_change_this_in_production

# ─── Frontend & Backend URLs ────────────────────────────────
FRONTEND_URL=http://localhost:5500
BACKEND_URL=http://localhost:8000

# ─── Google OAuth 2.0 ───────────────────────────────────────
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# ─── Email (IONOS SMTP) ─────────────────────────────────────
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587

# Magic Link & Password Reset → magic@cssberlin.de
SMTP_USER_MAGIC=magic@cssberlin.de
SMTP_PASSWORD_MAGIC=BURAYA_MAGIC_EMAIL_SIFRESINI_YAZ
FROM_EMAIL_MAGIC=magic@cssberlin.de

# General Info & Notifications → info@cssberlin.de
SMTP_USER_INFO=info@cssberlin.de
SMTP_PASSWORD_INFO=BURAYA_INFO_EMAIL_SIFRESINI_YAZ
FROM_EMAIL_INFO=info@cssberlin.de

# Default sender (Magic Link için)
SMTP_USER=magic@cssberlin.de
SMTP_PASSWORD=BURAYA_MAGIC_EMAIL_SIFRESINI_YAZ
FROM_EMAIL=magic@cssberlin.de

# ⚠️ ÖNEMLİ: Gerçek email göndermek için false yap
EMAIL_DEV_MODE=false

# ─── Database ───────────────────────────────────────────────
DATABASE_URL=sqlite+aiosqlite:///./cssberlin.db

# ─── Stripe Payment (Optional) ──────────────────────────────
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
```

---

## 💾 Adım 4: .env Dosyasını Kaydet

1. Yukarıdaki içeriği kopyala
2. `C:\Users\cyhnsrgc\Desktop\CSSberlin\backend\.env` dosyası oluştur
3. İçeriği yapıştır
4. **BURAYA_MAGIC_EMAIL_SIFRESINI_YAZ** kısmını IONOS'tan aldığın şifre ile değiştir
5. **BURAYA_INFO_EMAIL_SIFRESINI_YAZ** kısmını IONOS'tan aldığın şifre ile değiştir
6. **EMAIL_DEV_MODE=false** yap (gerçek email gönderecek)
7. Kaydet

---

## 🧪 Adım 5: Test Et

### Backend'i Yeniden Başlat

```bash
cd C:\Users\cyhnsrgc\Desktop\CSSberlin\backend
python -m uvicorn main:app --reload
```

### Magic Link Test

Frontend'de:
1. **Anmelden** tıkla
2. **Magic Link** sekmesi
3. Email gir: `cyhnsrgc@gmail.com`
4. **MAGIC LINK SENDEN** tıkla
5. Gmail kutunu kontrol et!

**Beklenen:** `magic@cssberlin.de`'den email gelecek!

### Console Test (Alternatif)

```bash
curl -X POST http://localhost:8000/api/auth/magic-link \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"cyhnsrgc@gmail.com\"}"
```

---

## ❓ Sorun Giderme

### Problem 1: "SMTPAuthenticationError"

**Sebep:** Şifre yanlış
**Çözüm:**
1. IONOS'tan şifreyi tekrar al
2. Boşluk, özel karakter varsa tırnak içine al:
   ```env
   SMTP_PASSWORD_MAGIC="şifre-burada-123!"
   ```

### Problem 2: "Connection refused"

**Sebep:** SMTP sunucusu yanlış
**Çözüm:** `SMTP_HOST=smtp.ionos.de` olduğundan emin ol

### Problem 3: Email spam'e düşüyor

**Sebep:** SPF/DKIM kayıtları
**Çözüm:**
1. IONOS DNS ayarlarını kontrol et
2. SPF record: `v=spf1 include:_spf.ionos.de ~all`
3. DKIM aktif mi kontrol et

### Problem 4: Hala console'a yazdırıyor, email gitmiyor

**Sebep:** `EMAIL_DEV_MODE=true`
**Çözüm:** `.env` dosyasında `EMAIL_DEV_MODE=false` yap ve backend'i restart et

---

## ✅ Başarı Kontrolü

Email gönderimi başarılı ise:

1. ✅ Gmail'de `magic@cssberlin.de`'den email geldi
2. ✅ Email subject: "🔐 Dein Magic Link für CSS Berlin"
3. ✅ Email içinde "Jetzt anmelden" butonu var
4. ✅ Link tıklanınca otomatik login oluyor

---

## 🚀 Production (Railway) için

Aynı env vars'ı Railway dashboard'a ekle:

```env
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587
SMTP_USER_MAGIC=magic@cssberlin.de
SMTP_PASSWORD_MAGIC=<IONOS_SIFRE>
SMTP_USER_INFO=info@cssberlin.de
SMTP_PASSWORD_INFO=<IONOS_SIFRE>
SMTP_USER=magic@cssberlin.de
SMTP_PASSWORD=<IONOS_SIFRE>
FROM_EMAIL=magic@cssberlin.de
EMAIL_DEV_MODE=false
FRONTEND_URL=https://cssberlin.de
```

---

## 📞 İletişim

**Sorun devam ederse:**
1. IONOS Destek: https://www.ionos.de/hilfe/
2. Backend console loglarını kontrol et
3. `.env` dosyasındaki şifreleri tekrar kontrol et

---

**Son Güncelleme:** 2026-02-05
**Durum:** ⏳ IONOS şifreleri bekleniyor
