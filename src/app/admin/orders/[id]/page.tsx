'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Order, OrderStatus } from '@/types';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

const STATUSES: OrderStatus[] = ['Pending', 'Confirmed', 'Processing', 'Dispatched', 'Completed', 'Cancelled'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const snap = await getDoc(doc(db, 'orders', id as string));
      if (snap.exists()) {
        const o = { id: snap.id, ...snap.data() } as Order;
        setOrder(o);
        setNotes(o.internalNotes ?? '');
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleUpdate = async (status: OrderStatus) => {
    if (!order) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        status,
        internalNotes: notes,
        updatedAt: new Date().toISOString(),
      });
      setOrder({ ...order, status, internalNotes: notes });
      toast.success(`Order updated to ${status}`);
    } catch {
      toast.error('Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="animate-pulse h-64 bg-brand-charcoal rounded-xl" />;
  if (!order) return <p className="text-brand-muted">Order not found.</p>;

  const waLink = getWhatsAppLink(
    order.customer.phone,
    `Hi ${order.customer.name}! This is Lillyum Fragrance regarding your order ${order.orderId}.`
  );

  return (
    <div className="space-y-5 max-w-3xl">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-brand-muted hover:text-brand-gold transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-serif text-xl font-bold text-brand-white">{order.orderId}</h1>
          <p className="text-brand-muted text-xs">{new Date(order.createdAt as string).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Customer */}
        <div className="bg-brand-charcoal rounded-xl p-5 border border-brand-mid/20 space-y-2">
          <h2 className="font-semibold text-brand-white text-sm mb-3">Customer Details</h2>
          {[
            { label: 'Name', value: order.customer.name },
            { label: 'Phone', value: order.customer.phone },
            { label: 'Email', value: order.customer.email },
            { label: 'District', value: order.customer.district },
            { label: 'Address', value: `${order.customer.address}, ${order.customer.city}` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between gap-2 text-xs">
              <span className="text-brand-muted">{label}</span>
              <span className="text-brand-white text-right">{value}</span>
            </div>
          ))}
          {order.customer.deliveryNotes && (
            <p className="text-xs text-orange-400 mt-2">Note: {order.customer.deliveryNotes}</p>
          )}
          <a href={waLink} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" size="sm" className="mt-3 w-full">
              <MessageCircle size={14} /> WhatsApp Customer
            </Button>
          </a>
        </div>

        {/* Order Summary */}
        <div className="bg-brand-charcoal rounded-xl p-5 border border-brand-mid/20 space-y-3">
          <h2 className="font-semibold text-brand-white text-sm mb-3">Order Summary</h2>
          {order.items.map((item) => (
            <div key={item.sku} className="text-xs flex justify-between">
              <span className="text-brand-light">{item.brand} {item.title} {item.size}ml × {item.quantity}</span>
              <span className="text-brand-gold">{formatPrice(item.subtotal)}</span>
            </div>
          ))}
          <div className="border-t border-brand-mid/30 pt-2 space-y-1">
            <div className="flex justify-between text-xs"><span className="text-brand-muted">Subtotal</span><span className="text-brand-white">{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between text-xs"><span className="text-brand-muted">Delivery</span><span className="text-brand-white">{formatPrice(order.deliveryFee)}</span></div>
            <div className="flex justify-between font-bold"><span className="text-brand-white">Total</span><span className="text-brand-gold">{formatPrice(order.total)}</span></div>
          </div>
        </div>
      </div>

      {/* Status Management */}
      <div className="bg-brand-charcoal rounded-xl p-5 border border-brand-mid/20 space-y-4">
        <h2 className="font-semibold text-brand-white text-sm">Update Status</h2>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleUpdate(s)}
              disabled={s === order.status || saving}
              className={`text-xs px-3 py-2 rounded border transition-colors disabled:opacity-50 ${
                s === order.status
                  ? 'border-brand-gold bg-brand-gold/10 text-brand-gold font-semibold'
                  : 'border-brand-mid/40 text-brand-muted hover:border-brand-gold/40 hover:text-brand-light'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div>
          <label className="text-brand-muted text-xs mb-1 block">Internal Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Add internal notes (not visible to customer)..."
            className="w-full bg-brand-dark border border-brand-mid rounded-md px-3 py-2 text-brand-white text-xs placeholder-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-gold resize-none"
          />
          <Button variant="outline" size="sm" loading={saving} onClick={() => handleUpdate(order.status)} className="mt-2">
            Save Notes
          </Button>
        </div>
      </div>
    </div>
  );
}
