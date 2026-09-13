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
    <div className="min-h-screen bg-brand-charcoal flex items-center justify-center py-12">
      <div className="container-padded max-w-lg">
        <div className="bg-brand-charcoal rounded-2xl border border-brand-gold/20 p-8 text-center">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle size={40} className="text-emerald-400" />
            </div>
          </div>

          <h1 className="font-serif text-2xl font-bold text-brand-white mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-brand-muted text-sm mb-6">
            Thank you for your order. We'll confirm it shortly and arrange delivery.
          </p>

          <div className="bg-brand-dark rounded-xl p-5 mb-6 text-left space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-brand-muted">Order Reference</span>
              <span className="text-brand-gold font-bold font-mono">{orderId}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-brand-muted">Total Amount</span>
              <span className="text-brand-white font-semibold">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-brand-muted">Payment Method</span>
              <span className="text-brand-white">Cash on Delivery</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-brand-muted">Estimated Delivery</span>
              <span className="text-brand-white">2–5 Business Days</span>
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3 mb-6 text-left">
            {[
              { icon: CheckCircle, label: 'Order Received', desc: 'Your order is in our system', done: true },
              { icon: Package, label: 'Order Confirmation', desc: 'We\'ll call/WhatsApp to confirm', done: false },
              { icon: Package, label: 'Dispatched', desc: 'Handed to courier for delivery', done: false },
            ].map(({ icon: Icon, label, desc, done }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon size={16} className={done ? 'text-emerald-400 mt-0.5' : 'text-brand-mid mt-0.5'} />
                <div>
                  <p className={`text-sm font-medium ${done ? 'text-brand-white' : 'text-brand-muted'}`}>{label}</p>
                  <p className="text-brand-muted text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-brand-muted text-xs mb-5">
            A confirmation email has been sent to your inbox. You can also reach us via WhatsApp for any queries.
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

