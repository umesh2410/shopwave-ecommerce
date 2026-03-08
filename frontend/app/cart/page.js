'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { cartAPI } from '../../services/api';
import { useCartStore, useAuthStore } from '../../hooks/useStore';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';

export default function CartPage() {
  const [cartData, setCartData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const { setCart } = useCartStore();

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    cartAPI.get().then(res => { setCartData(res.data); setCart(res.data.items, res.data.total); }).catch(console.error).finally(() => setLoading(false));
  }, [user]);

  const updateQty = async (id, quantity) => {
    try {
      if (quantity < 1) return;
      await cartAPI.update(id, { quantity });
      const res = await cartAPI.get();
      setCartData(res.data);
      setCart(res.data.items, res.data.total);
    } catch (err) { toast.error('Failed to update cart'); }
  };

  const remove = async (id) => {
    try {
      await cartAPI.remove(id);
      const res = await cartAPI.get();
      setCartData(res.data);
      setCart(res.data.items, res.data.total);
      toast.success('Item removed');
    } catch (err) { toast.error('Failed to remove item'); }
  };

  if (!user) return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />
      <div className="pt-32 pb-20 flex flex-col items-center justify-center gap-6 px-6 text-center animate-fade-in">
        <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center text-brand-500 mb-4 shadow-inner">
          <ShoppingBag size={40} strokeWidth={1.5} />
        </div>
        <h2 className="font-display text-3xl font-bold text-surface-900">Your cart is waiting</h2>
        <p className="text-surface-500 max-w-md">Log in to your account to view your saved items and enjoy a seamless shopping experience.</p>
        <Link href="/auth/login" className="btn-primary px-8 py-3 mt-4">Sign in to checkout</Link>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />
      <div className="pt-32 pb-20 flex items-center justify-center">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-brand-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-r-2 border-accent-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s'}} />
        </div>
      </div>
    </div>
  );

  const shipping = cartData.total > 999 ? 0 : 49;
  const grandTotal = cartData.total + shipping;

  if (!cartData.items || !cartData.items.length) return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />
      <div className="pt-32 pb-20 flex flex-col items-center justify-center gap-6 px-6 text-center animate-fade-in">
        <div className="w-24 h-24 bg-surface-100 rounded-full flex items-center justify-center text-surface-400 mb-4 shadow-inner">
          <ShoppingBag size={40} strokeWidth={1.5} />
        </div>
        <h2 className="font-display text-3xl font-bold text-surface-900">Your cart is empty</h2>
        <p className="text-surface-500 max-w-md mb-2">Looks like you haven&apos;t added any items to your cart yet. Discover our premium collection.</p>
        <Link href="/products" className="btn-primary px-8 py-3 group">
          Start Shopping <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 inline-block transition-transform" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-50 selection:bg-brand-500/30">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-200">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight">Shopping Cart</h1>
            <span className="bg-surface-200 text-surface-700 font-semibold px-4 py-1.5 rounded-full text-sm">
              {cartData.items.length} {cartData.items.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
            
            {/* Cart Items List */}
            <div className="w-full lg:w-2/3 space-y-6">
              {cartData.items.map((item, index) => (
                <div key={item.id} className="bg-white rounded-[2rem] p-4 sm:p-6 flex flex-col sm:flex-row gap-6 border border-surface-200 shadow-sm hover:shadow-soft transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 50}ms`}}>
                  
                  {/* Image */}
                  <Link href={`/products/${item.product_id}`} className="relative w-full sm:w-32 md:w-40 aspect-square sm:aspect-[4/5] rounded-2xl overflow-hidden bg-surface-50 shrink-0 group block">
                    <Image src={item.image_url || 'https://via.placeholder.com/400'} alt={item.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  
                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4 gap-4">
                      <Link href={`/products/${item.product_id}`}>
                        <h3 className="font-semibold text-lg text-surface-900 group hover:text-brand-600 transition-colors line-clamp-2">
                          {item.name}
                        </h3>
                      </Link>
                      <button onClick={() => remove(item.id)} className="w-10 h-10 rounded-full flex items-center justify-center text-surface-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0" title="Remove item">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-end justify-between mt-auto">
                      <div className="inline-flex items-center bg-surface-50 rounded-xl p-1 border border-surface-200">
                        <button onClick={() => updateQty(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="w-8 h-8 rounded-lg bg-white shadow flex items-center justify-center text-surface-700 hover:text-brand-600 disabled:opacity-50 transition-colors">
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-bold text-sm text-surface-900">{item.quantity}</span>
                        <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-8 h-8 rounded-lg bg-white shadow flex items-center justify-center text-surface-700 hover:text-brand-600 transition-colors">
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-surface-500 mb-1">₹{Number(item.price).toLocaleString()} each</div>
                        <div className="font-bold text-xl text-brand-600">₹{(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary sticky sidebar */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-surface-200 shadow-soft sticky top-28">
                <h2 className="font-display text-xl font-bold text-surface-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center text-surface-600">
                     <span>Subtotal</span>
                     <span className="font-medium text-surface-900">₹{cartData.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-surface-600">
                     <span>Estimated Shipping</span>
                     {shipping === 0 ? (
                       <span className="font-bold text-emerald-600">Free</span>
                     ) : (
                       <span className="font-medium text-surface-900">₹{shipping}</span>
                     )}
                  </div>
                  
                  {shipping > 0 && (
                    <div className="bg-brand-50 rounded-xl p-3 text-sm text-brand-700 font-medium border border-brand-100 flex items-start gap-2">
                       <ShieldCheck className="w-5 h-5 shrink-0 text-brand-500" />
                       <p>Add ₹{(999 - cartData.total).toLocaleString()} more to your cart for free shipping!</p>
                    </div>
                  )}
                  
                  <div className="pt-6 border-t border-surface-200">
                    <div className="flex justify-between items-end">
                       <div>
                         <span className="block font-bold text-surface-900 text-lg">Total</span>
                         <span className="text-xs text-surface-500 font-medium">Including all taxes</span>
                       </div>
                       <span className="font-black text-3xl text-surface-900 tracking-tight">₹{Math.round(grandTotal).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <Link href="/checkout" className="btn-primary w-full py-4 text-center mt-4">
                  Proceed to Checkout
                </Link>
                
                <div className="mt-6 flex flex-col items-center gap-4">
                   <div className="flex items-center gap-2 text-surface-500 text-sm">
                     <ShieldCheck className="w-4 h-4" />
                     <span>Secure encrypted checkout</span>
                   </div>
                   <Link href="/products" className="text-sm font-semibold text-brand-600 hover:text-brand-700 mt-2 hover:underline">
                     or Continue Shopping
                   </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
