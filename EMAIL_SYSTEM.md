# 📧 CSS Berlin — Email System Documentation

## 🎯 Email Görev Dağılımı (IONOS)

### 1. **magic@cssberlin.de** 🔐
**Görev:** Güvenlik & Kimlik Doğrulama
**Kullanım Alanları:**
- ✅ Magic Link (Şifresiz Giriş)
- ✅ Şifre Sıfırlama (Password Reset)
- ✅ Email Verification
- ✅ 2FA Kodları (gelecekte)

**Sebep:** Güvenlik kritik emailler ayrı bir adres üzerinden gönderilmeli.

---

### 2. **info@cssberlin.de** ℹ️
**Görev:** Genel Bilgilendirme & İletişim
**Kullanım Alanları:**
- ✅ Hoşgeldin Emaili (Welcome Email)
- ✅ Sipariş Onayı (Order Confirmation)
- ✅ Kargo Bildirimleri (Shipping Updates)
- ✅ Genel Duyurular
- ✅ Müşteri Destek İletişimi

**Sebep:** Marketing ve bilgilendirme emaillerini magic link'lerden ayırarak kullanıcı deneyimini iyileştirmek.

---

## 📂 Dosya Yapısı

```
backend/
├── email_service.py          # 🆕 Email gönderim servisi
├── auth_oauth.py              # Magic Link & Password Reset (magic@cssberlin.de kullanıyor)
├── .env.example               # IONOS SMTP configuration
└── .env                       # (local) Gerçek SMTP credentials
```

---

## 🔧 Backend Kurulum

### 1. Environment Variables (`.env`)

IONOS SMTP bilgilerini `.env` dosyasına ekleyin:

```env
# ─── Email (IONOS SMTP) ────────────────────────────────────
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587

# Magic Link & Password Reset
SMTP_USER_MAGIC=magic@cssberlin.de
SMTP_PASSWORD_MAGIC=your-magic-password
FROM_EMAIL_MAGIC=magic@cssberlin.de

# General Info & Notifications
SMTP_USER_INFO=info@cssberlin.de
SMTP_PASSWORD_INFO=your-info-password
FROM_EMAIL_INFO=info@cssberlin.de

# Default sender (Magic Link için)
SMTP_USER=magic@cssberlin.de
SMTP_PASSWORD=your-magic-password
FROM_EMAIL=magic@cssberlin.de

# Frontend URL
FRONTEND_URL=https://cssberlin.de

# DEV MODE: Console'a yazdır (production'da false)
EMAIL_DEV_MODE=true
```

### 2. IONOS Email Şifreleri

IONOS Dashboard'dan email hesaplarınızın şifrelerini alın:
1. https://login.ionos.de → Login
2. Email & Office → Email hesaplarınız
3. `magic@cssberlin.de` → Şifre görüntüle/değiştir
4. `info@cssberlin.de` → Şifre görüntüle/değiştir

---

## 📨 Email Service API

### `email_service.py` Fonksiyonları

#### 1. **Magic Link Email** 🔐

```python
from email_service import send_magic_link_email

send_magic_link_email(
    to_email="user@example.com",
    magic_link="https://cssberlin.de/magic-login?token=...",
    user_name="Max"  # Optional
)
```

**Gönderen:** `magic@cssberlin.de`
**Konu:** "🔐 Dein Magic Link für CSS Berlin"
**Geçerlilik:** 15 dakika

---

#### 2. **Password Reset Email** 🔑

```python
from email_service import send_password_reset_email

send_password_reset_email(
    to_email="user@example.com",
    reset_link="https://cssberlin.de/reset-password?token=...",
    user_name="Max"  # Optional
)
```

**Gönderen:** `magic@cssberlin.de`
**Konu:** "🔑 Passwort zurücksetzen — CSS Berlin"
**Geçerlilik:** 30 dakika

---

#### 3. **Welcome Email** 🎉

```python
from email_service import send_welcome_email

send_welcome_email(
    to_email="newuser@example.com",
    user_name="Max"
)
```

**Gönderen:** `info@cssberlin.de`
**Konu:** "🎉 Willkommen bei CSS Berlin!"
**İçerik:** Hoşgeldin mesajı, platform özellikleri, CTA button

---

#### 4. **Order Confirmation Email** ✅

```python
from email_service import send_order_confirmation_email

send_order_confirmation_email(
    to_email="customer@example.com",
    user_name="Max",
    order_id="ORD-12345",
    total=49.99
)
```

**Gönderen:** `info@cssberlin.de`
**Konu:** "✅ Bestellung bestätigt #ORD-12345"
**İçerik:** Sipariş detayları, toplam tutar

---

## 🧪 Development Mode

**DEV MODE Aktif İken:**
- Emailler gerçekten gönderilmez
- Console'a yazdırılır
- SMTP credentials gerekmez

**Aktivasyon:**
```env
EMAIL_DEV_MODE=true
```

**Console Output:**
```
============================================================
📧 [DEV MODE] Email Preview
============================================================
From: magic@cssberlin.de
To: user@example.com
Subject: 🔐 Dein Magic Link für CSS Berlin
------------------------------------------------------------
<!DOCTYPE html>...
============================================================
```

