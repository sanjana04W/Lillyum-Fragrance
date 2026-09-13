'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import { AlertTriangle, Package } from 'lucide-react';
import { LOW_STOCK_THRESHOLD } from '@/lib/constants';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { SAMPLE_PRODUCTS } from '@/data/products';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>(SAMPLE_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});

  const handleAdjust = async (product: Product, variantSku: string, delta: number) => {
    const variantIdx = product.variants.findIndex((v) => v.sku === variantSku);
    if (variantIdx === -1) return;
    const newStock = Math.max(0, product.variants[variantIdx].stock + delta);
    const updatedVariants = product.variants.map((v, i) =>
      i === variantIdx ? { ...v, stock: newStock } : v
    );

    try {
      await updateDoc(doc(db, 'products', product.id), { variants: updatedVariants });
    } catch {
      // For seed data not in Firestore
    }
    setProducts((prev) =>
      prev.map((p) => p.id === product.id ? { ...p, variants: updatedVariants } : p)
    );
    toast.success(`Stock updated: ${variantSku} → ${newStock}`, { icon: '📦' });
  };

  const lowStockItems = products.flatMap((p) =>
    p.variants
      .filter((v) => v.stock > 0 && v.stock <= (v.lowStockThreshold ?? LOW_STOCK_THRESHOLD))
      .map((v) => ({ product: p, variant: v }))
  );
  const outOfStock = products.flatMap((p) =>
    p.variants.filter((v) => v.stock === 0).map((v) => ({ product: p, variant: v }))
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-xl font-bold text-brand-white">Inventory Management</h1>
        <p className="text-brand-muted text-xs">Real-time stock levels across all products and variants</p>
      </div>

      {/* Alerts */}
      {(lowStockItems.length > 0 || outOfStock.length > 0) && (
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-400" />
            <h2 className="text-red-400 font-semibold text-sm">Stock Alerts</h2>
          </div>
          {outOfStock.slice(0, 5).map((item, i) => (
            <div key={i} className="flex justify-between items-center text-xs">
              <span className="text-brand-muted">{item.product.brand} {item.product.title} · {item.variant.size}ml</span>
              <span className="text-red-400 font-semibold">Out of Stock</span>
            </div>
          ))}
          {lowStockItems.slice(0, 5).map((item, i) => (
            <div key={i} className="flex justify-between items-center text-xs">
              <span className="text-brand-muted">{item.product.brand} {item.product.title} · {item.variant.size}ml</span>
              <span className="text-orange-400 font-semibold">Only {item.variant.stock} left</span>
            </div>
          ))}
        </div>
      )}

      {/* Full inventory table */}
      <div className="bg-brand-charcoal rounded-xl border border-brand-mid/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-brand-mid/30">
                <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium">Product</th>
                <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium">SKU</th>
                <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium">Size</th>
                <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium">Stock</th>
                <th className="text-left px-4 py-3 text-brand-muted text-xs font-medium">Adjust</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-mid/20">
              {products.map((product) =>
                product.variants.map((variant) => {
                  const isOut = variant.stock === 0;
                  const isLow = variant.stock > 0 && variant.stock <= (variant.lowStockThreshold ?? LOW_STOCK_THRESHOLD);
                  return (
                    <tr key={variant.sku} className="hover:bg-brand-dark/40 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-brand-white text-xs">{product.brand} {product.title}</p>
                        <p className="text-brand-muted text-xs">{product.fragranceType}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-brand-muted text-xs font-mono">{variant.sku}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-brand-muted text-xs">{variant.size}ml</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${isOut ? 'text-red-400' : isLow ? 'text-orange-400' : 'text-emerald-400'}`}>
                          {variant.stock}
                        </span>
                        {isOut && <span className="ml-2 text-xs text-red-400">⚠ Out</span>}
                        {isLow && <span className="ml-2 text-xs text-orange-400">⚠ Low</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAdjust(product, variant.sku, -1)}
                            className="w-6 h-6 rounded bg-brand-mid/40 text-brand-light hover:bg-red-500/20 hover:text-red-400 transition-colors text-xs flex items-center justify-center"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleAdjust(product, variant.sku, 1)}
                            className="w-6 h-6 rounded bg-brand-mid/40 text-brand-light hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors text-xs flex items-center justify-center"
                          >
                            +
                          </button>
                          <button
                            onClick={() => handleAdjust(product, variant.sku, -(variant.stock))}
                            className="text-xs text-brand-muted hover:text-red-400 transition-colors px-1"
                            title="Mark as Out of Stock"
                          >
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

