'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SAMPLE_PRODUCTS } from '@/data/products';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Star, Eye, Pencil } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function FeaturedProductsPage() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);

  const toggleFeatured = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFeatured: !p.isFeatured } : p))
    );
    toast.success('Featured status updated', { icon: '⭐' });
  };

  const featured = products.filter((p) => p.isFeatured);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold text-brand-charcoal">Featured Products</h1>
          <p className="text-brand-charcoal/50 text-xs">Curate handpicked fragrances displayed on the storefront homepage</p>
        </div>
        <div className="flex items-center gap-2 bg-brand-gold-soft border border-brand-gold/30 px-3.5 py-1.5 rounded-full">
          <Star size={14} className="text-brand-gold fill-brand-gold" />
          <span className="text-xs font-semibold text-brand-charcoal">{featured.length} Featured Items</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-brand-light shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-light bg-brand-cream/60">
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Featured</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide hidden sm:table-cell">Brand</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Price</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide hidden md:table-cell">Badge</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-light">
              {products.map((product) => {
                const variant = product.variants[0];
                return (
                  <tr key={product.id} className="hover:bg-brand-cream/40 transition-colors">
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleFeatured(product.id)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          product.isFeatured
                            ? 'bg-brand-gold-soft border-brand-gold/40 text-brand-gold'
                            : 'bg-white border-brand-light text-brand-charcoal/30 hover:border-brand-gold/40'
                        }`}
                        title={product.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                      >
                        <Star size={16} className={product.isFeatured ? 'fill-brand-gold' : ''} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-brand-ivory border border-brand-light">
                          <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-brand-charcoal text-xs font-medium">{product.title}</p>
                          <p className="text-brand-charcoal/50 text-xs">{variant?.size}ml - {product.fragranceType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-brand-charcoal/70 text-xs">{product.brand}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-brand-gold font-semibold text-xs">{formatPrice(variant?.price ?? 0)}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {product.isFeatured ? (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                          Homepage Featured
                        </span>
                      ) : (
                        <span className="text-brand-charcoal/40 text-[10px]">Standard</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/products/${product.id}`} className="text-brand-charcoal/40 hover:text-brand-gold p-1">
                          <Pencil size={14} />
                        </Link>
                        <Link href={`/product/${product.slug}`} target="_blank" className="text-brand-charcoal/40 hover:text-brand-gold p-1">
                          <Eye size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
