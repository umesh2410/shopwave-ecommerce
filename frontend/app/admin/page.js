'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/layout/Navbar';
import { adminAPI } from '../../services/api';
import { useAuthStore } from '../../hooks/useStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, ShoppingBag, DollarSign, Package, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const { user, isManager, initialize } = useAuthStore();
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!isManager()) { router.push('/'); return; }
    loadAnalytics();
  }, [user]);

  const loadAnalytics = async () => {
    try {
      const res = await adminAPI.getAnalytics();
      setAnalytics(res.data.data);
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="pt-16 flex items-center justify-center min-h-screen">
        <div className="animate-spin w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full" />
      </div>
    </>
  );

  if (!analytics) return null;

  const { summary, topProducts, recentOrders, ordersByStatus, monthlySales } = analytics;

  const chartData = monthlySales.map(m => ({
    month: new Date(m.month).toLocaleDateString('en', { month: 'short' }),
    orders: parseInt(m.orders),
    revenue: parseFloat(m.revenue),
  }));

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-500 mt-1">Welcome back, {user?.name}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/products" className="btn-secondary !py-2">Manage Products</Link>
              <Link href="/admin/orders" className="btn-primary !py-2">Manage Orders</Link>
            </div>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {[
              { label: 'Total Orders', value: summary.totalOrders.toLocaleString(), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Total Revenue', value: `₹${summary.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Top Products', value: topProducts.length, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
              { label: 'Order Statuses', value: ordersByStatus.length, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-500">{label}</span>
                  <div className={`w-9 h-9 ${bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Monthly sales chart */}
            <div className="lg:col-span-2 card p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Monthly Revenue (Last 6 Months)</h2>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(val, name) => name === 'revenue' ? `₹${val.toLocaleString()}` : val} />
                    <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-56 flex items-center justify-center text-slate-400">No data yet</div>
              )}
            </div>

            {/* Order status breakdown */}
            <div className="card p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Orders by Status</h2>
              <div className="space-y-3">
                {ordersByStatus.map(s => (
                  <div key={s.order_status} className="flex items-center justify-between">
                    <span className={`badge ${STATUS_COLORS[s.order_status] || 'bg-slate-100 text-slate-700'} capitalize`}>
                      {s.order_status}
                    </span>
                    <span className="font-bold text-slate-900">{s.count}</span>
                  </div>
                ))}
                {ordersByStatus.length === 0 && <p className="text-slate-400 text-sm">No orders yet</p>}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Top products */}
            <div className="card p-6">
              <h2 className="font-semibold text-slate-900 mb-4">Top Selling Products</h2>
              <div className="space-y-3">
                {topProducts.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-slate-400 font-bold w-5">#{i + 1}</span>
                    <img src={p.image_url || 'https://via.placeholder.com/40'} alt={p.name} className="w-10 h-10 object-cover rounded-lg" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{p.name}</p>
                      <p className="text-xs text-slate-500">{p.units_sold} sold</p>
                    </div>
                    <span className="text-sm font-bold text-slate-900">₹{parseFloat(p.revenue).toLocaleString()}</span>
                  </div>
                ))}
                {topProducts.length === 0 && <p className="text-slate-400 text-sm">No sales yet</p>}
              </div>
            </div>

            {/* Recent orders */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-900">Recent Orders</h2>
                <Link href="/admin/orders" className="text-sm text-brand-600 hover:text-brand-700 flex items-center gap-1">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentOrders.slice(0, 5).map(o => (
                  <div key={o.id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{o.customer_name}</p>
                      <p className="text-xs text-slate-400">#{o.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">₹{parseFloat(o.total_amount).toLocaleString()}</p>
                      <span className={`badge text-xs ${STATUS_COLORS[o.order_status]} capitalize`}>{o.order_status}</span>
                    </div>
                  </div>
                ))}
                {recentOrders.length === 0 && <p className="text-slate-400 text-sm">No orders yet</p>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
