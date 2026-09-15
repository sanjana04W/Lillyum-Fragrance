'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SAMPLE_PRODUCTS, getStoredProducts, saveProduct, getProductById } from '@/data/products';
import { Product, FragranceType, FragranceFamily, Gender } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const FRAGRANCE_TYPES: FragranceType[] = ['EDP', 'EDT', 'Extrait', 'EDC', 'Parfum'];
const FRAGRANCE_FAMILIES: FragranceFamily[] = ['Floral', 'Oriental', 'Woody', 'Fresh', 'Citrus', 'Aquatic', 'Gourmand', 'Chypre', 'Fougere', 'Musk', 'Spicy'];
const GENDERS: Gender[] = ['Men', 'Women', 'Unisex'];

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const [form, setForm] = useState({
    title: '', brand: '', fragranceName: '', description: '',
    fragranceType: 'EDP' as FragranceType,
    fragranceFamily: 'Floral' as FragranceFamily,
    gender: 'Unisex' as Gender,
    topNotes: '', middleNotes: '', baseNotes: '',
    size: '100', price: '', salePrice: '', stock: '',
    authenticityInfo: '',
    isFeatured: false, isNewArrival: false, isBestSeller: false,
    images: '',
  });

  useEffect(() => {
    async function load() {
      // First check local and stored products
      const localP = getProductById(id as string) || getStoredProducts().find((p) => p.id === id || p.slug === id);
      if (localP) {
        setupForm(localP);
        setLoading(false);
        return;
      }

      // Check Firestore
      try {
        const snap = await getDoc(doc(db, 'products', id as string));
        if (snap.exists()) {
          const p = { id: snap.id, ...snap.data() } as Product;
          setupForm(p);
        } else {
          toast.error('Product not found');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    function setupForm(p: Product) {
      setProduct(p);
      const v = p.variants[0];
      setForm({
        title: p.title,
        brand: p.brand,
        fragranceName: p.fragranceName || p.title,
        description: p.description,
        fragranceType: p.fragranceType,
        fragranceFamily: p.fragranceFamily,
        gender: p.gender,
        topNotes: p.notes.top.join(', '),
        middleNotes: p.notes.middle.join(', '),
        baseNotes: p.notes.base.join(', '),
        size: v ? v.size.toString() : '100',
        price: v ? v.price.toString() : '0',
        salePrice: v?.salePrice ? v.salePrice.toString() : '',
        stock: v ? v.stock.toString() : '0',
        authenticityInfo: p.authenticityInfo || '',
        isFeatured: p.isFeatured,
        isNewArrival: p.isNewArrival,
        isBestSeller: p.isBestSeller,
        images: p.images.join('\n'),
      });
    }

    load();
  }, [id]);

  const update = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const price = parseFloat(form.price);
      const salePrice = form.salePrice ? parseFloat(form.salePrice) : undefined;
      const stock = parseInt(form.stock || '0', 10);
      const size = parseInt(form.size || '100', 10);
      const images = form.images.split('\n').map((s) => s.trim()).filter(Boolean);

      const updatedData = {
        title: form.title,
        brand: form.brand,
        fragranceName: form.fragranceName,
        description: form.description,
        fragranceType: form.fragranceType,
        fragranceFamily: form.fragranceFamily,
        gender: form.gender,
        notes: {
          top: form.topNotes.split(',').map((s) => s.trim()).filter(Boolean),
          middle: form.middleNotes.split(',').map((s) => s.trim()).filter(Boolean),
          base: form.baseNotes.split(',').map((s) => s.trim()).filter(Boolean),
        },
        variants: [
          {
            size,
            price,
            salePrice,
            stock,
            sku: product?.variants[0]?.sku || `${form.brand.substring(0, 3).toUpperCase()}-${Date.now()}`,
            lowStockThreshold: 5,
          },
        ],
        images: images.length > 0 ? images : ['/images/placeholder.jpg'],
        authenticityInfo: form.authenticityInfo,
        isFeatured: form.isFeatured,
        isNewArrival: form.isNewArrival,
        isBestSeller: form.isBestSeller,
        updatedAt: new Date().toISOString(),
      };

      const fullUpdatedProduct: Product = {
        ...(product || {}),
        ...updatedData,
        id: (id as string) || product?.id || `prod-${Date.now()}`,
        slug: product?.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        categories: product?.categories || [form.gender.toLowerCase(), form.fragranceType.toLowerCase()],
        orderCount: product?.orderCount ?? 0,
        createdAt: product?.createdAt || new Date().toISOString(),
        status: product?.status || 'active',
      } as Product;

      // 1. Save synchronously to local storage and sync in-memory catalog
      saveProduct(fullUpdatedProduct);

      // 2. Fire and forget Firestore update non-blockingly
      const docId = id as string;
      if (docId && !docId.startsWith('prod-')) {
        updateDoc(doc(db, 'products', docId), updatedData).catch(() => {});
      }

      toast.success('Product updated successfully!');
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-brand-charcoal/50">Loading product...</div>;
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-brand-charcoal/50 hover:text-brand-gold">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-serif text-xl font-bold text-brand-charcoal">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl p-5 border border-brand-light shadow-soft space-y-4">
          <h2 className="text-brand-charcoal font-semibold text-sm">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Product Title" required value={form.title} onChange={(e) => update('title', e.target.value)} />
            <Input label="Brand" required value={form.brand} onChange={(e) => update('brand', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-brand-charcoal">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              rows={4}
              className="bg-brand-cream border border-brand-light rounded-md px-3 py-2.5 text-brand-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/60 resize-none"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-brand-light shadow-soft space-y-4">
          <h2 className="text-brand-charcoal font-semibold text-sm">Fragrance Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-brand-charcoal">Type</label>
              <select value={form.fragranceType} onChange={(e) => update('fragranceType', e.target.value)} className="bg-brand-cream border border-brand-light rounded-md px-3 py-2.5 text-brand-charcoal text-sm focus:outline-none focus:border-brand-gold">
                {FRAGRANCE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-brand-charcoal">Family</label>
              <select value={form.fragranceFamily} onChange={(e) => update('fragranceFamily', e.target.value)} className="bg-brand-cream border border-brand-light rounded-md px-3 py-2.5 text-brand-charcoal text-sm focus:outline-none focus:border-brand-gold">
                {FRAGRANCE_FAMILIES.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-brand-charcoal">Gender</label>
              <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className="bg-brand-cream border border-brand-light rounded-md px-3 py-2.5 text-brand-charcoal text-sm focus:outline-none focus:border-brand-gold">
                {GENDERS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <Input label="Top Notes (comma-separated)" value={form.topNotes} onChange={(e) => update('topNotes', e.target.value)} />
          <Input label="Heart Notes (comma-separated)" value={form.middleNotes} onChange={(e) => update('middleNotes', e.target.value)} />
          <Input label="Base Notes (comma-separated)" value={form.baseNotes} onChange={(e) => update('baseNotes', e.target.value)} />
        </div>

        <div className="bg-white rounded-xl p-5 border border-brand-light shadow-soft space-y-4">
          <h2 className="text-brand-charcoal font-semibold text-sm">Pricing & Stock</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input label="Size (ml)" required type="number" value={form.size} onChange={(e) => update('size', e.target.value)} />
            <Input label="Price (LKR)" required type="number" value={form.price} onChange={(e) => update('price', e.target.value)} />
            <Input label="Sale Price (LKR)" type="number" value={form.salePrice} onChange={(e) => update('salePrice', e.target.value)} />
            <Input label="Stock Qty" type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-brand-light shadow-soft space-y-4">
          <h2 className="text-brand-charcoal font-semibold text-sm">Images & Badges</h2>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-brand-charcoal">Image URLs (one per line)</label>
            <textarea value={form.images} onChange={(e) => update('images', e.target.value)} rows={3} className="bg-brand-cream border border-brand-light rounded-md px-3 py-2.5 text-brand-charcoal text-sm font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-gold/60 resize-none" />
          </div>
          <Input label="Authenticity Info" value={form.authenticityInfo} onChange={(e) => update('authenticityInfo', e.target.value)} />
          <div className="flex flex-wrap gap-4">
            {[
              { key: 'isFeatured', label: 'Featured' },
              { key: 'isNewArrival', label: 'New Arrival' },
              { key: 'isBestSeller', label: 'Best Seller' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[key as keyof typeof form] as boolean} onChange={(e) => update(key, e.target.checked)} className="accent-brand-gold" />
                <span className="text-brand-charcoal text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="primary" size="lg" loading={saving}>
            {saving ? 'Updating...' : 'Save Changes'}
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
