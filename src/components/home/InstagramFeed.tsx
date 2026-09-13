import Link from 'next/link';
import { Instagram } from 'lucide-react';

export default function InstagramFeed() {
  return (
    <section className="py-14 bg-brand-white">
      <div className="container-padded">
        <div className="text-center mb-8">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-semibold mb-2">Follow Us</p>
          <h2 className="section-heading">@lillyum_fragrance</h2>
          <p className="text-brand-mid text-sm mt-2">Follow us on Instagram for fragrance inspiration & giveaways</p>
        </div>

        {/* Placeholder grid */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {[
            '/images/0f1335e388535d48b99c24c0e4894fc2.jpg',
            '/images/1dc9d3caa49629dcf553b591e815fcb9.jpg',
            '/images/3f5a9b3d7d07ab1203b5a753c37bbf5b.jpg',
            '/images/29d72228b8254853126e1f8c0074c08d.jpg',
            '/images/c011c8c4754ba7a75e6e577d680f9835.jpg',
            '/images/440ffe895171256286ad489ca83ba45c.jpg',
          ].map((src, i) => (
            <Link
              key={i}
              href="https://www.instagram.com/lillyum_fragrance"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square overflow-hidden rounded-xl bg-brand-ivory"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Instagram post ${i + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-brand-charcoal/0 group-hover:bg-brand-charcoal/40 transition-colors duration-300 flex items-center justify-center">
                <Instagram size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-6">
          <a
            href="https://www.instagram.com/lillyum_fragrance"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-gold text-brand-gold text-sm font-semibold rounded-xl hover:bg-brand-gold hover:text-white transition-all duration-200"
          >
            <Instagram size={16} />
            Follow on Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
