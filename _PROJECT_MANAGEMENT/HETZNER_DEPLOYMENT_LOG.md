# CSS Berlin - Hetzner Deployment Log
**Tarih:** 2026-02-28
**Durum:** 🔄 Devam Ediyor

---

## 🏗️ SİSTEM MİMARİSİ

```
[cssberlin.de] → Cloudflare (DNS) → Hetzner IP: 195.201.146.224
                                          ↓
                                     Nginx (port 80/443)
                                     ├── /         → /var/www/cssberlin/ (Frontend)
                                     └── /api/     → Docker Container (port 8001)
                                                         ↓
                                               FastAPI Backend (port 8000 içeride)
                                                         ↓
                                                   SQLite DB (/app/cssberlin.db)
                                                         ↓
                                                IONOS SMTP (email gönderimi)
```

---

## 🖥️ HETZNER SUNUCU BİLGİLERİ

| Özellik | Değer |
|---------|-------|
| **IP** | 195.201.146.224 |
| **Sunucu Adı** | ubuntu-4gb-nbg1-1 |
| **OS** | Ubuntu 24.04.3 LTS |
| **CPU** | 2 vCPU |
| **RAM** | 4 GB |
| **Disk** | 40 GB (kullanım: ~%78) |
| **Lokasyon** | Nürnberg, Almanya |
| **Fiyat** | €3.56/ay |

---

## 📁 SUNUCUDAK PROJE YAPISI

```
/opt/
├── cssberlin/          # ESKİ sistem (simple_api.py - SQLite)
├── cssberlin-new/      # YENİ sistem (FastAPI - GitHub'dan clone)
│   ├── backend/        # FastAPI kodu
│   ├── Dockerfile      # Docker build config
│   └── docker-compose.yml
├── tatanga/            # Video/sosyal medya otomasyon projesi
│   └── docker-compose.yml (PostgreSQL + Redis)
├── fbref/              # ❌ İPTAL - Futbol scraper (639M - silinecek)
├── fbref-predictions/  # ❌ İPTAL - ML tahmin (185M - silinecek)
├── google/             # Chrome binary (scraping için - 379M)
└── microsoft/          # Bilinmiyor (185M - incelenecek)

/var/www/
├── cssberlin/          # Frontend HTML dosyaları
├── cssberlin_backup_2026-02-08_23:11:24/  # Yedek (116M - silinebilir)
├── cssberlin_backup_2026-02-08_23:19:26/  # Yedek (156K - silinebilir)
└── html/               # Nginx default
```

---

## 🐳 DOCKER CONTAINER'LAR

| Container | Image | Port | Durum |
|-----------|-------|------|-------|
| cssberlin-backend-v2 | cssberlin-backend-v2 | 8001→8000 | ✅ Çalışıyor |
| ~~cssberlin-website-backend-1~~ | ~~eski~~ | ~~8001~~ | ❌ Durduruldu |

---

## ✅ TAMAMLANAN İŞLEMLER (2026-02-28)

### 1. GitHub Temizliği
- ✅ `client_secret.json` Git history'den silindi
- ✅ `git reset --soft` ile temiz commit oluşturuldu
- ✅ Force push yapıldı (commit: 809f0d5)
- ✅ Branch: `pensive-bohr`

### 2. Email Sistemi (IONOS SMTP)
- ✅ `backend/email_service.py` oluşturuldu
- ✅ SMTP: smtp.ionos.de:587
- ✅ Magic Link → noreply@cssberlin.de
- ✅ Sipariş bildirimi → info@cssberlin.de
- ✅ Şifre: F@ceb00k2002?
- ✅ Test email başarıyla gönderildi (cyhnsrgc@gmail.com)

### 3. Backend Güncelleme (requirements.txt)
- ✅ `PyJWT==2.8.0` eklendi (jwt import hatası düzeltildi)
- ✅ `email_service.py` commit edildi ve push yapıldı
- ✅ Commit: 2143fa7 (pensive-bohr branch)

### 4. Hetzner Sunucu Kurulumu
- ✅ SSH bağlantısı kuruldu (root@195.201.146.224)
- ✅ Sunucu analizi yapıldı (projeler, disk, portlar)
- ✅ GitHub'dan pensive-bohr branch klonlandı → `/opt/cssberlin-new/`
- ✅ Docker image build edildi → `cssberlin-backend-v2`
- ✅ Eski container durduruldu (cssberlin-website-backend-1)
- ✅ Yeni container başlatıldı (cssberlin-backend-v2, port 8001)
- ✅ Health check başarılı: `{"status":"ok"}`
- ✅ API çalışıyor: `{"status":"online","service":"CSS Berlin API","version":"3.0.0"}`
- ✅ Nginx config güncellendi (port 80, cssberlin.de, /api/ → 8001)

---

## ✅ TAMAMLANAN İŞLEMLER (2026-02-28 — Devam)

### 5. Email Template Güncelleme
- ✅ Turuncu→Yeşil gradient (header, button, footer)
- ✅ "Climate Smart Solutions" badge: koyu yeşil bg + turuncu border + açık yeşil yazı
- ✅ Commit: 81c6056 | Push: pensive-bohr

