'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Order, OrderStatus } from '@/types';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { getOrderById, updateOrderStatus } from '@/services/firestoreService';
import {
  ArrowLeft,
  MessageCircle,
  Printer,
  Save,
  User,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Processing',
  'Dispatched',
  'Completed',
  'Cancelled',
];

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<OrderStatus>('Pending');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (id) {
        const o = await getOrderById(id as string);
        if (o) {
          setOrder(o);
          setStatus(o.status);
          setNotes(o.internalNotes ?? '');
        }
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleUpdate = async () => {
    if (!order) return;
    setSaving(true);
    try {
      const targetId = order.id || order.orderId;
      await updateOrderStatus(targetId, status, notes);
      setOrder({ ...order, status, internalNotes: notes, updatedAt: new Date().toISOString() });
      window.dispatchEvent(new Event('lillyum_orders_updated'));
      toast.success(`Order ${order.orderId} updated to ${status}`);
    } catch {
      toast.error('Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  const handlePrintDispatchSlip = () => {
    if (!order) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = order.items
      .map(
        (i) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${i.title} (${i.brand}) - ${i.size}ml</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${i.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">Rs. ${i.price.toLocaleString()}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">Rs. ${(i.quantity * i.price).toLocaleString()}</td>
        </tr>
      `
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dispatch Slip - ${order.orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #1c1c1e; line-height: 1.5; }
            .header { border-bottom: 2px solid #B8892A; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 20px; font-weight: bold; color: #B8892A; letter-spacing: 2px; }
            .badge { background: #FAF7F2; border: 1px solid #B8892A; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: bold; }
            .box { background: #FAF7F2; border: 1px solid #eee; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
            th { background: #f5f5f5; padding: 8px; text-align: left; font-size: 12px; text-transform: uppercase; }
            .totals { margin-top: 16px; text-align: right; font-size: 14px; }
            .total-val { font-size: 18px; font-weight: bold; color: #B8892A; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">LILLYUM FRAGRANCE</div>
              <p style="margin: 2px 0 0 0; font-size: 12px; color: #666;">COURIER DISPATCH & PACKING SLIP</p>
            </div>
            <div>
              <span class="badge">${order.paymentMethod || 'COD'} ORDER</span>
            </div>
          </div>

          <div style="display: flex; gap: 20px; margin-bottom: 16px;">
            <div class="box" style="flex: 1;">
              <strong>ORDER INFO</strong><br/>
              Order Ref: <strong>${order.orderId}</strong><br/>
              Date: ${new Date(order.createdAt as string).toLocaleString()}<br/>
              Status: <strong>${order.status.toUpperCase()}</strong>
            </div>
            <div class="box" style="flex: 1;">
              <strong>RECIPIENT DETAILS</strong><br/>
              Name: <strong>${order.customer.name}</strong><br/>
              Phone: <strong>${order.customer.phone}</strong><br/>
              Address: ${order.customer.address}, ${order.customer.city}<br/>
              District: <strong>${order.customer.district}</strong>
            </div>
          </div>

          ${order.internalNotes ? `<div class="box"><strong>Dispatch / Courier Notes:</strong> ${order.internalNotes}</div>` : ''}

          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div class="totals">
            <div>Subtotal: Rs. ${order.subtotal.toLocaleString()}</div>
            <div>Delivery Fee: Rs. ${(order.deliveryFee || 0).toLocaleString()}</div>
            <div style="margin-top: 6px;">Total Collectible Amount: <span class="total-val">Rs. ${order.total.toLocaleString()}</span></div>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return <div className="animate-pulse h-64 bg-white rounded-3xl border border-brand-light" />;
  }

  if (!order) {
    return (
      <div className="p-12 text-center text-xs text-brand-charcoal/50">
        Order not found.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header Row (Matching Image 3) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full border border-brand-light hover:bg-brand-cream text-brand-charcoal transition-colors shadow-2xs cursor-pointer"
            title="Back to orders"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-serif text-2xl font-bold text-brand-charcoal">
                {order.orderId}
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                {order.paymentMethod || 'COD'} ORDER
              </span>
            </div>
            <p className="text-brand-charcoal/50 text-xs mt-0.5">
              Placed on{' '}
              {new Date(order.createdAt as string).toLocaleString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintDispatchSlip}
          className="border border-brand-light hover:border-brand-gold/60 bg-white hover:bg-brand-cream text-brand-charcoal font-semibold text-xs px-4 py-2.5 rounded-full flex items-center gap-2 transition-colors shadow-2xs cursor-pointer self-start sm:self-auto"
        >
          <Printer size={15} className="text-brand-gold" />
          <span>Print Dispatch Slip</span>
        </button>
      </div>

      {/* UPDATE ORDER STATUS CARD (Matching Image 3 Top Card) */}
      <div className="p-6 rounded-3xl border border-brand-light bg-brand-cream/30 space-y-4 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="text-xs font-bold text-brand-charcoal uppercase tracking-wider block mb-1.5">
              Update Order Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              className="px-3.5 py-2.5 bg-white border border-brand-light rounded-xl text-xs font-bold text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold cursor-pointer shadow-2xs"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  Status: {s}
                </option>
              ))}
            </select>
          </div>

          <a
            href={getWhatsAppLink(
              order.customer?.phone ?? '',
              `Hi ${order.customer?.name ?? 'Customer'}! Regarding your Lillyum Fragrance order ${order.orderId}: status is ${status}.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-soft transition-all self-start sm:self-end"
          >
            <MessageCircle size={15} />
            <span>WhatsApp Customer</span>
          </a>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-brand-charcoal">
            Internal Admin &amp; Courier Tracking Notes
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add courier tracking numbers, packing details, or customer notes..."
            className="w-full p-3.5 bg-white border border-brand-light rounded-xl text-xs text-brand-charcoal placeholder-brand-charcoal/40 focus:outline-none focus:ring-1 focus:ring-brand-gold focus:border-brand-gold resize-none shadow-2xs"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleUpdate}
            disabled={saving}
            className="bg-brand-charcoal hover:bg-brand-gold text-white font-bold text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-soft transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={14} />
            <span>{saving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Details (Matching Image 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Left Column: Customer Details */}
        <div className="p-6 rounded-3xl border border-brand-light bg-white shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-brand-light pb-3">
            <User size={16} className="text-brand-gold" />
            <h3 className="font-bold text-xs text-brand-charcoal uppercase tracking-wider">
              Customer Details
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-brand-charcoal/50 block text-[11px]">Name:</span>
              <span className="font-bold text-brand-charcoal">{order.customer?.name}</span>
            </div>

            <div>
              <span className="text-brand-charcoal/50 block text-[11px]">Phone:</span>
              <a
                href={`tel:${order.customer?.phone}`}
                className="font-semibold text-brand-charcoal hover:text-brand-gold"
              >
                {order.customer?.phone}
              </a>
            </div>

            <div>
              <span className="text-brand-charcoal/50 block text-[11px]">Email:</span>
              <span className="text-brand-charcoal/80">{order.customer?.email || 'N/A'}</span>
            </div>

            <div>
              <span className="text-brand-charcoal/50 block text-[11px]">Delivery Address:</span>
              <p className="text-brand-charcoal/80 leading-relaxed">
                {order.customer?.address}
                {order.customer?.city ? `, ${order.customer.city}` : ''}
              </p>
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md bg-brand-cream border border-brand-light text-[10px] font-bold text-brand-charcoal">
                District: {order.customer?.district || 'Colombo'}
              </span>
            </div>

            {order.customer?.deliveryNotes && (
              <div className="pt-2 border-t border-brand-light">
                <span className="text-brand-charcoal/50 block text-[11px]">Delivery Notes:</span>
                <p className="text-xs text-brand-charcoal/80 italic">{order.customer.deliveryNotes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Items */}
        <div className="p-6 rounded-3xl border border-brand-light bg-white shadow-soft space-y-4">
          <div className="border-b border-brand-light pb-3">
            <h3 className="font-bold text-xs text-brand-charcoal uppercase tracking-wider">
              Order Items ({order.items?.length ?? 1})
            </h3>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-brand-cream border border-brand-light shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-brand-charcoal/40">
                      No img
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-brand-charcoal truncate">{item.title}</p>
                  <p className="text-[11px] text-brand-charcoal/50">
                    Qty: {item.quantity} × Rs. {item.price.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-brand-charcoal">
                    Rs. {(item.quantity * item.price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Summary */}
          <div className="border-t border-brand-light pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-brand-charcoal/60">
              <span>Subtotal</span>
              <span>Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-brand-charcoal/60">
              <span>Delivery Fee</span>
              <span>Rs. {(order.deliveryFee || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-brand-charcoal pt-2 border-t border-brand-light/60">
              <span>Total Amount ({order.paymentMethod || 'COD'})</span>
              <span className="text-brand-gold">Rs. {order.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

