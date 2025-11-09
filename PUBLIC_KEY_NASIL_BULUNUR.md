# EmailJS Public Key Nasıl Bulunur?

## 🎯 HEDEF
auth.js dosyasındaki `'YOUR_PUBLIC_KEY'` yerine gerçek Public Key'i eklemek.

---

## 📍 ADIM ADIM REHBER

### 1. EmailJS Dashboard'a Giriş

Tarayıcınızda açık olan EmailJS dashboard:
- URL: https://dashboard.emailjs.com/admin

### 2. Sol Menüde "Account" Bulun

```
Sol menü yapısı:
┌────────────────────┐
│ 📊 Dashboard       │
│ 📧 Email Services  │ ← Şu anda buradasınız
│ 📝 Email Templates │
│ 📈 Email Log       │
│ ─────────────────  │
│ 👤 Account         │ ← BURAYA TIKLAYIN!
│ ⚙️ Integration     │
└────────────────────┘
```

### 3. "General" Sekmesine Gidin

Account sayfasında üstte sekmeler var:

```
┌────────────┬────────────┬────────────┐
│  General   │   Billing  │  Settings  │
└────────────┴────────────┴────────────┘
    ↑
 BURAYA TIKLAYIN
```

### 4. Public Key'i Bulun ve Kopyalayın

General sekmesinde şu bilgileri göreceksiniz:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Account Details
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Email: [sizin emailiniz]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
API Keys
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Public Key: uJ8Kx_9mP4nL2zQ5V  [📋 Copy]
             ↑
        BU KEY'İ KOPYALAYIN!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**NOT:** Yukarıdaki `uJ8Kx_9mP4nL2zQ5V` örnek bir key'dir. Sizin key'iniz farklı olacak!

### 5. auth.js Dosyasını Açın

Yol: `c:\Users\cyhnsrgc\Desktop\CSS-Berlin-Website\auth.js`

**Satır 116'yı bulun:**

```javascript
await emailjs.send(
    'service_x3phsl7',        // ✅ Service ID
    'template_icqfar5',       // ✅ Template ID
    templateParams,
    'YOUR_PUBLIC_KEY'         // ⚠️ BURASI DEĞİŞECEK
);
```

### 6. Public Key'i Yapıştırın

**ÖNCE:**
```javascript
'YOUR_PUBLIC_KEY'         // ⚠️ TODO: Add Public Key
```

**SONRA:**
```javascript
'uJ8Kx_9mP4nL2zQ5V'      // ✅ EmailJS Public Key (örnek)
```

**ÖNEMLİ:** Tek tırnak işaretlerini ( `'` ) sakın silmeyin!

### 7. Kaydedin

- `Ctrl + S` ile kaydedin
- Dosya editörünü kapatabilirsiniz

---

## ✅ KONTROL LİSTESİ

Tamamlandıktan sonra auth.js satır 112-117 şöyle görünmeli:

```javascript
await emailjs.send(
    'service_x3phsl7',        // ✅ Service ID (IONOS SMTP)
    'template_icqfar5',       // ✅ Template ID (E-Mail-Verifizierung)
    templateParams,
    'GERÇEK_PUBLIC_KEY'       // ✅ EmailJS Public Key (dashboard'dan)
);
```

**Kontrol:**
- ✅ Service ID: `service_x3phsl7` (değişmedi)
- ✅ Template ID: `template_icqfar5` (değişmedi)
- ✅ Public Key: Artık `YOUR_PUBLIC_KEY` değil, gerçek key

---

## 🧪 TEST

Public Key eklendikten sonra test edin:

### Hızlı Test:

1. Browser'da açın: `registrieren.html`
2. Test kullanıcı kaydedin
3. Console açın (F12)
4. Şu mesajı görmelisiniz:
   ```
   ✅ Email sent successfully via EmailJS
   ```
5. E-posta kontrolü yapın (spam klasörü dahil)

### Hata Mesajları:

**Eğer görürseniz:**
```
❌ Email error: 403 Forbidden
```
**Çözüm:** Public Key yanlış, tekrar kontrol edin

**Eğer görürseniz:**
```
⚠️ EmailJS not loaded
```
**Çözüm:** İnternet bağlantısı veya ad-blocker kontrolü

**Eğer görürseniz:**
```
✅ Email sent successfully via EmailJS
```
**Sonuç:** 🎉 HER ŞEY ÇALIŞIYOR!

---

## 📸 GÖRSEL YARDIM

### EmailJS Dashboard Görünümü:

```
┌─────────────────────────────────────────────┐
│ EmailJS                        [kullanıcı]  │
├─────────────────────────────────────────────┤
│                                              │
│  📊 Dashboard                                │
│  📧 Email Services ← (Şu an buradasınız)    │
│  📝 Email Templates                          │
│  📈 Email Log                                │
│  ─────────────────                           │
│  👤 Account        ← BURAYA GİDİN!          │
│  ⚙️ Integration                              │
│                                              │
│  [Account sayfası açıldığında]              │
│                                              │
│  ┌─────────────┬──────────┬──────────┐      │
│  │  General    │ Billing  │ Settings │      │
│  └─────────────┴──────────┴──────────┘      │
│     ↑ BURAYA TIKLAYIN                       │
│                                              │
│  Email: yourmail@example.com                │
│                                              │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━            │
│  API Keys                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━            │
│                                              │
│  Public Key: uJ8Kx_9mP4nL2zQ5V [📋 Copy]   │
│               ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑                │
│               BU KEY'İ ALIN!                 │
│                                              │
└─────────────────────────────────────────────┘
```

---

## ❓ SIKÇA SORULAN SORULAR

### S: Public Key nerede?
**C:** Dashboard → Account → General → API Keys bölümünde

### S: Public Key kaç karakter?
**C:** Genellikle 15-20 karakter arası (örn: `uJ8Kx_9mP4nL2zQ5V`)

### S: Private Key ile aynı mı?
**C:** HAYIR! Public Key kullanın, Private Key'i kullanmayın!

### S: Birden fazla Public Key var mı?
**C:** Hayır, hesap başına 1 tane Public Key var

### S: Key'i yanlış girdim, ne olur?
**C:** E-posta gönderilemez, console'da 403 Forbidden hatası görürsünüz

---

## 📞 YARDIM

Sorun yaşarsanız:

1. **Public Key bulma sorunu:** EmailJS Support (support@emailjs.com)
2. **Code hatası:** Console'u (F12) kontrol edin, hata mesajını okuyun
3. **E-posta gelmedi:** Spam klasörü + EmailJS Email Log kontrolü

---

**Oluşturulma:** 2025-11-08
**Süre:** 2 dakika
**Zorluk:** ⭐ Çok Kolay

🎯 **Sadece kopyala-yapıştır işlemi!**
