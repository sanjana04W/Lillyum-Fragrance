'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

const SLIDES = [
  {
    id: 1,
    headline: 'Discover Your Signature Scent',
    sub: 'Authentic imported fragrances delivered islandwide · Cash on Delivery',
    cta: { label: 'Shop All Perfumes', href: '/shop' },
    ctaSecondary: { label: 'New Arrivals', href: '/shop/new-arrivals' },
    image: '/images/0f1335e388535d48b99c24c0e4894fc2.jpg',
    badge: '100% Authentic',
  },
  {
    id: 2,
    headline: 'Best Sellers of the Season',
    sub: 'Our most-loved fragrances — loved by thousands across Sri Lanka',
    cta: { label: 'View Best Sellers', href: '/shop/best-sellers' },
    ctaSecondary: { label: 'Shop Men', href: '/shop/men' },
    image: '/images/8a9a7313bb27e5a998c3f427bf0a7ba2.jpg',
    badge: 'Best Seller',
  },
  {
    id: 3,
    headline: 'New Arrivals Just Landed',
    sub: 'Fresh from Dubai — the latest fragrances to hit our collection',
    cta: { label: 'Explore New Arrivals', href: '/shop/new-arrivals' },
    ctaSecondary: { label: 'View Offers', href: '/offers' },
    image: '/images/440ffe895171256286ad489ca83ba45c.jpg',
    badge: 'New In',
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <section className="relative h-[75vh] min-h-[480px] max-h-[720px] overflow-hidden bg-brand-black">
      {/* Background image */}
      <div className="absolute inset-0 transition-opacity duration-1000">
        <Image
          src={slide.image}
          alt={slide.headline}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 via-brand-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl animate-fade-in">
            <span className="inline-block bg-brand-gold text-brand-black text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-4">
              {slide.badge}
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-brand-white leading-tight mb-4">
              {slide.headline}
            </h1>
            <p className="text-brand-light/80 text-sm sm:text-base mb-6 leading-relaxed">
              {slide.sub}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={slide.cta.href}>
                <Button variant="primary" size="lg">{slide.cta.label}</Button>
              </Link>
              <Link href={slide.ctaSecondary.href}>
                <Button variant="outline" size="lg">{slide.ctaSecondary.label}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-brand-gold' : 'w-2 bg-brand-white/40'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
