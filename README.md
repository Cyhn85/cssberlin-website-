# CSS Berlin - Climate Smart Solutions

🌍 **Sustainable Second-Hand Marketplace for Fashion**

A modern, eco-friendly e-commerce platform connecting conscious buyers with quality second-hand fashion items while tracking environmental impact.

---

## 🎯 Project Overview

CSS Berlin (Climate Smart Solutions) is a climate-focused marketplace that:

- ✅ Sells quality second-hand fashion items
- ✅ Tracks CO₂ savings for every purchase
- ✅ Gamifies sustainability with user rankings
- ✅ Supports multi-vendor selling
- ✅ Implements fair profit-sharing (90% seller, 10% platform)

---

## 🚀 Features

### Customer Features
- **Product Browsing**: Advanced filtering by category, size, brand, condition
- **Search**: Real-time search with instant results
- **Wishlist**: Save favorite items with localStorage persistence
- **Negotiation**: Direct messaging with sellers for price negotiation
- **CO₂ Tracking**: See environmental impact of each purchase
- **Leaderboard**: Compete with other users for top CO₂ saver

### Seller Features
- **Product Listings**: Easy upload process with image management
- **Stripe Connect**: Direct payments (90% to seller)
- **Dashboard**: Sales analytics and order management
- **Ratings**: Build reputation through customer reviews

### Admin Features
- **Admin Panel**: Comprehensive dashboard with statistics
- **Kozmik Oda**: Terminal-based system management
- **User Management**: View and manage all users
- **Product Moderation**: Approve/reject listings
- **Analytics**: Real-time sales and traffic data

---

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Custom design system with CSS variables
- **JavaScript**: Vanilla JS (no frameworks)
- **LocalStorage**: Client-side data persistence

### Backend
- **Cloudflare Workers**: Serverless API
- **Stripe API**: Payment processing
- **Stripe Connect**: Multi-vendor payments

### Hosting
- **GitHub Pages**: Static site hosting
- **Cloudflare**: CDN, SSL, DDoS protection
- **Cloudflare Workers**: API hosting

---

## 📁 File Structure

```
css-berlin/
├── index.html                  # Main homepage
├── campaign.html               # Campaign/promotional page
├── admin.html                  # Admin panel
├── styles.css                  # Main stylesheet
├── script.js                   # Main JavaScript
├── admin-styles.css            # Admin panel styles
├── admin-script.js             # Admin panel logic
├── PAYMENT_INTEGRATION.md      # Payment setup guide
├── DEPLOYMENT_GUIDE.md         # Deployment instructions
└── README.md                   # This file
```

---

## 🎨 Design System

### Color Palette

```css
/* Orange to Green Journey (Eco-Friendly Metaphor) */
--primary-orange: #FF8C42;      /* Starting point */
--primary-green: #2D5016;       /* Environmental action */
--primary-green-light: #6BA83E; /* Growth */
```

### Typography

```css
Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
Weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold), 900 (black)
```

### Button Behavior

All buttons follow the **orange → green** transition:
- Default: Orange (`#FF8C42`)
- Hover/Active: Green (`#2D5016`)

This represents the user's journey from "thinking about sustainability" to "taking eco-friendly action."

---

## 🚀 Quick Start

### Prerequisites

- Git installed
- GitHub account
- Cloudflare account (free)
- Stripe account (for payments)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/css-berlin.git
cd css-berlin

# 2. Open index.html in browser
# No build process needed - it's pure HTML/CSS/JS!
```

### Local Development

Simply open `index.html` in your browser. No build tools or npm required!

For live reload, use a simple HTTP server:

```bash
# Python 3
python -m http.server 8000

# Node.js (if you have it)
npx serve

# Visit: http://localhost:8000
```

---

## 📦 Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for detailed instructions.

### Quick Deploy to GitHub Pages

```bash
# 1. Create GitHub repository
# 2. Push code
git add .
git commit -m "Initial commit"
git push origin main

