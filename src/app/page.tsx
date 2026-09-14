import type { Metadata } from 'next';
import HeroCarousel from '@/components/home/HeroCarousel';
import TrustStrip from '@/components/home/TrustStrip';
import CategoryNav from '@/components/home/CategoryNav';
import RitualBanner from '@/components/home/RitualBanner';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BestSellersSection from '@/components/home/BestSellersSection';
import NewArrivalsSection from '@/components/home/NewArrivalsSection';
import BrandStoryBanner from '@/components/home/BrandStoryBanner';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import InstagramFeed from '@/components/home/InstagramFeed';
import WhatsAppFAB from '@/components/home/WhatsAppFAB';

export const metadata: Metadata = {
  title: 'Lillyum Fragrance Studio | Authentic Perfumes in Sri Lanka',
  description:
    'Discover authentic imported perfumes for men and women. Premium fragrances from Dubai, Europe & the Arab world. Cash on Delivery across all of Sri Lanka.',
  openGraph: {
    title: 'Lillyum Fragrance Studio',
    description: 'Authentic imported perfumes delivered island-wide in Sri Lanka.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <main className="bg-brand-cream">
      <HeroCarousel />
      <TrustStrip />
      <CategoryNav />
      <RitualBanner />
      <FeaturedProducts />
      <BrandStoryBanner />
      <BestSellersSection />
      <NewArrivalsSection />
      <TestimonialsSection />
      <InstagramFeed />
      <WhatsAppFAB />
    </main>
  );
}

