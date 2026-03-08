'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import { cartAPI, orderAPI, paymentAPI } from '../../services/api';
import { useAuthStore } from '../../hooks/useStore';
import { MapPin, CreditCard, CheckCircle, ShieldCheck, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [address, setAddress] = useState({
    full_name: user?.name || '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India',
  });

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return; }
    loadCart();
  }, [user]);

  const loadCart = async () => {
    try {
      const res = await cartAPI.get();
      if (!res.data.items || res.data.items.length === 0) {
        router.push('/cart');
        return;
      }
      setCart(res.data);
    } catch {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    setAddress(a => ({ ...a, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    if (!address.full_name || !address.address_line1 || !address.city || !address.postal_code) {
      toast.error('Please fill all required address fields');
      return;
    }

    setProcessing(true);
    try {
      // Create order
      const orderRes = await orderAPI.create({ shipping_address: address });
      const order = orderRes.data;

      // Create Razorpay payment order
      const paymentRes = await paymentAPI.createOrder({ order_id: order.id });
      const { razorpay_order_id, amount, key } = paymentRes.data;

      // Launch Razorpay checkout
      const options = {
        key: key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: 'INR',
        name: 'ShopWave Premium',
        description: `Order #${order.id.slice(0, 8)}`,
        order_id: razorpay_order_id,
        handler: async (response) => {
          try {
            await paymentAPI.verify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order.id,
            });
            toast.success('Order placed successfully!');
            router.push(`/orders/${order.id}`);
          } catch {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: address.full_name,
          contact: address.phone,
        },
        theme: { color: '#6366f1' }, // brand-500
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => toast.error('Payment failed. Please try again.'));
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !cart) return (
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

  const shipping = cart.total > 999 ? 0 : 49;
  const grandTotal = cart.total + shipping;

  return (
    <div className="min-h-screen bg-surface-50 selection:bg-brand-500/30">
      <Navbar />
      {/* Load Razorpay SDK */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-200">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-surface-900 tracking-tight">Secure Checkout</h1>
            <div className="flex items-center gap-2 text-surface-500 text-sm font-medium bg-surface-100 px-3 py-1.5 rounded-full border border-surface-200">
              <Lock className="w-4 h-4" /> SSL Encrypted
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 xl:gap-12">
            
            {/* Address Form */}
            <div className="lg:col-span-2 space-y-8 animate-slide-up">
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-surface-200 shadow-soft">
                
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-surface-100">
                  <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-600 shadow-inner">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-bold text-surface-900 tracking-tight">Shipping Details</h2>
                    <p className="text-surface-500 text-sm">Where should we send your premium order?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-surface-700">Full Name *</label>
                    <input name="full_name" value={address.full_name} onChange={handleAddressChange} className="w-full bg-surface-50 border border-surface-200 text-surface-900 text-sm rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 block p-3.5 transition-all outline-none" placeholder="Jane Doe" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-surface-700">Phone Number *</label>
                    <input name="phone" value={address.phone} onChange={handleAddressChange} className="w-full bg-surface-50 border border-surface-200 text-surface-900 text-sm rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 block p-3.5 transition-all outline-none" placeholder="+91 98765 43210" />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-sm font-semibold text-surface-700">Street Address *</label>
                    <input name="address_line1" value={address.address_line1} onChange={handleAddressChange} className="w-full bg-surface-50 border border-surface-200 text-surface-900 text-sm rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 block p-3.5 transition-all outline-none" placeholder="House/Flat No., Building Name, Street" />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="block text-sm font-semibold text-surface-700">Landmark & Apartment (Optional)</label>
                    <input name="address_line2" value={address.address_line2} onChange={handleAddressChange} className="w-full bg-surface-50 border border-surface-200 text-surface-900 text-sm rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 block p-3.5 transition-all outline-none" placeholder="Near Apollo Hospital, Apt 4B" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-surface-700">City *</label>
                    <input name="city" value={address.city} onChange={handleAddressChange} className="w-full bg-surface-50 border border-surface-200 text-surface-900 text-sm rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 block p-3.5 transition-all outline-none" placeholder="Mumbai" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-surface-700">State *</label>
                    <input name="state" value={address.state} onChange={handleAddressChange} className="w-full bg-surface-50 border border-surface-200 text-surface-900 text-sm rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 block p-3.5 transition-all outline-none" placeholder="Maharashtra" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-surface-700">PIN Code *</label>
                    <input name="postal_code" value={address.postal_code} onChange={handleAddressChange} className="w-full bg-surface-50 border border-surface-200 text-surface-900 text-sm rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 block p-3.5 transition-all outline-none tracking-widest" placeholder="400001" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-surface-700">Country</label>
                    <input name="country" value={address.country} onChange={handleAddressChange} className="w-full bg-surface-100 border border-surface-200 text-surface-500 text-sm rounded-xl p-3.5 outline-none cursor-not-allowed font-medium" readOnly />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="w-full">
              <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-surface-200 shadow-soft sticky top-28 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <h2 className="font-display text-xl font-bold text-surface-900 mb-6 pb-4 border-b border-surface-100">Your Order</h2>
                
                {/* Items preview */}
                <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {cart.items.map(item => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-16 h-16 rounded-xl bg-surface-50 overflow-hidden shrink-0 border border-surface-100">
                        <img src={item.image_url || 'https://via.placeholder.com/100'} alt={item.name} className="w-full h-full object-cover" />
                        <span className="absolute -top-2 -right-2 bg-brand-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-white">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-surface-900 text-sm leading-tight mb-1 truncate">{item.name}</p>
                        <p className="font-bold text-brand-600 text-sm">₹{parseFloat(item.subtotal).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Totals */}
                <div className="space-y-3 pt-6 border-t border-surface-200 mb-8">
                  <div className="flex justify-between items-center text-sm font-medium text-surface-600">
                    <span>Subtotal</span>
                    <span className="text-surface-900">₹{parseFloat(cart.total).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium text-surface-600">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-emerald-600 font-bold">Free Delivery</span>
                    ) : (
                      <span className="text-surface-900">₹{shipping}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-end pt-4 border-t border-surface-100 mt-2">
                    <div>
                      <span className="block font-bold text-surface-900 text-base">Total</span>
                      <span className="text-xs text-surface-500 font-medium">INR</span>
                    </div>
                    <span className="font-black text-2xl text-surface-900 tracking-tight">₹{parseFloat(grandTotal).toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="btn-primary w-full py-4 text-center group relative overflow-hidden"
                >
                  <div className="relative z-10 flex items-center justify-center gap-2 text-lg">
                    {processing ? (
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                    {processing ? 'Processing Securely...' : 'Pay Securely'}
                  </div>
                  {/* Subtle shine effect */}
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
                </button>
                
                <div className="mt-5 space-y-3">
                  <div className="flex items-center justify-center gap-2 text-xs font-medium text-surface-500 bg-surface-50 p-2.5 rounded-xl border border-surface-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Payments processed securely by <span className="text-surface-700 font-bold">Razorpay</span></span>
                  </div>
                  <p className="text-[10px] text-center text-surface-400">By placing this order, you agree to our Terms of Service and Privacy Policy.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
