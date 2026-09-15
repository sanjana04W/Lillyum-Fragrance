// ======================================================
// Lillyum Fragrance — Core TypeScript Types
// ======================================================

export type FragranceType = 'EDP' | 'EDT' | 'Extrait' | 'EDC' | 'Parfum';
export type FragranceFamily = 'Floral' | 'Oriental' | 'Woody' | 'Fresh' | 'Citrus' | 'Aquatic' | 'Gourmand' | 'Chypre' | 'Fougere' | 'Musk' | 'Spicy';
export type Gender = 'Men' | 'Women' | 'Unisex';
export type FragranceGender = Gender;
export type ProductStatus = 'active' | 'hidden' | 'out_of_stock';
export type OrderStatus = 'Pending' | 'Confirmed' | 'Processing' | 'Dispatched' | 'Completed' | 'Cancelled';
export type UserRole = 'Owner' | 'Staff';
export type PaymentMethod = 'COD' | 'BankTransfer' | 'KOKO';
export type PaymentStatus = 'Pending Collection' | 'Collected' | 'Refunded';
export type InquiryStatus = 'New' | 'In Progress' | 'Resolved';

// ------ Product Variant ------
export interface ProductVariant {
  size: number; // in ml
  price: number; // in LKR
  salePrice?: number; // in LKR, null if no sale
  stock: number;
  sku: string;
  lowStockThreshold?: number; // default 5
}

// ------ Product ------
export interface Product {
  id: string;
  slug: string;
  title: string;
  brand: string;
  fragranceName: string;
  description: string;
  fragranceType: FragranceType;
  fragranceFamily: FragranceFamily;
  gender: Gender;
  notes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  variants: ProductVariant[];
  images: string[]; // URLs (Firebase Storage or /images/)
  status: ProductStatus;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  categories: string[]; // category slugs
  authenticityInfo?: string;
  orderCount: number; // for best seller sorting
  createdAt: Date | string;
  updatedAt: Date | string;
}

// ------ Category ------
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string;
  imageUrl?: string;
}

// ------ Cart ------
export interface CartItem {
  productId: string;
  productSlug: string;
  title: string;
  brand: string;
  image: string;
  size: number;
  sku: string;
  price: number;
  salePrice?: number;
  quantity: number;
  maxStock: number;
}

export interface Cart {
  items: CartItem[];
  updatedAt: Date;
}

// ------ Customer ------
export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode?: string;
  deliveryNotes?: string;
}

// ------ Order Item (snapshot at time of purchase) ------
export interface OrderItem {
  productId: string;
  productSlug: string;
  title: string;
  brand: string;
  image: string;
  size: number;
  sku: string;
  price: number;
  salePrice?: number;
  quantity: number;
  subtotal: number;
}

// ------ Order ------
export interface Order {
  id: string;
  orderId: string; // human-readable: LF-YYYYMMDD-XXXX
  customer: CustomerDetails;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentGatewayReference: string | null;
  transactionId: string | null;
  verificationCode?: string;
  isVerified?: boolean;
  internalNotes?: string;
  cancelReason?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// ------ Promotion ------
export interface Promotion {
  id: string;
  title: string;
  type: 'percentage' | 'fixed';
  value: number;
  isActive: boolean;
  applicableTo: 'all' | string[]; // 'all' or product IDs
  startDate: Date | string;
  endDate: Date | string;
  bannerImage?: string;
  code?: string;
  createdAt: Date | string;
}

// ------ Customer Profile (Firestore) ------
export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  orderHistory: string[]; // order IDs
  createdAt: Date | string;
}

// ------ Inquiry ------
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  customerId?: string;
  internalNotes?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

// ------ Admin User ------
export interface AdminUser {
  id: string;
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date | string;
}

// ------ Delivery Zone ------
export interface DeliveryZone {
  id: string;
  name: string;
  districts: string[];
  fee: number;
  estimatedDays: string; // e.g., "2-3 Business Days"
}

// ------ Settings ------
export interface SiteSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  metaPixelId: string;
  tiktokPixelId: string;
  emailjsServiceId: string;
  emailjsTemplateId: string;
  emailjsPublicKey: string;
  deliveryZones: DeliveryZone[];
  freeDeliveryThreshold?: number;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    whatsapp?: string;
  };
}

// ------ Pagination ------
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  hasMore: boolean;
  lastDoc?: unknown;
}

// ------ Filter & Sort ------
export interface ProductFilters {
  brand?: string;
  gender?: Gender;
  fragranceType?: FragranceType;
  fragranceFamily?: FragranceFamily;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
}

export type ProductSortOption = 'newest' | 'price_asc' | 'price_desc' | 'best_selling';
