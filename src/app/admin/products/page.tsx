'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Plus, Pencil, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { SAMPLE_PRODUCTS, getStoredProducts, saveProduct } from '@/data/products';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    setProducts(getStoredProducts());
    const handleUpdate = () => {
      setProducts(getStoredProducts());
    };
    window.addEventListener('lillyum_products_updated', handleUpdate);
    return () => window.removeEventListener('lillyum_products_updated', handleUpdate);
  }, []);

  const handleToggleStatus = async (product: Product) => {
    const newStatus = product.status === 'active' ? 'hidden' : 'active';
    const updated = { ...product, status: newStatus as Product['status'] };
    saveProduct(updated);
    setProducts((prev) => prev.map((p) => p.id === product.id ? updated : p));
    
    // Non-blocking Firestore sync
    if (product.id && !product.id.startsWith('prod-')) {
      updateDoc(doc(db, 'products', product.id), { status: newStatus }).catch(() => {});
    }
    toast.success(`Product ${newStatus === 'active' ? 'shown' : 'hidden'}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-xl font-bold text-brand-charcoal">Products</h1>
          <p className="text-brand-charcoal/50 text-xs">{products.length} products in catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="primary" size="sm"><Plus size={14} /> Add Product</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-brand-light overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-light bg-brand-cream">
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide hidden sm:table-cell">Brand</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Price</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide hidden sm:table-cell">Stock</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-light">
              {products.map((product) => {
                const variant = product.variants[0];
                const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                return (
                  <tr key={product.id} className={`hover:bg-brand-cream/60 transition-colors ${product.status === 'hidden' ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded overflow-hidden shrink-0 bg-brand-ivory">
                          <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                        </div>
                        <div>
                          <p className="text-brand-charcoal text-xs font-medium">{product.title}</p>
                          <p className="text-brand-charcoal/50 text-xs">{variant?.size}ml</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell"><p className="text-brand-charcoal/60 text-xs">{product.brand}</p></td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs bg-brand-cream text-brand-charcoal/60 px-2 py-0.5 rounded border border-brand-light">{product.fragranceType}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-brand-gold text-xs font-semibold">{formatPrice(variant?.salePrice ?? variant?.price ?? 0)}</p>
                      {variant?.salePrice && <p className="text-brand-charcoal/40 text-xs line-through">{formatPrice(variant.price)}</p>}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`text-xs font-semibold ${totalStock === 0 ? 'text-red-500' : totalStock <= 5 ? 'text-orange-500' : 'text-emerald-600'}`}>{totalStock}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${product.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-brand-cream text-brand-charcoal/50 border border-brand-light'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/products/${product.id}`} className="text-brand-charcoal/40 hover:text-brand-gold transition-colors"><Pencil size={14} /></Link>
                        <button onClick={() => handleToggleStatus(product)} className="text-brand-charcoal/40 hover:text-brand-gold transition-colors">
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
