import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Tag, Sparkles, ArrowRight, ShieldCheck, Clock, Gift } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { SAMPLE_PRODUCTS } from '@/data/products';

export const metadata: Metadata = {
  title: 'Offers & Sale | Lillyum Fragrance Sri Lanka',
  description:
    'Shop discounted authentic perfumes online Sri Lanka. Limited time offers, special promotions, and sale fragrances from Armaf, Lattafa, Rasasi, Ajmal — with islandwide COD.',
};

const offerProducts = SAMPLE_PRODUCTS.filter(
  (p) => p.status === 'active' && p.categories.includes('offers')
);
const saleProducts = SAMPLE_PRODUCTS.filter(
  (p) => p.status === 'active' && p.variants.some((v) => v.salePrice)
);

// Merge without duplicates
const allDeals = [
  ...offerProducts,
  ...saleProducts.filter((p) => !offerProducts.find((o) => o.id === p.id)),
];

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* ── Page Header ── */}
      <div className="bg-brand-white border-b border-brand-light py-10 sm:py-12">
        <div className="container-padded text-center">
          <span className="inline-flex items-center gap-1.5 bg-brand-gold-soft text-brand-gold-dark border border-brand-gold/30 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-3 shadow-soft">
            <Tag size={13} /> Exclusive Deals
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-charcoal mb-3">
            Offers & Special Promotions
          </h1>
          <p className="text-brand-mid text-sm sm:text-base max-w-xl mx-auto">
            Discover limited-time bundle promotions, seasonal markdowns, and special gifts on authentic luxury perfumes.
          </p>
        </div>
      </div>

      <div className="container-padded py-8 sm:py-12">
        {/* ── High-Definition Promotional Banner Section ── */}
        <section className="mb-14 rounded-3xl overflow-hidden shadow-card-hover border border-brand-light bg-[#19080F] text-white relative">
          <div className="relative w-full min-h-[440px] md:min-h-[500px] flex flex-col md:flex-row items-stretch">
            {/* Background High-Resolution Clean Product Imagery */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/images/offers_promo_banner_clean.jpg"
                alt="Luxury Fragrance Mist Promotion"
                fill
                priority
                className="object-cover object-left md:object-center"
              />
              {/* Responsive Gradient overlay to blend perfectly with text */}
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-[#19080F]/70 md:via-[#19080F]/80 to-[#19080F] z-10" />
            </div>

            {/* Empty column on desktop to let the luxury mist bottles shine */}
            <div className="hidden md:block md:w-5/12 lg:w-1/2 relative z-20 min-h-[300px]" />

            {/* Crisp Typography & Promotion Details Overlay */}
            <div className="relative z-20 w-full md:w-7/12 lg:w-1/2 flex flex-col justify-center p-6 sm:p-10 lg:p-14 text-center md:text-left">
              {/* Header Badges */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-3">
                <span className="bg-red-500 text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  Limited Time
                </span>
                <span className="bg-brand-gold/20 text-brand-gold-lighter border border-brand-gold/30 text-[11px] font-semibold tracking-wider uppercase px-3 py-1 rounded-full flex items-center gap-1.5">
                  <Sparkles size={13} className="text-brand-gold-light" /> Special Promotion
                </span>
              </div>

              {/* Title & Promotion Structure */}
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2 leading-tight">
                BUY ANY <span className="text-gold-gradient font-black">2x 250ml</span> BODY MISTS
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-3 my-2">
                <span className="text-xl sm:text-2xl font-serif text-brand-gold-lighter">&amp; GET</span>
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white underline decoration-brand-gold decoration-2 underline-offset-4">
                  1 FREE 75ml MIST!
                </span>
              </div>

              <p className="text-white/80 text-xs sm:text-sm max-w-lg mt-2 mb-6 leading-relaxed">
                Elevate your everyday fragrance ritual. Purchase any two full-sized 250ml fragrance mists from our luxury collection and get a complimentary travel-size 75ml mist of your choice.
              </p>

              {/* CTA & Savings Callout */}
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                <a
                  href="#deals-grid"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-white text-sm font-semibold rounded-2xl shadow-gold hover:shadow-gold-lg transition-all duration-200"
                >
                  <Gift size={16} />
                  Shop The Promotion
                  <ArrowRight size={15} />
                </a>

                <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] text-brand-gold-lighter uppercase tracking-wider font-semibold">Total Savings</p>
                    <p className="text-base font-bold text-white">Save Rs. 3,750</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Banner bottom highlight ribbon */}
          <div className="bg-[#12050B] border-t border-white/10 px-6 py-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 text-brand-gold-lighter">
              <Sparkles size={15} className="text-brand-gold shrink-0" />
              <span className="font-medium">Free 75ml Mist with every 2 full-size mists</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 text-brand-gold-lighter">
              <Clock size={15} className="text-brand-gold shrink-0" />
              <span className="font-medium">Valid while promotional stocks last</span>
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-2.5 text-brand-gold-lighter">
              <ShieldCheck size={15} className="text-brand-gold shrink-0" />
              <span className="font-medium">100% Authentic Guaranteed</span>
            </div>
          </div>
        </section>

        {/* ── Product Deals Grid ── */}
        <section id="deals-grid" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-brand-charcoal">
                Discounted Fragrances
              </h2>
              <p className="text-brand-mid text-xs sm:text-sm mt-0.5">
                {allDeals.length} items currently on offer
              </p>
            </div>
          </div>

          {allDeals.length > 0 ? (
            <div className="product-grid">
              {allDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-brand-white rounded-2xl border border-brand-light">
              <p className="text-brand-mid text-lg font-medium">No active offers at the moment.</p>
              <p className="text-brand-muted text-sm mt-2">Check back soon — we run regular promotions!</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
