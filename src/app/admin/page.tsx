'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ShoppingBag, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { Order, Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { LOW_STOCK_THRESHOLD } from '@/lib/constants';
import Link from 'next/link';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ordersSnap, productsSnap] = await Promise.all([
          getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(50))),
          getDocs(query(collection(db, 'products'), where('status', '==', 'active'))),
        ]);
        setOrders(ordersSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
        setProducts(productsSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Product)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
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
    { label: 'Pending Orders', value: pendingOrders.length, icon: ShoppingBag, color: 'text-orange-400', href: '/admin/orders?status=Pending' },
    { label: "Today's Orders", value: todayOrders.length, icon: TrendingUp, color: 'text-emerald-400', href: '/admin/orders' },
    { label: 'Total Revenue', value: formatPrice(totalRevenue), icon: TrendingUp, color: 'text-brand-gold', href: '/admin/analytics' },
    { label: 'Low Stock Alerts', value: lowStockItems.length + outOfStock.length, icon: AlertTriangle, color: 'text-red-400', href: '/admin/inventory' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-bold text-brand-white">Dashboard</h1>
        <p className="text-brand-muted text-sm">Welcome back — here's what's happening</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-brand-charcoal rounded-xl p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(({ label, value, icon: Icon, color, href }) => (
              <Link key={label} href={href} className="bg-brand-charcoal rounded-xl p-5 border border-brand-mid/20 hover:border-brand-gold/30 transition-colors group">
                <div className="flex items-start justify-between mb-3">
                  <Icon size={20} className={color} />
                </div>
                <p className={`text-xl sm:text-2xl font-bold ${color} group-hover:scale-105 transition-transform`}>{value}</p>
                <p className="text-brand-muted text-xs mt-1">{label}</p>
              </Link>
            ))}
          </div>

          {/* Pending orders */}
          {pendingOrders.length > 0 && (
            <div className="bg-brand-charcoal rounded-xl border border-brand-mid/20">
              <div className="px-5 py-4 border-b border-brand-mid/20 flex justify-between items-center">
                <h2 className="font-semibold text-brand-white text-sm">Pending Orders</h2>
                <Link href="/admin/orders" className="text-brand-gold text-xs hover:underline">View all</Link>
              </div>
              <div className="divide-y divide-brand-mid/20">
                {pendingOrders.slice(0, 5).map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-brand-dark transition-colors"
                  >
                    <div>
                      <p className="text-brand-white text-sm font-mono">{order.orderId}</p>
                      <p className="text-brand-muted text-xs">{order.customer.name} · {order.customer.district}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-brand-gold text-sm font-semibold">{formatPrice(order.total)}</p>
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded">{order.status}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Low stock alerts */}
          {(lowStockItems.length > 0 || outOfStock.length > 0) && (
            <div className="bg-brand-charcoal rounded-xl border border-red-500/20">
              <div className="px-5 py-4 border-b border-brand-mid/20 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-400" />
                <h2 className="font-semibold text-brand-white text-sm">Stock Alerts</h2>
              </div>
              <div className="divide-y divide-brand-mid/20">
                {[...outOfStock.map((i) => ({ ...i, type: 'out' })), ...lowStockItems.map((i) => ({ ...i, type: 'low' }))].slice(0, 6).map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-brand-white text-sm">{item.product.brand} {item.product.title}</p>
                      <p className="text-brand-muted text-xs">{item.variant.size}ml · SKU: {item.variant.sku}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                      item.type === 'out' ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
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

