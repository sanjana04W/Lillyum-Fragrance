import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  {
    label: 'Women',
    href: '/shop/women',
    image: '/images/1dc9d3caa49629dcf553b591e815fcb9.jpg',
    sub: 'Elegant & Floral',
    emoji: '♀',
  },
  {
    label: 'Men',
    href: '/shop/men',
    image: '/images/0771edee4246abc5f034c3be2e739e74.jpg',
    sub: 'Bold & Powerful',
    emoji: '♂',
  },
  {
    label: 'Unisex',
    href: '/shop/unisex',
    image: '/images/3f5a9b3d7d07ab1203b5a753c37bbf5b.jpg',
    sub: 'For Everyone',
    emoji: '✦',
  },
  {
    label: 'Gift Sets',
    href: '/shop/gift-sets',
    image: '/images/4ed73906dc55b3491b3fc80daba6b528.jpg',
    sub: 'Perfect Presents',
    emoji: '🎁',
  },
  {
    label: 'New Arrivals',
    href: '/shop/new-arrivals',
    image: '/images/c011c8c4754ba7a75e6e577d680f9835.jpg',
    sub: 'Latest Drops',
    emoji: '✨',
  },
  {
    label: 'Offers',
    href: '/offers',
    image: '/images/f4f75331a4fe2c1c2f5d2193ac5f6462.jpg',
    sub: 'Best Deals',
    emoji: '🏷',
  },
];

export default function CategoryNav() {
  return (
    <section className="py-14 bg-brand-cream">
      <div className="container-padded">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-semibold mb-2">Collections</p>
          <h2 className="section-heading">Browse by Category</h2>
          <p className="section-subheading mx-auto mt-2">Find your perfect fragrance from our curated collection</p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.href} href={cat.href} className="group">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-ivory mb-2.5 shadow-card group-hover:shadow-card-hover transition-all duration-300">
                <Image
                  src={cat.image}
                  alt={`${cat.label} fragrances`}
                  fill
                  sizes="(max-width:640px) 33vw, (max-width:1024px) 33vw, 16vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/75 via-brand-charcoal/20 to-transparent" />
                {/* Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-3 px-2 text-center">
                  <p className="text-white font-semibold text-xs sm:text-sm leading-tight">{cat.label}</p>
                  <p className="text-brand-gold-lighter text-[10px] hidden sm:block mt-0.5">{cat.sub}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View all */}
        <div className="text-center mt-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold hover:text-brand-gold-dark transition-colors group"
          >
            View All Products
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
