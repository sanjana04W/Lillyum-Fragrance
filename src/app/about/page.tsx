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

      {/* Story */}
      <section className="py-16 container-padded">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-brand-charcoal mb-4">
              From Social Media to Your Doorstep
            </h2>
            <div className="space-y-4 text-brand-mid text-sm leading-relaxed">
              <p>
                Lillyum Fragrance started as a passion project — sharing our love for authentic, imported fragrances with the fragrance community in Sri Lanka through Facebook, Instagram, and TikTok.
              </p>
              <p>
                What began as social media posts sharing beautiful scents quickly grew into a loyal community of fragrance lovers across the island. With over 4,800 Facebook followers and thousands of satisfied customers, we realized it was time to create a proper home for our collection.
              </p>
              <p>
                Today, Lillyum Fragrance is your go-to online destination for authentic imported perfumes — from Arabic powerhouses like Lattafa and Rasasi to sophisticated Armaf and Ajmal fragrances. We ship islandwide with Cash on Delivery, because we believe everyone deserves to smell amazing.
              </p>
            </div>
          </div>
          <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden">
            <Image
              src="/images/440ffe895171256286ad489ca83ba45c.jpg"
              alt="Lillyum Fragrance collection"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 to-transparent" />
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

