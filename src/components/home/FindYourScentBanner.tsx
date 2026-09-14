import Image from 'next/image';
import Link from 'next/link';

export default function FindYourScentBanner() {
  return (
    <section className="relative w-full bg-[#120D0A] overflow-hidden py-20 sm:py-28 lg:py-36 text-white text-center">
      {/* Background Image with Ambient Glow */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/find_your_scent_hd.jpg"
          alt="Discover the Essence that Defines You - Lillyum Fragrance"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Cinematic dark luxury gradient to ensure text clarity and seamless blending */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 z-10" />
        <div className="absolute inset-0 bg-black/25 z-10" />
      </div>

      {/* Content Container */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <p className="text-brand-gold-lighter text-xs sm:text-sm uppercase tracking-[0.35em] font-medium mb-4 sm:mb-5">
          — Find Your Scent —
        </p>

        {/* Headline */}
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal leading-[1.18] tracking-wide text-white mb-5 sm:mb-6">
          Discover <span className="italic font-serif text-brand-gold-lighter">the Essence</span> that Defines You
        </h2>

        {/* Subtitle */}
        <p className="text-white/85 text-sm sm:text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10">
          Find a scent that speaks your truth — subtle or bold, familiar or unexplored.
          <span className="block mt-1 sm:inline sm:mt-0"> Let your fragrance reflect the feeling you want to carry.</span>
        </p>

        {/* Action Button */}
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-8 sm:px-10 py-3.5 sm:py-4 bg-brand-gold hover:bg-brand-gold-dark text-white font-semibold text-xs sm:text-sm uppercase tracking-[0.2em] rounded-xl shadow-gold hover:shadow-gold-lg hover:scale-105 transition-all duration-300"
          >
            Find Your Scent
          </Link>
        </div>
      </div>
    </section>
  );
}