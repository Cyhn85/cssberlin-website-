# CSS Berlin - Türkçe Kurulum Rehberi
## GitHub Pages + Cloudflare ile Siteyi Yayınlama

---

## 📋 İçindekiler

1. [Gerekli Hesaplar](#gerekli-hesaplar)
2. [GitHub'a Dosya Yükleme](#githuba-dosya-yükleme)
3. [GitHub Pages Aktifleştirme](#github-pages-aktifleştirme)
4. [Cloudflare Kurulumu](#cloudflare-kurulumu)
5. [Domain Bağlama](#domain-bağlama)
6. [Admin Paneline Giriş](#admin-paneline-giriş)
7. [Sorun Giderme](#sorun-giderme)

---

## 🔑 Gerekli Hesaplar

### 1. GitHub Hesabı (ÜCRETSİZ)
- https://github.com adresinden kayıt ol
- Email adresini doğrula

### 2. Cloudflare Hesabı (ÜCRETSİZ)
- https://cloudflare.com adresinden kayıt ol
- Email adresini doğrula

### 3. Domain (Opsiyonel - €10-15/yıl)
- GoDaddy, Namecheap veya başka bir domain sağlayıcısından
- Yoksa GitHub subdomain kullanabilirsin: `username.github.io`

---

## 📤 GitHub'a Dosya Yükleme

### Yöntem 1: Web Arayüzü ile (EN KOLAY)

#### Adım 1: Yeni Repository Oluştur

1. GitHub'a giriş yap
2. Sağ üstteki **[+]** butonuna tıkla
3. **"New repository"** seç
4. Şu bilgileri gir:
   - **Repository name**: `css-berlin`
   - **Description**: "CSS Berlin - Climate Smart Solutions"
   - **Public** seç (ücretsiz hosting için gerekli)
   - **"Add a README file"** işaretle
5. **"Create repository"** tıkla

#### Adım 2: Dosyaları Yükle

1. Repository sayfasında **"Add file"** → **"Upload files"** tıkla
2. Bu klasördeki TÜM dosyaları sürükle-bırak:
   ```
   c:\Users\cyhnsrgc\Desktop\CSS BOT\github-upload
   ```
3. Yüklenecek dosyalar:
   - ✅ index.html
   - ✅ campaign.html
   - ✅ login.html
   - ✅ admin.html
   - ✅ styles.css
   - ✅ script.js
   - ✅ admin-styles.css
   - ✅ admin-script.js
   - ✅ product-detail.html
   - ✅ README.md
   - ✅ PAYMENT_INTEGRATION.md
   - ✅ DEPLOYMENT_GUIDE.md
   - ✅ KURULUM_REHBERI.md

4. Commit message: `İlk yükleme - CSS Berlin website`
5. **"Commit changes"** tıkla

**✅ Dosyalar GitHub'a yüklendi!**

---

### Yöntem 2: Git ile (Komut Satırı)

```bash
# 1. Klasöre git
cd "c:\Users\cyhnsrgc\Desktop\CSS BOT\github-upload"

# 2. Git başlat
git init

# 3. Tüm dosyaları ekle
git add .

# 4. Commit yap
git commit -m "İlk yükleme - CSS Berlin website"

# 5. GitHub'a bağlan (KULLANICI_ADIN değiştir!)
git remote add origin https://github.com/KULLANICI_ADIN/css-berlin.git

# 6. Ana branch adını main yap
git branch -M main

# 7. GitHub'a yükle
git push -u origin main

# GitHub kullanıcı adı ve token iste yecek - gir
```

---

## 🌐 GitHub Pages Aktifleştirme

### Adım 1: GitHub Pages'i Aç

1. Repository sayfasında **"Settings"** sekmesine git
2. Sol menüden **"Pages"** bul ve tıkla
3. **"Source"** bölümünde:
   - Branch: **main** seç
   - Folder: **/ (root)** seç
4. **"Save"** tıkla

### Adım 2: Yayınlanmasını Bekle

- GitHub şu mesajı gösterecek:
  ```
  Your site is ready to be published at https://KULLANICI_ADIN.github.io/css-berlin/
  ```
- 2-3 dakika bekle
- URL'yi ziyaret et - **SİTEN YAYIN DA!** 🎉

---

## ☁️ Cloudflare Kurulumu

### Neden Cloudflare?

- ✅ Ücretsiz SSL sertifikası (HTTPS)
- ✅ Dünya çapında CDN (hızlı yükleme)
- ✅ DDoS koruması
- ✅ Sınırsız bant genişliği
- ✅ Otomatik optimizasyon

### Seçenek A: Cloudflare Pages (ÖNERİLEN)

**GitHub'dan otomatik deploy eder - her değişiklikte yeni sürüm yayınlar!**

#### Adım 1: Cloudflare Pages'e Git

1. Cloudflare Dashboard'a giriş yap
2. Sol menüden **"Workers & Pages"** seç
3. **"Create application"** tıkla
4. **"Pages"** sekmesini seç
5. **"Connect to Git"** tıkla

#### Adım 2: GitHub'ı Bağla

1. **"Connect GitHub"** tıkla
2. GitHub'da Cloudflare'e izin ver
3. Repository seç: **css-berlin**
4. **"Begin setup"** tıkla

#### Adım 3: Build Ayarları

```
Project name: css-berlin
Production branch: main
Build command: (BOŞ BIRAK)
Build output directory: /
```

5. **"Save and Deploy"** tıkla

#### Adım 4: Yayınlandı! 🚀

- Cloudflare 1-2 dakikada deploy eder
- Sitenin URL'si: `https://css-berlin.pages.dev`
- **Bu URL'yi ziyaret et - ÇALIŞIYOR!**

---

### Seçenek B: Cloudflare ile GitHub Pages (Alternatif)

#### Adım 1: Domain Ekle (Varsa)

1. Cloudflare Dashboard'da **"Add site"** tıkla
2. Domain adını gir: `cssberlin.com`
3. **"Free"** plan seç
4. **"Continue"** tıkla

#### Adım 2: DNS Kayıtları

Cloudflare şu nameserver'ları verecek:
```
nina.ns.cloudflare.com
walt.ns.cloudflare.com
```

1. Domain sağlayıcına git (GoDaddy, Namecheap, vb.)
2. DNS ayarlarını bul
3. Nameserver'ları Cloudflare'in verdiğiyle değiştir
4. Kaydet
5. 24-48 saat bekle (genelde 2-4 saat yeter)

#### Adım 3: DNS Ayarları

1. Cloudflare'de **"DNS"** sekmesine git
2. **"Add record"** tıkla
3. Şu kaydı ekle:
   ```
   Type: CNAME
   Name: @
   Target: KULLANICI_ADIN.github.io
   Proxy: ON (turuncu bulut)
   ```
4. **"Save"** tıkla

#### Adım 4: GitHub'da Custom Domain

1. GitHub repository → **Settings** → **Pages**
2. **"Custom domain"** kutusuna domaini yaz: `cssberlin.com`
3. **"Save"** tıkla
4. **"Enforce HTTPS"** işaretle (DNS yayıldıktan sonra)

---

## 🔒 SSL/HTTPS Ayarları

### Cloudflare SSL

1. Cloudflare'de **"SSL/TLS"** sekmesine git
2. **"Full"** veya **"Full (strict)"** seç
3. **"Always Use HTTPS"** aç
4. **"Automatic HTTPS Rewrites"** aç

**✅ Siteniz artık HTTPS ile güvenli!**

---

## ⚡ Performans Optimizasyonu

### Hız Ayarları

1. **"Speed"** → **"Optimization"** git
2. Şunları aç:
   - ✅ Auto Minify (JavaScript, CSS, HTML)
   - ✅ Brotli
   - ✅ Early Hints
   - ✅ Rocket Loader (opsiyonel)

### Cache Ayarları

1. **"Caching"** → **"Configuration"** git
2. Şunları ayarla:
   - Caching Level: **Standard**
   - Browser Cache TTL: **4 hours**
   - ✅ Always Online

---

## 👤 Admin Paneline Giriş

### Admin Paneline Erişim

1. Sitenizi açın: `https://DOMAIN/login.html`
2. **Demo bilgilerle giriş yap:**
   ```
   Email: admin@cssberlin.com
   Password: admin123
   ```
3. **"Anmelden"** tıkla
4. Admin paneline yönlendirileceksin!

### Kozmik Oda Terminal

1. Admin panelinde **"Kozmik Oda"** sekmesine git
2. Terminal komutlarını dene:
   ```bash
   help       # Komutları göster
   status     # Sistem durumu
   products   # Ürün istatistikleri
   users      # Kullanıcı istatistikleri
   analytics  # Website analytics
   ```

### Şifre Değiştirme

**ÖNEMLİ:** Demo şifresini değiştir!

1. `login.html` dosyasını aç
2. Şu satırı bul (satır 106):
   ```javascript
   const ADMIN_CREDENTIALS = {
       email: 'admin@cssberlin.com',
       password: 'admin123' // BURAYI DEĞİŞTİR!
   };
   ```
3. Email ve şifreyi değiştir
4. Dosyayı kaydet ve GitHub'a yükle

---

## 🔄 Site Güncelleme

### Dosya Değiştirdikten Sonra

#### GitHub Web ile:

1. GitHub'da dosyaya git
2. Kalem ikonuna tıkla (Edit)
3. Değişiklikleri yap
4. **"Commit changes"** tıkla
5. **1-2 dakikada otomatik deploy olur!**

#### Git ile:

```bash
# Değişiklikleri yap

# Git'e ekle
git add .

# Commit yap
git commit -m "Açıklama"

# GitHub'a yükle
git push

# Cloudflare Pages 30-60 saniyede otomatik deploy eder!
```

---

## 🛠️ Sorun Giderme

### Site Açılmıyor

**Problem:** DNS çözümlenmiyor
- **Çözüm:** 24-48 saat bekle, nameserver yayılması zaman alır
- **Kontrol:** https://whatsmydns.net sitesinden kontrol et

**Problem:** 404 Not Found
- **Çözüm:** `index.html` dosyasının root klasörde olduğundan emin ol
- **Kontrol:** GitHub'da dosya yolunu kontrol et

### SSL Hatası

**Problem:** "Your connection is not secure"
- **Çözüm:** Cloudflare SSL ayarlarından "Full" veya "Full (strict)" seç
- **Kontrol:** 15-30 dakika bekle, SSL sertifikası yayılıyor

### Admin Paneli Açılmıyor

**Problem:** Login ekranına yönlendiriyor
- **Çözüm:** `login.html` sayfasından giriş yap
- **Kontrol:** Browser Console'da (F12) hata var mı kontrol et

**Problem:** Şifreyi unuttum
- **Çözüm:** Browser'da F12 → Console → şu kodu çalıştır:
  ```javascript
  localStorage.clear()
  ```
  Ardından `login.html` dosyasını düzenle

---

## 📱 Test Checklist

Siteyi yayınladıktan sonra test et:

- [ ] Ana sayfa açılıyor
- [ ] Ürünler görünüyor
- [ ] Arama çalışıyor
- [ ] Mega menu açılıyor
- [ ] Campaign sayfası açılıyor
- [ ] Admin login sayfası açılıyor
- [ ] Admin paneline giriş yapılıyor
- [ ] Kozmik Oda terminal çalışıyor
- [ ] Mobilde responsive
- [ ] HTTPS aktif (kilit ikonu)

---

## 💰 Maliyet Özeti

### Ücretsiz Plan

- ✅ GitHub Pages: **0 TL**
- ✅ Cloudflare: **0 TL**
- ✅ Cloudflare Workers: **0 TL** (100K istek/gün'e kadar)
- ✅ Cloudflare Pages: **0 TL** (500 build/ay)

### Domain (Opsiyonel)

- Domain: **€10-15/yıl** (~₺350-500/yıl)
- Email (Google Workspace): **€5/ay** (~₺175/ay) - opsiyonel

**TOPLAM: 0 TL (domain olmadan) veya ₺350-500/yıl (domain ile)**

---

## 🎯 Önemli Linkler

- **GitHub Repository**: https://github.com/KULLANICI_ADIN/css-berlin
- **GitHub Pages**: https://KULLANICI_ADIN.github.io/css-berlin/
- **Cloudflare Pages**: https://css-berlin.pages.dev
- **Admin Panel**: /login.html

---

## 📞 Yardım Gerekiyorsa

### Dokümantasyon

- İngilizce detaylı rehber: `DEPLOYMENT_GUIDE.md`
- Ödeme sistemi: `PAYMENT_INTEGRATION.md`
- Proje açıklaması: `README.md`

### Online Kaynaklar

- GitHub Pages: https://docs.github.com/pages
- Cloudflare: https://developers.cloudflare.com
- Cloudflare Community: https://community.cloudflare.com

---

## ⚡ Hızlı Başlangıç (Özet)

```
1. GitHub'a kayıt ol
2. Yeni repo oluştur: css-berlin
3. Dosyaları yükle (drag & drop)
4. Settings → Pages → main branch seç → Save
5. 2 dakika bekle → Site yayında!
6. (Opsiyonel) Cloudflare Pages'e bağla
7. login.html'den admin paneline giriş yap
8. Kozmik Oda'yı test et!
```

---

## 🎉 Tebrikler!

Site yayında! Şimdi şunları yapabilirsin:

1. ✅ Ürünleri düzenle
2. ✅ Admin panelini özelleştir
3. ✅ Stripe ödeme sistemini kur
4. ✅ Domain bağla
5. ✅ Marketing'e başla!

---

**Son Güncelleme**: 5 Kasım 2025
**Versiyon**: 1.0.0
**Hazırlayan**: CSS Berlin Development Team

**🌍 Dünyayı birlikte yeşillendirelim!**
