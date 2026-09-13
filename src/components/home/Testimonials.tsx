import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: 'Chamari P.',
    location: 'Colombo',
    rating: 5,
    review: 'Absolutely love the Club de Nuit! The packaging was perfect and arrived in 2 days. 100% genuine product. Will definitely order again!',
    product: 'Armaf Club de Nuit Intense Man',
  },
  {
    name: 'Kavinda R.',
    location: 'Kandy',
    rating: 5,
    review: 'Finally found a reliable place to buy original perfumes in Sri Lanka. Lillyum Fragrance is the best! Fast delivery and great prices.',
    product: 'Lattafa Khamrah EDP',
  },
  {
    name: 'Dilani S.',
    location: 'Galle',
    rating: 5,
    review: 'Ordered Yara for my daughter\'s birthday and she loved it! COD made it so easy to order. Very trustworthy seller.',
    product: 'Lattafa Yara EDP',
  },
  {
    name: 'Ashan M.',
    location: 'Negombo',
    rating: 5,
    review: 'Great experience ordering from Lillyum. The Hawas EDT smells exactly like the original. Quick delivery to Negombo as well!',
    product: 'Rasasi Hawas EDT',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < count ? 'text-brand-gold fill-brand-gold' : 'text-brand-mid'}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-14 bg-brand-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-white mb-2">
            What Our Customers Say
          </h2>
          <p className="text-brand-muted text-sm">Trusted by fragrance lovers across Sri Lanka</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="text-brand-gold fill-brand-gold" />
              ))}
            </div>
            <span className="text-brand-light text-sm font-semibold">4.8</span>
            <span className="text-brand-muted text-sm">· 200+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="bg-brand-dark rounded-xl p-5 border border-brand-mid/20 hover:border-brand-gold/30 transition-colors"
            >
              <Stars count={t.rating} />
              <p className="text-brand-light text-sm mt-3 mb-4 leading-relaxed">"{t.review}"</p>
              <div>
                <p className="text-brand-white text-sm font-semibold">{t.name}</p>
                <p className="text-brand-muted text-xs">{t.location}</p>
                <p className="text-brand-gold text-xs mt-1 italic">{t.product}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
