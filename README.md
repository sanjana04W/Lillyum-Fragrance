# 🌸 Lillyum Fragrance

### Premium Perfumes & Fragrances E-Commerce Website

A modern, responsive, and SEO-friendly e-commerce platform developed for **Lillyum Fragrance**, a Sri Lankan perfume business. The website transforms the brand's social-media-based selling process into a centralized online shopping experience with product browsing, fragrance discovery, shopping cart, Cash on Delivery checkout, customer accounts, inventory management, order management, promotions, analytics, and an administrative dashboard.

---

## ✨ Overview

**Lillyum Fragrance** is designed to provide customers with a premium digital shopping experience for discovering and purchasing perfumes online.

The platform allows customers to:

* 🛍️ Browse the complete fragrance catalog
* 🔎 Search and filter perfumes
* 🌸 Explore fragrances by category, brand, gender, concentration, size, and price
* 📖 View detailed fragrance information
* 🛒 Add products to a shopping cart
* 💳 Complete Cash on Delivery orders
* 👤 Create and manage customer accounts
* 📦 Receive order confirmations
* 📱 Access the website from mobile, tablet, and desktop devices

The system also provides an administrative platform for managing products, inventory, customers, orders, promotions, messages, users, and analytics.

---

## 🎯 Project Objectives

The main objectives of the Lillyum Fragrance website are:

* Build a fully functional online perfume store.
* Reduce dependency on Facebook, Instagram, and TikTok DM-based ordering.
* Provide structured and complete fragrance information.
* Simplify the customer shopping and checkout process.
* Centralize product, inventory, and order management.
* Reduce inventory discrepancies and overselling.
* Support Cash on Delivery ordering.
* Improve organic search visibility through SEO.
* Enable Meta Pixel and TikTok Pixel conversion tracking.
* Provide analytics for products, orders, customers, and marketing activities.

The original business workflow relied heavily on social-media communication for product discovery and order coordination, creating operational overhead and fragmented product information.

---

## 🚀 Key Features

### 🛍️ Customer Storefront

* Modern luxury-inspired interface
* Responsive and mobile-first design
* Hero promotional carousel
* Featured products
* New arrivals
* Best sellers
* Promotional offers
* Brand/category navigation
* Product search
* Product filtering
* Product sorting
* Product recommendations
* Instagram/social content integration
* Customer testimonials
* Trust and brand sections

---

### 🌺 Product Catalog

Customers can discover fragrances using:

* Brand
* Men's Fragrances
* Women's Fragrances
* Unisex Fragrances
* EDP
* EDT
* Extrait
* New Arrivals
* Best Sellers
* Offers & Sale

Each product can contain:

* Product name
* Brand
* Description
* Fragrance concentration
* Fragrance family
* Top notes
* Middle notes
* Base notes
* Bottle size
* Price
* Sale price
* Product images
* Availability
* Authenticity information
* Stock status

---

## 🔍 Product Search & Filtering

The shop provides structured product discovery through:

* Search by product name
* Brand filtering
* Gender filtering
* Fragrance type/concentration
* Bottle size
* Price range
* Category filtering

Available sorting options include:

* Newest
* Price: Low → High
* Price: High → Low
* Best Selling

---

## 🛒 Shopping Cart

Customers can:

* Add fragrances to the cart
* Select bottle-size variants
* Increase/decrease quantities
* Remove products
* Review selected products
* View subtotal
* View delivery charges
* Review the final order total
* Continue to checkout

The project includes a dedicated cart drawer component and centralized cart state management.

---

## 📦 Cash on Delivery Checkout

The initial checkout workflow supports **Cash on Delivery (COD)**.

Customers provide:

* Full name
* Phone number
* Email
* Delivery address
* District
* Delivery notes
* Order details

The checkout then displays:

* Selected products
* Bottle sizes
* Quantities
* Subtotal
* Delivery fee
* Total amount
* Payment method
* Order confirmation

The architecture also reserves payment fields for future integration with online payment providers such as PayHere, iPay, or KOKO.

---

## ✅ Order Confirmation

After successfully placing an order, customers receive an order confirmation containing:

* Order reference number
* Ordered products
* Selected variants
* Quantities
* Payment method
* Delivery information
* Order total
* Estimated delivery information

---

# 👤 Customer Account

Registered customers can access their personal account through:

