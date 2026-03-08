'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminAPI } from '../../../services/api';
import Navbar from '../../../components/layout/Navbar';
import { ShoppingBag, DollarSign, Users, Package, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard().then(res => setData(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-surface-50">
      <Navbar />
      <div className="pt-32 pb-20 flex items-center justify-center min-h-[60vh]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-t-2 border-brand-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-r-2 border-accent-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s'}} />
        </div>
      </div>
    </div>
  );

  const stats = [
    { label: 'Total Revenue', value: `₹${parseFloat(data?.stats.total_revenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', trend: '+12.5%' },
    { label: 'Total Orders', value: data?.stats.total_orders, icon: ShoppingBag, color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-100', trend: '+8.2%' },
    { label: 'Active Customers', value: data?.stats.total_customers, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', trend: '+24.1%' },
    { label: 'Products Listed', value: data?.stats.total_products, icon: Package, color: 'text-accent-600', bg: 'bg-accent-50', border: 'border-accent-100', trend: '+4.3%' },
  ];

  return (
    <div className="min-h-screen bg-surface-50 selection:bg-brand-500/30">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-surface-200 animate-slide-up">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30">
                  <Activity size={20} />
                </div>
                <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">Overview</h1>
              </div>
              <p className="text-surface-500 text-lg">Your business at a glance.</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Link href="/admin/products" className="btn-secondary py-2.5 px-5 bg-white shadow-sm border-surface-200 hover:border-brand-300">
                Manage Inventory
              </Link>
              <Link href="/admin/orders" className="btn-primary py-2.5 px-5 shadow-brand-500/25">
                View All Orders
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map(({ label, value, icon: Icon, color, bg, border, trend }, i) => (
              <div key={label} className="bg-white rounded-[2rem] p-6 border border-surface-200 shadow-soft animate-slide-up hover:-translate-y-1 transition-transform duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl ${bg} ${border} border flex items-center justify-center ${color} shadow-inner`}>
                    <Icon strokeWidth={2} size={24} />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold border border-emerald-100">
                    <ArrowUpRight size={14} />
                    {trend}
                  </div>
                </div>
                <div>
                  <p className="text-surface-500 text-sm font-semibold mb-1 uppercase tracking-wider">{label}</p>
                  <p className="font-display text-3xl font-black text-surface-900 tracking-tight">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-10">
            
            {/* Recent Orders */}
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-surface-200 shadow-soft animate-slide-up" style={{ animationDelay: '400ms' }}>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-surface-100">
                <h2 className="font-display text-2xl font-bold text-surface-900">Recent Orders</h2>
                <button className="w-10 h-10 rounded-full flex items-center justify-center text-surface-400 hover:text-brand-600 hover:bg-brand-50 transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {(data?.recent_orders || []).map(order => (
                  <div key={order.id} className="group flex items-center justify-between p-4 rounded-2xl hover:bg-surface-50 border border-transparent hover:border-surface-200 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-surface-100 flex items-center justify-center text-surface-500 font-bold group-hover:bg-brand-100 group-hover:text-brand-600 transition-colors">
                        {order.user_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-surface-900 text-sm">{order.user_name}</p>
                        <p className="text-xs text-surface-500 font-mono mt-0.5">#{order.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-surface-900 text-base mb-1">₹{parseFloat(order.total_amount).toLocaleString()}</p>
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${STATUS_COLORS[order.order_status]}`}>
                        {order.order_status}
                      </span>
                    </div>
                  </div>
                ))}
                {!(data?.recent_orders?.length) && (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 bg-surface-100 rounded-full flex items-center justify-center text-surface-400 mx-auto mb-4">
                      <ShoppingBag size={24} />
                    </div>
                    <p className="text-surface-500 font-medium">No recent orders found.</p>
                  </div>
                )}
              </div>
              
              {(data?.recent_orders?.length > 0) && (
                <Link href="/admin/orders" className="block w-full py-3 text-center text-sm font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl mt-6 transition-colors">
                  View All Orders
                </Link>
              )}
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-[2.5rem] p-6 sm:p-8 border border-surface-200 shadow-soft animate-slide-up" style={{ animationDelay: '500ms' }}>
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-surface-100">
                <h2 className="font-display text-2xl font-bold text-surface-900 flex items-center gap-2">
                  <TrendingUp className="text-brand-500" size={24} /> 
                  Top Performing
                </h2>
                <button className="text-sm font-bold text-brand-600 hover:text-brand-700">Full Report</button>
              </div>
              
              <div className="space-y-4">
                {(data?.top_products || []).map((p, i) => (
                  <div key={p.name} className="flex items-center gap-4 py-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 border
                      ${i === 0 ? 'bg-amber-100 text-amber-600 border-amber-200 shadow-sm' : 
                        i === 1 ? 'bg-slate-200 text-slate-600 border-slate-300 shadow-sm' : 
                        i === 2 ? 'bg-orange-100 text-orange-700 border-orange-200 shadow-sm' : 
                        'bg-surface-50 text-surface-400 border-surface-200'}`}
                    >
                      {i + 1}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-surface-900 text-sm truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="h-1.5 flex-1 bg-surface-100 rounded-full overflow-hidden">
                          <div className="h-full bg-brand-500 rounded-full" style={{ width: `${Math.max(10, 100 - (i * 20))}%` }} />
                        </div>
                        <p className="text-[10px] text-surface-500 font-bold w-16 text-right">{p.total_sold} UNITS</p>
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0">
                      <span className="font-black text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg block">
                        ₹{parseFloat(p.revenue || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
                
                {!(data?.top_products?.length) && (
                  <div className="text-center py-10">
                    <p className="text-surface-400 font-medium">Not enough sales data to compute top products.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
