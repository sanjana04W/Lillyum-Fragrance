'use client';

import { useCartStore } from '@/store/cartStore';
import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [closeCart]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-brand-charcoal/50 backdrop-blur-sm"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-brand-white shadow-2xl flex flex-col animate-slide-in-right"
        role="dialog"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-brand-light">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-brand-gold" />
            <h2 className="font-serif text-lg font-bold text-brand-charcoal">
              Shopping Cart
            </h2>
            {items.length > 0 && (
              <span className="bg-brand-gold text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-2 rounded-xl text-brand-mid hover:text-brand-charcoal hover:bg-brand-ivory transition-all"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
              <div className="w-20 h-20 bg-brand-ivory rounded-full flex items-center justify-center">
                <ShoppingBag size={32} className="text-brand-light" />
              </div>
              <p className="text-brand-mid font-medium">Your cart is empty</p>
              <p className="text-brand-muted text-sm text-center">
                Discover our collection of authentic fragrances.
              </p>
              <Button variant="primary" size="sm" onClick={closeCart}>
                <Link href="/shop">Browse Fragrances</Link>
              </Button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.sku} className="flex gap-3 p-3 bg-brand-cream rounded-2xl border border-brand-light">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-brand-ivory">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-brand-gold font-semibold uppercase tracking-wide">{item.brand}</p>
                  <p className="text-sm font-semibold text-brand-charcoal line-clamp-1">{item.title}</p>
                  <p className="text-xs text-brand-muted">{item.size}ml</p>
                  <div className="flex items-center justify-between mt-2">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1.5 bg-brand-white border border-brand-light rounded-xl p-0.5">
                      <button
                        onClick={() => updateQuantity(item.sku, Math.max(1, item.quantity - 1))}
                        className="w-6 h-6 flex items-center justify-center rounded-lg text-brand-mid hover:bg-brand-ivory hover:text-brand-charcoal transition-all"
                      >
                        <Minus size={11} />
                      </button>
                      <span className="text-xs font-semibold text-brand-charcoal w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.sku, Math.min(item.maxStock, item.quantity + 1))}
                        className="w-6 h-6 flex items-center justify-center rounded-lg text-brand-mid hover:bg-brand-ivory hover:text-brand-charcoal transition-all"
                      >
                        <Plus size={11} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-brand-charcoal">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                      <button
                        onClick={() => removeItem(item.sku)}
                        className="p-1 text-brand-muted hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-brand-light p-5 space-y-4 bg-brand-cream">
            {/* Free delivery progress */}
            {subtotal < 15000 && (
              <div>
                <p className="text-xs text-brand-mid mb-1">
                  Add <span className="font-semibold text-brand-gold">{formatPrice(15000 - subtotal)}</span> more for free delivery!
                </p>
                <div className="w-full h-1.5 bg-brand-light rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-gradient rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / 15000) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-brand-muted">Subtotal</p>
                <p className="text-xl font-bold text-brand-charcoal">{formatPrice(subtotal)}</p>
              </div>
              <p className="text-xs text-brand-muted text-right">
                + delivery<br />calculated at checkout
              </p>
            </div>

            <Link href="/checkout" onClick={closeCart}>
              <Button variant="primary" size="lg" fullWidth>
                Proceed to Checkout <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/cart" onClick={closeCart}>
              <Button variant="ghost" size="sm" fullWidth>
                View Full Cart
              </Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
