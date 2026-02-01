# GoCart

GoCart is an open-source multi-vendor e-commerce marketplace built with Next.js 15. It allows multiple sellers to register their own stores, manage products independently, and sell on a unified platform. The platform provides a full buyer shopping experience, seller management dashboard, and admin control panel.

## Features

### Buyer

- Product browsing and category-based search
- Shopping cart with Redux + database persistence
- Multi-store checkout with Stripe online payment and Cash on Delivery (COD)
- Shipping address management
- Order history and tracking
- Product ratings and reviews
- Coupon / promo code validation
- Plus membership (free shipping, exclusive coupons)

### Seller

- Store registration and profile management
- Product management (add, edit, toggle stock status)
- Multi-image upload via ImageKit CDN
- AI-powered product image analysis for auto-extracting product name and description (Gemini 2.0 Flash)
- Sales dashboard (orders, revenue, ratings overview)
- Order management

### Admin

- Store approval workflow (approve / reject / deactivate)
- Coupon management (create, delete, auto-expiry)
- Platform-wide statistics and analytics

### Platform Capabilities

- Multi-vendor architecture: a single checkout automatically splits orders by store
- Event-driven user sync: Clerk Webhooks → Inngest background jobs → database sync
- Automated coupon expiry scheduling via Inngest
- Edge Runtime compatible (Neon Serverless Adapter)

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router + Turbopack) |
| Styling | Tailwind CSS 4 |
| State Management | Redux Toolkit |
| Database | PostgreSQL (Neon Serverless) |
| ORM | Prisma 6 + Neon Adapter |
| Authentication | Clerk |
| Payments | Stripe |
| Image Storage | ImageKit |
| AI | OpenAI SDK / Gemini 2.0 Flash |
| Background Jobs | Inngest |
| Charts | Recharts |
| Icons | Lucide React |

## Project Structure

```
app/
├── (public)/          # Buyer pages (home, products, cart, orders)
├── store/             # Seller dashboard (analytics, product management, orders)
├── admin/             # Admin panel (approval, coupons, statistics)
└── api/               # API routes
    ├── product/       # Product endpoints
    ├── store/         # Store & seller endpoints
    ├── admin/         # Admin endpoints
    ├── cart/          # Cart endpoints
    ├── orders/        # Order endpoints
    ├── address/       # Address endpoints
    ├── coupon/        # Coupon endpoints
    ├── rating/        # Rating endpoints
    ├── stripe/        # Stripe webhook
    └── inngest/       # Inngest background jobs
```

## Getting Started

### Environment Variables

The project requires the following environment variables. Configure them in `.env`:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database (Neon PostgreSQL)
DATABASE_URL=
DIRECT_DATABASE_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# ImageKit
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
IMAGEKIT_URL_ENDPOINT=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# OpenAI / Gemini
OPENAI_API_KEY=
OPENAI_BASE_URL=
OPENAI_MODEL=

# Admin
ADMIN_EMAILS=
```

### Install and Run

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Data Models

The platform has 8 core data models:

- **User** — Buyers and sellers
- **Store** — Vendor stores (with approval status)
- **Product** — Marketplace products
- **Order** — Orders (split by store)
- **OrderItem** — Order line items
- **Rating** — Product reviews
- **Address** — Shipping addresses
- **Coupon** — Promotional codes