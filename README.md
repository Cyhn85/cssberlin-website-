# 🛍️ CSS Berlin - Second-Hand Fashion Marketplace

Modern, full-stack e-commerce platform for second-hand fashion items. Built with FastAPI backend and vanilla JavaScript frontend.

[![Deploy Status](https://img.shields.io/badge/deploy-ready-success)](https://github.com/Cyhn85/cssberlin-website-)
[![Backend](https://img.shields.io/badge/backend-online-success)](http://195.201.146.224:8000)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## ✨ Features

### 🔐 Authentication System
- JWT-based authentication with 7-day token expiry
- Modern login/register modal with tabs
- Google OAuth integration (ready)
- Secure password hashing (PBKDF2-HMAC-SHA256)
- Protected actions (favorites, buy, negotiate)

### ⭐ Favorites System
- Full-stack favorites with API sync
- LocalStorage fallback for non-logged users
- Real-time favorite count badge
- Persistent across sessions
- One-click toggle

### 🛒 E-commerce Features
- Product listing with categories (Damen, Herren, Kinder)
- Advanced product detail pages
- Similar products recommendations
- Price negotiation system
- Shopping cart
- Secure checkout
- Shipping tracking (Vinted-style)

### 🎨 Modern UI/UX
- Vinted-inspired design
- Responsive layout (mobile-first)
- Smooth animations and transitions
- Loading states
- Error handling
- Toast notifications

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js (optional, for local server)
- Git

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs on: http://localhost:8000

### Frontend Setup

```bash
# Simple HTTP server
python -m http.server 8080
```

Frontend runs on: http://localhost:8080

## 📁 Project Structure

```
css-berlin-website/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # Authentication logic
│   ├── database.py          # Database configuration
│   └── requirements.txt     # Python dependencies
├── auth-gate.js             # Login modal system
├── favorites.js             # Favorites manager
├── api-config.js            # API configuration
├── api-client.js            # API client wrapper
├── styles.css               # Global styles
├── script.js                # Main JavaScript
├── index.html               # Homepage
├── product-detail.html      # Product page
├── damen.html               # Women's category
├── herren.html              # Men's category
├── kinder.html              # Kids category
└── DEPLOYMENT_GUIDE.md      # Deployment instructions
```

## 🌐 Deployment

### Cloudflare Pages (Frontend)
1. Fork or clone this repository
2. Connect to Cloudflare Pages
3. Configure:
   - Build command: (leave empty)
   - Build output: /
4. Deploy!

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

### Hetzner Server (Backend)
Already deployed and running:
- API: http://195.201.146.224:8000
- Health: http://195.201.146.224:8000/health
- Docs: http://195.201.146.224:8000/docs

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product
- `GET /api/products/{id}` - Get product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Favorites
- `POST /api/favorites/{product_id}` - Add to favorites
- `DELETE /api/favorites/{product_id}` - Remove from favorites
- `GET /api/favorites` - Get user's favorites
- `GET /api/favorites/check/{product_id}` - Check if favorited

### Offers & Messages
- `POST /api/offers` - Create price offer
- `GET /api/offers` - List offers
- `POST /api/messages` - Send message
- `GET /api/messages` - Get messages

Full API documentation: http://195.201.146.224:8000/docs

## 🧪 Testing

### Test Account
```
Email: test@cssberlin.de
Password: test123
```

### Test Scenarios
1. **Login Gate:** Click wishlist → Login modal opens
2. **Favorites:** Add/remove products → Persists after refresh
3. **Similar Products:** Scroll to bottom → 4 products load
4. **Responsive:** Test on mobile/tablet

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern async web framework
- **SQLAlchemy** - ORM with async support
- **SQLite** - Database
- **JWT** - Token-based auth
- **Pydantic** - Data validation

### Frontend
- **Vanilla JavaScript** - No framework overhead
- **Modern CSS** - Flexbox, Grid, Custom Properties
- **Responsive Design** - Mobile-first approach
- **LocalStorage** - Offline support

## 📊 Database Schema

7 tables:
- **users** - User accounts
- **products** - Product listings
- **favorites** - User favorites
- **offers** - Price negotiations
- **messages** - User messages
- **orders** - Purchase records
- **shipments** - Shipping tracking

## 🔒 Security

- PBKDF2-HMAC-SHA256 password hashing
- JWT tokens with expiry
- Protected API endpoints
- CORS configuration
- Input validation
- SQL injection protection

## 📈 Performance

- Async/await throughout
- Lazy image loading
- Code splitting ready
- Optimized assets
- CDN-ready

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📝 License

MIT License - see [LICENSE](LICENSE) file

## 👥 Authors

- CSS Berlin Team
- Built with [Claude Code](https://claude.com/claude-code)

## 🙏 Acknowledgments

- Vinted for design inspiration
- FastAPI for excellent documentation
- Unsplash for placeholder images

---

**Live Demo:** Coming soon on Cloudflare Pages  
**Backend API:** http://195.201.146.224:8000  
**Repository:** https://github.com/Cyhn85/cssberlin-website-

🌟 Star this repo if you find it useful!
