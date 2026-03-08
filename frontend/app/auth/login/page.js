'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../../services/api';
import { useAuthStore } from '../../../hooks/useStore';
import toast from 'react-hot-toast';
import { ArrowRight, Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      setAuth(res.data.user, res.data.token);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      router.push(res.data.user.role === 'admin' ? '/admin/dashboard' : '/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex bg-surface-50 selection:bg-brand-500/30">
      
      {/* Left side: Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-24 xl:px-32 relative z-10 animate-fade-in">
        
        {/* Simple Top Nav for Auth */}
        <div className="absolute top-8 left-6 sm:left-12 lg:left-24 xl:left-32">
          <Link href="/" className="font-display text-2xl font-black tracking-tight text-surface-900 flex items-center gap-2 group relative z-50">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:rotate-12 transition-transform duration-300">
              <span className="w-4 h-4 text-white font-bold">E</span>
            </div>
            Elite<span className="text-brand-600">Bazaar</span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto space-y-10 mt-20 lg:mt-8">
          <div className="space-y-3">
            <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-surface-900">Welcome Back</h1>
            <p className="text-surface-500 text-lg">Enter your details to access your premium account.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5 group">
              <label className="block text-sm font-semibold text-surface-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
                <input type="email" className="w-full bg-white border border-surface-200 text-surface-900 pl-11 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none" placeholder="you@example.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>
            
            <div className="space-y-1.5 group">
              <label className="flex justify-between items-center text-sm font-semibold text-surface-700">
                Password
                <Link href="#" className="font-medium text-brand-600 hover:text-brand-700 text-xs hover:underline transition-all">Forgot password?</Link>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
                <input type="password" className="w-full bg-white border border-surface-200 text-surface-900 pl-11 pr-4 py-3.5 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none" placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
              </div>
            </div>
            
            <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-lg mt-8 group relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-center gap-2">
                {loading ? 'Authenticating...' : 'Sign In'}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </div>
              <div className="absolute top-0 -inset-full h-full w-1/2 z-0 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
            </button>
          </form>

          <p className="text-center text-surface-600 font-medium">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-brand-600 hover:text-brand-700 font-bold ml-1 hover:underline">Create one</Link>
          </p>

          <div className="mt-10 p-5 rounded-2xl border border-brand-100 bg-brand-50/50 text-sm text-surface-600 shadow-inner">
            <div className="font-bold text-surface-900 mb-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              Demo Accounts:
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between bg-white px-3 py-2 rounded-lg border border-brand-50">
                <span className="font-semibold text-brand-700">Admin</span> 
                <span className="font-mono text-xs">admin2@shopwave.com / Admin@123</span>
              </div>
              <div className="flex justify-between bg-white px-3 py-2 rounded-lg border border-brand-50">
                <span className="font-semibold text-brand-700">User</span> 
                <span className="font-mono text-xs">testuser2@shopwave.com / Test@123</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Image showcase */}
      <div className="hidden lg:flex lg:flex-1 relative bg-surface-900 overflow-hidden m-4 rounded-[3rem] animate-fade-in">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center transition-transform duration-1000 hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-brand-900/10 mix-blend-overlay" />
        
        <div className="absolute bottom-16 left-16 right-16 z-10 text-white animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="glass-panel p-8 !border-white/10 !bg-black/30 backdrop-blur-xl">
            <blockquote className="space-y-6">
              <p className="text-3xl font-display font-medium leading-tight">
                &quot;The most seamless shopping experience I&apos;ve ever had. Everything from discovery to checkout is crafted to perfection.&quot;
              </p>
              <footer className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold backdrop-blur-md">
                  A
                </div>
                <div>
                  <div className="font-bold text-lg">Alex Morgan</div>
                  <div className="text-brand-300 text-sm font-medium">Verified Customer</div>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
}
