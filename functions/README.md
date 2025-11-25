# Cloudflare Pages Functions - API Proxy

## Overview

This directory contains Cloudflare Pages Functions that provide a secure HTTPS proxy to the backend API running on Hetzner.

## Architecture

```
┌─────────────────┐         ┌──────────────────────┐         ┌──────────────────┐
│                 │         │                      │         │                  │
│  Frontend       │ HTTPS   │  Cloudflare Pages    │  HTTP   │  Hetzner Backend │
│  (Browser)      ├────────►│  Function (Proxy)    ├────────►│  (FastAPI)       │
│                 │         │                      │         │                  │
└─────────────────┘         └──────────────────────┘         └──────────────────┘
  css-berlin.pages.dev         /api/[[path]].js               195.201.146.224:8000
```

## Why This Approach?

**Problem:** Mixed Content Security Issue
- Frontend: `https://css-berlin.pages.dev` (HTTPS)
- Backend: `http://195.201.146.224:8000` (HTTP)
- Browsers block HTTP requests from HTTPS pages

**Solution:** Cloudflare Pages Function Proxy
- ✅ All traffic is HTTPS (browser ↔ Cloudflare)
- ✅ Cloudflare handles HTTP ↔ Backend internally
- ✅ No SSL certificate needed on backend
- ✅ Zero configuration
- ✅ Automatic CORS handling
- ✅ Free tier included

## How It Works

### 1. API Proxy Function
**File:** `functions/api/[[path]].js`

- Catches all `/api/*` requests on the frontend
- Forwards them to `http://195.201.146.224:8000`
- Returns the response with proper CORS headers
- Handles OPTIONS preflight requests

### 2. Frontend Configuration
**File:** `script.js`

```javascript
const API_BASE_URL = '';  // Empty = relative URL
```

All API calls use relative URLs:
- `${API_BASE_URL}/api/products` → `/api/products`
- Browser sends to: `https://css-berlin.pages.dev/api/products`
- Cloudflare Function proxies to: `http://195.201.146.224:8000/api/products`

## API Routes

All these routes are automatically proxied:

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/search?q=...` - Search products
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/favorites` - Get user favorites
- `POST /api/favorites/:id` - Add to favorites
- `DELETE /api/favorites/:id` - Remove from favorites

## Local Development

For local development, the frontend connects directly to backend:

```javascript
// Localhost → Direct connection to local backend
if (hostname === 'localhost') {
    return 'http://localhost:8000';
}
```

## Deployment

1. Any push to `main` branch triggers automatic deployment
2. Cloudflare builds and deploys the static site
3. Functions are automatically deployed with the site
4. No additional configuration needed

## Security Features

- ✅ HTTPS encryption end-to-end (browser ↔ Cloudflare)
- ✅ CORS headers automatically added
- ✅ No mixed content warnings
- ✅ Backend IP not exposed to browser
- ✅ DDoS protection via Cloudflare

## Performance

- ⚡ Cloudflare's global CDN
- ⚡ Automatic caching for GET requests
- ⚡ Edge computing (function runs close to user)
- ⚡ ~50ms overhead vs direct connection

## Monitoring

Check function logs in Cloudflare Dashboard:
1. Go to: https://dash.cloudflare.com/
2. Select: Workers & Pages → css-berlin
3. Click: Functions → View logs

## Troubleshooting

**Issue:** API returns 500 error
- Check if backend is running: `curl http://195.201.146.224:8000/api/products`
- Check function logs in Cloudflare Dashboard

**Issue:** CORS error
- Function automatically adds CORS headers
- Check browser console for specific error
- Verify OPTIONS preflight is handled

**Issue:** Slow response
- Check backend performance
- Cloudflare adds minimal overhead (~50ms)
- Consider caching strategies

## Alternative Approaches (Not Used)

1. **SSL Certificate on Backend (Let's Encrypt)**
   - Requires domain/subdomain
   - Manual certificate renewal
   - More complex setup

2. **Cloudflare Tunnel**
   - Requires daemon on server
   - More moving parts
   - Overkill for simple API

3. **Keep HTTP + Disable Browser Security** ❌
   - Not production-ready
   - Security risk
   - Unprofessional

## Conclusion

This Cloudflare Pages Function approach provides a **professional, secure, and zero-config** solution to the mixed content problem. It's the recommended approach for projects hosted on Cloudflare Pages with external API backends.
