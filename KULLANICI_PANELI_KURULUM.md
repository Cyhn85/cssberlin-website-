# Kullanıcı Paneli & EmailJS Kurulum Rehberi

**Tarih:** 2025-11-08
**Proje:** CSS Berlin Website
**Durum:** ✅ Tamamlandı

---

## 📦 YAPILAN DEĞİŞİKLİKLER

### 1. EmailJS Entegrasyonu

**Dosya:** `auth.js` (Satır 110-117)

**Değişiklik:**
```javascript
// ÖNCE:
await emailjs.send(
    'YOUR_SERVICE_ID',
    'YOUR_TEMPLATE_ID',
    templateParams,
    'YOUR_PUBLIC_KEY'
);

// ŞİMDİ:
await emailjs.send(
    'service_x3phsl7',        // IONOS SMTP Service ID
    'template_icqfar5',       // E-Mail-Verifizierung Template ID
    templateParams,
    'YOUR_PUBLIC_KEY'         // ⚠️ BURAYA PUBLIC KEY EKLENMELİ
);
```

**EmailJS Dashboard Bilgileri:**
- **Service ID:** `service_x3phsl7` ✅
- **Service Name:** IONOS SMTP / SMTP server ✅
- **Host:** smtp.ionos.de ✅
- **Port:** 465 (SSL) ✅
- **User:** noreply@cssberlin.de ✅
- **Template ID:** `template_icqfar5` ✅
- **Template Name:** E-Mail-Verifizierung ✅
- **Public Key:** ⚠️ **EKLENMELİ**

---

### 2. Kullanıcı Paneli (mein-konto.html)

**Yeni Dosya:** `c:\Users\cyhnsrgc\Desktop\CSS-Berlin-Website\mein-konto.html`

**Özellikler:**
- ✅ Modern Material Design dashboard
- ✅ Responsive design (desktop + mobile)
- ✅ Sol sidebar menü
- ✅ İstatistik kartları
- ✅ Hızlı erişim butonları
- ✅ Aktivite geçmişi
- ✅ Admin dashboard linki (sadece admin kullanıcılar için)

**Menü Yapısı:**
```
┌─────────────────────────────┐
│ 📊 Übersicht               │ ← Varsayılan aktif
│ 👤 Mein Profil             │
│ 📦 Bestellungen (0)        │
│ 💬 Nachrichten (0)         │ → messages.html
│ ❤️ Wunschliste (5)         │ → wunschliste.html
│ 🤝 Verhandlungen (0)       │
│ ⚙️ Einstellungen           │
│ ─────────────────────────  │
│ 🔧 Admin Dashboard         │ ← Sadece admin
│ 🚪 Abmelden                │
└─────────────────────────────┘
```

**İstatistik Kartları:**
- 🛒 Bestellungen: 0
- 💬 Nachrichten: 0
- ❤️ Wunschliste: X (dinamik)
- 🤝 Verhandlungen: X (dinamik)

---

### 3. Auth.js Kullanıcı Adı Tıklama Davranışı

**Dosya:** `auth.js` (Satır 544-548)

**Değişiklik:**
```javascript
// ÖNCE:
userBtn.onclick = (e) => {
    e.preventDefault();
    if (confirm('Möchten Sie sich abmelden?')) {
        logout();
    }
};

// ŞİMDİ:
userBtn.onclick = (e) => {
    e.preventDefault();
    window.location.href = 'mein-konto.html';
};
```

**Sonuç:**
- ❌ Eski: Kullanıcı adına tıklayınca direkt çıkış uyarısı
- ✅ Yeni: Kullanıcı adına tıklayınca kullanıcı paneli açılır

---

## ⚠️ YAPILMASI GEREKEN

### EmailJS Public Key Ekleme

**Adımlar:**

1. **EmailJS Dashboard'a giriş yapın:**
   - URL: https://dashboard.emailjs.com/
   - Login: (Email bilgileriniz ile)

2. **Public Key'i bulun:**
   - Sol menüden **"Account"** → **"General"** sekmesi
   - **"Public Key"** bölümünde key'i göreceksiniz
   - Örnek format: `Kx9mP4nL2zQ5V`

