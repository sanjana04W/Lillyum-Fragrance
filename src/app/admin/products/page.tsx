'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Plus, Pencil, Eye, EyeOff, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { SAMPLE_PRODUCTS } from '@/data/products';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(false);

  const handleToggleStatus = async (product: Product) => {
    const newStatus = product.status === 'active' ? 'hidden' : 'active';
    try {
      // If product is in Firestore
      await updateDoc(doc(db, 'products', product.id), { status: newStatus });
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, status: newStatus } : p));
      toast.success(`Product ${newStatus === 'active' ? 'shown' : 'hidden'}`);
    } catch {
      // Local update for seed data
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, status: newStatus } : p));
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-xl font-bold text-brand-white">Products</h1>
          <p className="text-brand-muted text-xs">{products.length} products in catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="primary" size="sm">
            <Plus size={14} /> Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-brand-charcoal rounded-xl border border-brand-mid/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-mid/30">
                <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium">Product</th>
                <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium hidden sm:table-cell">Brand</th>
                <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium">Price</th>
                <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium hidden sm:table-cell">Stock</th>
                <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium">Status</th>
                <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-mid/20">
              {products.map((product) => {
                const variant = product.variants[0];
                const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                return (
                  <tr key={product.id} className={`hover:bg-brand-dark/40 transition-colors ${product.status === 'hidden' ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded overflow-hidden shrink-0 bg-brand-dark">
                          <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-brand-white text-xs font-medium">{product.title}</p>
                          <p className="text-brand-muted text-xs">{variant?.size}ml</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <p className="text-brand-muted text-xs">{product.brand}</p>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs bg-brand-dark text-brand-muted px-2 py-0.5 rounded">{product.fragranceType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-brand-gold text-xs font-semibold">{formatPrice(variant?.salePrice ?? variant?.price ?? 0)}</p>
                      {variant?.salePrice && <p className="text-brand-muted text-xs line-through">{formatPrice(variant.price)}</p>}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs font-semibold ${totalStock === 0 ? 'text-red-400' : totalStock <= 5 ? 'text-orange-400' : 'text-emerald-400'}`}>
                        {totalStock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${product.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-brand-mid/30 text-brand-muted'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/products/${product.id}`} className="text-brand-muted hover:text-brand-gold transition-colors">
                          <Pencil size={14} />
                        </Link>
                        <button onClick={() => handleToggleStatus(product)} className="text-brand-muted hover:text-brand-gold transition-colors">
                          {product.status === 'active' ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

