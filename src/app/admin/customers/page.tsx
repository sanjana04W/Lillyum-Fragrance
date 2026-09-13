'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { CustomerProfile } from '@/types';
import { getWhatsAppLink } from '@/lib/utils';
import { MessageCircle } from 'lucide-react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const snap = await getDocs(query(collection(db, 'customers'), orderBy('createdAt', 'desc')));
      setCustomers(snap.docs.map((d) => ({ id: d.id, ...d.data() } as CustomerProfile)));
      setLoading(false);
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
      <h1 className="font-serif text-xl font-bold text-brand-white">Customers</h1>
      <input
        type="search"
        placeholder="Search by name, email, or phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-sm bg-brand-dark border border-brand-mid/50 text-brand-white text-sm rounded-md px-3 py-2 focus:outline-none focus:border-brand-gold"
      />
      <div className="bg-brand-charcoal rounded-xl border border-brand-mid/20 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-mid/30">
              <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium">Name</th>
              <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium">Orders</th>
              <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-mid/20">
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-brand-muted text-sm">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-brand-muted text-sm">No customers found.</td></tr>
            ) : filtered.map((c) => (
              <tr key={c.id} className="hover:bg-brand-dark/40 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-brand-white text-xs font-medium">{c.name}</p>
                  <p className="text-brand-muted text-xs">{c.phone}</p>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <p className="text-brand-muted text-xs">{c.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="text-brand-gold text-xs">{c.orderHistory?.length ?? 0}</span>
                </td>
                <td className="px-4 py-3">
                  {c.phone && (
                    <a
                      href={getWhatsAppLink(c.phone, `Hi ${c.name}! This is Lillyum Fragrance.`)}
                      target="_blank" rel="noopener noreferrer"
                      className="text-brand-muted hover:text-emerald-400 transition-colors"
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