* Registration
* Login
* Profile management
* Order-related information

The implemented project includes dedicated authentication and profile pages.

---

# 🧑‍💼 Admin Dashboard

The Lillyum Fragrance admin platform provides centralized business management.

### Admin Modules

| Module          | Description                                     |
| --------------- | ----------------------------------------------- |
| 📊 Analytics    | Sales, order, customer and performance insights |
| 📋 Orders       | View and manage customer orders                 |
| 📦 Products     | Create, edit and manage fragrance products      |
| 📈 Inventory    | Track stock and bottle-size variants            |
| 👥 Customers    | Manage customer information and order history   |
| 🎁 Promotions   | Manage discounts, offers and campaigns          |
| ⭐ Featured      | Manage featured products                        |
| 💬 Messages     | Manage customer inquiries                       |
| 🗂️ Master Data | Manage categories, brands and related data      |
| 👤 Users        | Manage admin/staff accounts                     |
| ⚙️ Settings     | Manage system configuration                     |
| 📝 Audit Logs   | Track administrative activities                 |

The project structure contains dedicated routes for these administration modules.

---

# 📦 Inventory Management

Inventory is managed at the product and bottle-size variant level.

### Inventory Features

* Track stock quantities
* Track stock by bottle size
* Low-stock identification
* Out-of-stock status
* Manual stock adjustments
* Stock restoration after cancellation
* Hide products without deleting them
* Controlled stock updates

The planned inventory rules are designed to reduce overselling and keep storefront availability synchronized with actual inventory.

---

# 📋 Order Management

Administrators can manage orders through the following lifecycle:

```text
Pending
   ↓
Confirmed
   ↓
Processing
   ↓
Dispatched
   ↓
Completed
```

Cancellation can occur when an order cannot be fulfilled:

```text
Pending / Confirmed
        ↓
    Cancelled
```

### Order Management Features

* View all orders
* Filter by order status
* View customer information
* View delivery details
* View ordered products
* View selected variants
* Update order status
* Add internal notes
* Follow up with customers through WhatsApp
* Maintain order history

The documented workflow defines six states: Pending, Confirmed, Processing, Dispatched, Completed, and Cancelled.

---

# 🎁 Promotions & Offers

The platform supports promotional management including:

* Percentage discounts
* Fixed-amount discounts
* Product-specific promotions
* Site-wide promotions
* Promotional banners
* Sale badges
* New Arrival badges
* Best Seller badges
* Limited Stock badges
* Special Offer badges
* Campaign date ranges
* Promotional codes

Promotions can be synchronized with Facebook, Instagram, and TikTok campaigns.

---

# 📊 Analytics & Marketing

The admin dashboard is designed to provide insights into:

* Daily order volume
* Weekly order volume
* Monthly order volume
* Revenue trends
* Best-selling fragrances
* Best-selling bottle sizes
* New customers
* Repeat customers
* Product performance
* Marketing conversions

### Conversion Tracking

The platform is designed to support:

* `PageView`
* `ViewContent`
* `AddToCart`
* `InitiateCheckout`
* `Purchase`

using:

* Meta Pixel
* TikTok Pixel

This allows the business to measure social-media campaign performance and identify customer actions throughout the purchase funnel.

---

# 💬 Customer Messages

The website includes a customer inquiry system for:

* Product inquiries
* Order support
* General questions
* Return/exchange requests
* Customer communication

Administrators can manage inquiries using statuses such as:

```text
New → In Progress → Resolved
```

The system also supports quick communication links through WhatsApp or email.

---

# 📱 Responsive Design

The website is designed with a **mobile-first approach** for customers who discover Lillyum Fragrance through social media.

The interface is optimized for:

* 📱 Mobile
* 💻 Desktop
* 📲 Tablet

The research specifies a fast-loading mobile experience with high-quality product photography and simple navigation.

---

# 🏗️ Project Architecture

