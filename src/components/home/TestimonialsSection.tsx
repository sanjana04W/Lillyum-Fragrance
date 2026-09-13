import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Tharushi M.',
    location: 'Colombo',
    rating: 5,
    text: "I ordered Baccarat Rouge 540 and it arrived beautifully packaged. 100% genuine — I've compared it to the one at duty free. Will definitely order again!",
    product: 'Baccarat Rouge 540',
    avatar: 'T',
  },
  {
    id: 2,
    name: 'Kasun P.',
    location: 'Kandy',
    rating: 5,
    text: "Great service! The WhatsApp support was super responsive. My order arrived within 3 days with free delivery. Packaging was excellent.",
    product: 'Dior Sauvage EDP',
    avatar: 'K',
  },
  {
    id: 3,
    name: 'Nethmi S.',
    location: 'Galle',
    rating: 5,
    text: "Finally a reliable place to buy authentic perfumes in Sri Lanka. The prices are fair and the quality is amazing. Highly recommend Lillyum!",
    product: "YSL Black Opium",
    avatar: 'N',
  },
  {
    id: 4,
    name: 'Dinusha R.',
    location: 'Nugegoda',
    rating: 5,
    text: "Bought two perfumes as gifts for my parents — they loved them! Fast delivery and the gift packaging was a lovely touch. Thank you Lillyum!",
    product: 'Versace Eros',
    avatar: 'D',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-brand-ivory">
      <div className="container-padded">
        <div className="text-center mb-12">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-semibold mb-2">Reviews</p>
          <h2 className="section-heading">What Our Customers Say</h2>
          <p className="text-brand-mid text-sm mt-2">Real reviews from real Sri Lankan customers</p>
          {/* Star summary */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="text-brand-gold fill-brand-gold" />
              ))}
            </div>
            <span className="text-sm font-semibold text-brand-charcoal">4.8 / 5</span>
            <span className="text-sm text-brand-muted">· 200+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TESTIMONIALS.map((t) => (
            <div key={t.id} className="card-surface p-5 flex flex-col gap-4 relative">
              <Quote size={20} className="text-brand-gold/30 absolute top-4 right-4" />
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={13} className="text-brand-gold fill-brand-gold" />
                ))}
              </div>
              {/* Text */}
              <p className="text-sm text-brand-dark leading-relaxed flex-1">"{t.text}"</p>
              {/* Product badge */}
              <span className="badge-gold text-[10px] self-start">{t.product}</span>
              {/* Author */}
              <div className="flex items-center gap-2.5 pt-2 border-t border-brand-light">
                <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-white text-xs font-bold shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-charcoal">{t.name}</p>
                  <p className="text-[10px] text-brand-muted">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
