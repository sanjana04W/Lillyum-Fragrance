'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, OrderStatus } from '@/types';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

const STATUSES: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Dispatched', 'Completed', 'Cancelled'];

const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: 'bg-orange-500/20 text-orange-400',
  Confirmed: 'bg-blue-500/20 text-blue-400',
  Processing: 'bg-purple-500/20 text-purple-400',
  Dispatched: 'bg-cyan-500/20 text-cyan-400',
  Completed: 'bg-emerald-500/20 text-emerald-400',
  Cancelled: 'bg-red-500/20 text-red-400',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | 'All'>('All');

  useEffect(() => {
    async function load() {
      const snap = await getDocs(query(collection(db, 'orders'), orderBy('createdAt', 'desc')));
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order)));
      setLoading(false);
    }
    load();
  }, []);

  const filtered = filter === 'All' ? orders : orders.filter((o) => o.status === filter);

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await updateDoc(doc(db, 'orders', orderId), { status, updatedAt: new Date().toISOString() });
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-serif text-xl font-bold text-brand-white">Orders</h1>
        <p className="text-brand-muted text-sm">{filtered.length} orders</p>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 flex-wrap">
        {(['All', ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              filter === s ? 'border-brand-gold bg-brand-gold/10 text-brand-gold' : 'border-brand-mid/40 text-brand-muted hover:border-brand-gold/40'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-brand-charcoal rounded-xl p-4 h-20 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-brand-muted text-sm py-8 text-center">No orders found.</p>
      ) : (
        <div className="bg-brand-charcoal rounded-xl border border-brand-mid/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-mid/30">
                  <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium">Order ID</th>
                  <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium">Customer</th>
                  <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium hidden sm:table-cell">Items</th>
                  <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium">Total</th>
                  <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-mid/20">
                {filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-dark/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-brand-gold hover:underline font-mono text-xs">
                        {order.orderId}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-brand-white text-xs">{order.customer.name}</p>
                      <p className="text-brand-muted text-xs">{order.customer.phone}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-brand-muted text-xs">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-brand-gold text-xs font-semibold">{formatPrice(order.total)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`text-xs px-2 py-1 rounded border-0 ${STATUS_COLORS[order.status]} bg-transparent cursor-pointer focus:outline-none`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-brand-charcoal text-brand-white">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={getWhatsAppLink(order.customer.phone, `Hi ${order.customer.name}! Your Lillyum Fragrance order ${order.orderId} has been ${order.status.toLowerCase()}.`)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-muted hover:text-emerald-400 transition-colors"
                        title="WhatsApp customer"
                      >
                        <MessageCircle size={16} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

