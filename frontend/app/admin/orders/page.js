'use client';
import { useState, useEffect } from 'react';
import { orderAPI } from '../../../services/api';
import Navbar from '../../../components/layout/Navbar';
import toast from 'react-hot-toast';
import { PackageSearch, Search, SlidersHorizontal, ChevronDown } from 'lucide-react';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  delivered: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getAll().then(res => setOrders(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, { order_status: status });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, order_status: status } : o));
      toast.success('Order status updated');
    } catch { toast.error('Failed to update'); }
  };

  return (
    <div className="min-h-screen bg-surface-50 selection:bg-brand-500/30">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-surface-200 animate-slide-up">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">Orders Management</h1>
              <p className="text-surface-500 mt-2">View and update customer orders.</p>
            </div>
            
            <div className="flex gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-4 h-4 group-focus-within:text-brand-500 transition-colors" />
                <input
                  className="w-full sm:w-64 bg-white border border-surface-200 text-surface-900 pl-10 pr-4 py-2 text-sm rounded-lg focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none"
                  placeholder="Search orders..."
                />
              </div>
              <button className="btn-secondary px-4 py-2 border-surface-200 bg-white shadow-sm flex items-center gap-2">
                <SlidersHorizontal size={16} /> Filters
              </button>
            </div>
          </div>

          {loading ? (
             <div className="flex justify-center py-20">
               <div className="relative w-12 h-12">
                 <div className="absolute inset-0 rounded-full border-t-2 border-brand-500 animate-spin" />
               </div>
             </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-12 text-center border border-surface-200 shadow-sm animate-fade-in">
               <div className="w-20 h-20 bg-surface-50 rounded-full flex items-center justify-center text-surface-400 mx-auto mb-4 border border-surface-100">
                 <PackageSearch size={32} />
               </div>
               <h3 className="font-display text-xl font-bold text-surface-900 mb-2">No Orders Found</h3>
               <p className="text-surface-500 max-w-sm mx-auto">There are currently no orders in the system matching your criteria.</p>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-surface-200 shadow-soft overflow-hidden animate-slide-up">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-50/50 border-b border-surface-200">
                      {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date'].map(h => (
                        <th key={h} className="px-6 py-4 text-[11px] font-bold text-surface-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    {orders.map((o, index) => (
                      <tr key={o.id} className="hover:bg-surface-50/50 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded-md border border-brand-100">
                            #{o.id.slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-surface-900">{o.user_name}</p>
                          <p className="text-xs text-surface-500 mt-0.5">{o.user_email}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-surface-700 bg-surface-100 px-2.5 py-1 rounded-lg">
                            {(o.items || []).length} item{(o.items || []).length !== 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-black text-surface-900">₹{parseFloat(o.total_amount).toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                            o.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {o.payment_status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap relative">
                          <div className={`relative inline-flex items-center rounded-lg border focus-within:ring-2 focus-within:ring-brand-500/20 ${STATUS_COLORS[o.order_status]}`}>
                            <select 
                              value={o.order_status} 
                              onChange={e => updateStatus(o.id, e.target.value)}
                              className="appearance-none bg-transparent py-1.5 pl-3 pr-8 text-xs font-bold uppercase tracking-wider cursor-pointer outline-none"
                            >
                              {STATUSES.map(s => <option key={s} value={s} className="bg-white text-surface-900 tracking-normal normal-case font-medium">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-50" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500 font-medium">
                          {new Date(o.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
