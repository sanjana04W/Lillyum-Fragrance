import { MetadataRoute } from 'next';
import { SAMPLE_PRODUCTS } from '@/data/products';
import { CATEGORIES } from '@/data/products';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://lillyumfragrance.lk';

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/offers`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${base}/shop/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = SAMPLE_PRODUCTS
    .filter((p) => p.status === 'active')
    .map((product) => ({
      url: `${base}/product/${product.slug}`,
      lastModified: new Date(product.updatedAt),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  return [...staticPages, ...categoryPages, ...productPages];
}

