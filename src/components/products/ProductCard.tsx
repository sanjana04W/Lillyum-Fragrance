'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { trackAddToCart } from '@/services/analyticsService';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const firstVariant = product.variants[0];
  const hasDiscount = !!firstVariant?.salePrice;
  const displayPrice = firstVariant?.salePrice ?? firstVariant?.price ?? 0;
  const originalPrice = firstVariant?.price ?? 0;
  const discountPct = hasDiscount ? getDiscountPercentage(originalPrice, displayPrice) : 0;
  const isOutOfStock = firstVariant?.stock === 0;
  const isLowStock = firstVariant?.stock > 0 && firstVariant?.stock <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock || !firstVariant) return;
    addItem({
      productId:   product.id,
      productSlug: product.slug,
      sku:         firstVariant.sku,
      title:       product.title,
      brand:       product.brand,
      price:       displayPrice,
      image:       product.images[0],
      quantity:    1,
      size:        firstVariant.size,
      maxStock:    firstVariant.stock,
    });
    trackAddToCart({ productId: product.id, productName: product.title, price: displayPrice, quantity: 1 });
    toast.success(`${product.brand} ${product.title} added to cart!`, { icon: '🛒' });
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="card-surface card-hover overflow-hidden">
        {/* Image area */}
        <div className="relative overflow-hidden bg-brand-ivory aspect-square">
          <Image
            src={product.images[0]}
            alt={`${product.brand} ${product.title}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {hasDiscount && (
              <Badge variant="sale" size="sm">-{discountPct}%</Badge>
            )}
            {product.isNewArrival && !hasDiscount && (
              <Badge variant="new" size="sm">New</Badge>
            )}
            {product.isBestSeller && (
              <Badge variant="gold" size="sm">Best Seller</Badge>
            )}
            {isLowStock && (
              <Badge variant="red" size="sm">Low Stock</Badge>
            )}
            {isOutOfStock && (
              <Badge variant="gray" size="sm">Sold Out</Badge>
            )}
          </div>

          {/* Overlay CTA */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-3">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="w-full py-2.5 px-3 bg-brand-gold text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-brand-gold-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-gold"
            >
              <ShoppingCart size={13} />
              {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 sm:p-4">
          <p className="text-[10px] uppercase tracking-widest text-brand-gold font-semibold mb-0.5">
            {product.brand}
          </p>
          <h3 className="text-sm font-semibold text-brand-charcoal line-clamp-1 group-hover:text-brand-gold transition-colors">
            {product.title}
          </h3>
          <p className="text-xs text-brand-muted mt-0.5">
            {product.fragranceType} · {firstVariant?.size}ml
          </p>

          {/* Pricing */}
          <div className="flex items-center justify-between mt-2.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-brand-charcoal">
                {formatPrice(displayPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-brand-muted line-through">
                  {formatPrice(originalPrice)}
                </span>
              )}
            </div>
            {isLowStock && !isOutOfStock && (
              <span className="text-[10px] text-red-500 font-medium">
                {firstVariant?.stock} left
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
