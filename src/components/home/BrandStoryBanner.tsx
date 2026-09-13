import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const POINTS = [
  'Directly sourced from authorized distributors in Dubai & Europe',
  'Serving Sri Lanka since 2020 with 4,800+ happy customers',
  'Cash on Delivery — no advance payment needed',
  'Free returns within 48 hours if you\'re unsatisfied',
];

export default function BrandStoryBanner() {
  return (
    <section className="py-16 bg-brand-ivory overflow-hidden">
      <div className="container-padded">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Image collage */}
          <div className="relative h-80 lg:h-[440px] rounded-3xl overflow-hidden shadow-soft-lg">
            <Image
              src="/images/0f1335e388535d48b99c24c0e4894fc2.jpg"
              alt="Lillyum Fragrance Story"
              fill
              className="object-cover"
            />
            {/* Overlaid card */}
            <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-gold-soft flex items-center justify-center shrink-0">
                  <span className="text-lg">🌸</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-brand-charcoal">Lillyum Fragrance Studio</p>
                  <p className="text-[11px] text-brand-muted">Sri Lanka's trusted perfume destination</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-lg font-bold text-brand-gold">4,800+</p>
                  <p className="text-[10px] text-brand-muted">Happy customers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div>
            <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-semibold mb-3">Our Story</p>
            <h2 className="section-heading mb-5">
              Authentic Fragrances,<br />
              <span className="text-gold-gradient">Real Sri Lankan Trust</span>
            </h2>
            <p className="text-brand-mid text-sm leading-relaxed mb-5">
              Lillyum Fragrance Studio was born from a passion for luxury scents and a mission to make them accessible across Sri Lanka. Every bottle we sell is 100% authentic — sourced directly from authorized distributors in Dubai, Europe, and the Arab world.
            </p>
            <p className="text-brand-mid text-sm leading-relaxed mb-7">
              From our humble beginnings on Facebook and Instagram, we've grown to serve thousands of customers island-wide, and we're just getting started.
            </p>

            <ul className="space-y-3 mb-8">
              {POINTS.map((pt) => (
                <li key={pt} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-brand-gold mt-0.5 shrink-0" />
                  <span className="text-sm text-brand-dark">{pt}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-charcoal text-white text-sm font-semibold rounded-xl hover:bg-brand-dark transition-colors group"
            >
              Read Our Story
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
