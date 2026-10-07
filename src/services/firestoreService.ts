import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  Timestamp,
  QueryConstraint,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product, Order, CustomerProfile, Inquiry, ProductFilters, ProductSortOption } from '@/types';

// ---- Products ----

export async function getProducts(
  filters?: ProductFilters,
  sort: ProductSortOption = 'newest',
  pageSize = 12,
  lastDoc?: DocumentSnapshot
): Promise<{ products: Product[]; lastDoc: DocumentSnapshot | null; hasMore: boolean }> {
  const constraints: QueryConstraint[] = [where('status', '==', 'active')];

  if (filters?.gender) constraints.push(where('gender', '==', filters.gender));
  if (filters?.fragranceType) constraints.push(where('fragranceType', '==', filters.fragranceType));
  if (filters?.category) constraints.push(where('categories', 'array-contains', filters.category));

  switch (sort) {
    case 'price_asc':
    case 'price_desc':
      // Sort client-side after fetch for variant-level pricing
      constraints.push(orderBy('createdAt', 'desc'));
      break;
    case 'best_selling':
      constraints.push(orderBy('orderCount', 'desc'));
      break;
    default:
      constraints.push(orderBy('createdAt', 'desc'));
  }

  if (lastDoc) constraints.push(startAfter(lastDoc));
  constraints.push(limit(pageSize + 1));

  const q = query(collection(db, 'products'), ...constraints);
  const snapshot = await getDocs(q);
  const docs = snapshot.docs;
  const hasMore = docs.length > pageSize;
  const pageDocs = hasMore ? docs.slice(0, pageSize) : docs;

  let products = pageDocs.map((d) => ({ id: d.id, ...d.data() } as Product));

  // Client-side brand filter (Firestore doesn't support != easily without composite index)
  if (filters?.brand) {
    products = products.filter((p) => p.brand === filters.brand);
  }

  // Client-side price sort
  if (sort === 'price_asc') {
    products.sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0));
  } else if (sort === 'price_desc') {
    products.sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0));
  }

  return {
    products,
    lastDoc: hasMore ? pageDocs[pageDocs.length - 1] : null,
    hasMore,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const q = query(collection(db, 'products'), where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() } as Product;
}