```text
Lillyum Fragrance
│
├── Customer Website
│   ├── Home
│   ├── About
│   ├── Shop
│   ├── Categories
│   ├── Product Details
│   ├── Offers
│   ├── FAQ
│   ├── Contact
│   ├── Cart
│   ├── Checkout
│   ├── Order Confirmation
│   ├── Login
│   ├── Register
│   ├── Profile
│   └── Policies
│
├── Admin Dashboard
│   ├── Dashboard
│   ├── Analytics
│   ├── Orders
│   ├── Products
│   ├── Inventory
│   ├── Customers
│   ├── Promotions
│   ├── Featured Products
│   ├── Messages
│   ├── Master Data
│   ├── Users
│   ├── Settings
│   └── Audit Logs
│
├── Firebase
│   ├── Authentication
│   ├── Firestore
│   └── Storage
│
└── Integrations
    ├── EmailJS
    ├── Meta Pixel
    └── TikTok Pixel
```

---

# 📁 Project Structure

```text
Lillyum-Fragrance/
│
├── public/
│   ├── images/
│   ├── videos/
│   ├── logo.jpg
│   └── robots.txt
│
├── src/
│   │
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── sitemap.ts
│   │   │
│   │   ├── about/
│   │   ├── admin/
│   │   │   ├── analytics/
│   │   │   ├── audit-logs/
│   │   │   ├── customers/
│   │   │   ├── featured/
│   │   │   ├── inventory/
│   │   │   ├── login/
│   │   │   ├── master-data/
│   │   │   ├── messages/
│   │   │   ├── orders/
│   │   │   ├── products/
│   │   │   ├── promotions/
│   │   │   ├── settings/
│   │   │   └── users/
│   │   │
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   └── orders/
│   │   │
│   │   ├── cart/
│   │   ├── checkout/
│   │   ├── contact/
│   │   ├── faq/
│   │   ├── login/
│   │   ├── offers/
│   │   ├── order-confirmation/
│   │   ├── policies/
│   │   │   ├── privacy/
│   │   │   ├── returns/
│   │   │   └── shipping/
│   │   ├── product/
│   │   │   └── [slug]/
│   │   ├── profile/
│   │   ├── register/
│   │   └── shop/
│   │       └── [category]/
│   │
│   ├── components/
│   │   ├── cart/
│   │   │   └── CartDrawer.tsx
│   │   │
│   │   ├── home/
│   │   │   ├── BestSellersSection.tsx
│   │   │   ├── BrandPerksSection.tsx
│   │   │   ├── BrandStoryBanner.tsx
│   │   │   ├── CategoryNav.tsx
│   │   │   ├── EditorialSpotlight.tsx
│   │   │   ├── FeaturedProducts.tsx
│   │   │   ├── FindYourScentBanner.tsx
│   │   │   ├── FragrancesThroughVideo.tsx
│   │   │   ├── HeroBanner.tsx
│   │   │   ├── HeroCarousel.tsx
│   │   │   ├── InstagramFeed.tsx
│   │   │   ├── NewArrivalsSection.tsx
│   │   │   ├── RitualBanner.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── TestimonialsSection.tsx
│   │   │   ├── TrustStrip.tsx
│   │   │   └── WhatsAppFAB.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── ConditionalLayout.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Header.tsx
│   │   │
│   │   ├── products/
│   │   │   └── ProductCard.tsx
│   │   │
│   │   └── ui/
│   │       ├── Badge.tsx
│   │       ├── Button.tsx
│   │       └── Input.tsx
│   │
│   ├── context/
│   │   └── AuthContext.tsx
│   │
│   ├── data/
│   │   └── products.ts
│   │
│   ├── lib/
│   │   ├── constants.ts
│   │   ├── firebase-admin.ts
│   │   ├── firebase.ts
│   │   └── utils.ts
│   │
│   ├── services/
│   │   ├── analyticsService.ts
│   │   ├── customerAuthService.ts
│   │   ├── emailService.ts
│   │   └── firestoreService.ts
│   │
│   ├── store/
│   │   └── cartStore.ts
│   │
│   └── types/
│       └── index.ts
│
├── .env.local
├── .gitignore
├── next.config.js
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## The provided project structure confirms the `src/app`, `components`, `context`, `data`, `lib`, `services`, `store`, and `types` organization, as well as the customer and admin routes listed above.

# 🛠️ Technology Stack

| Technology                  | Purpose                        |
| --------------------------- | ------------------------------ |
| **Next.js**                 | Full-stack React framework     |
| **React**                   | User interface development     |
| **TypeScript**              | Type-safe development          |
| **Tailwind CSS**            | Responsive styling             |
| **Firebase**                | Backend services               |
| **Firebase Authentication** | Customer/admin authentication  |
| **Cloud Firestore**         | Database                       |
| **Firebase Storage**        | Product and promotional images |
| **Zustand**                 | Cart/state management          |
| **EmailJS**                 | Email notifications            |
| **Next Image**              | Image optimization             |
| **Meta Pixel**              | Marketing conversion tracking  |
| **TikTok Pixel**            | Marketing conversion tracking  |

The research specifies Next.js + Tailwind CSS for the frontend and Firebase Firestore, Authentication, Storage, Hosting, and Cloud Functions for the backend architecture.

---

# 🔥 Firebase Architecture

### Firestore Collections

```text
products
categories
brands
orders
customers
promotions
adminUsers
```

### `products`

Stores:

* Product ID
* Product name
* Slug
* Brand
* Category
* Gender
* Concentration
* Bottle sizes
* Fragrance family
* Top notes
* Middle notes
* Base notes
* Price
* Sale price
* Images
* Description
* Authenticity information
* Stock status
* Stock by size
* Featured status

### `orders`

Stores:

* Order ID
* Customer information
* Ordered items
* Selected size/variant
* Subtotal
* Delivery fee
* Total
* Payment method
* Payment status
* Order status
* Internal notes
* Tracking history
* Timestamps

The documented Firestore architecture defines these collections and their core attributes.

---

# 🔐 Authentication & Access Control

The system uses Firebase Authentication with role-based administrative access.

## 👑 Owner / Super Admin

Full access to:

* Products
* Inventory
* Orders
* Customers
* Promotions
* Analytics
* Settings
* Marketing configuration
* Staff management

## 👤 Staff / Operator

Restricted access to:

* Order processing
* Inventory operations
* Customer inquiries

Staff members do not have access to sensitive settings such as:

* Product pricing
* Promotional configuration
* Financial analytics
* Pixel configuration
* User management

The documented access model separates Owner and Staff permissions to protect sensitive business operations.

---

# 📧 Email Notifications

The notification system is designed to send order confirmation emails after successful order placement.

An order confirmation can contain:

* Order reference
* Products
* Bottle sizes
* Quantities
* Subtotal
* Delivery fee
* Total
* Delivery address
* Estimated delivery information
* Customer support details

**EmailJS** is planned as the initial email service, with the notification layer designed to remain replaceable with services such as SendGrid or Mailgun.

---

# 🔎 SEO

The website is designed with SEO as a core requirement.

### SEO Features

* Unique page titles
* Meta descriptions
* Open Graph metadata
* Clean URLs
* Canonical URLs
* XML sitemap
* `robots.txt`
* Structured data
* Product schema
* Organization/Brand schema
* Image alt text
* Internal linking
* Indexable product/category pages

Private administration pages should remain excluded from search engine indexing.

The research identifies perfume-related Sri Lankan search terms and specifies technical SEO requirements including sitemap, robots.txt, canonical URLs, and structured product data.

---

# ⚡ Performance Optimization

The project targets a fast mobile shopping experience.

### Performance Targets

```text
LCP < 2.5 seconds
CLS < 0.1
INP < 200 ms
Lighthouse Mobile: 85+
```

### Optimization Techniques

* Responsive images
* Lazy loading
* WebP/AVIF formats
* CDN delivery
* Optimized fonts
* Code splitting
* Browser caching
* Minimal third-party dependencies
* Indexed Firestore queries
* Pagination
* Optimized product photography

## These targets and optimization approaches are specified in the project research.

# 📱 Social Media Integration

Lillyum Fragrance currently uses social platforms for product discovery and marketing.

### Platforms

* Facebook
* Instagram
* TikTok

Social content can be integrated into:

* Homepage
* Product sections
* Promotional areas
* Social-proof sections

The supplied business research identifies these three platforms as the primary social discovery channels.

---

# 🧭 Customer Journey

```text
Facebook / Instagram / TikTok
              ↓
        Website Visit
              ↓
       Browse / Search
              ↓
      Product Details
              ↓
         Add to Cart
              ↓
          Checkout
              ↓
      Delivery Details
              ↓
      Cash on Delivery
              ↓
       Place Order
              ↓
     Order Confirmation
              ↓
          Processing
              ↓
         Dispatched
              ↓
          Completed