---

## 🚀 Production Deployment

### Railway Environment Variables

Railway dashboard'da şu env vars'ı ekleyin:

```env
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587
SMTP_USER_MAGIC=magic@cssberlin.de
SMTP_PASSWORD_MAGIC=<IONOS_MAGIC_PASSWORD>
FROM_EMAIL_MAGIC=magic@cssberlin.de
SMTP_USER_INFO=info@cssberlin.de
SMTP_PASSWORD_INFO=<IONOS_INFO_PASSWORD>
FROM_EMAIL_INFO=info@cssberlin.de
SMTP_USER=magic@cssberlin.de
SMTP_PASSWORD=<IONOS_MAGIC_PASSWORD>
FROM_EMAIL=magic@cssberlin.de
FRONTEND_URL=https://cssberlin.de
EMAIL_DEV_MODE=false
```

### Test Production Emails

```bash
# Magic Link test
curl -X POST https://cssberlin-backend.up.railway.app/api/auth/magic-link \
  -H "Content-Type: application/json" \
  -d '{"email":"test@cssberlin.de"}'

# Password Reset test
curl -X POST https://cssberlin-backend.up.railway.app/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@cssberlin.de"}'
```

---

## 📊 Email Template Özellikleri

### Modern HTML Design
- ✅ Responsive (mobile-friendly)
- ✅ Gradient header (Orange → Green)
- ✅ Clean typography (Inter font)
- ✅ Professional layout
- ✅ Security warnings
- ✅ Almanca içerik

### Security Best Practices
- ✅ Token expiry times (15-30 dakika)
- ✅ HTTPS links only
- ✅ "Didn't request this?" uyarıları
- ✅ Email'den gönderen bilgisi footer'da

---

## 🔒 Security Notes

### Magic Link Güvenliği
- Token'lar `itsdangerous` ile sign edilir
- 15 dakika sonra expire olur
- Tek kullanımlık (bir kere login → invalid)

### Password Reset Güvenliği
- Token'lar 30 dakika geçerli
- Eski şifre değişene kadar geçerli
- Email'de link kopyalanabilir (accessibility)

### IONOS SMTP Security
- TLS encryption (STARTTLS)
- Port 587 (secure SMTP)
- App-specific passwords önerilir

---

## 📝 Email Content Guidelines

### Magic Link Email
- **Ton:** Güvenlik odaklı, kısa ve net
- **CTA:** "🔓 Jetzt anmelden"
- **Uyarı:** "Falls du diese Email nicht angefordert hast..."

### Password Reset Email
- **Ton:** Güvenlik uyarısı, yardımsever
- **CTA:** "🔑 Neues Passwort erstellen"
- **Uyarı:** "Dein Passwort bleibt unverändert"

### Welcome Email
- **Ton:** Coşkulu, davetkar, bilgilendirici
- **CTA:** "🛍️ Jetzt entdecken"
- **İçerik:** Platform özellikleri, CO₂ tasarrufu

### Order Confirmation
- **Ton:** Profesyonel, teşekkür edici
- **İçerik:** Sipariş numarası, toplam tutar
- **CTA:** "Sipariş detaylarını görüntüle" (opsiyonel)

---

## 🐛 Troubleshooting

### Email Gönderilmiyor

**Problem:** `SMTPAuthenticationError`
**Çözüm:** IONOS şifresini kontrol et, app-specific password kullan

**Problem:** `SMTPConnectError: Connection refused`
**Çözüm:** SMTP_HOST ve PORT doğru mu kontrol et (`smtp.ionos.de:587`)

**Problem:** Email spam'e düşüyor
**Çözüm:**
- IONOS SPF/DKIM records kontrol et
- "From" email verified olmalı
- HTTPS links kullan

### DEV MODE Çalışmıyor

**Problem:** Emailler console'a yazdırılmıyor
**Çözüm:** `EMAIL_DEV_MODE=true` olduğundan emin ol

---

## ✅ Test Checklist

### Local Development
- [ ] DEV_MODE aktif (console output)
- [ ] Magic Link email preview
- [ ] Password Reset email preview
- [ ] Welcome email preview
- [ ] Order confirmation preview

### Production
- [ ] IONOS credentials Railway'de
- [ ] Magic Link gerçek email gönderimi
- [ ] Password Reset gerçek email gönderimi
- [ ] Email spam'e düşmüyor
- [ ] Links doğru çalışıyor (FRONTEND_URL)
- [ ] Token expiry çalışıyor

---

## 📚 Kaynaklar

- **IONOS SMTP Docs:** https://www.ionos.de/hilfe/e-mail/
- **Python smtplib:** https://docs.python.org/3/library/smtplib.html
- **FastAPI Email:** https://fastapi.tiangolo.com/
- **itsdangerous:** https://itsdangerous.palletsprojects.com/

---

**Son Güncelleme:** 2026-02-05
**Durum:** ✅ Production Ready
**Email Servisi:** IONOS (`magic@cssberlin.de` + `info@cssberlin.de`)