3. **auth.js dosyasını güncelleyin:**
   ```javascript
   // Satır 116'yı bulun:
   'YOUR_PUBLIC_KEY'         // ⚠️ TODO: Add Public Key

   // Şununla değiştirin (örnek):
   'Kx9mP4nL2zQ5V'          // EmailJS Public Key
   ```

4. **Kaydedin ve test edin:**
   - Yeni kullanıcı kayıt edin
   - Console'da `✅ Email sent successfully via EmailJS` görmeli
   - E-posta gelmeli (spam klasörünü kontrol edin)

---

## 🧪 TEST ADIMLARI

### 1. Kullanıcı Kaydı Testi

**Adımlar:**
1. `registrieren.html` sayfasını açın
2. Form doldurun:
   - Vorname: Test
   - Nachname: Benutzer
   - E-Mail: test@example.com
   - Passwort: Test1234!
   - Passwort wiederholen: Test1234!
   - ✅ AGB akzeptieren
3. **"Jetzt registrieren"** tıklayın

**Beklenen:**
- ✅ Toast notification: "Registrierung erfolgreich!"
- ✅ Yönlendirme: verify-email.html
- ✅ Console'da verification code

### 2. Email Verifizierung Testi

**Adımlar:**
1. verify-email.html sayfasında
2. Console'dan 6 haneli kodu alın
3. Kodu girin
4. **"Bestätigen"** tıklayın

**Beklenen:**
- ✅ Toast: "E-Mail erfolgreich bestätigt!"
- ✅ Yönlendirme: login.html

### 3. Login Testi

**Adımlar:**
1. login.html sayfasında
2. E-mail: test@example.com
3. Passwort: Test1234!
4. **"Anmelden"** tıklayın

**Beklenen:**
- ✅ Toast: "Erfolgreich angemeldet! Willkommen zurück, Test!"
- ✅ Yönlendirme: index.html
- ✅ Header'da "Test" ismi görünür

### 4. Kullanıcı Paneli Testi

**Adımlar:**
1. index.html sayfasında
2. Header'da **"Test"** ismine tıklayın

**Beklenen:**
- ✅ Yönlendirme: mein-konto.html
- ✅ Hoşgeldin mesajı: "Willkommen zurück, Test!"
- ✅ Avatar: "T"
- ✅ İstatistikler yüklü
- ✅ Sidebar menü görünür

### 5. Admin Dashboard Testi

**Adımlar:**
1. Admin kullanıcı ile login olun:
   - Email: `admin@cssberlin.de` VEYA
   - Email: `noreply@cssberlin.de`
2. mein-konto.html açın

**Beklenen:**
- ✅ Sidebar'da **"Admin Dashboard"** linki görünür
- ✅ Link: admin-v2.html

### 6. Entegrasyon Testleri

**Messages:**
1. mein-konto.html → Sidebar → "Nachrichten" tıkla
2. ✅ Yönlendirme: messages.html

**Wunschliste:**
1. index.html → Ürün kartında ❤️ tıkla
2. mein-konto.html aç
3. ✅ "Wunschliste (1)" badge güncellendi
4. Sidebar → "Wunschliste" tıkla
5. ✅ Yönlendirme: wunschliste.html

**Abmelden:**
1. mein-konto.html → Sidebar → "Abmelden" tıkla
2. ✅ Confirm dialog: "Möchten Sie sich wirklich abmelden?"
3. "OK" tıkla
4. ✅ Çıkış yapıldı, login.html'e yönlendirildi

---

## 📁 DEĞİŞTİRİLEN DOSYALAR

### Güncellenen:
1. **auth.js**
   - Satır 110-117: EmailJS konfigürasyonu
   - Satır 544-548: Kullanıcı adı tıklama davranışı

### Oluşturulan:
1. **mein-konto.html** - Kullanıcı paneli (yeni)

### Mevcut (Değiştirilmedi):
1. **toast.js** - Toast notification sistemi ✅
2. **toast.css** - Toast stilleri ✅
3. **messages.html** - Chat sistemi ✅
4. **wunschliste.html** - Wishlist ✅
5. **admin-v2.html** - Admin dashboard ✅

