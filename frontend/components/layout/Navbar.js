'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore, useCartStore } from '../../hooks/useStore';
import { ShoppingCart, User, Search, Menu, X, LogOut, LayoutDashboard, Package, ChevronDown, Crown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { items } = useCartStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  const cartCount = items.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'All Products', href: '/products' },
    { name: 'Electronics', href: '/products?category=electronics' },
    { name: 'Clothing', href: '/products?category=clothing' },
  ];

  if (pathname?.startsWith('/auth')) {
    return null;
  }

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-surface-200/50 py-3' : 'bg-white/50 backdrop-blur-sm border-b border-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="font-display text-2xl font-black tracking-tight text-surface-900 flex items-center gap-2 group relative z-50">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 group-hover:rotate-12 transition-transform duration-300">
                <Crown className="w-4 h-4 text-white" />
              </div>
              Elite<span className="text-brand-600">Bazaar</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center bg-surface-100/50 rounded-full px-2 py-1.5 border border-surface-200/50 backdrop-blur-md">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`px-4 py-2 text-sm font-bold rounded-full transition-all ${
                    pathname === link.href || (pathname === '/products' && link.href.includes('category=') && typeof window !== 'undefined' && window.location.search === link.href.split('?')[1])
                      ? 'bg-white text-brand-600 shadow-sm' 
                      : 'text-surface-600 hover:text-surface-900 hover:bg-white/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2 relative z-50">
              
              <Link href="/products" className="w-10 h-10 rounded-full flex items-center justify-center text-surface-600 hover:bg-surface-100 hover:text-brand-600 transition-colors">
                <Search size={20} />
              </Link>

              {(!user || user.role !== 'admin') && (
                <Link href="/cart" className="relative w-10 h-10 rounded-full flex items-center justify-center text-surface-600 hover:bg-surface-100 hover:text-brand-600 transition-colors">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 translate-x-1/2 -translate-y-1/2 bg-brand-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}

              {user ? (
                <div className="relative group ml-1 hidden sm:block">
                  <button className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-surface-200 hover:border-brand-200 hover:bg-brand-50 transition-all">
                    <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs uppercase">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-bold text-surface-700">{user.name.split(' ')[0]}</span>
                    <ChevronDown size={14} className="text-surface-400 group-hover:text-brand-500 transition-colors" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right group-hover:scale-100 scale-95">
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-surface-100 p-2 overflow-hidden">
                      <div className="px-4 py-3 border-b border-surface-100 mb-2">
                        <p className="text-sm font-bold text-surface-900">{user.name}</p>
                        <p className="text-xs text-surface-500 truncate">{user.email}</p>
                      </div>
                      
                      <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50 hover:text-brand-600 rounded-xl transition-colors">
                        <Package size={18} className="text-surface-400" /> My Orders
                      </Link>
                      
                      {(user.role === 'admin' || user.role === 'manager' || user.role === 'seller') && (
                        <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-surface-700 hover:bg-surface-50 hover:text-brand-600 rounded-xl transition-colors">
                          <LayoutDashboard size={18} className="text-surface-400" /> Admin Dashboard
                        </Link>
                      )}
                      
                      <div className="h-px bg-surface-100 my-2 mx-2" />
                      
                      <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left">
                        <LogOut size={18} className="text-red-400" /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link href="/auth/login" className="btn-primary py-2 px-5 text-sm ml-2 hidden sm:flex">
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-surface-600 hover:bg-surface-100 hover:text-brand-600 transition-colors" 
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-surface-900/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setMenuOpen(false)} />
      
      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white shadow-2xl transition-transform duration-300 transform md:hidden flex flex-col ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-surface-100">
           <span className="font-display text-xl font-bold text-surface-900">Menu</span>
           <button onClick={() => setMenuOpen(false)} className="p-2 -mr-2 text-surface-400 hover:text-brand-600 bg-surface-50 rounded-full">
             <X size={20} />
           </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {user && (
            <div className="px-4 py-4 mb-4 bg-brand-50 rounded-2xl border border-brand-100">
              <p className="text-sm font-bold text-brand-900">{user.name}</p>
              <p className="text-xs text-brand-600 truncate">{user.email}</p>
            </div>
          )}
          
          <div className="px-3 pb-2 text-xs font-bold uppercase tracking-wider text-surface-400">Navigation</div>
          {navLinks.map(link => (
            <Link key={link.name} href={link.href} className="block px-4 py-3 text-base font-medium text-surface-700 hover:bg-surface-50 hover:text-brand-600 rounded-xl transition-colors">
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <>
              <div className="px-3 pt-4 pb-2 text-xs font-bold uppercase tracking-wider text-surface-400">Account</div>
              <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-base font-medium text-surface-700 hover:bg-surface-50 hover:text-brand-600 rounded-xl transition-colors">
                <Package size={20} className="text-brand-500" /> My Orders
              </Link>
              {(user.role === 'admin' || user.role === 'manager' || user.role === 'seller') && (
                <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-base font-medium text-surface-700 hover:bg-surface-50 hover:text-brand-600 rounded-xl transition-colors">
                  <LayoutDashboard size={20} className="text-brand-500" /> Admin Dashboard
                </Link>
              )}
            </>
          ) : null}
        </div>
        
        <div className="p-6 border-t border-surface-100 bg-surface-50 shrink-0">
          {user ? (
            <button onClick={logout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-xl transition-colors">
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <Link href="/auth/login" className="btn-primary w-full py-3 shadow-brand-500/25">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
