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

function getLocalOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_ORDERS_KEY) || '[]');
  } catch {
    return [];
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

  try {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    newOrder.id = docRef.id;
    saveLocalOrder(newOrder);
    return docRef.id;
  } catch (err) {
    console.warn('Firestore unavailable, saving order to local store:', err);
    saveLocalOrder(newOrder);
    return localId;
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const d = await getDoc(doc(db, 'orders', id));
    if (d.exists()) {
      return { id: d.id, ...d.data() } as Order;
    }
  } catch {
    // fallback
  }
  const local = getLocalOrders().find((o) => o.id === id || o.orderId === id);
  return local || null;
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

export async function updateOrderStatus(
  id: string,
  status: Order['status'],
  notes?: string
): Promise<void> {
  try {
    const updates: Record<string, unknown> = {
      status,
      updatedAt: Timestamp.now(),
    };
    if (notes) updates.internalNotes = notes;
    await updateDoc(doc(db, 'orders', id), updates);
  } catch {
    // fallback
  }

  const orders = getLocalOrders();
  const found = orders.find((o) => o.id === id || o.orderId === id);
  if (found) {
    found.status = status;
    if (notes) found.internalNotes = notes;
    found.updatedAt = new Date().toISOString();
    saveLocalOrder(found);
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

export async function createInquiry(inquiry: Omit<Inquiry, 'id'>): Promise<void> {
  await addDoc(collection(db, 'inquiries'), {
    ...inquiry,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}