---

## 🚀 KULLANICI AKIŞI

### Tam Akış:

```
1. index.html
   ↓ (Anmelden tıkla)
2. login.html
   ↓ (Jetzt registrieren)
3. registrieren.html
   ↓ (Form doldur + Jetzt registrieren)
4. 🎉 Toast: "Registrierung erfolgreich!"
   ↓ (Auto yönlendirme)
5. verify-email.html
   ↓ (6-haneli kod gir)
6. 🎉 Toast: "E-Mail erfolgreich bestätigt!"
   ↓ (Auto yönlendirme)
7. login.html
   ↓ (Email + Passwort gir)
8. 🎉 Toast: "Erfolgreich angemeldet!"
   ↓ (Auto yönlendirme)
9. index.html
   ↓ (Header'da isim görünür)
10. (İsme tıkla) → mein-konto.html
    ↓
11. ✅ Kullanıcı Paneli
    - İstatistikler
    - Mesajlar
    - Wunschliste
    - Verhandlungen
    - Einstellungen
    - Admin Dashboard (admin ise)
    - Abmelden
```

---

## 🔧 SORUN GİDERME

### Sorun: "getCurrentUser is not defined"

**Çözüm:**
- auth.js yüklenmemiş
- mein-konto.html'de `<script src="auth.js"></script>` var mı kontrol edin
- Browser cache temizleyin (Ctrl+F5)

### Sorun: "User loaded: null" - Login sayfasına yönleniyor

**Çözüm:**
- Kullanıcı giriş yapmamış
- Önce login.html → Giriş yapın
- localStorage'da `cssberlin_session` kontrolü:
  ```javascript
  // Console'da çalıştırın:
  console.log(localStorage.getItem('cssberlin_session'));
  ```

### Sorun: Toast göstermiyor

**Çözüm:**
- toast.js yüklenmemiş
- `<script src="toast.js"></script>` ekleyin
- Browser console'da hata var mı kontrol edin

### Sorun: Admin Dashboard linki görünmüyor

**Çözüm:**
- Kullanıcı admin değil
- Admin olarak test etmek için:
  1. Console açın (F12)
  2. Şunu çalıştırın:
     ```javascript
     let users = JSON.parse(localStorage.getItem('cssberlin_users'));
     users[0].email = 'admin@cssberlin.de';
     localStorage.setItem('cssberlin_users', JSON.stringify(users));
     ```
  3. Sayfayı yenileyin

### Sorun: EmailJS email göndermiyor

**Çözüm:**
1. Public Key eklendi mi? (auth.js satır 116)
2. Service ID doğru mu? (`service_x3phsl7`)
3. Template ID doğru mu? (`template_icqfar5`)
4. Console'da hata var mı?
5. EmailJS Dashboard → Email Log kontrolü

---

## 📊 ÖZELLİKLER

### Tamamlanan:
- ✅ Modern kullanıcı paneli
- ✅ Toast notification sistemi
- ✅ EmailJS entegrasyonu (Public Key hariç)
- ✅ Admin kontrolü
- ✅ Messages entegrasyonu
- ✅ Wunschliste entegrasyonu
- ✅ Responsive tasarım
- ✅ Mobile hamburger menü

### Gelecek Geliştirmeler:
- ⏳ Profil düzenleme formu
- ⏳ Şifre değiştirme
- ⏳ Adres defteri
- ⏳ Sipariş geçmişi (backend gerekli)
- ⏳ Gerçek mesajlaşma sistemi
- ⏳ 2FA (İki faktörlü kimlik doğrulama)

---

## 📞 DESTEK

**Sorularınız için:**
- Email: info@cssberlin.de
- Developer: Claude Code

**Faydalı Linkler:**
- EmailJS Docs: https://www.emailjs.com/docs/
- Toast System: toast.js + toast.css (custom)
- Auth System: auth.js

---

**Son Güncelleme:** 2025-11-08
**Versiyon:** 1.0
**Durum:** ✅ Production Ready (Public Key eklendikten sonra)