export async function getFeaturedProducts(count = 8): Promise<Product[]> {
  const q = query(
    collection(db, 'products'),
    where('status', '==', 'active'),
    where('isFeatured', '==', true),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getBestSellers(count = 8): Promise<Product[]> {
  const q = query(
    collection(db, 'products'),
    where('status', '==', 'active'),
    where('isBestSeller', '==', true),
    orderBy('orderCount', 'desc'),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getNewArrivals(count = 8): Promise<Product[]> {
  const q = query(
    collection(db, 'products'),
    where('status', '==', 'active'),
    where('isNewArrival', '==', true),
    orderBy('createdAt', 'desc'),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getOffers(count = 20): Promise<Product[]> {
  const q = query(
    collection(db, 'products'),
    where('status', '==', 'active'),
    where('categories', 'array-contains', 'offers'),
    limit(count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function getRelatedProducts(productId: string, category: string, count = 4): Promise<Product[]> {
  const q = query(
    collection(db, 'products'),
    where('status', '==', 'active'),
    where('categories', 'array-contains', category),
    limit(count + 1)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs
    .filter((d) => d.id !== productId)
    .slice(0, count)
    .map((d) => ({ id: d.id, ...d.data() } as Product));
}

// ---- Orders ----

const LOCAL_ORDERS_KEY = 'lillyum_orders';

export const INITIAL_SEED_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderId: 'LIL-2025-001',
    customer: {
      name: 'Anushka Senanayake',
      email: 'anushka.s@gmail.com',
      phone: '0771234567',
      address: '42 Galle Road, Colombo 03',
      city: 'Colombo',
      district: 'Colombo',
      postalCode: '00300',
    },
    items: [
      {
        productId: 'prod-001',
        productSlug: 'armaf-club-de-nuit-intense-man-edp-105ml',
        title: 'Club de Nuit Intense Man',
        brand: 'Armaf',
        image: '/images/0058f985846f5d72fa882910e61518fd.jpg',
        size: 105,
        sku: 'ARM-CDNI-105',
        price: 5800,
        quantity: 1,
        subtotal: 5800,
      },
    ],
    subtotal: 5800,
    deliveryFee: 350,
    total: 6150,
    paymentMethod: 'COD',
    paymentStatus: 'Pending Collection',
    paymentGatewayReference: null,
    transactionId: null,
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
    isVerified: true,
  },
  {
    id: 'ord-102',
    orderId: 'LIL-2025-002',
    customer: {
      name: 'Rohan De Silva',
      email: 'rohan.desilva@yahoo.com',
      phone: '0719876543',
      address: '15 Kandy Road, Kadawatha',
      city: 'Kadawatha',
      district: 'Gampaha',
      postalCode: '11850',
    },
    items: [
      {
        productId: 'prod-002',
        productSlug: 'lattafa-oud-for-glory-edp-100ml',
        title: 'Oud For Glory',
        brand: 'Lattafa',
        image: '/images/089aeefb5e523f231fc70a006c71c4c1.jpg',
        size: 100,
        sku: 'LAT-OFG-100',
        price: 7200,
        quantity: 1,
        subtotal: 7200,
      },
    ],
    subtotal: 7200,
    deliveryFee: 400,
    total: 7600,
    paymentMethod: 'BankTransfer',
    paymentStatus: 'Collected',
    paymentGatewayReference: null,
    transactionId: null,
    status: 'Completed',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date().toISOString(),
    isVerified: true,
  },
  {
    id: 'ord-103',
    orderId: 'LIL-2025-003',
    customer: {
      name: 'Dilini Jayawardena',
      email: 'dilini.j@outlook.com',
      phone: '0765432109',
      address: '88 Peradeniya Road, Kandy',
      city: 'Kandy',
      district: 'Kandy',
      postalCode: '20000',
    },
    items: [
      {
        productId: 'prod-003',
        productSlug: 'lattafa-khamrah-edp-100ml',
        title: 'Khamrah',
        brand: 'Lattafa',
        image: '/images/1b9bf597b69bc306c59fa2ea2c366ff4.jpg',
        size: 100,
        sku: 'LAT-KHM-100',
        price: 8500,
        quantity: 1,
        subtotal: 8500,
      },
    ],
    subtotal: 8500,
    deliveryFee: 450,
    total: 8950,
    paymentMethod: 'KOKO',
    paymentStatus: 'Collected',
    paymentGatewayReference: null,
    transactionId: null,
    status: 'Completed',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date().toISOString(),
    isVerified: true,
  },
];

export function withTimeout<T>(promise: Promise<T>, ms = 1200, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), ms)),
  ]);
}

export function getLocalOrders(): Order[] {
  if (typeof window === 'undefined') return INITIAL_SEED_ORDERS;
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(INITIAL_SEED_ORDERS));
      return INITIAL_SEED_ORDERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(INITIAL_SEED_ORDERS));
    return INITIAL_SEED_ORDERS;
  } catch {
    return INITIAL_SEED_ORDERS;
  }
}

function saveLocalOrder(order: Order) {
  if (typeof window === 'undefined') return;
  try {
    const orders = getLocalOrders();
    const idx = orders.findIndex((o) => o.orderId === order.orderId || o.id === order.id);
    if (idx >= 0) {
      orders[idx] = order;
    } else {
      orders.unshift(order);
    }
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));

    // ── Per-user email index ─────────────────────────────────────────────────
    // Store the orderId under a per-email key so orders survive logout/re-login.
    const email = order.customer?.email?.toLowerCase().trim();
    if (email) {
      const emailKey = `lillyum_orders_${email}`;
      let emailIndex: string[] = [];
      try { emailIndex = JSON.parse(localStorage.getItem(emailKey) || '[]'); } catch { /* */ }
      if (!emailIndex.includes(order.orderId)) {
        emailIndex.unshift(order.orderId);
        localStorage.setItem(emailKey, JSON.stringify(emailIndex));
      }
    }

    window.dispatchEvent(new Event('lillyum_orders_updated'));
  } catch (e) {
    console.error('Failed to save local order:', e);
  }
}

