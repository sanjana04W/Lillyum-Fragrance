'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import { AlertTriangle, Package } from 'lucide-react';
import { LOW_STOCK_THRESHOLD } from '@/lib/constants';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { SAMPLE_PRODUCTS, getStoredProducts, saveStoredProducts } from '@/data/products';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProducts(getStoredProducts());
    const handleUpdate = () => setProducts(getStoredProducts());
    window.addEventListener('lillyum_products_updated', handleUpdate);
    return () => window.removeEventListener('lillyum_products_updated', handleUpdate);
  }, []);

  const handleAdjust = async (product: Product, variantSku: string, delta: number) => {
    const variantIdx = product.variants.findIndex((v) => v.sku === variantSku);
    if (variantIdx === -1) return;
    const newStock = Math.max(0, product.variants[variantIdx].stock + delta);
    const updatedVariants = product.variants.map((v, i) => i === variantIdx ? { ...v, stock: newStock } : v);
    const updatedProduct = { ...product, variants: updatedVariants };

    // Save to localStorage and sync in-memory
    const all = getStoredProducts();
    const idx = all.findIndex((p) => p.id === product.id);
    if (idx >= 0) all[idx] = updatedProduct;
    saveStoredProducts(all);
    setProducts(getStoredProducts());

    // Non-blocking Firestore sync
    if (product.id && !product.id.startsWith('prod-')) {
      updateDoc(doc(db, 'products', product.id), { variants: updatedVariants }).catch(() => {});
    }
    toast.success(`Stock updated: ${variantSku} -> ${newStock}`, { icon: '📦' });
  };

  const lowStockItems = products.flatMap((p) =>
    p.variants.filter((v) => v.stock > 0 && v.stock <= (v.lowStockThreshold ?? LOW_STOCK_THRESHOLD)).map((v) => ({ product: p, variant: v }))
  );
  const outOfStock = products.flatMap((p) =>
    p.variants.filter((v) => v.stock === 0).map((v) => ({ product: p, variant: v }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-xl font-bold text-brand-charcoal">Inventory Management</h1>
        <p className="text-brand-charcoal/50 text-xs">Real-time stock levels across all products and variants</p>
      </div>

      {(lowStockItems.length > 0 || outOfStock.length > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-500" />
            <h2 className="text-red-600 font-semibold text-sm">Stock Alerts</h2>
          </div>
          {outOfStock.slice(0, 5).map((item, i) => (
            <div key={i} className="flex justify-between items-center text-xs">
              <span className="text-brand-charcoal/60">{item.product.brand} {item.product.title} - {item.variant.size}ml</span>
              <span className="text-red-600 font-semibold">Out of Stock</span>
            </div>
          ))}
          {lowStockItems.slice(0, 5).map((item, i) => (
            <div key={i} className="flex justify-between items-center text-xs">
              <span className="text-brand-charcoal/60">{item.product.brand} {item.product.title} - {item.variant.size}ml</span>
              <span className="text-orange-500 font-semibold">Only {item.variant.stock} left</span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl border border-brand-light overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-light bg-brand-cream">
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Product</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">SKU</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Size</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Stock</th>
                <th className="text-left px-4 py-3 text-brand-charcoal/50 text-xs font-semibold uppercase tracking-wide">Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-light">
              {products.map((product) =>
                product.variants.map((variant) => {
                  const isOut = variant.stock === 0;
                  const isLow = variant.stock > 0 && variant.stock <= (variant.lowStockThreshold ?? LOW_STOCK_THRESHOLD);
                  return (
                    <tr key={variant.sku} className="hover:bg-brand-cream/60 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-brand-charcoal text-xs font-medium">{product.brand} {product.title}</p>
                        <p className="text-brand-charcoal/50 text-xs">{product.fragranceType}</p>
                      </td>
                      <td className="px-4 py-3"><span className="text-brand-charcoal/60 text-xs font-mono">{variant.sku}</span></td>
                      <td className="px-4 py-3"><span className="text-brand-charcoal/60 text-xs">{variant.size}ml</span></td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${isOut ? 'text-red-500' : isLow ? 'text-orange-500' : 'text-emerald-600'}`}>
                          {variant.stock}
                        </span>
                        {isOut && <span className="ml-2 text-xs text-red-500">Out</span>}
                        {isLow && <span className="ml-2 text-xs text-orange-500">Low</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleAdjust(product, variant.sku, -1)}
                            className="w-6 h-6 rounded bg-red-50 text-red-500 hover:bg-red-100 transition-colors text-xs flex items-center justify-center font-bold border border-red-100">-</button>
                          <button onClick={() => handleAdjust(product, variant.sku, 1)}
                            className="w-6 h-6 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors text-xs flex items-center justify-center font-bold border border-emerald-100">+</button>
                          <button onClick={() => handleAdjust(product, variant.sku, -variant.stock)}
                            className="text-xs text-brand-charcoal/40 hover:text-red-500 transition-colors px-1" title="Mark as Out of Stock">
                            <Package size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
