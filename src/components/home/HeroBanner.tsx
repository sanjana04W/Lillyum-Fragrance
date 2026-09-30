'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    sub: 'Our most-loved fragrances — trusted by thousands across Sri Lanka',
    cta: { label: 'View Best Sellers', href: '/shop/best-sellers' },
    ctaSecondary: { label: "Shop Men's", href: '/shop/men' },
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

/** Auto-advance interval in milliseconds */
const INTERVAL_MS = 3000;

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
      setAnimKey((k) => k + 1);
    }, INTERVAL_MS);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const goTo = (index: number) => {
    setCurrent(index);
    setAnimKey((k) => k + 1);
    startTimer(); // reset timer on manual navigation
  };

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((current + 1) % SLIDES.length);

  const slide = SLIDES[current];

  return (
    <section className="relative h-[75vh] min-h-[480px] max-h-[720px] overflow-hidden bg-brand-black">
      {/* Background images — crossfade via absolute stacking */}
      {SLIDES.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === current ? 'opacity-100 z-0' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={s.image}
            alt={s.headline}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black/90 via-brand-black/60 to-transparent" />
        </div>
      ))}

      {/* Content — re-animates on every slide change via key */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div key={animKey} className="max-w-xl animate-fade-in">
            <span className="inline-block bg-brand-gold text-brand-black text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-4">
              ★ {slide.badge}
            </span>
            <p className="text-brand-gold text-xs uppercase tracking-widest font-semibold mb-2">
              Premium Collection
            </p>
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

      {/* Prev / Next arrows */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-brand-black/40 hover:bg-brand-black/70 border border-brand-white/20 flex items-center justify-center text-brand-white transition-colors"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-brand-black/40 hover:bg-brand-black/70 border border-brand-white/20 flex items-center justify-center text-brand-white transition-colors"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-brand-gold' : 'w-2 bg-brand-white/40 hover:bg-brand-white/70'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
