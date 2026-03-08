'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../../components/layout/Navbar';
import { orderAPI } from '../../../services/api';
import { useAuthStore } from '../../../hooks/useStore';
import { ArrowLeft, MapPin, Package, CheckCircle, Clock, Truck } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    loadOrder();
  }, [user]);

  const loadOrder = async () => {
    try {
      const res = await orderAPI.getOne(id);
      setOrder(res.data.data);
    } catch {
      toast.error('Order not found');
      router.push('/orders');
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

  if (!order) return null;

  const stepIndex = STATUS_STEPS.indexOf(order.order_status);
  const addr = order.shipping_address;

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>

          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">Order Details</h1>
              <p className="text-slate-500 text-sm mt-1">#{order.id.slice(0, 8).toUpperCase()} · {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`badge capitalize ${STATUS_COLORS[order.order_status]}`}>{order.order_status}</span>
              <span className={`badge capitalize ${order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.payment_status}</span>
            </div>
          </div>

          {/* Progress tracker */}
          {order.order_status !== 'cancelled' && (
            <div className="card p-6 mb-6">
              <div className="flex items-center justify-between relative">
                <div className="absolute top-5 left-0 right-0 h-1 bg-slate-100 z-0">
                  <div
                    className="h-full bg-brand-500 transition-all"
                    style={{ width: `${(stepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                  />
                </div>
                {STATUS_STEPS.map((step, i) => (
                  <div key={step} className="flex flex-col items-center z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${i <= stepIndex ? 'bg-brand-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                      {i < stepIndex ? <CheckCircle className="w-5 h-5" /> : i === stepIndex ? <Clock className="w-5 h-5" /> : <div className="w-3 h-3 rounded-full bg-current" />}
                    </div>
                    <span className={`text-xs mt-2 font-medium capitalize ${i <= stepIndex ? 'text-brand-600' : 'text-slate-400'}`}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="card p-6 mb-4">
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-brand-500" /> Items Ordered
            </h2>
            <div className="space-y-4">
              {(order.items || []).map(item => (
                <div key={item.id} className="flex gap-4">
                  <img
                    src={item.image_url || 'https://via.placeholder.com/60'}
                    alt={item.product_snapshot?.name || item.name}
                    className="w-16 h-16 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{item.product_snapshot?.name || item.name}</p>
                    <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-slate-900">₹{(parseFloat(item.price) * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-slate-100 mt-4 pt-4 flex justify-between">
              <span className="font-bold text-slate-900">Total</span>
              <span className="font-bold text-lg text-brand-600">₹{parseFloat(order.total_amount).toLocaleString()}</span>
            </div>
          </div>

          {/* Shipping Address */}
          {addr && (
            <div className="card p-6">
              <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-500" /> Shipping Address
              </h2>
              <div className="text-slate-600 text-sm leading-relaxed">
                <p className="font-medium text-slate-900">{addr.full_name}</p>
                {addr.phone && <p>{addr.phone}</p>}
                <p>{addr.address_line1}</p>
                {addr.address_line2 && <p>{addr.address_line2}</p>}
                <p>{addr.city}, {addr.state} {addr.postal_code}</p>
                <p>{addr.country}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
