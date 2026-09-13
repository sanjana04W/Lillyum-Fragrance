'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice } from '@/lib/utils';
import { getDeliveryFee } from '@/lib/constants';
import Button from '@/components/ui/Button';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  // Default estimate for Colombo
  const estimatedDelivery = getDeliveryFee('Colombo');
  const estimatedTotal = subtotal + estimatedDelivery;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex flex-col items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-charcoal flex flex-col items-center justify-center gap-6 py-20">
        <ShoppingBag size={64} className="text-brand-mid" />
        <h1 className="font-serif text-2xl text-brand-white">Your cart is empty</h1>
        <p className="text-brand-muted text-sm">Add some fragrances to get started.</p>
        <Link href="/shop">
          <Button variant="primary" size="lg">Browse Perfumes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="container-padded py-8 sm:py-12">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-white mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.sku} className="flex gap-4 bg-brand-charcoal rounded-xl p-4 border border-brand-mid/20">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden shrink-0 bg-brand-dark">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-brand-muted text-xs">{item.brand}</p>
                  <h3 className="text-brand-white font-medium text-sm sm:text-base">{item.title}</h3>
                  <p className="text-brand-muted text-xs mb-3">{item.size}ml</p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                        className="w-7 h-7 rounded border border-brand-mid/50 flex items-center justify-center text-brand-light hover:border-brand-gold hover:text-brand-gold transition-colors"
                        aria-label="Decrease"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-brand-white text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="w-7 h-7 rounded border border-brand-mid/50 flex items-center justify-center text-brand-light hover:border-brand-gold hover:text-brand-gold transition-colors disabled:opacity-40"
                        aria-label="Increase"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-brand-gold font-semibold text-sm">
                        {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.sku)}
                        className="text-brand-muted hover:text-red-400 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-brand-charcoal rounded-xl p-5 border border-brand-mid/20 sticky top-20">
              <h2 className="font-serif text-lg font-bold text-brand-white mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-brand-muted">Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                  <span className="text-brand-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-muted">Estimated Delivery (Colombo)</span>
                  <span className="text-brand-white">{formatPrice(estimatedDelivery)}</span>
                </div>
                <p className="text-brand-muted text-xs">Exact delivery fee calculated at checkout based on your district.</p>
                <div className="border-t border-brand-mid/30 pt-3 flex justify-between font-semibold">
                  <span className="text-brand-white">Estimated Total</span>
                  <span className="text-brand-gold text-base">{formatPrice(estimatedTotal)}</span>
                </div>
              </div>
              <Link href="/checkout">
                <Button variant="primary" size="lg" fullWidth>
                  Proceed to Checkout <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="ghost" size="md" fullWidth className="mt-2">
                  Continue Shopping
                </Button>
              </Link>
              <div className="mt-4 pt-4 border-t border-brand-mid/20 space-y-1.5">
                {['100% Authentic Products', 'Cash on Delivery', 'Island-wide Delivery'].map((t) => (
                  <p key={t} className="text-brand-muted text-xs flex items-center gap-1.5">
                    <span className="text-brand-gold">✓</span> {t}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

