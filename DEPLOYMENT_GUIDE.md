# CSS Berlin - Deployment Guide
## GitHub Pages + Cloudflare Setup

---

## Table of Contents

1. [GitHub Repository Setup](#github-repository-setup)
2. [GitHub Pages Configuration](#github-pages-configuration)
3. [Cloudflare Setup](#cloudflare-setup)
4. [Custom Domain Configuration](#custom-domain-configuration)
5. [SSL/HTTPS Setup](#ssl-https-setup)
6. [Performance Optimization](#performance-optimization)
7. [Monitoring & Analytics](#monitoring--analytics)

---

## GitHub Repository Setup

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click **"New Repository"**
3. Repository name: `css-berlin` (or your preferred name)
4. Description: "CSS Berlin - Climate Smart Solutions E-Commerce"
5. Public repository
6. Initialize with README: ✓
7. Click **"Create repository"**

### Step 2: Upload Your Files

**Option A: Via GitHub Web Interface**

1. Click **"Add file" → "Upload files"**
2. Drag and drop all files:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `admin.html`
   - `admin-styles.css`
   - `admin-script.js`
   - `campaign.html`
   - `PAYMENT_INTEGRATION.md`
   - `README.md`
3. Commit message: "Initial commit - CSS Berlin website"
4. Click **"Commit changes"**

**Option B: Via Git Command Line**

```bash
# Navigate to your project folder
cd "c:\Users\cyhnsrgc\Desktop\CSS BOT\github-upload"

# Initialize Git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit - CSS Berlin website"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/css-berlin.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## GitHub Pages Configuration

### Step 1: Enable GitHub Pages

1. Go to your repository
2. Click **"Settings"** tab
3. Scroll to **"Pages"** in left sidebar
4. Under **"Source"**:
   - Branch: `main`
   - Folder: `/ (root)`
5. Click **"Save"**

### Step 2: Verify Deployment

- GitHub will provide a URL: `https://YOUR_USERNAME.github.io/css-berlin/`
- Wait 2-3 minutes for deployment
- Visit the URL to verify your site is live

---

## Cloudflare Setup

### Step 1: Create Cloudflare Account

1. Register at [cloudflare.com](https://cloudflare.com)
2. Verify email
3. Complete account setup

### Step 2: Add Your Domain

If you have a custom domain (e.g., `cssberlin.com`):

1. Click **"Add site"**
2. Enter your domain: `cssberlin.com`
3. Select **"Free"** plan
4. Click **"Continue"**

### Step 3: Update Nameservers

Cloudflare will provide nameservers:

```
nina.ns.cloudflare.com
walt.ns.cloudflare.com
```

**Update at your domain registrar:**

1. Go to your domain registrar (e.g., GoDaddy, Namecheap)
2. Find "Nameservers" or "DNS Settings"
3. Replace existing nameservers with Cloudflare's
4. Save changes
5. Wait 24-48 hours for propagation

---

## Custom Domain Configuration

### Option 1: Using GitHub Pages with Custom Domain

**In GitHub Repository:**

1. Go to **Settings → Pages**
2. Under **"Custom domain"**, enter: `cssberlin.com`
3. Click **"Save"**
4. Enable **"Enforce HTTPS"** (after DNS propagates)

**In Cloudflare DNS:**

1. Go to **DNS** tab
2. Add CNAME record:
   - **Type**: CNAME
   - **Name**: `@` (or `www`)
   - **Target**: `YOUR_USERNAME.github.io`
   - **Proxy status**: Proxied (orange cloud)
3. Click **"Save"**

### Option 2: Using Cloudflare Pages (Recommended)

**Better performance and features!**

1. Go to **Cloudflare Dashboard**
2. Select **"Workers & Pages"**
3. Click **"Create application"**
4. Select **"Pages"** tab
5. Click **"Connect to Git"**
6. Authorize GitHub
7. Select your `css-berlin` repository
8. Configure build settings:
   - **Project name**: css-berlin
   - **Production branch**: main
   - **Build command**: (leave empty)
   - **Build output directory**: /
9. Click **"Save and Deploy"**

Your site will be live at: `css-berlin.pages.dev`

### Custom Domain for Cloudflare Pages

1. In your Pages project, go to **"Custom domains"**
2. Click **"Set up a custom domain"**
3. Enter: `cssberlin.com`
4. Cloudflare will automatically configure DNS
5. SSL certificate will be automatically provisioned

---

## SSL/HTTPS Setup

### Automatic SSL with Cloudflare

Cloudflare provides free SSL certificates:

1. Go to **SSL/TLS** tab
2. Set encryption mode to: **"Full"** or **"Full (strict)"**
3. Enable **"Always Use HTTPS"**
4. Enable **"Automatic HTTPS Rewrites"**

### Force HTTPS with Page Rules

1. Go to **Rules → Page Rules**
2. Click **"Create Page Rule"**
3. URL: `http://*cssberlin.com/*`
4. Setting: **"Always Use HTTPS"**
5. Click **"Save and Deploy"**

---

## Performance Optimization

### Cloudflare Optimizations

**1. Caching Configuration**

```
Go to Caching → Configuration:
- Caching Level: Standard
- Browser Cache TTL: 4 hours
- Enable "Always Online"
```

**2. Speed Optimization**

```
Go to Speed → Optimization:
- Auto Minify: ✓ JavaScript, ✓ CSS, ✓ HTML
- Brotli: ✓ Enabled
- Early Hints: ✓ Enabled
- Rocket Loader: ✓ Enabled (optional)
```

**3. Image Optimization**

```
Go to Speed → Optimization:
- Image Resizing: ✓ Enabled
- Polish: Lossy
- Mirage: ✓ Enabled
```

### Content Delivery Network (CDN)

Cloudflare automatically provides global CDN:

- 275+ data centers worldwide
- Automatic geo-routing
- DDoS protection included

---

## Cloudflare Workers (for Payment API)

### Deploy Payment API Worker

**Step 1: Install Wrangler CLI**

```bash
npm install -g wrangler
```

**Step 2: Login to Cloudflare**

```bash
wrangler login
```

**Step 3: Create Worker Project**

```bash
wrangler init payment-api
cd payment-api
```

**Step 4: Add Worker Code**

Create `worker.js` (use code from PAYMENT_INTEGRATION.md)

**Step 5: Configure wrangler.toml**

```toml
name = "css-berlin-payment-api"
main = "worker.js"
compatibility_date = "2024-01-01"

[env.production]
vars = { ENVIRONMENT = "production" }
```

**Step 6: Add Secrets**

```bash
wrangler secret put STRIPE_SECRET_KEY
# Enter your Stripe secret key when prompted

wrangler secret put STRIPE_WEBHOOK_SECRET
# Enter your webhook secret when prompted
```

**Step 7: Deploy**

```bash
wrangler publish
```

Your API will be live at: `https://css-berlin-payment-api.YOUR_SUBDOMAIN.workers.dev`

### Custom Domain for Worker

1. Go to **Workers → payment-api → Settings → Triggers**
2. Click **"Add Custom Domain"**
3. Enter: `api.cssberlin.com`
4. Cloudflare will automatically configure DNS

---

## Monitoring & Analytics

### Cloudflare Analytics

Built-in analytics available in dashboard:

- Total requests
- Bandwidth usage
- Threats blocked
- Geographic distribution
- Performance metrics

### Google Analytics Integration

Add to your HTML `<head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Uptime Monitoring

**Option 1: UptimeRobot (Free)**

1. Register at [uptimerobot.com](https://uptimerobot.com)
2. Add monitor:
   - Type: HTTPS
   - URL: `https://cssberlin.com`
   - Interval: 5 minutes
3. Get alerts via email/SMS

**Option 2: Cloudflare Health Checks**

Available on paid plans ($20/month minimum)

---

## Security Configuration

### Cloudflare Security Settings

**1. Firewall Rules**

```
Go to Security → WAF:
- Enable "Managed Rules"
- Add custom rules if needed
```

**2. Rate Limiting**

```
Go to Security → Rate Limiting:
- Protect API endpoints
- Example: Max 10 requests per minute per IP
```

**3. Bot Protection**

```
Go to Security → Bots:
- Enable "Bot Fight Mode" (Free plan)
- Or "Super Bot Fight Mode" (Pro plan)
```

---

## Deployment Checklist

### Pre-Launch

- [ ] All files uploaded to GitHub
- [ ] GitHub Pages enabled and working
- [ ] Cloudflare account created
- [ ] Domain added to Cloudflare
- [ ] DNS records configured
- [ ] SSL certificate active
- [ ] Custom domain pointing correctly
- [ ] Admin panel accessible
- [ ] Payment API deployed (if using)
- [ ] Test all pages and links
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing completed

### Post-Launch

- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics
- [ ] Configure uptime monitoring
- [ ] Test payment flow with real card
- [ ] Set up email notifications
- [ ] Monitor Cloudflare analytics
- [ ] Check SSL certificate expiry
- [ ] Review security logs

---

## Updating Your Site

### Method 1: GitHub Web Interface

1. Go to repository on GitHub
2. Click on file to edit
3. Click pencil icon (Edit)
4. Make changes
5. Commit changes
6. GitHub Pages auto-deploys in 1-2 minutes

### Method 2: Git Command Line

```bash
# Make changes to your files locally

# Stage changes
git add .

# Commit changes
git commit -m "Update: description of changes"

# Push to GitHub
git push origin main

# Cloudflare Pages auto-deploys in 30-60 seconds
```

---

## Troubleshooting

### Site Not Loading

**Issue**: DNS not resolving
- **Solution**: Wait 24-48 hours for nameserver propagation
- **Check**: Use [whatsmydns.net](https://whatsmydns.net) to verify

**Issue**: 404 Not Found
- **Solution**: Verify `index.html` is in root directory
- **Check**: File names are case-sensitive

### SSL Errors

**Issue**: Mixed content warnings
- **Solution**: Ensure all resources use HTTPS URLs
- **Check**: Search for `http://` in your code

**Issue**: Certificate not trusted
- **Solution**: Wait for Cloudflare to provision certificate (5-15 minutes)

### Performance Issues

**Issue**: Slow loading
- **Solution**: Enable all Cloudflare optimizations
- **Check**: Image sizes (compress large images)

---

## Cost Summary

### Free Tier (Sufficient for Most Cases)

- **GitHub Pages**: Free (public repositories)
- **Cloudflare**: Free (includes CDN, SSL, DDoS protection)
- **Domain**: ~€10-15/year (from registrar)

### Paid Options (Optional)

- **Cloudflare Pro**: $20/month (enhanced security, analytics)
- **Cloudflare Workers**: $5/month for 10M requests
- **Custom email**: ~€5/month (Google Workspace or similar)

**Total minimum cost**: €10-15/year (just the domain!)

---

## Support Resources

- **GitHub Pages Docs**: https://docs.github.com/pages
- **Cloudflare Docs**: https://developers.cloudflare.com
- **Cloudflare Community**: https://community.cloudflare.com
- **GitHub Support**: https://support.github.com

---

## Next Steps After Deployment

1. **SEO Optimization**
   - Add meta descriptions
   - Create sitemap.xml
   - Submit to Google Search Console

2. **Marketing**
   - Social media integration
   - Email newsletter setup
   - Blog content creation

3. **Features**
   - User authentication
   - Product reviews
   - Live chat support

4. **Scaling**
   - Database integration (Supabase, Firebase)
   - Backend API expansion
   - Mobile app development

---

**Deployment Guide Version**: 1.0.0
**Last Updated**: 2025-01-05
**Maintained by**: CSS Berlin Development Team

---

## Quick Start Commands

```bash
# 1. Clone repository (if not already local)
git clone https://github.com/YOUR_USERNAME/css-berlin.git
cd css-berlin

# 2. Make changes
# Edit your files...

# 3. Deploy
git add .
git commit -m "Your changes"
git push origin main

# Done! Site updates automatically in 1-2 minutes
```

🚀 **Happy Deploying!**
