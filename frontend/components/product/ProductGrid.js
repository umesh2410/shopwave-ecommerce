'use client';
import { useState, useEffect } from 'react';
import { productAPI } from '../../services/api';
import ProductCard from './ProductCard';

export default function ProductGrid({ limit, category, search }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await productAPI.getAll({ limit: limit || 12, category, search });
        setProducts(res.data.products);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [limit, category, search]);

  if (loading) return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {Array(limit || 8).fill(0).map((_, i) => (
        <div key={i} className="card animate-pulse">
          <div className="aspect-square bg-stone-200" />
          <div className="p-4 space-y-2">
            <div className="h-3 bg-stone-200 rounded w-1/3" />
            <div className="h-4 bg-stone-200 rounded" />
            <div className="h-4 bg-stone-200 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );

  if (!products.length) return (
    <div className="text-center py-20 text-stone-400">
      <div className="text-5xl mb-4">🔍</div>
      <p className="text-lg font-medium">No products found</p>
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
