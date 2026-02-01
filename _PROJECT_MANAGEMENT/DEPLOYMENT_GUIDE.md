# 🚀 CSS Berlin - Deployment Guide

## ✅ Current Status

- **Repository:** https://github.com/Cyhn85/cssberlin-website-
- **Backend API:** Running on Hetzner (http://195.201.146.224:8000)
- **Frontend:** Ready for Cloudflare Pages deployment

---

## 🎯 İki Deployment Yöntemi

### Yöntem 1: Cloudflare Pages Git Entegrasyonu (ÖNERİLEN - En Kolay) ⭐

Bu yöntem **tam otomatik** ve kurulumu çok kolay:

#### Step 1: Cloudflare Dashboard
Visit: https://dash.cloudflare.com/

#### Step 2: Create Pages Project
1. Click "Workers & Pages" → "Create application"
2. Select "Pages" → "Connect to Git"
3. Authorize GitHub and select: **cssberlin-website-**

#### Step 3: Configure Build
```
Project name: css-berlin
Production branch: main
Build command: (leave empty - static site)
Build output directory: /
Root directory: /
```

#### Step 4: Deploy
Click "Save and Deploy" - Done in 2-3 minutes! ✅

**Artık her push otomatik deploy edilir!** 🎉

Your site: https://css-berlin.pages.dev

---

### Yöntem 2: GitHub Actions Workflow (Alternatif)

GitHub Actions ile daha fazla kontrol istiyorsanız:

#### Step 1: Cloudflare API Token Oluştur
1. https://dash.cloudflare.com/profile/api-tokens
2. "Create Token" → "Edit Cloudflare Workers" template
3. Permissions: `Cloudflare Pages:Edit`
4. Token'ı kopyala

#### Step 2: GitHub Secrets Ekle
Repository → Settings → Secrets and variables → Actions

**Secret 1:**
- Name: `CLOUDFLARE_API_TOKEN`
- Value: Oluşturduğunuz token

**Secret 2:**
- Name: `CLOUDFLARE_ACCOUNT_ID`
- Value: Cloudflare Dashboard'dan Account ID (sağ üst köşe)

#### Step 3: Workflow Otomatik Çalışır
`.github/workflows/deploy-cloudflare.yml` dosyası her push'ta otomatik deploy eder.

---

## 🧪 Testing

Visit: https://css-berlin.pages.dev

Test:
- [ ] Homepage loads
- [ ] Login modal works
- [ ] Favorites system
- [ ] Similar products section
- [ ] Mobile responsive
- [ ] Galaxy theme görünüyor

---

## 🖥️ Backend (Hetzner) Deployment (FastAPI)

Frontend Cloudflare ile otomatik deploy olur, **backend için Hetzner sunucuda deploy script** çalıştırılır.

### ✅ Deploy komutu (Hetzner sunucuda)

```bash
curl -fsSLo /tmp/deploy_hetzner.sh https://raw.githubusercontent.com/Cyhn85/cssberlin-website-/main/deploy_hetzner.sh && bash /tmp/deploy_hetzner.sh
```

### ✅ Backend sağlık kontrolü (Hetzner)

```bash
curl -fsS http://127.0.0.1:8000/health && echo OK || echo FAIL
sudo systemctl status cssberlin-backend --no-pager
```

### 🧯 Eğer “Could not resolve host: raw.githubusercontent.com” olursa (DNS)

Önce tanı koy:

```bash
getent hosts raw.githubusercontent.com || (echo DNS_FAIL; cat /etc/resolv.conf)
```

Geçici çözüm (örnek): sunucu DNS’i düzeltilmeden raw content indirilemez. Bu durumda:
- Cloudflare/DNS ayarlarınızı bozmayın.
- Sunucu üzerinde `/etc/resolv.conf` veya provider DNS ayarları düzeltilmelidir (kalıcı çözüm sunucu/network tarafındadır).

---

## ✅ Smoke Test Checklist (Deploy Sonrası)

Frontend (Cloudflare):
- [ ] `index.html` açılıyor
- [ ] Header/Footer V2 her sayfada görünüyor
- [ ] Ürün kartları render oluyor
- [ ] `mein-konto.html` girişsizken `login.html`’e yönlendiriyor

Backend (Hetzner):
- [ ] `GET /health` 200
- [ ] `POST /api/auth/register` çalışıyor
- [ ] `GET /api/products` 200
- [ ] `POST /api/offers` 200/201 (auth ile)

---

## 🎉 Success!

**Frontend:** Deployed on Cloudflare Pages  
**Backend:** Running on Hetzner  
**Status:** Production Ready ✅

**Otomatik Deployment:** Her push'ta otomatik deploy! 🚀
