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

export async function createOrder(orderData: Omit<Order, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'orders'), {
    ...orderData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
}

export async function getOrderById(id: string): Promise<Order | null> {
  const d = await getDoc(doc(db, 'orders', id));
  if (!d.exists()) return null;
  return { id: d.id, ...d.data() } as Order;
}

export async function getOrderByOrderId(orderId: string): Promise<Order | null> {
  const q = query(collection(db, 'orders'), where('orderId', '==', orderId), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() } as Order;
}

export async function updateOrderStatus(
  id: string,
  status: Order['status'],
  notes?: string
): Promise<void> {
  const updates: Record<string, unknown> = {
    status,
    updatedAt: Timestamp.now(),
  };
  if (notes) updates.internalNotes = notes;
  await updateDoc(doc(db, 'orders', id), updates);
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
