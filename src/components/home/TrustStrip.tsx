import { Shield, Truck, CreditCard, Phone, Star, RefreshCw } from 'lucide-react';

const TRUST_ITEMS = [
  { icon: Shield,    label: '100% Authentic',      desc: 'Every fragrance is verified genuine' },
  { icon: Truck,     label: 'Island-wide Delivery', desc: 'All 25 districts covered' },
  { icon: CreditCard,label: 'Cash on Delivery',     desc: 'Pay when your parcel arrives' },
  { icon: Star,      label: '4.8★ Rated',           desc: 'Loved by thousands of customers' },
  { icon: Phone,     label: 'WhatsApp Support',      desc: 'Chat with us anytime' },
  { icon: RefreshCw, label: '48-hr Returns',         desc: 'Hassle-free replacements' },
];

export default function TrustStrip() {
  return (
    <section className="py-8 bg-brand-white border-y border-brand-light">
      <div className="container-padded">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {TRUST_ITEMS.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center text-center gap-2 group">
              <div className="w-11 h-11 rounded-2xl bg-brand-gold-soft flex items-center justify-center group-hover:bg-brand-gold group-hover:text-white transition-all duration-200">
                <Icon size={18} className="text-brand-gold group-hover:text-white transition-colors" />
              </div>
              <div>
                <p className="text-brand-charcoal text-xs font-semibold">{label}</p>
                <p className="text-brand-muted text-[11px] hidden sm:block mt-0.5 leading-tight">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