export async function createOrder(orderData: Omit<Order, 'id'>): Promise<string> {
  const localId = 'ord_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const newOrder: Order = {
    ...orderData,
    id: localId,
  };

  // 1. Save locally IMMEDIATELY so it is always present in order history
  saveLocalOrder(newOrder);

  // 2. Sync to Firestore with a 2.5s timeout protection
  try {
    const firestorePromise = addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500));
    const docRef = await Promise.race([firestorePromise, timeoutPromise]);

    if (docRef && docRef.id) {
      newOrder.id = docRef.id;
      saveLocalOrder(newOrder);
      return docRef.id;
    }
    return localId;
  } catch (err) {
    console.warn('Firestore unavailable, saved order to local store:', err);
    return localId;
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  // 1. Try local first (fast, works offline) — match by either doc id or orderId
  const localMatch = getLocalOrders().find((o) => o.id === id || o.orderId === id);
  if (localMatch) return localMatch;

  // 2. Try Firestore by document ID
  try {
    const d = await getDoc(doc(db, 'orders', id));
    if (d.exists()) {
      return { id: d.id, ...d.data() } as Order;
    }
  } catch {
    // fallback to orderId query
  }

  // 3. Try Firestore by orderId field
  try {
    const q = query(collection(db, 'orders'), where('orderId', '==', id), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { id: d.id, ...d.data() } as Order;
    }
  } catch {
    // ignore
  }

  return null;
}

export async function getOrderByOrderId(orderId: string): Promise<Order | null> {
  try {
    const q = query(collection(db, 'orders'), where('orderId', '==', orderId), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const d = snapshot.docs[0];
      return { id: d.id, ...d.data() } as Order;
    }
  } catch {
    // fallback
  }
  const local = getLocalOrders().find((o) => o.orderId === orderId);
  return local || null;
}

/**
 * getUserOrders — robust, multi-source order retrieval for My Profile.
 *
 * Sources (in priority order):
 *  1. Per-email localStorage index  → orderIds → look up in full local orders list
 *  2. Full local orders list scan   → match by email / phone / customerId
 *  3. Firestore query by email      → fetched with 2.5 s timeout, cached locally
 *
 * Results from all sources are merged and deduplicated by orderId.
 * Newly found Firestore orders are saved to localStorage so they survive offline.
 */
export async function getUserOrders(params: {
  email: string;
  uid?: string;
  phone?: string;
}): Promise<Order[]> {
  const email = params.email.toLowerCase().trim();
  const uid = params.uid || '';
  const phone = (params.phone || '').trim().replace(/[\s-]/g, '');

  const orderMap = new Map<string, Order>(); // keyed by orderId

  // ── Source 1: Per-email localStorage index ─────────────────────────────────
  if (typeof window !== 'undefined') {
    try {
      const emailKey = `lillyum_orders_${email}`;
      const emailIndex: string[] = JSON.parse(localStorage.getItem(emailKey) || '[]');
      const allLocal = getLocalOrders();
      for (const oid of emailIndex) {
        const found = allLocal.find((o) => o.orderId === oid || o.id === oid);
        if (found) orderMap.set(found.orderId, found);
      }
    } catch { /* ignore */ }
  }

  // ── Source 2: Full local orders scan ──────────────────────────────────────
  try {
    const allLocal = getLocalOrders();
    for (const o of allLocal) {
      const oEmail = (o.customer?.email || '').toLowerCase().trim();
      const oPhone = (o.customer?.phone || '').trim().replace(/[\s-]/g, '');
      const matches =
        (email && oEmail === email) ||
        (phone && oPhone && oPhone === phone) ||
        (uid && o.customerId === uid);
      if (matches && !orderMap.has(o.orderId)) {
        orderMap.set(o.orderId, o);
      }
    }
  } catch { /* ignore */ }

  // ── Source 3: Firestore query by customer email ────────────────────────────
  try {
    const firestoreQuery = getDocs(
      query(collection(db, 'orders'), where('customer.email', '==', email))
    );
    const snap = await Promise.race([
      firestoreQuery,
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500)),
    ]);
    if (snap && 'docs' in snap) {
      for (const d of snap.docs) {
        const o = { id: d.id, ...d.data() } as Order;
        if (!orderMap.has(o.orderId)) {
          orderMap.set(o.orderId, o);
          // Cache this Firestore order locally so it's available offline
          saveLocalOrder(o);
        }
      }
    }
  } catch { /* Firestore offline — local data is the source of truth */ }

  // Sort by createdAt descending (newest first)
  return Array.from(orderMap.values()).sort((a, b) => {
    const tA = a.createdAt ? new Date(a.createdAt as string).getTime() : 0;
    const tB = b.createdAt ? new Date(b.createdAt as string).getTime() : 0;
    return tB - tA;
  });
}

