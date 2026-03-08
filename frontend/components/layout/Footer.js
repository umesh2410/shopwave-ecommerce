import Link from 'next/link';
import { Crown } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface-950 text-surface-400 mt-auto border-t border-surface-900 overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-500/50 to-transparent opacity-50" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
        <div className="lg:pr-8">
          <Link href="/" className="font-display text-3xl font-black tracking-tight text-white flex items-center gap-2 mb-6 group inline-flex">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20 group-hover:-rotate-12 transition-transform duration-300">
              <Crown className="w-5 h-5 text-white" />
            </div>
            Elite<span className="text-brand-500">Bazaar</span>
          </Link>
          <p className="text-surface-400 text-sm leading-relaxed mb-6">
            A premium e-commerce platform offering meticulously curated products and an exceptional, seamless customer experience from discovery to delivery.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Curated Categories</h4>
          <ul className="space-y-3">
            {['Electronics', 'Clothing & Apparel', 'Books & Literature', 'Home & Kitchen', 'Sports & Outdoors'].map(c => (
              <li key={c}>
                <Link href={`/products?category=${c.split(' ')[0].toLowerCase()}`} className="text-surface-400 hover:text-brand-400 transition-colors inline-block hover:translate-x-1 duration-300">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Customer Account</h4>
          <ul className="space-y-3">
            {[
              { label: 'Secure Login', path: '/auth/login' },
              { label: 'Create Account', path: '/auth/register' },
              { label: 'Track Orders', path: '/orders' },
              { label: 'Saved Items', path: '/cart' },
            ].map(link => (
              <li key={link.label}>
                <Link href={link.path} className="text-surface-400 hover:text-brand-400 transition-colors inline-block hover:translate-x-1 duration-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Dedicated Support</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-brand-500 text-lg leading-none">✉</span>
              <div>
                <span className="block text-white font-medium mb-0.5">Email Us</span>
                <a href="mailto:makwanau2410@gmail.com" className="hover:text-brand-400 transition-colors">support@elitebazaar.com</a>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-500 text-lg leading-none">✆</span>
              <div>
                <span className="block text-white font-medium mb-0.5">Call Us</span>
                <a href="tel:9428086555" className="hover:text-brand-400 transition-colors">1800-123-4567</a>
              </div>
            </li>
            {/* <li className="flex items-start gap-3">
              <span className="text-brand-500 text-lg leading-none">🕐</span>
              <div>
                <span className="block text-white font-medium mb-0.5">Hours</span>
                <span>Mon–Sat, 9AM–6PM EST</span>
              </div>
            </li> */}
          </ul>
        </div>
      </div>
      
      <div className="border-t border-surface-900/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-surface-500 text-sm">
            © {new Date().getFullYear()} EliteBazaar. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-surface-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
