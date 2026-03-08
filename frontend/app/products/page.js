'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { productAPI } from '../../services/api';
import ProductCard from '../../components/product/ProductCard';
import Navbar from '../../components/layout/Navbar';
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [sort, setSort] = useState('created_at');
  const category = searchParams.get('category');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await productAPI.getAll({ category, search, page, limit: 12, sort });
        setProducts(res.data.products);
        setTotal(res.data.total);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, [category, search, page, sort]);

  return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />
      
      {/* Page Header */}
      <div className="bg-white border-b border-surface-200 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="animate-slide-up">
              <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-surface-900 tracking-tight">
                {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Explore Collection'}
              </h1>
              <p className="text-surface-500 mt-3 text-lg font-light">
                Showing {total} premium {total === 1 ? 'product' : 'products'} curated for you.
              </p>
            </div>
            
            {/* Filters & Search */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
                <input
                  className="w-full sm:w-72 bg-surface-50 border border-surface-200 text-surface-900 pl-11 pr-4 py-3 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                  placeholder="Search products..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                />
              </div>
              <div className="relative">
                <select 
                  className="w-full sm:w-48 appearance-none bg-surface-50 border border-surface-200 text-surface-900 pl-4 pr-10 py-3 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none cursor-pointer" 
                  value={sort} 
                  onChange={e => setSort(e.target.value)}
                >
                  <option value="created_at">Latest Arrivals</option>
                  <option value="price">Price: Low to High</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-[2rem] border border-surface-100 overflow-hidden animate-pulse">
                <div className="aspect-[4/5] bg-surface-200" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-surface-200 rounded w-1/3" />
                  <div className="h-6 bg-surface-200 rounded w-3/4" />
                  <div className="h-8 bg-surface-200 rounded w-1/2 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xl:gap-8">
              {products.map((p, index) => (
                <div key={p.id} className="animate-slide-up" style={{ animationDelay: `${(index % 12) * 50}ms` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {total > 12 && (
              <div className="flex justify-center flex-wrap gap-2 mt-16 pb-8">
                {Array(Math.ceil(total / 12)).fill(0).map((_, i) => (
                  <button key={i} onClick={() => setPage(i + 1)}
                    className={`w-12 h-12 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center ${
                      page === i + 1 
                        ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30' 
                        : 'bg-white border border-surface-200 text-surface-600 hover:border-brand-300 hover:text-brand-600'
                    }`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-32 max-w-md mx-auto animate-fade-in">
            <div className="w-24 h-24 bg-surface-100 rounded-full flex items-center justify-center text-surface-400 mx-auto mb-6">
              <Search size={40} strokeWidth={1.5} />
            </div>
            <h2 className="font-display text-3xl font-bold text-surface-900 mb-3">No products found</h2>
            <p className="text-surface-500 text-lg mb-8">We couldn&apos;t find anything matching your search criteria. Try adjusting your filters or browsing all categories.</p>
            <button
              onClick={() => { setSearch(''); setCategory(null); setSort('created_at'); setPage(1); }}
              className="btn-secondary"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return <Suspense fallback={
    <div className="min-h-screen bg-surface-50 pt-32 flex justify-center">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-t-2 border-brand-500 animate-spin" />
      </div>
    </div>
  }><ProductsContent /></Suspense>;
}
