'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ShoppingBag, AlertTriangle, TrendingUp } from 'lucide-react';
import { Order, Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { LOW_STOCK_THRESHOLD } from '@/lib/constants';
import Link from 'next/link';
import { getAllOrders, getLocalOrders, withTimeout } from '@/services/firestoreService';
import { SAMPLE_PRODUCTS } from '@/data/products';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>(() => getLocalOrders());
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fast background refresh without blocking UI
    async function fetchData() {
      try {
        const [ordersList, productsSnap] = await Promise.all([
          getAllOrders(),
          withTimeout(
            getDocs(query(collection(db, 'products'), where('status', '==', 'active'))),
            1000,
            { docs: [] } as any
          ),
        ]);
        if (ordersList && ordersList.length > 0) {
          setOrders(ordersList);
        }
        if (productsSnap && 'docs' in productsSnap && productsSnap.docs.length > 0) {
          setProducts(productsSnap.docs.map((d: any) => ({ id: d.id, ...d.data() } as Product)));
        }
      } catch (e) {
        console.warn('Dashboard background sync completed with cache fallback');
      }
    }
    fetchData();
  }, []);

  const pendingOrders = orders.filter((o) => o.status === 'Pending');
  const todayOrders = orders.filter((o) => {
    const d = new Date(o.createdAt as string);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });
  const totalRevenue = orders
    .filter((o) => o.status === 'Completed')
    .reduce((sum, o) => sum + o.total, 0);
  const lowStockItems = products.flatMap((p) =>
    p.variants.filter(
      (v) => v.stock > 0 && v.stock <= (v.lowStockThreshold ?? LOW_STOCK_THRESHOLD)
    ).map((v) => ({ product: p, variant: v }))
  );
  const outOfStock = products.flatMap((p) =>
    p.variants.filter((v) => v.stock === 0).map((v) => ({ product: p, variant: v }))
  );

  const STATS = [
    { label: 'Pending Orders', value: pendingOrders.length, icon: ShoppingBag, color: 'text-orange-500', bg: 'bg-orange-50', href: '/admin/orders?status=Pending' },
    { label: "Today's Orders", value: todayOrders.length, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50', href: '/admin/orders' },
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'text-brand-gold', bg: 'bg-brand-gold-soft', href: '/admin/analytics' },
    { label: 'Low Stock Alerts', value: lowStockItems.length + outOfStock.length, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50', href: '/admin/inventory' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-brand-charcoal">Dashboard</h1>
        <p className="text-brand-charcoal/50 text-sm">Welcome back — here&apos;s what&apos;s happening</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 h-24 animate-pulse border border-brand-light" />
          ))}
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(({ label, value, icon: Icon, color, bg, href }) => (
              <Link key={label} href={href} className="bg-white rounded-xl p-5 border border-brand-light hover:border-brand-gold/40 hover:shadow-card transition-all group">
                <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center mb-3`}>
                  <Icon size={18} className={color} />
                </div>
                <p className={`text-xl sm:text-2xl font-bold ${color} group-hover:scale-105 transition-transform`}>{value}</p>
                <p className="text-brand-charcoal/50 text-xs mt-1">{label}</p>
              </Link>
            ))}
          </div>

          {/* Pending orders */}
          {pendingOrders.length > 0 && (
            <div className="bg-white rounded-xl border border-brand-light shadow-soft">
              <div className="px-5 py-4 border-b border-brand-light flex justify-between items-center">
                <h2 className="font-semibold text-brand-charcoal text-sm">Pending Orders</h2>
                <Link href="/admin/orders" className="text-brand-gold text-xs hover:underline">View all</Link>
              </div>
              <div className="divide-y divide-brand-light">
                {pendingOrders.slice(0, 5).map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-brand-cream transition-colors"
                  >
                    <div>
                      <p className="text-brand-charcoal text-sm font-mono">{order.orderId}</p>
                      <p className="text-brand-charcoal/50 text-xs">{order.customer.name} · {order.customer.district}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-brand-gold text-sm font-semibold">{formatPrice(order.total)}</p>
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded font-medium">{order.status}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Low stock alerts */}
          {(lowStockItems.length > 0 || outOfStock.length > 0) && (
            <div className="bg-white rounded-xl border border-red-200 shadow-soft">
              <div className="px-5 py-4 border-b border-red-100 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-500" />
                <h2 className="font-semibold text-brand-charcoal text-sm">Stock Alerts</h2>
              </div>
              <div className="divide-y divide-brand-light">
                {[...outOfStock.map((i) => ({ ...i, type: 'out' })), ...lowStockItems.map((i) => ({ ...i, type: 'low' }))].slice(0, 6).map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-brand-charcoal text-sm">{item.product.brand} {item.product.title}</p>
                      <p className="text-brand-charcoal/50 text-xs">{item.variant.size}ml · SKU: {item.variant.sku}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      item.type === 'out' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {item.type === 'out' ? 'Out of Stock' : `${item.variant.stock} left`}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3">
                <Link href="/admin/inventory" className="text-brand-gold text-xs hover:underline">Manage Inventory →</Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
