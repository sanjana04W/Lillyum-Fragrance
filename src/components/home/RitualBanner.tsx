import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function RitualBanner() {
  return (
    <section className="py-8 sm:py-12 bg-brand-cream">
      <div className="container-padded">
        <div className="relative rounded-3xl overflow-hidden shadow-card-hover border border-brand-light bg-[#1C1715] text-white min-h-[440px] md:min-h-[500px] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/fragrance_ritual.jpg"
              alt="The Ritual of Scent"
              fill
              priority
              className="object-cover object-left md:object-center"
            />
            {/* Elegant Luxury Gradient overlay to guarantee crisp text legibility on the right */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-[#1C1715]/75 md:via-[#1C1715]/85 to-[#1C1715] z-10" />
          </div>

          {/* Spacer column on desktop so model & fragrance mist remain visible */}
          <div className="hidden md:block md:w-5/12 lg:w-1/2 relative z-20 min-h-[350px]" />

          {/* Typography Content on the Right */}
          <div className="relative z-20 w-full md:w-7/12 lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center text-center md:text-left">
            {/* Small pill/overline */}
            <p className="text-brand-gold-light text-xs sm:text-sm font-serif tracking-[0.3em] uppercase mb-4">
              THE RITUAL
            </p>

            {/* Editorial Headline */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.2] tracking-tight text-white mb-6">
              A quiet <span className="italic font-normal font-serif text-brand-gold-lighter">ritual of scent,</span><br className="hidden sm:inline" />
              {' '}softness, and presence.
            </h2>

            {/* Editorial Paragraph */}
            <p className="text-white/80 text-xs sm:text-sm max-w-md mb-8 leading-relaxed mx-auto md:mx-0">
              More than an aroma — an intimate daily pause that lingers gracefully throughout your day. Handpicked essences crafted to mirror your personal essence.
            </p>

            {/* Dual CTA links */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 sm:gap-8 pt-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium text-brand-gold-lighter hover:text-white transition-colors group"
              >
                DISCOVER THE RITUAL
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <Link
                href="/shop"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm uppercase tracking-[0.2em] font-medium text-brand-gold-lighter hover:text-white transition-colors group"
              >
                SHOP FRAGRANCES
                <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
