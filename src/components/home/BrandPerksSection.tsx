import { Sprout, Truck, Gift, TicketPercent } from 'lucide-react';

const PERKS = [
  {
    icon: Sprout,
    title: 'Eco-friendly',
    desc: 'Crafted with care for sustainability.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Your scent, fast and safe delivery.',
  },
  {
    icon: Gift,
    title: 'Free Shipping',
    desc: 'Free shipping on every order.',
  },
  {
    icon: TicketPercent,
    title: 'Special Discount',
    desc: 'Special savings just for you.',
  },
];

export default function BrandPerksSection() {
  return (
    <section className="py-14 sm:py-18 bg-brand-cream border-t border-brand-light">
      <div className="container-padded">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {PERKS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-start text-left group">
              {/* Circular Icon Badge */}
              <div className="w-14 h-14 rounded-full bg-brand-gold text-white flex items-center justify-center shadow-gold group-hover:bg-brand-gold-dark group-hover:scale-105 transition-all duration-300">
                <Icon size={24} strokeWidth={1.75} />
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl sm:text-2xl font-normal text-brand-charcoal mt-6 mb-2 tracking-wide">
                {title}
              </h3>

              {/* Accent Underline */}
              <div className="w-9 h-0.5 bg-brand-gold mb-3 rounded-full" />

              {/* Description */}
              <p className="text-brand-mid text-xs sm:text-sm font-light leading-relaxed mb-4">
                {desc}
              </p>

              {/* Accent Bullet Dot */}
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}