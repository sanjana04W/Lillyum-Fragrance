# Lillyum Fragrance E-Commerce Platform

Full-stack Next.js e-commerce store for Lillyum Fragrance — Sri Lanka's authentic perfume shop.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage)
- **State**: Zustand (cart)
- **Forms**: React Hook Form + Zod
- **Emails**: EmailJS
- **Tracking**: Meta Pixel + TikTok Pixel

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Copy `.env.local` and fill in:
- EmailJS credentials (from [emailjs.com](https://emailjs.com))
- Meta Pixel ID (from Meta Business Manager)
- TikTok Pixel ID (from TikTok Ads Manager)

## Project Structure

```
src/
├── app/               # Next.js App Router pages
│   ├── admin/         # Admin panel (auth-protected)
│   ├── shop/          # Shop & category pages
│   ├── product/       # Product detail pages
│   ├── cart/          # Cart page
│   ├── checkout/      # Checkout page
│   └── api/           # API routes
├── components/        # UI components
│   ├── layout/        # Header, Footer
│   ├── home/          # Hero, CategoryNav, etc.
│   ├── products/      # ProductCard, ProductGrid
│   └── cart/          # CartDrawer
├── services/          # Firebase, Email, Analytics
├── store/             # Zustand stores
├── types/             # TypeScript types
├── lib/               # Utils, constants, Firebase config
└── data/              # Seed product catalog
```

## Admin Panel

Go to `/admin/login` and sign in with a Firebase user that has a document in the `users` Firestore collection with `role: "Owner"` or `role: "Staff"`.

## Seeding Products to Firestore

The `src/data/products.ts` file contains sample data. To push to Firestore, run the seed script or use the Admin Panel → Products → Add Product.
