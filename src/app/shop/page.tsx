'use client';

import { useState, useMemo } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '@/components/products/ProductCard';
import Button from '@/components/ui/Button';
import { SAMPLE_PRODUCTS, BRANDS, CATEGORIES } from '@/data/products';
import { Gender, FragranceType, ProductSortOption } from '@/types';

const GENDERS: Gender[] = ['Men', 'Women', 'Unisex'];
const TYPES: FragranceType[] = ['EDP', 'EDT', 'Extrait'];
const SORT_OPTIONS: { value: ProductSortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'best_selling', label: 'Best Selling' },
];

interface ShopPageProps {
  params?: { category?: string };
  searchParams?: { brand?: string; gender?: string; type?: string; sort?: string };
}

export default function ShopPage({ params, searchParams }: ShopPageProps) {
  const categorySlug = params?.category;
  const [selectedBrand, setSelectedBrand] = useState<string>(searchParams?.brand ?? '');
  const [selectedGender, setSelectedGender] = useState<Gender | ''>(
    (searchParams?.gender as Gender) ?? ''
  );
  const [selectedType, setSelectedType] = useState<FragranceType | ''>(
    (searchParams?.type as FragranceType) ?? ''
  );
  const [sort, setSort] = useState<ProductSortOption>(
    (searchParams?.sort as ProductSortOption) ?? 'newest'
  );
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let products = SAMPLE_PRODUCTS.filter((p) => p.status === 'active');
    if (categorySlug) products = products.filter((p) => p.categories.includes(categorySlug));
    if (selectedBrand) products = products.filter((p) => p.brand === selectedBrand);
    if (selectedGender) products = products.filter((p) => p.gender === selectedGender);
    if (selectedType) products = products.filter((p) => p.fragranceType === selectedType);

    if (sort === 'price_asc') products.sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0));
    else if (sort === 'price_desc') products.sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0));
    else if (sort === 'best_selling') products.sort((a, b) => b.orderCount - a.orderCount);
    else products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return products;
  }, [categorySlug, selectedBrand, selectedGender, selectedType, sort]);

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
    <div className="min-h-screen bg-brand-charcoal">
      {/* Page header */}
      <div className="bg-brand-charcoal border-b border-brand-mid/30 py-8">
        <div className="container-padded">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-brand-white">{pageTitle}</h1>
          <p className="text-brand-muted text-sm mt-1">{filtered.length} products</p>
        </div>
      </div>

      <div className="container-padded py-8">
        {/* Controls bar */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-brand-light text-sm border border-brand-mid/50 rounded-md px-4 py-2 hover:border-brand-gold hover:text-brand-gold transition-colors"
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasFilters && (
              <span className="bg-brand-gold text-brand-charcoal text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                !
              </span>
            )}
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as ProductSortOption)}
            className="bg-brand-dark border border-brand-mid/50 text-brand-light text-sm rounded-md px-3 py-2 focus:outline-none focus:border-brand-gold"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-brand-charcoal rounded-xl border border-brand-mid/30 p-5 mb-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Brand */}
              <div>
                <p className="text-brand-muted text-xs uppercase tracking-widest mb-2">Brand</p>
                <div className="flex flex-wrap gap-2">
                  {BRANDS.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(selectedBrand === b ? '' : b)}
                      className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                        selectedBrand === b
                          ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                          : 'border-brand-mid/50 text-brand-muted hover:border-brand-gold/50'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <p className="text-brand-muted text-xs uppercase tracking-widest mb-2">Gender</p>
                <div className="flex flex-wrap gap-2">
                  {GENDERS.map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(selectedGender === g ? '' : g)}
                      className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                        selectedGender === g
                          ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                          : 'border-brand-mid/50 text-brand-muted hover:border-brand-gold/50'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type */}
              <div>
                <p className="text-brand-muted text-xs uppercase tracking-widest mb-2">Type</p>
                <div className="flex flex-wrap gap-2">
                  {TYPES.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedType(selectedType === t ? '' : t)}
                      className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                        selectedType === t
                          ? 'border-brand-gold bg-brand-gold/10 text-brand-gold'
                          : 'border-brand-mid/50 text-brand-muted hover:border-brand-gold/50'
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
                className="mt-4 flex items-center gap-1 text-brand-muted text-xs hover:text-brand-gold transition-colors"
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
          <div className="text-center py-16">
            <p className="text-brand-muted mb-4">No products match your filters.</p>
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          </div>
        )}
      </div>
    </div>
  );
}

