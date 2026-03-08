'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { orderAPI } from '../../services/api';
import { Package, ChevronRight } from 'lucide-react';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getAll().then(res => setOrders(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-stone-400">Loading orders...</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display text-4xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package size={64} className="text-stone-200 mx-auto mb-4" />
          <p className="text-xl font-medium text-stone-500">No orders yet</p>
          <Link href="/products" className="btn-primary inline-block mt-4">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-stone-400 font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm text-stone-500 mt-1">{new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <span className={`badge ${STATUS_COLORS[order.order_status] || 'bg-stone-100 text-stone-600'} capitalize`}>
                  {order.order_status}
                </span>
              </div>
              <div className="flex gap-2 mb-4">
                {(order.items || []).slice(0, 3).map(item => (
                  <div key={item.id} className="text-sm text-stone-600 bg-stone-50 px-3 py-1 rounded-lg">
                    {item.name} × {item.quantity}
                  </div>
                ))}
                {(order.items || []).length > 3 && (
                  <span className="text-sm text-stone-400 px-3 py-1">+{order.items.length - 3} more</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">₹{parseFloat(order.total_amount).toLocaleString()}</span>
                <span className={`badge ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} capitalize`}>
                  {order.payment_status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
