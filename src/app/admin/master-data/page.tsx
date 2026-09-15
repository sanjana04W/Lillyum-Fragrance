'use client';

import { useState } from 'react';
import { Layers, Plus, Database, Sparkles, Tag } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function MasterDataPage() {
  const [brands, setBrands] = useState(['Armaf', 'Lattafa', 'Rasasi', 'Ajmal', 'Al-Rehab', 'Swiss Arabian', 'Afnan']);
  const [families, setFamilies] = useState(['Woody', 'Oriental', 'Floral', 'Fresh', 'Aquatic', 'Gourmand', 'Citrus', 'Spicy', 'Musk']);
  const [types, setTypes] = useState([
    { name: 'Eau de Parfum (EDP)', code: 'EDP', conc: '15-20%' },
    { name: 'Eau de Toilette (EDT)', code: 'EDT', conc: '5-15%' },
    { name: 'Extrait de Parfum', code: 'Extrait', conc: '20-40%' },
    { name: 'Eau de Cologne (EDC)', code: 'EDC', conc: '2-4%' },
  ]);
  const [newBrand, setNewBrand] = useState('');
  const [newFamily, setNewFamily] = useState('');

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrand.trim()) return;
    if (brands.includes(newBrand.trim())) {
      toast.error('Brand already exists');
      return;
    }
    setBrands([...brands, newBrand.trim()]);
    setNewBrand('');
    toast.success('Brand added to Master Data');
  };

  const handleAddFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFamily.trim()) return;
    if (families.includes(newFamily.trim())) {
      toast.error('Family already exists');
      return;
    }
    setFamilies([...families, newFamily.trim()]);
    setNewFamily('');
    toast.success('Fragrance family added');
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-serif text-2xl font-bold text-brand-charcoal">Master Data</h1>
        <p className="text-brand-charcoal/50 text-xs">Manage catalog taxonomies, perfume families, brands, and perfume types</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fragrance Brands */}
        <div className="bg-white rounded-2xl border border-brand-light shadow-soft p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-brand-charcoal text-sm flex items-center gap-2">
              <Sparkles size={16} className="text-brand-gold" />
              Fragrance Brands ({brands.length})
            </h2>
          </div>
          <form onSubmit={handleAddBrand} className="flex gap-2">
            <input
              type="text"
              value={newBrand}
              onChange={(e) => setNewBrand(e.target.value)}
              placeholder="New brand name..."
              className="flex-1 bg-brand-cream border border-brand-light rounded-lg px-3 py-1.5 text-xs text-brand-charcoal focus:outline-none focus:border-brand-gold"
            />
            <Button type="submit" variant="primary" size="sm">
              <Plus size={14} /> Add
            </Button>
          </form>
          <div className="flex flex-wrap gap-2 pt-2">
            {brands.map((brand) => (
              <span key={brand} className="bg-brand-cream border border-brand-light text-brand-charcoal text-xs font-medium px-3 py-1 rounded-full">
                {brand}
              </span>
            ))}
          </div>
        </div>

        {/* Fragrance Families */}
        <div className="bg-white rounded-2xl border border-brand-light shadow-soft p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-brand-charcoal text-sm flex items-center gap-2">
              <Tag size={16} className="text-brand-gold" />
              Fragrance Families ({families.length})
            </h2>
          </div>
          <form onSubmit={handleAddFamily} className="flex gap-2">
            <input
              type="text"
              value={newFamily}
              onChange={(e) => setNewFamily(e.target.value)}
              placeholder="New olfactive family..."
              className="flex-1 bg-brand-cream border border-brand-light rounded-lg px-3 py-1.5 text-xs text-brand-charcoal focus:outline-none focus:border-brand-gold"
            />
            <Button type="submit" variant="primary" size="sm">
              <Plus size={14} /> Add
            </Button>
          </form>
          <div className="flex flex-wrap gap-2 pt-2">
            {families.map((f) => (
              <span key={f} className="bg-brand-gold-soft border border-brand-gold/20 text-brand-gold-dark text-xs font-medium px-3 py-1 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Perfume Concentrations */}
        <div className="bg-white rounded-2xl border border-brand-light shadow-soft p-5 md:col-span-2 space-y-3">
          <h2 className="font-semibold text-brand-charcoal text-sm flex items-center gap-2">
            <Layers size={16} className="text-brand-gold" />
            Standard Fragrance Concentrations & Classes
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {types.map((t) => (
              <div key={t.code} className="bg-brand-cream/60 border border-brand-light rounded-xl p-3.5 space-y-1">
                <span className="font-mono text-xs font-bold text-brand-gold">{t.code}</span>
                <p className="text-xs font-semibold text-brand-charcoal">{t.name}</p>
                <p className="text-[11px] text-brand-charcoal/50">Oil Concentration: {t.conc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
