'use client';

import { useState, useMemo, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import Button from '@/components/ui/Button';
import { getStoredProducts, CATEGORIES, BRANDS } from '@/data/products';
import { Product, FragranceGender, FragranceType, ProductSortOption } from '@/types';

const GENDERS: FragranceGender[] = ['Men', 'Women', 'Unisex'];
const TYPES: FragranceType[] = ['EDP', 'EDT', 'Extrait'];
const SORT_OPTIONS: { label: string; value: ProductSortOption }[] = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Best Selling', value: 'best_selling' },
];

interface ShopPageProps {
  params?: { category?: string };
}

export default function ShopPage({ params }: ShopPageProps) {
  const categorySlug = params?.category;

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [sort, setSort] = useState<ProductSortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setAllProducts(getStoredProducts());
    const handleUpdate = () => setAllProducts(getStoredProducts());
    window.addEventListener('lillyum_products_updated', handleUpdate);
    return () => window.removeEventListener('lillyum_products_updated', handleUpdate);
  }, []);

  const filtered = useMemo(() => {
    let products = allProducts.filter((p) => p.status === 'active');

    // Category filter
    if (categorySlug) {
      products = products.filter((p) => p.categories.includes(categorySlug));
    }
    // Brand filter
    if (selectedBrand) {
      products = products.filter((p) => p.brand === selectedBrand);
    }
    // Gender filter
    if (selectedGender) {
      products = products.filter((p) => p.gender === selectedGender);
    }
    // Type filter
    if (selectedType) {
      products = products.filter((p) => p.fragranceType === selectedType);
    }

    // Sort
    products = [...products].sort((a, b) => {
      const priceA = a.variants[0]?.salePrice ?? a.variants[0]?.price ?? 0;
      const priceB = b.variants[0]?.salePrice ?? b.variants[0]?.price ?? 0;
      if (sort === 'price_asc') return priceA - priceB;
      if (sort === 'price_desc') return priceB - priceA;
      if (sort === 'best_selling') return (b.orderCount ?? 0) - (a.orderCount ?? 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return products;
  }, [allProducts, categorySlug, selectedBrand, selectedGender, selectedType, sort]);

  const cat = CATEGORIES.find((c) => c.slug === categorySlug);
  const pageTitle = cat?.name ?? 'All Fragrances';

  const clearFilters = () => {
    setSelectedBrand('');
    setSelectedGender('');
    setSelectedType('');
    setSort('newest');
  };
  const hasFilters = selectedBrand || selectedGender || selectedType;

  return (
    <div className="min-h-screen bg-brand-cream">
      {/* Page header */}
      <div className="bg-brand-white border-b border-brand-light py-8 sm:py-10">
        <div className="container-padded">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-charcoal">{pageTitle}</h1>
          <p className="text-brand-mid text-sm mt-1">{filtered.length} products found</p>
        </div>
      </div>

      <div className="container-padded py-8">
        {/* Controls bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-brand-charcoal text-sm bg-brand-white border border-brand-light rounded-xl px-4 py-2.5 shadow-soft hover:border-brand-gold hover:text-brand-gold transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasFilters && (
              <span className="bg-brand-gold text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                !
              </span>
            )}
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as ProductSortOption)}
            className="bg-brand-white border border-brand-light text-brand-charcoal text-sm rounded-xl px-4 py-2.5 shadow-soft focus:outline-none focus:border-brand-gold"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-brand-white rounded-2xl border border-brand-light shadow-card p-5 mb-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Brand */}
              <div>
                <p className="text-brand-charcoal text-xs font-semibold uppercase tracking-wider mb-2.5">Brand</p>
                <div className="flex flex-wrap gap-2">
                  {BRANDS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(selectedBrand === b ? '' : b)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        selectedBrand === b
                          ? 'border-brand-gold bg-brand-gold-soft text-brand-gold-dark font-semibold'
                          : 'border-brand-light bg-brand-cream text-brand-mid hover:border-brand-gold/40'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <p className="text-brand-charcoal text-xs font-semibold uppercase tracking-wider mb-2.5">Gender</p>
                <div className="flex flex-wrap gap-2">
                  {GENDERS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(selectedGender === g ? '' : g)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        selectedGender === g
                          ? 'border-brand-gold bg-brand-gold-soft text-brand-gold-dark font-semibold'
                          : 'border-brand-light bg-brand-cream text-brand-mid hover:border-brand-gold/40'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <p className="text-brand-charcoal text-xs font-semibold uppercase tracking-wider mb-2.5">Type</p>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedType(selectedType === t ? '' : t)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        selectedType === t
                          ? 'border-brand-gold bg-brand-gold-soft text-brand-gold-dark font-semibold'
                          : 'border-brand-light bg-brand-cream text-brand-mid hover:border-brand-gold/40'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 flex items-center gap-1 text-brand-mid text-xs hover:text-brand-gold transition-colors"
              >
                <X size={12} /> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-brand-white rounded-2xl border border-brand-light">
            <p className="text-brand-mid mb-4">No products match your filters.</p>
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}