### 6. magic-login.html Backend Entegrasyonu
- ✅ localStorage token kontrolü KALDIRILDI (güvenlik açığı)
- ✅ Backend `/api/auth/magic-link/verify` endpoint'i kullanılıyor
- ✅ JWT token localStorage'a kaydediliyor (cssberlin_jwt + auth_token)
- ✅ Her iki versiyon güncellendi: root + frontend/
- ✅ Commit: 4fe8636 | Hetzner'e kopyalandı

### 7. Hetzner Disk Temizliği
- ✅ /opt/fbref/ silindi (639MB)
- ✅ /opt/fbref-predictions/ silindi (184MB)
- ✅ /var/www/cssberlin_backup* silindi (132MB)
- ✅ Disk: %78 → %75 (9GB boş)

---

## 🔄 DEVAM EDEN İŞLEMLER

### 8. SSL Sertifikası (Sonraki Adım)
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d cssberlin.de -d www.cssberlin.de
```
- [ ] Let's Encrypt SSL kurulumu
- [ ] HTTPS yönlendirmesi

### 9. Cloudflare Pages Temizliği
- [ ] cssberlin-website2 sil
- [ ] cssberlin1 sil
- [ ] cssberlinfull sil
- [ ] cssberlin-son sil
- [ ] cssberlin Worker sil

### 10. Test
- ✅ Magic Link email testi (production) — BAŞARILI
- ✅ https://cssberlin.de açılıyor (HTTP 200)
- [ ] /api/products çalışıyor mu?
- [ ] Tam akış: Magic Link → verify → login → index.html

---

## 🔧 ÖNEMLİ KOMUTLAR (Referans)

```bash
# Sunucuya bağlan
ssh root@195.201.146.224

# Container durumu
docker ps

# Container logları
docker logs cssberlin-backend-v2 --tail 20

# Container restart
docker restart cssberlin-backend-v2

# Yeni kod deploy et
cd /opt/cssberlin-new && git pull && docker build -t cssberlin-backend-v2 . && docker restart cssberlin-backend-v2

# Nginx test ve reload
nginx -t && systemctl reload nginx

# Health check
curl http://localhost:8001/health

# SSL yenile
certbot renew
```

---

## 🌐 NGINX KONFİGÜRASYONU

Dosya: `/etc/nginx/sites-enabled/cssberlin`

```nginx
server {
    listen 80;
    server_name cssberlin.de www.cssberlin.de;
    root /var/www/cssberlin;

    location /api/ {
        proxy_pass http://127.0.0.1:8001;  # Docker container
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
# SSL eklenince certbot otomatik günceller
```

---

## 🐳 DOCKER CONTAINER BAŞLATMA KOMUTU

```bash
docker run -d \
  --name cssberlin-backend-v2 \
  --restart always \
  -p 8001:8000 \
  -e SMTP_HOST=smtp.ionos.de \
  -e SMTP_PORT=587 \
  -e SMTP_USER_MAGIC=noreply@cssberlin.de \
  -e SMTP_PASSWORD_MAGIC="F@ceb00k2002?" \
  -e FROM_EMAIL_MAGIC=noreply@cssberlin.de \
  -e SMTP_USER_INFO=info@cssberlin.de \
  -e SMTP_PASSWORD_INFO="F@ceb00k2002?" \
  -e FROM_EMAIL_INFO=info@cssberlin.de \
  -e EMAIL_DEV_MODE=false \
  -e SECRET_KEY=super_secret_key_css_berlin_production_2026 \
  -e FRONTEND_URL=https://cssberlin.de \
  cssberlin-backend-v2
```

---

## 📊 SUNUCUDAK METRİKLER

| Metrik | Değer |
|--------|-------|
| Disk kullanımı | %75 (27GB/38GB) |
| RAM kullanımı | %28 |
| CPU yükü | 0.0 |
| Çalışan container | 1 (cssberlin-backend-v2) |

### Disk Temizleme Durumu
| Klasör | Boyut | Durum |
|--------|-------|-------|
| /opt/fbref/ | 639M | ✅ Silindi |
| /opt/fbref-predictions/ | 185M | ✅ Silindi |
| /opt/google/ | 379M | ❓ İncelenecek |
| /var/www/cssberlin_backup* | ~132M | ✅ Silindi |

---

## 🔑 GİRİŞ BİLGİLERİ (Güvenli Saklayın!)

| Servis | Kullanıcı | Not |
|--------|-----------|-----|
| Hetzner SSH | root@195.201.146.224 | SSH key önerilir |
| IONOS noreply | noreply@cssberlin.de | SMTP auth |
| IONOS info | info@cssberlin.de | SMTP auth |
| GitHub | Cyhn85 | pensive-bohr branch |

---

## 🗺️ TATANGA SİSTEMİ (Gelecek Plan)

**Mevcut durum:** Durdurulmuş, `/opt/tatanga/` klasöründe
**Teknoloji:** Docker Compose (PostgreSQL + Redis + Frontend + Workers)
**Hedef (Gelecek):**
- Ürün scraping (secondhand platformlardan)
- AI ile sosyal medya içerik üretimi (Gemini API)
- Otomatik post/video oluşturma
- Instagram, YouTube, TikTok, Pinterest entegrasyonu

---

**Son Güncelleme:** 2026-02-28 (14:00)
**Aktif Branch:** pensive-bohr
**Sunucu:** Hetzner (195.201.146.224)
**Commit:** 4fe8636 (magic-login backend entegrasyon)
