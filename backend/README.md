# CSS Berlin Backend API

FastAPI backend for cssberlin.de e-commerce platform.

## Quick Start

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### 2. Run the Server

```bash
python main.py
```

Or with uvicorn:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Test the API

- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user info

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/{id}` - Get single product
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/{id}` - Update product (auth required)
- `DELETE /api/products/{id}` - Delete product (auth required)

### Offers (Negotiations)
- `POST /api/offers` - Create price offer
- `GET /api/offers` - Get user's offers
- `PUT /api/offers/{id}/accept` - Accept offer
- `PUT /api/offers/{id}/counter` - Send counter offer
- `PUT /api/offers/{id}/decline` - Decline offer

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/{user_id}` - Get conversation

## Database

Uses SQLite for development (`cssberlin.db`).

For production, set `DATABASE_URL` environment variable:
```
DATABASE_URL=postgresql+asyncpg://user:password@localhost/cssberlin
```

## Environment Variables

```env
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite+aiosqlite:///./cssberlin.db
```

## Frontend Integration

Add to your HTML:
```html
<script src="api-client.js"></script>
```

Usage:
```javascript
// Login
const data = await api.login('email@example.com', 'password');

// Get products
const products = await api.getProducts({ category: 'Herren' });

// Create offer
await api.createOffer(productId, 65.00, 'Mein Angebot');
```
