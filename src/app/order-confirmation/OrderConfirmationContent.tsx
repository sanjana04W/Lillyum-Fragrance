'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Package, Phone, MessageCircle } from 'lucide-react';
import { formatPrice, getWhatsAppLink } from '@/lib/utils';
import { WHATSAPP_NUMBER } from '@/lib/constants';
import Button from '@/components/ui/Button';

export default function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') ?? 'LF-UNKNOWN';
  const total = Number(searchParams.get('total') ?? 0);

  const waLink = getWhatsAppLink(
    WHATSAPP_NUMBER,
    `Hi! I just placed order ${orderId}. Can you confirm my order?`
  );

  return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center py-12">
      <div className="container-padded max-w-lg">
        <div className="bg-brand-white rounded-3xl border border-brand-light p-8 sm:p-10 text-center shadow-card">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
              <CheckCircle size={36} className="text-emerald-600" />
            </div>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-charcoal mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-brand-mid text-sm mb-6">
            Thank you for your order. We'll confirm it shortly and arrange island-wide delivery.
          </p>

          <div className="bg-brand-cream rounded-2xl p-5 mb-6 text-left space-y-3 border border-brand-light">
            <div className="flex justify-between items-center text-sm">
              <span className="text-brand-mid">Order Reference</span>
              <span className="text-brand-gold-dark font-bold font-mono text-base">{orderId}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-brand-mid">Total Amount</span>
              <span className="text-brand-charcoal font-bold text-base">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-brand-mid">Payment Method</span>
              <span className="text-brand-charcoal font-medium">Cash on Delivery</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-brand-mid">Estimated Delivery</span>
              <span className="text-brand-charcoal font-medium">2–5 Business Days</span>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3 mb-6 text-left">
            {[
              { icon: CheckCircle, label: 'Order Received', desc: 'Your order is recorded in our system', done: true },
              { icon: Package, label: 'Order Confirmation', desc: 'We\'ll call or message on WhatsApp to confirm details', done: false },
              { icon: Package, label: 'Dispatched', desc: 'Handed over to courier rider for delivery', done: false },
            ].map(({ icon: Icon, label, desc, done }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon size={18} className={done ? 'text-emerald-600 mt-0.5' : 'text-brand-muted mt-0.5'} />
                <div>
                  <p className={`text-sm font-semibold ${done ? 'text-brand-charcoal' : 'text-brand-muted'}`}>{label}</p>
                  <p className="text-brand-mid text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-brand-muted text-xs mb-6 leading-relaxed">
            A confirmation email has been sent to your inbox. You can also reach us via WhatsApp for any queries regarding your shipment.
          </p>

          <div className="flex flex-col gap-3">
            <a href={waLink} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg" fullWidth>
                <MessageCircle size={16} /> Chat on WhatsApp
              </Button>
            </a>
            <Link href="/shop">
              <Button variant="outline" size="lg" fullWidth>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

