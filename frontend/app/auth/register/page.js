'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../../services/api';
import { useAuthStore } from '../../../hooks/useStore';
import toast from 'react-hot-toast';
import { ArrowRight, Mail, Lock, User, Phone } from 'lucide-react';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'customer' });
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await authAPI.register(form);
      setAuth(res.data.user, res.data.token);
      toast.success('Account created successfully!');
      router.push((res.data.user.role === 'admin') ? '/admin/dashboard' : '/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  const getIcon = (key) => {
    switch (key) {
      case 'name': return <User className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />;
      case 'email': return <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />;
      case 'phone': return <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />;
      case 'password': return <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-50 selection:bg-brand-500/30">
      
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 xl:px-32 relative z-10 animate-fade-in py-12">
        
        {/* Simple Top Nav for Auth */}
        <div className="absolute top-8 left-6 sm:left-12 lg:left-24 xl:left-32">
          <Link href="/" className="font-display text-2xl font-black tracking-tight text-surface-900 flex items-center gap-2 group relative z-50">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:-rotate-12 transition-transform duration-300">
              <span className="w-4 h-4 text-white font-bold">E</span>
            </div>
            Elite<span className="text-brand-600">Bazaar</span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto space-y-10 mt-20 lg:mt-8">
          <div className="space-y-3">
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-surface-900">Create Account</h1>
            <p className="text-surface-500 text-lg">Join the ShopWave premium experience today.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {[
              ['name', 'Full Name', 'John Doe', 'text'],
              ['email', 'Email Address', 'you@example.com', 'email'],
              ['phone', 'Phone Number (Optional)', '+91 98765 43210', 'tel'],
              ['password', 'Password', 'At least 6 characters', 'password']
            ].map(([key, label, placeholder, type]) => (
              <div key={key} className="space-y-1.5 group">
                <label className="block text-sm font-semibold text-surface-700">{label}</label>
                <div className="relative">
                  {getIcon(key)}
                  <input type={type} className="w-full bg-white border border-surface-200 text-surface-900 pl-11 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none" placeholder={placeholder}
                    value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} required={key !== 'phone'} />
                </div>
              </div>
            ))}
            
            {/* Role Selection */}
            <div className="space-y-2 mt-2">
              <label className="block text-sm font-semibold text-surface-700">Account Type</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${form.role === 'customer' ? 'border-brand-500 bg-brand-50 text-brand-700 font-bold' : 'border-surface-200 text-surface-600 hover:border-surface-300'}`}>
                  <input type="radio" name="role" value="customer" className="hidden" checked={form.role === 'customer'} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                  Customer
                </label>
                <label className={`flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all ${form.role === 'admin' ? 'border-brand-500 bg-brand-50 text-brand-700 font-bold' : 'border-surface-200 text-surface-600 hover:border-surface-300'}`}>
                  <input type="radio" name="role" value="admin" className="hidden" checked={form.role === 'admin'} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                  Admin
                </label>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg mt-8 group relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </div>
              <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
            </button>
          </form>

          <p className="text-center text-surface-600 font-medium">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-brand-600 hover:text-brand-700 font-bold ml-1 hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      {/* Right side: Image showcase */}
      <div className="hidden lg:flex lg:flex-1 relative bg-surface-900 overflow-hidden m-4 rounded-[3rem] animate-fade-in">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center transition-transform duration-1000 hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-brand-900/10 mix-blend-overlay" />
        
        <div className="absolute bottom-16 left-16 right-16 z-10 text-white animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="glass-panel p-8 !border-white/10 !bg-black/30 backdrop-blur-xl">
            <h2 className="text-3xl font-display font-medium leading-tight mb-4">
              Unlock premium features, exclusive drops, and lightning-fast free shipping.
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-surface-900 bg-surface-200 bg-[url('https://i.pravatar.cc/100?img=1')] bg-cover" />
                <div className="w-10 h-10 rounded-full border-2 border-surface-900 bg-surface-300 bg-[url('https://i.pravatar.cc/100?img=2')] bg-cover" />
                <div className="w-10 h-10 rounded-full border-2 border-surface-900 bg-surface-400 bg-[url('https://i.pravatar.cc/100?img=3')] bg-cover" />
                <div className="w-10 h-10 rounded-full border-2 border-surface-900 bg-brand-500 flex items-center justify-center text-xs font-bold text-white">
                  10k+
                </div>
              </div>
              <span className="text-brand-200 text-sm font-medium">Join 10,000+ premium members</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
