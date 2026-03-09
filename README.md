<<<<<<< HEAD
# 🌊 ShopWave — Full-Stack E-Commerce Platform

A production-ready e-commerce application built with Next.js, Node.js, and PostgreSQL.

![ShopWave](https://via.placeholder.com/1200x400/f97316/ffffff?text=ShopWave+E-Commerce)

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React, Tailwind CSS |
| State | Zustand |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (Neon for production) |
| Auth | JWT + bcrypt |
| Payments | Razorpay (test mode) |
| Deployment | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
shopwave/
├── frontend/          # Next.js App
│   ├── app/           # Pages (App Router)
│   ├── components/    # Reusable UI components
│   ├── services/      # API client (axios)
│   └── hooks/         # Zustand stores
│
├── backend/           # Express REST API
│   ├── controllers/   # Business logic
│   ├── routes/        # API routes
│   ├── middleware/     # Auth, error handling
│   └── config/        # DB connection
│
└── database/
    └── schema.sql     # PostgreSQL schema + seed data
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (or Neon account)

### 1. Database Setup
```bash
# Create database and run schema
psql -U postgres -c "CREATE DATABASE shopwave;"
psql -U postgres -d shopwave -f database/schema.sql
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in your DATABASE_URL, JWT_SECRET, RAZORPAY keys
npm install
npm run dev   # Starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm install
npm run dev   # Starts on http://localhost:3000
```

---

## 🔑 Test Credentials

| Role | Email | Password |
|------|-------|---------|
| Admin | admin@shopwave.com | Admin@123 |

**Test Payment (Razorpay):**
- Card: `4111 1111 1111 1111`
- Expiry: Any future date
- CVV: Any 3 digits

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/profile` | Get profile (auth required) |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (supports ?category, ?search, ?page, ?sort) |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |

### Cart
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get user cart |
| POST | `/api/cart` | Add to cart |
| PUT | `/api/cart/:id` | Update quantity |
| DELETE | `/api/cart/:id` | Remove item |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Create order |
| GET | `/api/orders` | Get user orders |
| GET | `/api/orders/:id` | Get single order |
| PUT | `/api/orders/:id/status` | Update status (admin) |

### Payment
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment signature |

---

## 🏗️ Architecture

```
Browser → Next.js (Vercel)
              ↓ REST API
         Express.js (Render)
              ↓
         PostgreSQL (Neon)
```

**Key Design Decisions:**
- **Separation of Concerns:** Frontend/backend are fully independent services
- **Stateless Auth:** JWT tokens stored client-side, no server sessions
- **Transaction Safety:** Order creation uses PostgreSQL transactions to prevent partial states
- **Soft Delete:** Products use `is_active` flag instead of hard deletion to preserve order history

---

## 🔧 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel deploy
```
Set env: `NEXT_PUBLIC_API_URL=https://your-backend.render.com/api`

### Backend (Render)
1. Connect GitHub repo to Render
2. Set environment variables
3. Build command: `npm install`
4. Start command: `npm start`

### Database (Neon)
1. Create project at neon.tech
2. Copy connection string to `DATABASE_URL`
3. Run `database/schema.sql`

---

## ✅ Features

- **Customer**: Browse, search, filter, cart, checkout, order history
- **Admin**: Product CRUD, order management, analytics dashboard
- **Auth**: JWT authentication, bcrypt password hashing, protected routes
- **Payments**: Razorpay integration with signature verification
- **Security**: Helmet, CORS, rate limiting, input validation

---

## 🔮 Future Improvements

- Product image upload (Cloudinary/S3)
- Email notifications (order confirmation, shipping updates)
- Product reviews and ratings
- Discount coupon system
- Advanced analytics (charts, revenue trends)
- PWA support
- Redis caching for product listings


Test API Key : rzp_test_SOcCiwyqxSfd5P

Test Key Secret : ysG77GSEq3Nokte73nuwj29Q
=======
# shopwave-ecommerce
>>>>>>> d30ea47cd90b7367a33e0eb92858a8baba174e5c