export async function updateOrderStatus(
  id: string,
  status: Order['status'],
  notes?: string
): Promise<void> {
  const targetId = id || '';
  // 1. Immediately update local store so UI updates with 0 latency
  const orders = getLocalOrders();
  const found = orders.find((o) => targetId && (o.id === targetId || o.orderId === targetId));
  if (found) {
    found.status = status;
    if (notes !== undefined) found.internalNotes = notes;
    found.updatedAt = new Date().toISOString();
    saveLocalOrder(found);
  }

  // 2. Sync to Firestore non-blockingly if not a mock/seed ID
  if (targetId && !targetId.startsWith('ord-') && !targetId.startsWith('ord_')) {
    try {
      const updates: Record<string, unknown> = {
        status,
        updatedAt: Timestamp.now(),
      };
      if (notes !== undefined) updates.internalNotes = notes;
      updateDoc(doc(db, 'orders', targetId), updates).catch((err) => {
        console.warn('Firestore update sync notice:', err);
      });
    } catch (e) {
      console.warn('Firestore update call notice:', e);
    }
  }
}

export async function verifyOrderCode(
  orderId: string,
  inputCode: string
): Promise<{ success: boolean; message: string; order?: Order }> {
  try {
    const q = query(collection(db, 'orders'), where('orderId', '==', orderId), limit(1));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const d = snapshot.docs[0];
      const orderDoc = d.data();

      if (orderDoc.isVerified) {
        return { success: true, message: 'Order is already verified.', order: { id: d.id, ...orderDoc } as Order };
      }

      if (!orderDoc.verificationCode) {
        return { success: false, message: 'No verification code was set for this order.' };
      }

      if (String(orderDoc.verificationCode).trim() !== inputCode.trim()) {
        return { success: false, message: 'Incorrect verification code. Please check your email.' };
      }

      // Update order as verified
      await updateDoc(doc(db, 'orders', d.id), {
        isVerified: true,
        status: 'Confirmed',
        updatedAt: Timestamp.now(),
      });

      const updatedOrder = { ...orderDoc, id: d.id, isVerified: true, status: 'Confirmed' } as Order;
      saveLocalOrder(updatedOrder);

      return {
        success: true,
        message: 'Verification successful! Your order has been confirmed.',
        order: updatedOrder,
      };
    }
  } catch {
    // fallback to local orders
  }

  const localOrder = getLocalOrders().find((o) => o.orderId === orderId);
  if (!localOrder) {
    return { success: false, message: 'Order not found.' };
  }

  if (localOrder.isVerified) {
    return { success: true, message: 'Order is already verified.', order: localOrder };
  }

  if (!localOrder.verificationCode) {
    return { success: false, message: 'No verification code was set for this order.' };
  }

  if (String(localOrder.verificationCode).trim() !== inputCode.trim()) {
    return { success: false, message: 'Incorrect verification code. Please check your email.' };
  }

  localOrder.isVerified = true;
  localOrder.status = 'Confirmed';
  localOrder.updatedAt = new Date().toISOString();
  saveLocalOrder(localOrder);

  return {
    success: true,
    message: 'Verification successful! Your order has been confirmed.',
    order: localOrder,
  };
}

// ---- Customer / Inquiries ----

export async function upsertCustomer(profile: Omit<CustomerProfile, 'id'>): Promise<void> {
  const q = query(collection(db, 'customers'), where('email', '==', profile.email), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    await addDoc(collection(db, 'customers'), {
      ...profile,
      createdAt: Timestamp.now(),
    });
  }
}

