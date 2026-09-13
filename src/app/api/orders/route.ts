import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// POST /api/orders — Create order and decrement stock
export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    
    // Decrement stock for each item
    const batch = adminDb.batch();
    for (const item of orderData.items) {
      // Find product by id and update variant stock
      const productRef = adminDb.collection('products').doc(item.productId);
      const productSnap = await productRef.get();
      if (productSnap.exists) {
        const product = productSnap.data()!;
        const variants = product.variants.map((v: { sku: string; stock: number }) =>
          v.sku === item.sku ? { ...v, stock: Math.max(0, v.stock - item.quantity) } : v
        );
        batch.update(productRef, { variants, updatedAt: new Date().toISOString() });
      }
    }

    // Create order document
    const orderRef = adminDb.collection('orders').doc();
    batch.set(orderRef, {
      ...orderData,
      id: orderRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await batch.commit();

    return NextResponse.json({ orderId: orderData.orderId, id: orderRef.id }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// GET /api/orders — Admin: list orders (requires auth check in production)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let queryRef = adminDb.collection('orders').orderBy('createdAt', 'desc').limit(50);
    if (status) queryRef = queryRef.where('status', '==', status) as typeof queryRef;

    const snap = await queryRef.get();
    const orders = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

