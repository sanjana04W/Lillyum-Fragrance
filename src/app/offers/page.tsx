import type { Metadata } from 'next';
import ProductCard from '@/components/products/ProductCard';
import { SAMPLE_PRODUCTS } from '@/data/products';

export const metadata: Metadata = {
  title: 'Offers & Sale | Lillyum Fragrance Sri Lanka',
  description:
    'Shop discounted authentic perfumes online Sri Lanka. Limited time offers and sale fragrances from Armaf, Lattafa, Rasasi, Ajmal — with COD delivery.',
};

const offerProducts = SAMPLE_PRODUCTS.filter(
  (p) => p.status === 'active' && p.categories.includes('offers')
);
const saleProducts = SAMPLE_PRODUCTS.filter(
  (p) => p.status === 'active' && p.variants.some((v) => v.salePrice)
);

// Merge without duplicates
const allDeals = [
  ...offerProducts,
  ...saleProducts.filter((p) => !offerProducts.find((o) => o.id === p.id)),
];

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-brand-charcoal">
      {/* Banner */}
      <div className="bg-gradient-to-r from-red-900/40 via-brand-charcoal to-brand-charcoal border-b border-red-500/20 py-12">
        <div className="container-padded text-center">
          <span className="inline-block bg-red-500 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded mb-3">
            Limited Time Offers
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-brand-white mb-2">
            Offers & Sale
          </h1>
          <p className="text-brand-muted text-sm max-w-lg mx-auto">
            Shop our discounted authentic fragrances. Prices reduced for a limited time — grab them before stock runs out!
          </p>
        </div>
      </div>

      <div className="container-padded py-10">
        {allDeals.length > 0 ? (
          <>
            <p className="text-brand-muted text-sm mb-6">{allDeals.length} products on offer</p>
            <div className="product-grid">
              {allDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-brand-muted text-lg">No active offers at the moment.</p>
            <p className="text-brand-muted text-sm mt-2">Check back soon — we run regular promotions!</p>
          </div>
        )}
      </div>
    </div>
  );
}