const LOCAL_INQUIRIES_KEY = 'lillyum_inquiries';

export const INITIAL_SEED_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-001',
    name: 'Anushka Senanayake',
    email: 'anushka.s@gmail.com',
    phone: '0771234567',
    subject: 'Order inquiry - LIL-2025-001',
    message: 'Hi, I placed an order this morning. Could you confirm when it will be dispatched?',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'inq-002',
    name: 'Rohan De Silva',
    email: 'rohan.desilva@yahoo.com',
    phone: '0719876543',
    subject: 'Authenticity & Batch Codes',
    message: 'Hello, are all the Lattafa perfumes 100% original Dubai imports with batch codes?',
    status: 'In Progress',
    internalNotes: 'Customer contacted via WhatsApp to verify batch codes.',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'inq-003',
    name: 'Dilini Jayawardena',
    email: 'dilini.j@outlook.com',
    phone: '0765432109',
    subject: 'Gift Wrapping Option',
    message: 'Do you offer luxury gift boxes or special gift wrapping for birthdays?',
    status: 'Resolved',
    internalNotes: 'Confirmed complimentary gift wrap available.',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function getLocalInquiries(): Inquiry[] {
  if (typeof window === 'undefined') return INITIAL_SEED_INQUIRIES;
  try {
    const raw = localStorage.getItem(LOCAL_INQUIRIES_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(INITIAL_SEED_INQUIRIES));
      return INITIAL_SEED_INQUIRIES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(INITIAL_SEED_INQUIRIES));
    return INITIAL_SEED_INQUIRIES;
  } catch {
    return INITIAL_SEED_INQUIRIES;
  }
}

export function saveLocalInquiry(inquiry: Inquiry): void {
  if (typeof window === 'undefined') return;
  try {
    const inquiries = getLocalInquiries();
    const idx = inquiries.findIndex((i) => i.id === inquiry.id);
    if (idx >= 0) {
      inquiries[idx] = inquiry;
    } else {
      inquiries.unshift(inquiry);
    }
    localStorage.setItem(LOCAL_INQUIRIES_KEY, JSON.stringify(inquiries));
    window.dispatchEvent(new Event('lillyum_inquiries_updated'));
  } catch (e) {
    console.error('Failed to save local inquiry:', e);
  }
}

export async function createInquiry(inquiryData: Omit<Inquiry, 'id'>): Promise<string> {
  const localId = 'inq_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const newInquiry: Inquiry = {
    ...inquiryData,
    id: localId,
    createdAt: inquiryData.createdAt ? String(inquiryData.createdAt) : new Date().toISOString(),
    updatedAt: inquiryData.updatedAt ? String(inquiryData.updatedAt) : new Date().toISOString(),
  };

  // 1. Immediately persist locally so message is guaranteed saved without freezing
  saveLocalInquiry(newInquiry);

  // 2. Sync to Firestore in background with a quick timeout (1.5s max)
  try {
    const docRefPromise = addDoc(collection(db, 'inquiries'), {
      ...inquiryData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    const docRef = await withTimeout(docRefPromise, 1500, null);
    if (docRef && (docRef as any).id) {
      newInquiry.id = (docRef as any).id;
      saveLocalInquiry(newInquiry);
      return (docRef as any).id;
    }
  } catch (err) {
    console.warn('Firestore inquiry sync notice, saved locally:', err);
  }

  return localId;
}

export async function getAllInquiries(): Promise<Inquiry[]> {
  const local = getLocalInquiries();
  try {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const snapshot = await withTimeout(getDocs(q), 1500, { docs: [] } as any);
    const firestoreInquiries: Inquiry[] = snapshot.docs.map((d: any) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as Inquiry;
    });

    const mergedMap = new Map<string, Inquiry>();
    local.forEach((item) => mergedMap.set(item.id, item));
    firestoreInquiries.forEach((item) => mergedMap.set(item.id, item));

    const merged = Array.from(mergedMap.values());
    merged.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());
    return merged;
  } catch (err) {
    console.warn('Failed to fetch inquiries from Firestore, using local fallback:', err);
    return local.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());
  }
}

