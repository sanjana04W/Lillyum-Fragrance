import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Heart, Star, Truck } from 'lucide-react';
import Button from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About Us | Lillyum Fragrance Sri Lanka',
  description:
    'Learn about Lillyum Fragrance — Sri Lanka\'s trusted destination for authentic imported perfumes. Serving fragrance lovers islandwide with Cash on Delivery.',
};

const VALUES = [
  { icon: Shield, title: 'Authenticity Guaranteed', desc: 'Every fragrance we sell is 100% genuine, imported directly. No fakes, no compromises.' },
  { icon: Heart, title: 'Passion for Fragrance', desc: 'We are fragrance enthusiasts who curate only the best from global perfume houses.' },
  { icon: Star, title: 'Customer First', desc: 'Your satisfaction is our priority. We go the extra mile to ensure you love your purchase.' },
  { icon: Truck, title: 'Island-wide Delivery', desc: 'We deliver authentic fragrances to all 25 districts across Sri Lanka.' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Hero */}
      <div className="relative bg-brand-white border-b border-brand-light py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <Image src="/images/8a9a7313bb27e5a998c3f427bf0a7ba2.jpg" alt="" fill className="object-cover" />
        </div>
        <div className="relative container-padded text-center">
          <p className="text-brand-gold text-xs uppercase tracking-widest font-semibold mb-3">Our Story</p>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-brand-charcoal mb-4">
            About Lillyum Fragrance
          </h1>
          <p className="text-brand-mid text-base max-w-2xl mx-auto">
            Born from a passion for authentic fragrances, Lillyum Fragrance is Sri Lanka's trusted destination for genuine, imported perfumes at accessible prices.
          </p>
        </div>
      </div>

      {/* Who We Are / Brand History */}
      <section className="py-16 sm:py-24 container-padded">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 lg:gap-16 items-center">
          {/* Image to the left */}
          <div className="relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-card border border-brand-light bg-brand-ivory group">
            <Image
              src="/images/about_brand_heritage.jpg"
              alt="Lillyum Fragrance perfume formulation and artisanal heritage"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Editorial Content on the right */}
          <div>
            <p className="text-brand-gold text-xs uppercase tracking-[0.35em] font-semibold mb-4">
              WHO WE ARE
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-[1.25] tracking-wide text-brand-charcoal uppercase mb-6">
              WE ARE SRI LANKA&apos;S SPECIALIST FRAGRANCE DESTINATION BRINGING ICONIC GLOBAL SCENTS DIRECTLY TO YOU.
            </h2>
            <div className="space-y-4 text-brand-mid text-sm sm:text-base leading-relaxed font-light">
              <p>
                Founded on an enduring reverence for the ancient art of perfumery, Lillyum Fragrance began as an intimate curatorial pursuit—sourcing authentic, rare, and celebrated fragrances from world-renowned perfume houses in France, Dubai, and beyond. Every bottle in our repertoire carries a legacy of exquisite formulation, uniting noble ingredients such as pure Cambodian agarwood, velvety amber, and delicate Damask rose petals.
              </p>
              <p>
                What started as sharing olfactory stories with a close-knit circle of scent connoisseurs has evolved into the island&apos;s premier destination for genuine artisanal perfumes. With thousands of satisfied clients across all 25 districts of Sri Lanka, our promise remains timeless: celebrating uncompromising authenticity, rare aromatic profiles, and the enduring luxury of finding your personal signature scent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand History & Heritage Timeline */}
      <section className="py-16 sm:py-24 bg-brand-white border-t border-brand-light">
        <div className="container-padded">
          {/* Top 2-Column Story Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16 sm:mb-20">
            {/* Left Column: Narrative Copy */}
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-brand-gold font-semibold mb-3">
                — BRAND HISTORY —
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-brand-charcoal leading-[1.2] mb-4">
                Years of Craft,{' '}
                <span className="italic font-serif font-normal text-brand-gold">Thousands</span>{' '}
                of Different Stories
              </h2>

              <p className="text-brand-charcoal font-medium text-base sm:text-lg mb-4">
                From subtle daytime — find a scent that moves with you.
              </p>

              <div className="space-y-4 text-brand-mid text-sm sm:text-base font-light leading-relaxed mb-8">
                <p>
                  Behind every bottle lies a legacy of artistry and intention. For years, we have been crafting fragrances that capture the very best moments, emotions, and identity that fit to anyone.
                </p>
                <p>
                  Our scents are born from meticulous blending, where tradition meets modern olfactory storytelling. Whether you&apos;re drawn to something soft or unforgettable, there&apos;s a story waiting to unfold — uniquely yours.
                </p>
              </div>

              {/* Scent Journey Callout Feature */}
              <div className="flex items-start gap-4 pt-2">
                <div className="w-12 h-12 rounded-full bg-brand-gold shrink-0 flex items-center justify-center text-white shadow-gold">
                  {/* Stylized Fragrance Bottle Icon */}
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="7" y="10" width="10" height="11" rx="2" />
                    <path d="M10 7h4v3h-4z" />
                    <path d="M12 4v3" />
                    <circle cx="12" cy="15" r="1.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-serif italic text-base sm:text-lg font-medium text-brand-charcoal">
                    Pick Your Own Scent Journey
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-mid mt-0.5 leading-relaxed">
                    Explore a selection of curated fragrance plans. Choose the one that fits your style and pace.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Specially Framed Driftwood Perfume Presentation */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="relative rounded-tl-[80px] sm:rounded-tl-[110px] rounded-br-[80px] sm:rounded-br-[110px] rounded-tr-2xl rounded-bl-2xl p-3 sm:p-4 bg-brand-cream/60 border border-brand-light/90 shadow-card">
                <div className="relative aspect-[4/3] w-full rounded-tl-[70px] sm:rounded-tl-[98px] rounded-br-[70px] sm:rounded-br-[98px] rounded-tr-xl rounded-bl-xl overflow-hidden bg-brand-ivory">
                  <Image
                    src="/images/brand_history_bottle.jpg"
                    alt="Lillyum artisanal perfume bottle with crystal cap resting on driftwood"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Milestone Timeline Track */}
          <div className="pt-10 border-t border-brand-light/80">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-10">
              {/* 2005 */}
              <div>
                <div className="w-7 h-[2px] bg-brand-gold mb-2" />
                <p className="text-xs font-semibold tracking-widest text-brand-gold font-mono">2005</p>
                <h4 className="font-serif text-lg sm:text-xl font-bold text-brand-charcoal mt-2 mb-1.5">
                  A Fragrant Beginning
                </h4>
                <p className="text-xs sm:text-sm text-brand-mid font-light leading-relaxed">
                  Single scent sparked a new vision.
                </p>
                <div className="w-2 h-2 rounded-full bg-brand-gold mt-5" />
              </div>

              {/* 2010 */}
              <div>
                <div className="w-7 h-[2px] bg-brand-gold mb-2" />
                <p className="text-xs font-semibold tracking-widest text-brand-gold font-mono">2010</p>
                <h4 className="font-serif text-lg sm:text-xl font-bold text-brand-charcoal mt-2 mb-1.5">
                  Craft Refined
                </h4>
                <p className="text-xs sm:text-sm text-brand-mid font-light leading-relaxed">
                  Tradition &amp; innovation found balance.
                </p>
                <div className="w-2 h-2 rounded-full bg-brand-gold mt-5" />
              </div>

              {/* 2018 */}
              <div>
                <div className="w-7 h-[2px] bg-brand-gold mb-2" />
                <p className="text-xs font-semibold tracking-widest text-brand-gold font-mono">2018</p>
                <h4 className="font-serif text-lg sm:text-xl font-bold text-brand-charcoal mt-2 mb-1.5">
                  Signature Scents
                </h4>
                <p className="text-xs sm:text-sm text-brand-mid font-light leading-relaxed">
                  Bold collections captured loyal hearts.
                </p>
                <div className="w-2 h-2 rounded-full bg-brand-gold mt-5" />
              </div>

              {/* 2025 */}
              <div>
                <div className="w-7 h-[2px] bg-brand-gold mb-2" />
                <p className="text-xs font-semibold tracking-widest text-brand-gold font-mono">2025</p>
                <h4 className="font-serif text-lg sm:text-xl font-bold text-brand-charcoal mt-2 mb-1.5">
                  Future in Every Bottle
                </h4>
                <p className="text-xs sm:text-sm text-brand-mid font-light leading-relaxed">
                  New ideas honor our rich heritage.
                </p>
                <div className="w-2 h-2 rounded-full bg-brand-gold mt-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Philosophy Section */}
      <section className="py-16 sm:py-24 bg-brand-cream border-t border-brand-light">
        <div className="container-padded">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center">
            {/* Left Image: Bottle on silk with crimson petals */}
            <div className="lg:col-span-4 order-2 lg:order-1">
              <div className="relative aspect-[3/4] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-card border border-brand-light bg-brand-white group">
                <Image
                  src="/images/philosophy_silk_bottle.jpg"
                  alt="Fine perfume bottle on draped ivory silk with crimson rose petals"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>

            {/* Center Content Card */}
            <div className="lg:col-span-4 order-1 lg:order-2 text-center px-2 sm:px-4 py-4 lg:py-0">
              <p className="text-xs uppercase tracking-[0.3em] text-brand-gold font-semibold mb-3">
                — OUR PHILOSOPHY —
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl xl:text-[2.6rem] font-normal text-brand-charcoal leading-[1.2] mb-4">
                Fragrance With Meaning Begin{' '}
                <span className="italic font-serif font-normal text-brand-gold">Your Story</span>
              </h2>

              <p className="text-brand-charcoal font-medium text-sm sm:text-base leading-snug mb-4 max-w-sm mx-auto">
                Crafted with care, inspired by emotion, designed to linger.
              </p>

              <p className="text-brand-mid text-xs sm:text-sm font-light leading-relaxed mb-8 max-w-md mx-auto">
                We use ethically sourced ingredients, work with master perfumers, and create in small batches to ensure integrity in every bottle — each scent thoughtfully blended to reflect personal stories and emotions.
              </p>

              <Link
                href="/shop"
                className="inline-flex items-center justify-center px-8 py-3.5 bg-brand-gold hover:bg-brand-gold-dark text-white text-xs uppercase tracking-[0.2em] font-semibold transition-colors duration-300 shadow-gold"
              >
                Learn More
              </Link>
            </div>

            {/* Right Image: Bottle and box floating among red florals */}
            <div className="lg:col-span-4 order-3">
              <div className="relative aspect-[3/4] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-card border border-brand-light bg-brand-white group">
                <Image
                  src="/images/philosophy_floating_bottle.jpg"
                  alt="Luxury fragrance flacon and embossed packaging box floating amidst florals"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-brand-white border-y border-brand-light">
        <div className="container-padded">
          <div className="text-center mb-12">
            <p className="text-brand-gold text-xs uppercase tracking-widest font-semibold mb-2">Our Values</p>
            <h2 className="section-heading">What We Stand For</h2>
            <div className="section-divider mt-3" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-brand-cream rounded-2xl p-6 border border-brand-light text-center shadow-card">
                <div className="w-12 h-12 rounded-2xl bg-brand-gold-soft flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-brand-gold" />
                </div>
                <h3 className="text-brand-charcoal font-semibold text-base mb-2">{title}</h3>
                <p className="text-brand-mid text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 container-padded text-center">
        <h2 className="section-heading mb-3">Ready to Find Your Signature Scent?</h2>
        <p className="text-brand-muted text-sm mb-6 max-w-md mx-auto">
          Browse our collection of authentic imported fragrances and experience the difference quality makes.
        </p>
        <Link href="/shop">
          <Button variant="primary" size="lg">Shop All Perfumes</Button>
        </Link>
      </section>
    </div>
  );
}

