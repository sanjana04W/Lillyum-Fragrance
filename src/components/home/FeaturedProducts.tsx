'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { getFeaturedProducts } from '@/data/products';
import { Product } from '@/types';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getFeaturedProducts(8));
    const handleUpdate = () => setProducts(getFeaturedProducts(8));
    window.addEventListener('lillyum_products_updated', handleUpdate);
    return () => window.removeEventListener('lillyum_products_updated', handleUpdate);
  }, []);

  return (
    <section className="py-16 bg-brand-white">
      <div className="container-padded">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-semibold mb-2">Featured</p>
            <h2 className="section-heading">Handpicked for You</h2>
            <p className="text-brand-mid text-sm mt-2">Our most popular fragrances, curated by the Lillyum team</p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-brand-gold hover:text-brand-gold-dark transition-colors group shrink-0"
          >
            View all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>

        <div className="text-center mt-8 sm:hidden">
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-gold">
            View All Products <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