export async function updateInquiryStatus(
  id: string,
  status: Inquiry['status'],
  internalNotes?: string
): Promise<void> {
  const targetId = id || '';
  // 1. Immediately update local store so UI is instant
  const inquiries = getLocalInquiries();
  const found = inquiries.find((i) => i.id === targetId);
  if (found) {
    found.status = status;
    if (internalNotes !== undefined) found.internalNotes = internalNotes;
    found.updatedAt = new Date().toISOString();
    saveLocalInquiry(found);
  }

  // 2. Sync to Firestore if doc is on Firestore
  if (targetId && !targetId.startsWith('inq-') && !targetId.startsWith('inq_')) {
    try {
      const updates: Record<string, unknown> = {
        status,
        updatedAt: Timestamp.now(),
      };
      if (internalNotes !== undefined) updates.internalNotes = internalNotes;
      updateDoc(doc(db, 'inquiries', targetId), updates).catch((err) => {
        console.warn('Firestore update inquiry notice:', err);
      });
    } catch (e) {
      console.warn('Firestore update inquiry notice:', e);
    }
  }
}

// ---- Admin & Full Data Sync Functions ----

export async function getAllOrders(): Promise<Order[]> {
  const localOrders = getLocalOrders();
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await withTimeout(getDocs(q), 1000, { docs: [] } as any);
    const firestoreOrders = snapshot.docs.map((d: any) => {
      const data = d.data();
      return {
        id: d.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      } as Order;
    });

    const mergedMap = new Map<string, Order>();
    localOrders.forEach((o) => {
      mergedMap.set(o.orderId || o.id, o);
    });
    firestoreOrders.forEach((o: any) => {
      mergedMap.set(o.orderId || o.id, o);
    });

    const merged = Array.from(mergedMap.values());
    merged.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());
    return merged;
  } catch (err) {
    console.warn('Firestore orders query failed, using local orders fallback:', err);
    return localOrders.sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime());
  }
}

export async function getAllCustomers(): Promise<CustomerProfile[]> {
  const customersMap = new Map<string, CustomerProfile>();

  if (typeof window !== 'undefined') {
    try {
      const accounts = JSON.parse(localStorage.getItem('lillyum_customer_accounts') || '[]');
      accounts.forEach((acc: { uid?: string; id?: string; email?: string; displayName?: string; name?: string; phone?: string; createdAt?: string }) => {
        if (acc.email) {
          customersMap.set(acc.email.toLowerCase(), {
            id: acc.uid || acc.id || acc.email,
            name: acc.displayName || acc.name || 'Customer',
            email: acc.email,
            phone: acc.phone,
            orderHistory: [],
            createdAt: acc.createdAt || new Date().toISOString(),
          });
        }
      });
    } catch {}
  }

  const allOrders = await getAllOrders();
  allOrders.forEach((ord) => {
    if (ord.customer?.email) {
      const email = ord.customer.email.toLowerCase();
      const existing = customersMap.get(email);
      if (existing) {
        if (!existing.orderHistory.includes(ord.orderId)) {
          existing.orderHistory.push(ord.orderId);
        }
        if (!existing.phone && ord.customer.phone) existing.phone = ord.customer.phone;
        if (!existing.name && ord.customer.name) existing.name = ord.customer.name;
      } else {
        customersMap.set(email, {
          id: ord.customer.email,
          name: ord.customer.name || 'Customer',
          email: ord.customer.email,
          phone: ord.customer.phone,
          orderHistory: [ord.orderId],
          createdAt: ord.createdAt,
        });
      }
    }
  });

  try {
    const snap = await withTimeout(
      getDocs(query(collection(db, 'customers'), orderBy('createdAt', 'desc'))),
      1000,
      { docs: [] } as any
    );
    snap.docs.forEach((d: any) => {
      const data = d.data();
      if (data.email) {
        customersMap.set(data.email.toLowerCase(), {
          ...data,
          id: d.id,
        } as CustomerProfile);
      }
    });
  } catch {}

  return Array.from(customersMap.values());
}
