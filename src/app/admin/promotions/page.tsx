'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import toast from 'react-hot-toast';
import { Tag, Calendar, Plus, Trash2 } from 'lucide-react';

interface Promo {
  id: string;
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  active: boolean;
  minOrder?: number;
}

export default function AdminPromotionsPage() {
  const [promos, setPromos] = useState<Promo[]>([
    { id: '1', code: 'WELCOME10', discount: 10, type: 'percentage', active: true, minOrder: 5000 },
    { id: '2', code: 'LILLYUM500', discount: 500, type: 'fixed', active: true, minOrder: 10000 },
    { id: '3', code: 'FREESHIP', discount: 350, type: 'fixed', active: false, minOrder: 15000 },
  ]);

  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [minOrder, setMinOrder] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discount) {
      toast.error('Please enter a coupon code and discount value.');
      return;
    }

    const newPromo: Promo = {
      id: Date.now().toString(),
      code: code.toUpperCase().trim(),
      discount: parseFloat(discount),
      type,
      active: true,
      minOrder: minOrder ? parseFloat(minOrder) : undefined,
    };

    setPromos([newPromo, ...promos]);
    setCode('');
    setDiscount('');
    setMinOrder('');
    toast.success(`Promo code ${newPromo.code} created!`);
  };

  const toggleActive = (id: string) => {
    setPromos(
      promos.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
    toast.success('Promo status updated');
  };

  const deletePromo = (id: string) => {
    setPromos(promos.filter((p) => p.id !== id));
    toast.success('Promo code deleted');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-xl font-bold text-brand-white">Promotions & Offers</h1>
        <p className="text-brand-muted text-xs">Manage discount codes and promotional campaigns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Create form */}
        <div className="bg-brand-charcoal rounded-xl p-5 border border-brand-mid/20 md:col-span-1 h-fit">
          <h2 className="text-brand-white font-semibold text-sm mb-4 flex items-center gap-2">
            <Plus size={16} className="text-brand-gold" />
            Create Promo Code
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Promo Code"
              placeholder="e.g. SUMMER15"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-brand-light">Discount Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'percentage' | 'fixed')}
                className="bg-brand-dark border border-brand-mid rounded-md px-3 py-2 text-brand-white text-sm focus:outline-none focus:border-brand-gold"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (LKR)</option>
              </select>
            </div>
            <Input
              label={type === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount (LKR)'}
              type="number"
              placeholder={type === 'percentage' ? '10' : '500'}
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              required
            />
            <Input
              label="Minimum Order Value (LKR)"
              type="number"
              placeholder="Optional, e.g. 5000"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
            />
            <Button type="submit" variant="primary" fullWidth size="md">
              Create Code
            </Button>
          </form>
        </div>

        {/* Existing Promo codes */}
        <div className="bg-brand-charcoal rounded-xl border border-brand-mid/20 md:col-span-2 overflow-hidden">
          <div className="p-4 border-b border-brand-mid/30">
            <h2 className="text-brand-white font-semibold text-sm flex items-center gap-2">
              <Tag size={16} className="text-brand-gold" />
              Active Campaigns & Codes
            </h2>
          </div>
          <div className="divide-y divide-brand-mid/20">
            {promos.map((p) => (
              <div key={p.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded text-sm">
                      {p.code}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        p.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-brand-mid/30 text-brand-muted'
                      }`}
                    >
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-brand-white text-xs mt-1">
                    {p.type === 'percentage' ? `${p.discount}% OFF` : `LKR ${p.discount.toLocaleString()} OFF`}
                    {p.minOrder && ` on orders above LKR ${p.minOrder.toLocaleString()}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(p.id)}
                  >
                    {p.active ? 'Pause' : 'Activate'}
                  </Button>
                  <button
                    onClick={() => deletePromo(p.id)}
                    className="text-brand-muted hover:text-red-400 p-1.5 transition-colors"
                    title="Delete promo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

