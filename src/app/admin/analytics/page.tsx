'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import { getAllOrders, getLocalOrders } from '@/services/firestoreService';

function SimpleBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1.5 h-32">
      {data.map(({ label, value }) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-brand-gold rounded-t transition-all duration-500 opacity-80"
            style={{ height: `${(value / max) * 100}%`, minHeight: value > 0 ? '4px' : '0' }}
          />
          <span className="text-brand-charcoal/50 text-[10px]">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>(() => getLocalOrders());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const list = await getAllOrders();
        if (list && list.length > 0) {
          setOrders(list);
        }
      } catch (err) {
        console.warn('Analytics loaded from local orders cache');
      }
    }
    load();
  }, []);

  const completed = orders.filter((o) => o.status === 'Completed');
  const totalRevenue = completed.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = completed.length > 0 ? totalRevenue / completed.length : 0;

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString('en-GB', { weekday: 'short' });
    const value = orders.filter((o) => {
      const od = new Date(o.createdAt as string);
      return od.toDateString() === d.toDateString();
    }).length;
    return { label, value };
  });

  const productCounts: Record<string, { name: string; count: number }> = {};
  orders.forEach((o) =>
    o.items.forEach((item) => {
      const key = item.sku;
      if (!productCounts[key]) productCounts[key] = { name: `${item.brand} ${item.title} ${item.size}ml`, count: 0 };
      productCounts[key].count += item.quantity;
    })
  );
  const topProducts = Object.values(productCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const STAT_CARDS = [
    { label: 'Total Orders', value: orders.length },
    { label: 'Completed', value: completed.length },
    { label: 'Total Revenue', value: formatPrice(totalRevenue) },
    { label: 'Avg Order Value', value: formatPrice(Math.round(avgOrderValue)) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-xl font-bold text-brand-charcoal">Analytics</h1>
        <p className="text-brand-charcoal/50 text-xs">Sales and performance overview</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-white rounded-xl p-5 h-20 animate-pulse border border-brand-light" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STAT_CARDS.map(({ label, value }) => (
              <div key={label} className="bg-white rounded-xl p-5 border border-brand-light shadow-soft">
                <p className="text-brand-gold text-xl sm:text-2xl font-bold">{value}</p>
                <p className="text-brand-charcoal/50 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl p-5 border border-brand-light shadow-soft">
            <h2 className="text-brand-charcoal font-semibold text-sm mb-4">Orders — Last 7 Days</h2>
            <SimpleBarChart data={last7} />
          </div>

          <div className="bg-white rounded-xl p-5 border border-brand-light shadow-soft">
            <h2 className="text-brand-charcoal font-semibold text-sm mb-4">Top Selling Products</h2>
            <div className="space-y-3">
              {topProducts.length === 0 ? (
                <p className="text-brand-charcoal/50 text-sm">No sales data yet.</p>
              ) : (
                topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-brand-charcoal/40 text-xs w-4">{i + 1}.</span>
                      <span className="text-brand-charcoal text-xs">{p.name}</span>
                    </div>
                    <span className="text-brand-gold text-xs font-semibold">{p.count} sold</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
