'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  Truck,
  Package,
  Phone,
  MapPin,
  Calendar,
  ClipboardList,
  MessageCircle,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import { getOrderByOrderId } from '@/services/firestoreService';
import { Order } from '@/types';
import Button from '@/components/ui/Button';

export default function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') ?? 'LF-PENDING';
  const totalParam = Number(searchParams.get('total') ?? 0);
  const emailParam = searchParams.get('email') ?? '';
  const nameParam = searchParams.get('name') ?? '';
  const districtParam = searchParams.get('district') ?? 'Colombo';
  const addressParam = searchParams.get('address') ?? '';
  const cityParam = searchParams.get('city') ?? '';
  const phoneParam = searchParams.get('phone') ?? '';

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    async function loadOrder() {
      if (orderId && orderId !== 'LF-PENDING') {
        try {
          const ord = await getOrderByOrderId(orderId);
          if (ord) {
            setOrder(ord);
          }
        } catch (e) {
          console.error('Failed to load order', e);
        }
      }
    }
    loadOrder();
  }, [orderId]);

  // Derive display values
  const customerName = order?.customer?.name || nameParam || 'Valued Customer';
  const customerPhone = order?.customer?.phone || phoneParam || 'N/A';
  const customerDistrict = order?.customer?.district || districtParam || 'Colombo';
  const customerAddress = order?.customer?.address || addressParam;
  const customerCity = order?.customer?.city || cityParam;
  const fullAddress = customerAddress ? `${customerAddress}${customerCity ? `, ${customerCity}` : ''}` : 'Address provided at checkout';
  const totalAmount = order?.total || totalParam || 0;
  const subtotalAmount = order?.subtotal || (totalAmount > 200 ? totalAmount - 200 : totalAmount);
  const deliveryAmount = order?.deliveryFee || (totalAmount > subtotalAmount ? totalAmount - subtotalAmount : 200);

  // Format order date
  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

  const waLink = getWhatsAppLink(
    WHATSAPP_NUMBER,
    `Hi Lillyum Fragrance! I just confirmed my order #${orderId}. Can you please confirm the dispatch details?`
  );

  return (
    <div className="min-h-screen bg-brand-cream py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* ── Top Header Section ── */}
        <div className="text-center mb-8">
          {/* Green Checkmark Circle */}
          <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
            <CheckCircle2 size={36} className="text-emerald-600" />
          </div>

          {/* Heading */}
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-brand-charcoal tracking-tight mb-2">
            Thank You For Your Order!
          </h1>
          <p className="text-brand-mid text-sm sm:text-base max-w-lg mx-auto">
            Your order has been received successfully. Below are your reference and shipping expectations.
          </p>

          {/* Order Number Pill */}
          <div className="mt-5">
            <span className="inline-block px-5 py-2 rounded-full border border-brand-light bg-brand-white text-xs sm:text-sm font-bold tracking-widest text-brand-charcoal uppercase shadow-card">
              ORDER NUMBER: <span className="text-brand-gold font-mono">{orderId}</span>
            </span>
          </div>
        </div>

        {/* ── 2 Columns: Shipping Details & Order Information ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Card 1: SHIPPING DETAILS */}
          <div className="bg-brand-white rounded-3xl p-6 sm:p-7 border border-brand-light shadow-card">
            <div className="flex items-center gap-2 text-rose-500 font-bold text-xs uppercase tracking-wider mb-5">
              <Truck size={17} className="text-rose-500" />
              <span>SHIPPING DETAILS</span>
            </div>

            <div className="space-y-3.5 text-sm">
              <div>
                <span className="text-brand-mid text-xs">Recipient Name:</span>
                <p className="font-semibold text-brand-charcoal mt-0.5">{customerName}</p>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={14} className="text-brand-mid shrink-0" />
                <div>
                  <span className="text-brand-mid text-xs">Mobile Contact:</span>
                  <p className="font-semibold text-brand-charcoal">{customerPhone}</p>
                </div>
              </div>

              <div>
                <span className="text-brand-mid text-xs">District:</span>
                <p className="font-semibold text-brand-charcoal mt-0.5">{customerDistrict}</p>
              </div>

              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-brand-mid shrink-0 mt-1" />
                <div>
                  <span className="text-brand-mid text-xs">Address:</span>
                  <p className="font-semibold text-brand-charcoal leading-snug">{fullAddress}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 border-t border-brand-light/60">
                <Calendar size={14} className="text-brand-gold shrink-0" />
                <div>
                  <span className="text-brand-mid text-xs">Requested Delivery / Placed:</span>
                  <p className="font-semibold text-brand-charcoal text-xs">{orderDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: ORDER INFORMATION */}
          <div className="bg-brand-white rounded-3xl p-6 sm:p-7 border border-brand-light shadow-card flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-violet-600 font-bold text-xs uppercase tracking-wider mb-5">
                <Package size={17} className="text-violet-600" />
                <span>ORDER INFORMATION</span>
              </div>

              <div className="space-y-3.5 text-sm">
                <div>
                  <span className="text-brand-mid text-xs">Payment Method:</span>
                  <p className="font-semibold text-brand-charcoal mt-0.5">
                    {order?.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : (order?.paymentMethod || 'Cash on Delivery (COD)')}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-brand-mid text-xs">Fulfillment Status:</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-300 uppercase tracking-wide">
                        {order?.status || 'PENDING'}
                      </span>
                      {order?.isVerified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300">
                          <CheckCircle2 size={12} /> Email Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subcard: Expected Delivery */}
            <div className="mt-5 p-4 rounded-2xl bg-brand-cream/70 border border-brand-light/80">
              <p className="font-bold text-xs text-brand-charcoal mb-1">Expected Delivery:</p>
              <p className="text-xs text-brand-mid leading-relaxed">
                Colombo/Gampaha: <span className="font-medium text-brand-charcoal">1–3 Business Days.</span>
              </p>
              <p className="text-xs text-brand-mid leading-relaxed">
                Outstations: <span className="font-medium text-brand-charcoal">3–5 Business Days.</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Ordered Itemized Summary ── */}
        <div className="bg-brand-white rounded-3xl p-6 sm:p-8 border border-brand-light shadow-card mb-8">
          <div className="flex items-center gap-2 text-brand-charcoal font-bold text-xs uppercase tracking-wider mb-6 pb-3 border-b border-brand-light">
            <ClipboardList size={17} className="text-brand-gold" />
            <span>ORDERED ITEMIZED SUMMARY</span>
          </div>

          {/* Items List */}
          <div className="divide-y divide-brand-light/60">
            {order?.items && order.items.length > 0 ? (
              order.items.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-brand-cream border border-brand-light shrink-0">
                      {item.image ? (
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-muted">
                          <Package size={20} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-serif font-bold text-sm text-brand-charcoal truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-brand-mid mt-0.5">
                        Qty: {item.quantity} @ {formatPrice(item.salePrice ?? item.price)}
                        {item.size ? ` • ${item.size}ml` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-sm text-brand-charcoal">
                      {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-brand-charcoal">Order Items</p>
                  <p className="text-xs text-brand-mid">Order confirmed with Lillyum Fragrance Studio</p>
                </div>
                <p className="font-bold text-sm text-brand-charcoal">{formatPrice(subtotalAmount)}</p>
              </div>
            )}
          </div>

          {/* Pricing Totals */}
          <div className="border-t border-brand-light pt-4 mt-2 space-y-2.5 text-sm">
            <div className="flex justify-between text-brand-mid">
              <span>Subtotal</span>
              <span className="font-semibold text-brand-charcoal">{formatPrice(subtotalAmount)}</span>
            </div>
            <div className="flex justify-between text-brand-mid">
              <span>Delivery ({customerDistrict})</span>
              <span className="font-semibold text-brand-charcoal">{formatPrice(deliveryAmount)}</span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t border-brand-light">
              <span className="font-serif font-bold text-base text-brand-charcoal">Total Amount (COD)</span>
              <span className="font-serif font-bold text-2xl text-brand-gold">
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/profile" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" fullWidth className="gap-2">
              <ExternalLink size={16} /> View in My Profile
            </Button>
          </Link>
          <a href={waLink} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" fullWidth className="gap-2 shadow-gold">
              <MessageCircle size={16} /> Chat on WhatsApp
            </Button>
          </a>
          <Link href="/shop" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" fullWidth className="gap-2">
              <ShoppingBag size={16} /> Continue Shopping
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
