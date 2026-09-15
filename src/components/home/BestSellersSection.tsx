'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import { getBestSellers } from '@/data/products';
import { Product } from '@/types';

export default function BestSellersSection() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getBestSellers(4));
    const handleUpdate = () => setProducts(getBestSellers(4));
    window.addEventListener('lillyum_products_updated', handleUpdate);
    return () => window.removeEventListener('lillyum_products_updated', handleUpdate);
  }, []);

  return (
    <section className="py-16 bg-brand-cream">
      <div className="container-padded">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-semibold mb-2">Most Popular</p>
            <h2 className="section-heading">Best Sellers</h2>
            <p className="text-brand-mid text-sm mt-2">The fragrances our customers keep coming back for</p>
          </div>
          <Link
            href="/shop/best-sellers"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-brand-gold hover:text-brand-gold-dark transition-colors group shrink-0"
          >
            See all <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
