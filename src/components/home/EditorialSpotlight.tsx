import Image from 'next/image';
import Link from 'next/link';

export default function EditorialSpotlight() {
  return (
    <section className="py-16 sm:py-24 bg-brand-white border-t border-brand-light">
      <div className="container-padded">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-20 items-center">
          {/* Left Column: Layered Luxury Fragrance Imagery */}
          <div className="lg:col-span-6 xl:col-span-7">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              {/* Main Angled Flacon Image */}
              <div className="relative aspect-[4/3] w-[88%] ml-auto rounded-3xl overflow-hidden shadow-card border border-brand-light bg-brand-ivory group">
                <Image
                  src="/images/spotlight_bottle_1.jpg"
                  alt="Lillyum Signature Eau de Parfum with white floral blossoms"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Overlapping Inset Bottle Card (Bottom-Left) */}
              <div className="absolute -bottom-6 left-0 w-[44%] sm:w-[40%] aspect-square rounded-2xl overflow-hidden shadow-card-hover border-2 border-brand-white bg-brand-white z-10">
                <Image
                  src="/images/spotlight_inset_1.jpg"
                  alt="Aura Eau de Parfum Iconic Flacon"
                  fill
                  sizes="(max-width: 1024px) 45vw, 25vw"
                  className="object-contain p-2.5 hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="lg:col-span-6 xl:col-span-5 text-left pt-6 lg:pt-0">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-gold font-semibold mb-4">
              OUR ORIGINAL PERFUME
            </p>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-brand-charcoal leading-[1.1] tracking-wide uppercase mb-6">
              THE<br />
              NEW<br />
              FRAGRANCE
            </h2>

            <p className="text-brand-mid text-sm sm:text-base font-light leading-relaxed mb-8 max-w-md">
              Distilled from rare botanical absolutes, blending sparkling citrus top notes with a sumptuous heart of white jasmine, velvet rose petals, and golden amber. Created for the individual who leaves an indelible impression.
            </p>

            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-9 py-4 bg-brand-charcoal hover:bg-brand-gold text-white text-xs uppercase tracking-[0.25em] font-semibold transition-colors duration-300 shadow-soft"
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

