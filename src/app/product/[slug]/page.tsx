import type { Metadata } from 'next';
import { SAMPLE_PRODUCTS, getStoredProducts } from '@/data/products';
import ProductDetailView from '@/components/products/ProductDetailView';
import { Product } from '@/types';

interface Props {
  params: { slug: string };
}

function findProduct(slugOrId: string): Product | null {
  if (!slugOrId) return null;
  const decoded = decodeURIComponent(slugOrId).trim();
  const lower = decoded.toLowerCase();
  const all = getStoredProducts();
  return (
    all.find((p) => p.slug === decoded || p.id === decoded) ||
    all.find((p) => p.slug?.toLowerCase() === lower || p.id?.toLowerCase() === lower) ||
    null
  );
}

export async function generateStaticParams() {
  return SAMPLE_PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = findProduct(params.slug);
  if (!product) {
    return {
      title: 'Fragrance Details | Lillyum Fragrance Sri Lanka',
      description: 'Discover luxury authentic fragrances imported from Dubai and Europe.',
    };
  }

  const primaryVariant = product.variants?.[0];
  const priceText = primaryVariant ? `LKR ${primaryVariant.price.toLocaleString()}` : '';

  return {
    title: `${product.brand} ${product.title} ${product.fragranceType} | Lillyum Fragrance`,
    description: product.description?.slice(0, 160) || 'Authentic luxury perfume available at Lillyum Fragrance.',
    openGraph: {
      title: `${product.brand} ${product.title} - Authentic Perfumes Sri Lanka`,
      description: `${product.brand} ${product.title} (${product.fragranceType}) available now. ${priceText}. Cash on delivery islandwide.`,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default function ProductPage({ params }: Props) {
  const initialProduct = findProduct(params.slug);
  return <ProductDetailView initialProduct={initialProduct} slug={params.slug} />;
}
