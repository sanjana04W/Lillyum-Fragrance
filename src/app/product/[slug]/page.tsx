'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, ChevronRight, ShoppingCart, Package, Shield, Truck } from 'lucide-react';
import { SAMPLE_PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/cartStore';
import { trackViewContent, trackAddToCart } from '@/services/analyticsService';
import { formatPrice, getDiscountPercentage, getWhatsAppLink } from '@/lib/utils';
import { LOW_STOCK_THRESHOLD } from '@/lib/constants';
import { ProductVariant } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import ProductCard from '@/components/products/ProductCard';
import toast from 'react-hot-toast';

interface Props {
  params: { slug: string };
}

export default function ProductDetailPage({ params }: Props) {
  const product = SAMPLE_PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) notFound();

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCartStore();

  // Fire ViewContent pixel on page load
  useEffect(() => {
    trackViewContent({
      productId: product.id,
      productName: `${product.brand} ${product.title}`,
      brand: product.brand,
      category: product.categories[0],
      price: selectedVariant.salePrice ?? selectedVariant.price,
    });
  }, [product, selectedVariant]);

  const inStock = selectedVariant.stock > 0;
  const isLowStock =
    selectedVariant.stock > 0 &&
    selectedVariant.stock <= (selectedVariant.lowStockThreshold ?? LOW_STOCK_THRESHOLD);
  const discount = selectedVariant.salePrice
    ? getDiscountPercentage(selectedVariant.price, selectedVariant.salePrice)
    : 0;

  const handleAddToCart = () => {
    if (!inStock) return;
    addItem({
      productId: product.id,
      productSlug: product.slug,
      title: `${product.brand} ${product.title}`,
      brand: product.brand,
      image: product.images[0],
      size: selectedVariant.size,
      sku: selectedVariant.sku,
      price: selectedVariant.price,
      salePrice: selectedVariant.salePrice,
      quantity,
      maxStock: selectedVariant.stock,
    });
    trackAddToCart({
      productId: product.id,
      productName: `${product.brand} ${product.title}`,
      price: selectedVariant.salePrice ?? selectedVariant.price,
      quantity,
    });
    toast.success('Added to cart!', { icon: '🛒', style: { background: '#1A1A1A', color: '#F5F5F0' } });
  };

  const related = SAMPLE_PRODUCTS
    .filter((p) => p.id !== product.id && p.categories.some((c) => product.categories.includes(c)))
    .slice(0, 4);

  const waLink = getWhatsAppLink(
    '94752369613',
    `Hi! I'm interested in ${product.brand} ${product.title} ${selectedVariant.size}ml. Is it available?`
  );

  return (
    <div className="min-h-screen bg-brand-charcoal">
      <div className="container-padded py-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="text-xs text-brand-muted mb-6 flex gap-2 flex-wrap" aria-label="breadcrumb">
          <Link href="/" className="hover:text-brand-gold">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-brand-gold">Shop</Link>
          <span>/</span>
          <span className="text-brand-light">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-brand-charcoal">
              <Image
                src={product.images[activeImage] ?? product.images[0]}
                alt={`${product.brand} ${product.title} ${selectedVariant.size}ml`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((i) => (i - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-brand-charcoal/60 rounded-full text-brand-white hover:bg-brand-gold/80 hover:text-brand-charcoal transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setActiveImage((i) => (i + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-brand-charcoal/60 rounded-full text-brand-white hover:bg-brand-gold/80 hover:text-brand-charcoal transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === activeImage ? 'border-brand-gold' : 'border-transparent'
                    }`}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            <div>
              <p className="text-brand-muted text-xs uppercase tracking-widest mb-1">{product.brand}</p>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-white">{product.title}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="gray">{product.fragranceType}</Badge>
                <Badge variant="gray">{product.fragranceFamily}</Badge>
                <Badge variant="gray">{product.gender}</Badge>
                {product.isNewArrival && <Badge variant="gold">New Arrival</Badge>}
                {product.isBestSeller && <Badge variant="orange">Best Seller</Badge>}
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-end gap-3">
              <span className="font-serif text-3xl font-bold text-brand-gold">
                {formatPrice(selectedVariant.salePrice ?? selectedVariant.price)}
              </span>
              {selectedVariant.salePrice && (
                <>
                  <span className="text-brand-muted text-lg line-through">{formatPrice(selectedVariant.price)}</span>
                  <Badge variant="red">-{discount}%</Badge>
                </>
              )}
            </div>

            {/* Stock status */}
            {!inStock ? (
              <p className="text-red-400 text-sm flex items-center gap-1.5"><Package size={14} /> Out of Stock</p>
            ) : isLowStock ? (
              <p className="text-orange-400 text-sm flex items-center gap-1.5"><Package size={14} /> Only {selectedVariant.stock} left!</p>
            ) : (
              <p className="text-emerald-400 text-sm flex items-center gap-1.5"><Package size={14} /> In Stock</p>
            )}

            {/* Size selector */}
            {product.variants.length > 1 && (
              <div>
                <p className="text-brand-muted text-xs uppercase tracking-widest mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.sku}
                      onClick={() => { setSelectedVariant(v); setQuantity(1); }}
                      disabled={v.stock === 0}
                      className={`px-4 py-2 rounded border text-sm transition-colors ${
                        v.sku === selectedVariant.sku
                          ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                          : v.stock === 0
                          ? 'border-brand-mid/30 text-brand-mid line-through cursor-not-allowed'
                          : 'border-brand-mid/50 text-brand-light hover:border-brand-gold/50'
                      }`}
                    >
                      {v.size}ml
                      {v.salePrice && <span className="text-xs text-brand-gold ml-1">Sale</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <p className="text-brand-muted text-xs uppercase tracking-widest mb-2">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-9 rounded-full border border-brand-mid/50 flex items-center justify-center text-brand-light hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  -
                </button>
                <span className="text-brand-white font-semibold w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))}
                  disabled={quantity >= selectedVariant.stock}
                  className="w-9 h-9 rounded-full border border-brand-mid/50 flex items-center justify-center text-brand-light hover:border-brand-gold hover:text-brand-gold transition-colors disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1"
              >
                <ShoppingCart size={18} />
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="secondary" size="lg" fullWidth>
                  Ask on WhatsApp
                </Button>
              </a>
            </div>

            {/* Fragrance Notes */}
            <div className="bg-brand-charcoal rounded-xl p-5 space-y-3">
              <h2 className="text-brand-white font-semibold text-sm">Fragrance Notes</h2>
              {[
                { label: 'Top Notes', notes: product.notes.top },
                { label: 'Heart Notes', notes: product.notes.middle },
                { label: 'Base Notes', notes: product.notes.base },
              ].map(({ label, notes }) => (
                <div key={label} className="flex gap-3">
                  <span className="text-brand-muted text-xs w-24 shrink-0 pt-0.5">{label}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {notes.map((n) => (
                      <span key={n} className="text-xs bg-brand-dark text-brand-light px-2 py-0.5 rounded">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-brand-white font-semibold text-sm mb-2">About this Fragrance</h2>
              <p className="text-brand-muted text-sm leading-relaxed">{product.description}</p>
            </div>

            {/* Authenticity */}
            {product.authenticityInfo && (
              <div className="flex items-start gap-2 bg-brand-gold/5 border border-brand-gold/20 rounded-lg p-3">
                <Shield size={16} className="text-brand-gold mt-0.5 shrink-0" />
                <p className="text-brand-light text-xs">{product.authenticityInfo}</p>
              </div>
            )}

            {/* Delivery */}
            <div className="flex items-start gap-2 bg-brand-charcoal rounded-lg p-3">
              <Truck size={16} className="text-brand-gold mt-0.5 shrink-0" />
              <p className="text-brand-muted text-xs">Cash on Delivery available islandwide · Colombo 1-2 days · Outstation 2-5 days</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="section-heading mb-2">You May Also Like</h2>
            <div className="gold-divider mx-0 mb-6" />
            <div className="product-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
