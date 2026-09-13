'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { slugify } from '@/lib/utils';
import { FragranceType, FragranceFamily, Gender } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const FRAGRANCE_TYPES: FragranceType[] = ['EDP', 'EDT', 'Extrait', 'EDC', 'Parfum'];
const FRAGRANCE_FAMILIES: FragranceFamily[] = ['Floral', 'Oriental', 'Woody', 'Fresh', 'Citrus', 'Aquatic', 'Gourmand', 'Chypre', 'Fougere', 'Musk', 'Spicy'];
const GENDERS: Gender[] = ['Men', 'Women', 'Unisex'];

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '', brand: '', fragranceName: '', description: '',
    fragranceType: 'EDP' as FragranceType,
    fragranceFamily: 'Floral' as FragranceFamily,
    gender: 'Unisex' as Gender,
    topNotes: '', middleNotes: '', baseNotes: '',
    size: '100', price: '', salePrice: '', stock: '',
    authenticityInfo: '',
    isFeatured: false, isNewArrival: true, isBestSeller: false,
    images: '',
  });

  const update = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.brand || !form.price) {
      toast.error('Title, brand, and price are required.');
      return;
    }
    setSaving(true);
    try {
      const slug = slugify(`${form.brand}-${form.title}-${form.size}ml`);
      const sku = `${form.brand.substring(0, 3).toUpperCase()}-${Date.now()}`;
      const price = parseFloat(form.price);
      const salePrice = form.salePrice ? parseFloat(form.salePrice) : undefined;
      const stock = parseInt(form.stock ?? '0', 10);

      const images = form.images.split('\n').map((s) => s.trim()).filter(Boolean);

      const categories: string[] = [form.gender.toLowerCase()];
      if (form.fragranceType === 'EDP') categories.push('edp');
      else if (form.fragranceType === 'EDT') categories.push('edt');
      else categories.push('extrait');
      if (form.isNewArrival) categories.push('new-arrivals');
      if (form.isBestSeller) categories.push('best-sellers');

      await addDoc(collection(db, 'products'), {
        slug,
        title: form.title,
        brand: form.brand,
        fragranceName: form.fragranceName || form.title,
        description: form.description,
        fragranceType: form.fragranceType,
        fragranceFamily: form.fragranceFamily,
        gender: form.gender,
        notes: {
          top: form.topNotes.split(',').map((s) => s.trim()).filter(Boolean),
          middle: form.middleNotes.split(',').map((s) => s.trim()).filter(Boolean),
          base: form.baseNotes.split(',').map((s) => s.trim()).filter(Boolean),
        },
        variants: [{ size: parseInt(form.size, 10), price, salePrice, stock, sku, lowStockThreshold: 5 }],
        images: images.length > 0 ? images : ['/images/placeholder.jpg'],
        status: 'active',
        isFeatured: form.isFeatured,
        isNewArrival: form.isNewArrival,
        isBestSeller: form.isBestSeller,
        categories,
        authenticityInfo: form.authenticityInfo,
        orderCount: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      toast.success('Product added successfully!');
      router.push('/admin/products');
    } catch (err) {
      console.error(err);
      toast.error('Failed to add product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-5">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="text-brand-muted hover:text-brand-gold">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-serif text-xl font-bold text-brand-white">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-brand-charcoal rounded-xl p-5 border border-brand-mid/20 space-y-4">
          <h2 className="text-brand-white font-semibold text-sm">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Product Title" required value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Club de Nuit Intense" />
            <Input label="Brand" required value={form.brand} onChange={(e) => update('brand', e.target.value)} placeholder="e.g. Armaf" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-brand-light">Description</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={4} placeholder="Fragrance description..." className="bg-brand-dark border border-brand-mid rounded-md px-3 py-2.5 text-brand-white text-sm placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/60 resize-none" />
          </div>
        </div>

        <div className="bg-brand-charcoal rounded-xl p-5 border border-brand-mid/20 space-y-4">
          <h2 className="text-brand-white font-semibold text-sm">Fragrance Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-brand-light">Type</label>
              <select value={form.fragranceType} onChange={(e) => update('fragranceType', e.target.value)} className="bg-brand-dark border border-brand-mid rounded-md px-3 py-2.5 text-brand-white text-sm focus:outline-none focus:border-brand-gold">
                {FRAGRANCE_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-brand-light">Family</label>
              <select value={form.fragranceFamily} onChange={(e) => update('fragranceFamily', e.target.value)} className="bg-brand-dark border border-brand-mid rounded-md px-3 py-2.5 text-brand-white text-sm focus:outline-none focus:border-brand-gold">
                {FRAGRANCE_FAMILIES.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-brand-light">Gender</label>
              <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className="bg-brand-dark border border-brand-mid rounded-md px-3 py-2.5 text-brand-white text-sm focus:outline-none focus:border-brand-gold">
                {GENDERS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <Input label="Top Notes (comma-separated)" value={form.topNotes} onChange={(e) => update('topNotes', e.target.value)} placeholder="e.g. Bergamot, Lemon, Apple" />
          <Input label="Heart Notes (comma-separated)" value={form.middleNotes} onChange={(e) => update('middleNotes', e.target.value)} placeholder="e.g. Rose, Jasmine, Oud" />
          <Input label="Base Notes (comma-separated)" value={form.baseNotes} onChange={(e) => update('baseNotes', e.target.value)} placeholder="e.g. Sandalwood, Musk, Amber" />
        </div>

        <div className="bg-brand-charcoal rounded-xl p-5 border border-brand-mid/20 space-y-4">
          <h2 className="text-brand-white font-semibold text-sm">Pricing & Stock</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input label="Size (ml)" required type="number" value={form.size} onChange={(e) => update('size', e.target.value)} />
            <Input label="Price (LKR)" required type="number" value={form.price} onChange={(e) => update('price', e.target.value)} />
            <Input label="Sale Price (LKR)" type="number" value={form.salePrice} onChange={(e) => update('salePrice', e.target.value)} hint="Optional" />
            <Input label="Stock Qty" type="number" value={form.stock} onChange={(e) => update('stock', e.target.value)} />
          </div>
        </div>

        <div className="bg-brand-charcoal rounded-xl p-5 border border-brand-mid/20 space-y-4">
          <h2 className="text-brand-white font-semibold text-sm">Images & Flags</h2>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-brand-light">Image URLs (one per line)</label>
            <textarea value={form.images} onChange={(e) => update('images', e.target.value)} rows={3} placeholder="/images/filename.jpg&#10;https://firebasestorage..." className="bg-brand-dark border border-brand-mid rounded-md px-3 py-2.5 text-brand-white text-sm placeholder-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-gold/60 resize-none font-mono text-xs" />
          </div>
          <Input label="Authenticity Info" value={form.authenticityInfo} onChange={(e) => update('authenticityInfo', e.target.value)} placeholder="e.g. 100% authentic, imported from Dubai" />
          <div className="flex flex-wrap gap-4">
            {[
              { key: 'isFeatured', label: 'Featured' },
              { key: 'isNewArrival', label: 'New Arrival' },
              { key: 'isBestSeller', label: 'Best Seller' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form[key as keyof typeof form] as boolean} onChange={(e) => update(key, e.target.checked)} className="accent-brand-gold" />
                <span className="text-brand-light text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" variant="primary" size="lg" loading={saving}>
            {saving ? 'Saving...' : 'Add Product'}
          </Button>
          <Button type="button" variant="ghost" size="lg" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

