import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ShopPage from '@/app/shop/page';
import { CATEGORIES } from '@/data/products';

interface Props {
  params: { category: string };
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = CATEGORIES.find((c) => c.slug === params.category);
  if (!cat) return {};
  return {
    title: `${cat.name} Perfumes Sri Lanka | Lillyum Fragrance`,
    description: `Shop authentic ${cat.name.toLowerCase()} fragrances online in Sri Lanka with Cash on Delivery. Wide selection at Lillyum Fragrance.`,
    openGraph: {
      title: `${cat.name} Perfumes | Lillyum Fragrance`,
      description: `Shop authentic ${cat.name.toLowerCase()} fragrances online in Sri Lanka.`,
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const cat = CATEGORIES.find((c) => c.slug === params.category);
  if (!cat) notFound();
  return <ShopPage params={{ category: params.category }} />;
}