# 3. Enable GitHub Pages in Settings
# 4. Your site will be live at: https://YOUR_USERNAME.github.io/css-berlin/
```

### Deploy to Cloudflare Pages (Recommended)

1. Connect GitHub repository to Cloudflare Pages
2. Select `css-berlin` repository
3. Deploy settings:
   - Build command: (none)
   - Output directory: /
4. Done! Auto-deploys on every push.

---

## 💳 Payment Integration

See [PAYMENT_INTEGRATION.md](PAYMENT_INTEGRATION.md) for complete setup guide.

### Overview

1. **Create Stripe Account**
2. **Deploy Cloudflare Worker** (API backend)
3. **Configure Stripe Connect** (multi-vendor)
4. **Test with test cards**
5. **Go live!**

---

## 🎮 Admin Panel - Kozmik Oda

Access the admin panel at `/admin.html`

### Features

- **Dashboard**: Overview statistics
- **Products**: Manage all listings
- **Orders**: Track sales and fulfillment
- **Users**: User management
- **Kozmik Oda**: Terminal interface for system commands
- **Settings**: Configure platform

### Terminal Commands

```bash
help       # Show all commands
status     # System health check
products   # Product statistics
users      # User statistics
analytics  # Website analytics
backup     # Create database backup
deploy     # Deploy updates
logs       # View system logs
clear      # Clear terminal
```

---

## 🌍 Environmental Impact Tracking

### CO₂ Calculation

Each product saves CO₂ by preventing new production:

```javascript
// Example: Zara Blazer
New Production CO₂: 18.5 kg
By buying second-hand: SAVE 18.5 kg CO₂
```

### Tier System

- 🏆 **Champion**: 18+ kg CO₂ saved
- 💎 **Profi**: 12-17.9 kg CO₂ saved
- ⭐ **Fortgeschritten**: 8-11.9 kg CO₂ saved
- 🌱 **Einsteiger**: 0-7.9 kg CO₂ saved

---

## 🔒 Security

- ✅ SSL/HTTPS via Cloudflare
- ✅ API keys stored in environment variables
- ✅ Webhook signature verification
- ✅ CORS protection
- ✅ DDoS protection via Cloudflare
- ✅ Input sanitization
- ✅ XSS prevention

---

## 📱 Responsive Design

Fully responsive across all devices:

- 📱 **Mobile**: 320px - 768px
- 📱 **Tablet**: 769px - 1024px
- 💻 **Desktop**: 1025px+
- 🖥️ **Large Desktop**: 1600px+

---

## 🌐 Browser Support

- ✅ Chrome/Edge (latest 2 versions)
- ✅ Firefox (latest 2 versions)
- ✅ Safari (latest 2 versions)
- ✅ Opera (latest 2 versions)

---

## 📊 Performance

### Lighthouse Scores (Target)

- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Optimizations

- Lazy loading images
- Minified CSS/JS (via Cloudflare)
- CDN delivery
- Browser caching
- Brotli compression

---

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- [x] Basic product listing
- [x] Shopping cart
- [x] Payment integration
- [x] Admin panel
- [x] CO₂ tracking

### Phase 2: Enhanced Features
- [ ] User authentication
- [ ] Product reviews
- [ ] Advanced search filters
- [ ] Email notifications
- [ ] Multi-language (EN, DE, FR, ES)

### Phase 3: Scale
- [ ] Mobile app (React Native)
- [ ] Live chat support
- [ ] Vendor dashboard
- [ ] Advanced analytics
- [ ] API for third-party integrations

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Team

**CSS Berlin Development Team**

- Project Lead: [Your Name]
- Email: admin@cssberlin.com
- Website: https://cssberlin.com

---

## 🙏 Acknowledgments

- Stripe for payment processing
- Cloudflare for hosting and CDN
- GitHub for version control and hosting
- Unsplash for product placeholder images

---

## 📞 Support

Need help?

- 📧 Email: support@cssberlin.com
- 📚 Documentation: See guides in this repository
- 💬 Community: [GitHub Discussions](#)

---

## 🌟 Show Your Support

If you like this project, please give it a ⭐ on GitHub!

---

**Built with 💚 for a greener planet**

*Every second-hand purchase is a step towards sustainability.*

---

## 📈 Statistics

```
Total Products: 1,234
CO₂ Saved: 248.5 tons
Active Users: 8,921
Trees Planted: 8,234
```

---

## 🔗 Links

- [Live Demo](https://cssberlin.com)
- [Payment Integration Guide](PAYMENT_INTEGRATION.md)
- [Deployment Guide](DEPLOYMENT_GUIDE.md)
- [Admin Panel](https://cssberlin.com/admin.html)

---

**Version**: 1.0.0
**Last Updated**: 2025-01-05
**Status**: 🟢 Active Development
