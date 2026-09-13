'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    headline: 'Discover Your Signature Scent',
    sub: 'Authentic imported fragrances delivered island-wide · Cash on Delivery available',
    cta: { label: 'Shop All Perfumes', href: '/shop' },
    ctaSecondary: { label: 'New Arrivals', href: '/shop/new-arrivals' },
    image: '/images/hero_slide_1.jpg',
    badge: '100% Authentic',
    accent: 'For Men & Women',
  },
  {
    id: 2,
    headline: 'Best Sellers of the Season',
    sub: 'Our most-loved fragrances — trusted by thousands across Sri Lanka',
    cta: { label: 'View Best Sellers', href: '/shop/best-sellers' },
    ctaSecondary: { label: "Shop Men's", href: '/shop/men' },
    image: '/images/hero_slide_2.jpg',
    badge: '⭐ Best Seller',
    accent: 'Premium Collection',
  },
  {
    id: 3,
    headline: 'New Arrivals Just Landed',
    sub: 'Fresh from Dubai — the latest fragrances to elevate your collection',
    cta: { label: 'Explore New Arrivals', href: '/shop/new-arrivals' },
    ctaSecondary: { label: 'View Offers', href: '/offers' },
    image: '/images/hero_slide_3.jpg',
    badge: '✨ New In',
    accent: 'Latest Drops',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [paused, next]);

  const slide = SLIDES[current];

  return (
    <section
      className="relative h-[80vh] min-h-[520px] max-h-[760px] overflow-hidden bg-brand-charcoal"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background image with crossfade */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={s.image}
            alt={s.headline}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Gradient overlay — dark left, transparent right */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/90 via-brand-charcoal/55 to-brand-charcoal/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/40 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container-padded w-full">
          <div className="max-w-lg">
            {/* Badge */}
            <span className="inline-block bg-brand-gold text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 shadow-gold animate-fade-in">
              {slide.badge}
            </span>

            {/* Accent label */}
            <p className="text-brand-gold-lighter text-xs uppercase tracking-[0.3em] mb-3 font-medium animate-fade-in">
              {slide.accent}
            </p>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 animate-slide-up">
              {slide.headline}
            </h1>

            {/* Subtext */}
            <p className="text-white/75 text-sm sm:text-base mb-7 leading-relaxed max-w-md animate-fade-in">
              {slide.sub}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 animate-fade-in">
              <Link href={slide.cta.href}>
                <Button variant="primary" size="lg">
                  {slide.cta.label}
                </Button>
              </Link>
              <Link href={slide.ctaSecondary.href}>
                <button className="px-6 py-3 text-sm font-semibold rounded-xl border-2 border-white/40 text-white hover:border-white hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
                  {slide.ctaSecondary.label}
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Nav arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm text-white transition-all duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-sm text-white transition-all duration-200"
        aria-label="Next slide"
      >
        <ChevronRight size={20} />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-400 ${
              i === current ? 'w-8 bg-brand-gold' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Slide count */}
      <div className="absolute bottom-6 right-6 z-20 text-white/50 text-xs font-medium">
        {current + 1} / {SLIDES.length}
      </div>
    </section>
  );
}