```

This workflow converts social-media discovery into a structured website purchasing journey.

---

# 🧪 Testing

Before production deployment, the following areas should be tested:

### Customer Website

* [ ] Homepage
* [ ] Product browsing
* [ ] Search
* [ ] Filters
* [ ] Sorting
* [ ] Product details
* [ ] Cart
* [ ] Checkout
* [ ] COD order placement
* [ ] Order confirmation
* [ ] Login
* [ ] Registration
* [ ] Profile
* [ ] Contact form
* [ ] FAQ
* [ ] Policies

### Admin Dashboard

* [ ] Admin login
* [ ] Product management
* [ ] Inventory management
* [ ] Order management
* [ ] Customer management
* [ ] Promotions
* [ ] Analytics
* [ ] Messages
* [ ] User management
* [ ] Settings
* [ ] Audit logs
* [ ] Role permissions

### Responsive Testing

* [ ] Mobile
* [ ] Tablet
* [ ] Desktop

---

# 💻 Getting Started

## Prerequisites

Make sure you have installed:

* **Node.js**
* **npm**
* A Firebase project

---

## 1. Clone the Repository

```bash
git clone https://github.com/your-username/lillyum-fragrance.git
```

```bash
cd lillyum-fragrance
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env.local` file in the project root.

Example:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Add other required configuration values for:

```env
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=

NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
```

> Never commit `.env.local` or other files containing private credentials to GitHub.

---

## 4. Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# 🏗️ Production Build

Create an optimized production build:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

---

# 🚀 Deployment

The architecture is designed for deployment using Firebase Hosting.

General deployment flow:

```text
Next.js Application
        ↓
Production Build
        ↓
Firebase Configuration
        ↓
Firebase Hosting
        ↓
Custom Domain
```

Before production deployment, configure:

* Firebase project
* Firestore
* Firebase Authentication
* Firebase Storage
* Environment variables
* Domain/DNS
* SSL
* Email service
* Meta Pixel
* TikTok Pixel
* Sitemap
* Google Search Console

---

# 📈 Future Enhancements

Potential future improvements include:

* 💳 Online payment gateway integration
* PayHere integration
* iPay integration
* KOKO integration
* Advanced order tracking
* Courier API integration
* Customer wishlist
* Product reviews and ratings
* Personalized fragrance recommendations
* Advanced customer segmentation
* Automated abandoned-cart recovery
* Advanced marketing automation
* Expanded analytics
* Loyalty/reward system

The current architecture reserves payment fields and a dedicated payment service structure so future payment providers can be introduced without redesigning the main checkout interface.

---

# 📊 Project Information

| Information                | Details                      |
| -------------------------- | ---------------------------- |
| **Project Name**           | Lillyum Fragrance            |
| **Project Type**           | E-Commerce Website           |
| **Business Type**          | Perfume / Fragrance Retail   |
| **Target Market**          | Sri Lanka                    |
| **Primary Audience**       | Ages 18–35                   |
| **Delivery Model**         | Islandwide delivery          |
| **Primary Payment Method** | Cash on Delivery             |
| **Frontend**               | Next.js + React + TypeScript |
| **Styling**                | Tailwind CSS                 |
| **Backend**                | Firebase                     |
| **Database**               | Cloud Firestore              |
| **Authentication**         | Firebase Authentication      |
| **Storage**                | Firebase Storage             |
| **State Management**       | Zustand                      |
| **Email Service**          | EmailJS                      |
| **Marketing**              | Meta Pixel + TikTok Pixel    |
| **Developer**              | Wenuri Sanjana               |
| **Assigned By**            | Pixzora Labs (Pvt) Ltd.      |
| **Research Date**          | 08/09/2026                   |

Project ownership, developer, submission date, and assignment details are recorded in the research document.

---

# 👩‍💻 Developer

**Wenuri Sanjana**

Software Engineering Undergraduate
The Open University of Sri Lanka

### Areas of Interest

* Frontend Development
* UI/UX Design
* Full-Stack Web Development
* E-Commerce Systems
* Firebase
* React / Next.js

---

# 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

```text
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Commit your changes
5. Push the branch
6. Create a Pull Request
```

Example:

```bash
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

---

# 📄 License

This project was developed for **Lillyum Fragrance** as a professional e-commerce website project.

All rights reserved.

---

<div align="center">

### 🌸 Lillyum Fragrance

**Discover Your Signature Scent.**

Built with ❤️ using Next.js, React, Tailwind CSS & Firebase.

</div>

