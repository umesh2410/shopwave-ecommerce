'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { cartAPI } from '../../services/api';
import { useCartStore, useAuthStore } from '../../hooks/useStore';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add to cart'); return; }
    try {
      await cartAPI.add({ product_id: product.id, quantity: 1 });
      addItem({ id: Date.now(), product_id: product.id, name: product.name, price: product.price, image_url: product.image_url, quantity: 1 });
      toast.success('Added to cart!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add to cart');
    }
  };

  const discount = product.compare_price ? Math.round((1 - product.price / product.compare_price) * 100) : 0;

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden hover:shadow-soft transition-all duration-500 border border-surface-100/50 hover:border-surface-200">
      <Link href={`/products/${product.id}`} className="block relative aspect-[4/5] bg-surface-50 overflow-hidden">
        <Image
          src={product.image_url || 'https://via.placeholder.com/400'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out p-4 md:p-8"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {discount > 0 && (
            <span className="bg-red-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
              {discount}% OFF
            </span>
          )}
          {product.category_name && (
            <span className="glass bg-white/60 text-surface-900 text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-md">
              {product.category_name}
            </span>
          )}
        </div>

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-20 flex items-center justify-center">
            <span className="bg-surface-900 text-white font-semibold px-4 py-2 rounded-full text-sm">
              Sold Out
            </span>
          </div>
        )}

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden md:flex flex-col justify-end p-4">
          <div className="flex justify-center gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-white/95 text-surface-900 hover:bg-brand-600 hover:text-white hover:shadow-lg w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-50"
              title="Add to Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <div className="bg-white/95 text-surface-900 hover:bg-brand-600 hover:text-white hover:shadow-lg w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300" title="Quick View">
              <Eye className="w-5 h-5" />
            </div>
          </div>
        </div>
      </Link>

      <div className="p-5 sm:p-6 bg-white relative z-20">
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(product.rating || 0) ? 'fill-orange-400 text-orange-400' : 'fill-surface-200 text-surface-200'}`} />
            ))}
          </div>
          <span className="text-xs text-surface-500 font-medium">({product.review_count || 0})</span>
        </div>
        
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-surface-900 text-base sm:text-lg leading-tight line-clamp-2 mb-4 group-hover:text-brand-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-end justify-between mt-auto">
          <div className="flex flex-col">
            {product.compare_price && (
              <span className="text-xs sm:text-sm text-surface-400 line-through decoration-surface-300 mb-0.5">
                ₹{product.compare_price.toLocaleString()}
              </span>
            )}
            <span className="font-bold text-surface-900 text-lg sm:text-xl">
              ₹{product.price.toLocaleString()}
            </span>
          </div>
          
          {/* Mobile cart button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="md:hidden p-3 bg-brand-50 text-brand-600 rounded-xl hover:bg-brand-600 hover:text-white transition-colors disabled:opacity-50"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
