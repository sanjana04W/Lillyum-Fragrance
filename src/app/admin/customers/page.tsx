'use client';

import { useEffect, useState } from 'react';
import { CustomerProfile } from '@/types';
import { getWhatsAppLink } from '@/lib/utils';
import { getAllCustomers, getLocalOrders } from '@/services/firestoreService';
import { MessageCircle } from 'lucide-react';

function getInitialCustomers(): CustomerProfile[] {
  const map = new Map<string, CustomerProfile>();
  const orders = getLocalOrders();
  orders.forEach((ord) => {
    if (ord.customer?.email) {
      const email = ord.customer.email.toLowerCase();
      const existing = map.get(email);
      if (existing) {
        if (!existing.orderHistory.includes(ord.orderId)) {
          existing.orderHistory.push(ord.orderId);
        }
      } else {
        map.set(email, {
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
  return Array.from(map.values());
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>(() => getInitialCustomers());
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const list = await getAllCustomers();
        if (list && list.length > 0) {
          setCustomers(list);
        }
      } catch (err) {
        console.warn('Customers loaded from local cache');
      }
    }
    load();
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  return (
    <div className="space-y-5">
      <h1 className="font-serif text-xl font-bold text-brand-charcoal">Customers</h1>
      <input
        type="search"
        placeholder="Search by name, email, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm bg-white border border-brand-light text-brand-charcoal text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-brand-gold placeholder-brand-charcoal/30"
      />
      <div className="bg-white rounded-xl border border-brand-light overflow-hidden shadow-soft">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-light bg-brand-cream">
              <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Orders</th>
              <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-light">
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-brand-charcoal/50 text-sm">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-brand-charcoal/50 text-sm">No customers found.</td></tr>
            ) : filtered.map((c) => (
              <tr key={c.id} className="hover:bg-brand-cream/60 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-brand-charcoal text-xs font-medium">{c.name}</p>
                  <p className="text-brand-charcoal/50 text-xs">{c.phone}</p>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <p className="text-brand-charcoal/60 text-xs">{c.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-brand-gold text-xs font-semibold">{c.orderHistory?.length ?? 0}</span>
                </td>
                <td className="px-4 py-3">
                  {c.phone && (
                    <a
                      href={getWhatsAppLink(c.phone, `Hi ${c.name}! This is Lillyum Fragrance.`)}
                      target="_blank" rel="noopener noreferrer"
                      className="text-brand-charcoal/40 hover:text-emerald-500 transition-colors"
                    >
                      <MessageCircle size={14} />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
