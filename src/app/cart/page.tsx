'use client';

import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { useState, useEffect } from 'react';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const estimatedDelivery = subtotal >= 15000 ? 0 : 350;
  const estimatedTotal = subtotal + estimatedDelivery;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-2 border-brand-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center gap-6 py-20">
        <div className="w-20 h-20 bg-brand-white rounded-full flex items-center justify-center shadow-soft border border-brand-light">
          <ShoppingBag size={40} className="text-brand-mid" />
        </div>
        <h1 className="font-serif text-2xl font-bold text-brand-charcoal">Your cart is empty</h1>
        <p className="text-brand-mid text-sm">Add some luxury fragrances to get started.</p>
        <Link href="/shop">
          <Button variant="primary" size="lg">Browse Fragrances</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <div className="container-padded py-8 sm:py-12">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-charcoal mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.sku} className="flex gap-4 bg-brand-white rounded-2xl p-4 sm:p-5 border border-brand-light shadow-card">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-brand-ivory border border-brand-light">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-brand-gold text-xs font-semibold uppercase tracking-wider">{item.brand}</p>
                  <h3 className="text-brand-charcoal font-semibold text-sm sm:text-base">{item.title}</h3>
                  <p className="text-brand-mid text-xs mb-3">{item.size}ml</p>
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 bg-brand-cream border border-brand-light rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-brand-white flex items-center justify-center text-brand-charcoal hover:border-brand-gold hover:text-brand-gold transition-colors shadow-soft"
                        aria-label="Decrease"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-brand-charcoal font-semibold text-sm w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                        disabled={item.quantity >= item.maxStock}
                        className="w-7 h-7 rounded-lg bg-brand-white flex items-center justify-center text-brand-charcoal hover:border-brand-gold hover:text-brand-gold transition-colors disabled:opacity-40 shadow-soft"
                        aria-label="Increase"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-brand-charcoal font-bold text-base">
                        {formatPrice((item.salePrice ?? item.price) * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.sku)}
                        className="text-brand-muted hover:text-red-500 transition-colors p-1"
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
            <div className="bg-brand-white rounded-3xl p-6 border border-brand-light shadow-card sticky top-24">
              <h2 className="font-serif text-lg font-bold text-brand-charcoal mb-5">Order Summary</h2>
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-brand-mid">Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                  <span className="text-brand-charcoal font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-mid">Estimated Delivery (Colombo)</span>
                  <span className="text-brand-charcoal font-semibold">{formatPrice(estimatedDelivery)}</span>
                </div>
                <p className="text-brand-muted text-xs">Exact delivery fee calculated at checkout based on your district.</p>
                <div className="border-t border-brand-light pt-3 flex justify-between items-baseline font-semibold">
                  <span className="text-brand-charcoal">Estimated Total</span>
                  <span className="text-brand-gold font-bold text-xl">{formatPrice(estimatedTotal)}</span>
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
              <div className="mt-5 pt-4 border-t border-brand-light space-y-2">
                {['100% Authentic Products', 'Cash on Delivery Available', 'Island-wide Delivery'].map((t) => (
                  <p key={t} className="text-brand-mid text-xs flex items-center gap-2">
                    <span className="text-brand-gold font-bold">✓</span> {t}
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
