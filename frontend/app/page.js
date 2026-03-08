import Link from 'next/link';
import Image from 'next/image';
import ProductGrid from '../components/product/ProductGrid';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, Star } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen pt-16 bg-surface-50 selection:bg-brand-500/30">
      
      {/* 1. STUNNING HERO SECTION */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center bg-white border-b border-surface-100">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-brand-300/30 to-accent-300/30 blur-3xl animate-float opacity-70" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-brand-400/20 to-blue-300/20 blur-3xl animate-float opacity-60" style={{ animationDelay: '2s' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-12 lg:gap-8 items-center py-20">
          
          {/* Hero Text Content */}
          <div className="space-y-8 max-w-2xl animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100/50 text-brand-700 text-sm font-semibold shadow-sm">
              <Star className="w-4 h-4 fill-brand-500 text-brand-500" />
              <span>Premium Tech & Fashion Destination</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-surface-900 leading-[1.1] tracking-tight">
              Elevate Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-500">
                Everyday Lifestyle.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-surface-600 leading-relaxed font-light max-w-xl">
              Discover a curated collection of premium gadgets, modern apparel, and home essentials tailored for those who demand absolute excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/products" className="btn-primary px-8 py-4 text-lg group">
                Shop Collection <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/products?category=electronics" className="btn-secondary px-8 py-4 text-lg">
                Explore Tech
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-6 border-t border-surface-200 mt-8">
               <div className="flex -space-x-3">
                 {[1,2,3,4].map((i) => (
                   <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-surface-200 overflow-hidden relative">
                      <Image src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80`} alt="avatar" fill className="object-cover" />
                   </div>
                 ))}
               </div>
               <div className="text-sm">
                 <div className="flex items-center gap-1 text-orange-500 font-bold">
                   <Star className="w-4 h-4 fill-current"/> 4.9/5
                 </div>
                 <div className="text-surface-500 font-medium whitespace-nowrap">from 10k+ reviews</div>
               </div>
            </div>
          </div>

          {/* Hero Image Showcase (Redesigned) */}
          <div className="relative animate-slide-up lg:ml-auto w-full max-w-lg">
             <div className="relative h-[550px] w-full mt-8 lg:mt-0">
                {/* Main Fashion Image */}
                <div className="absolute top-0 right-0 w-[80%] h-[75%] rounded-[2rem] overflow-hidden glass shadow-2xl p-2 bg-white/40 border border-white/60 z-10 transition-transform duration-500 hover:scale-[1.02]">
                   <div className="w-full h-full rounded-3xl overflow-hidden relative">
                     <Image 
                       src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80" 
                       alt="Premium Fashion" 
                       fill 
                       className="object-cover"
                       priority
                     />
                     <div className="absolute inset-0 bg-gradient-to-t from-surface-900/20 to-transparent mix-blend-multiply"></div>
                   </div>
                </div>
                
                {/* Secondary Tech Image Overlapping */}
                <div className="absolute bottom-4 left-0 w-[60%] h-[50%] rounded-[2rem] overflow-hidden glass shadow-2xl p-2 bg-white/70 border border-white/80 z-20 animate-float" style={{ animationDelay: '1s' }}>
                   <div className="w-full h-full rounded-3xl overflow-hidden relative">
                     <Image 
                       src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80" 
                       alt="Premium Tech" 
                       fill 
                       className="object-cover"
                     />
                   </div>
                </div>

                {/* Floating Premium Badge */}
                <div className="absolute top-[40%] -left-8 glass bg-white/95 p-4 rounded-2xl animate-float shadow-xl hidden md:flex items-center gap-3 z-30" style={{ animationDelay: '2s' }}>
                   <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100 shadow-inner">
                     <Star className="w-5 h-5 fill-brand-500" />
                   </div>
                   <div>
                     <div className="text-sm font-bold text-surface-900">Premium Curated</div>
                     <div className="text-xs text-surface-500 font-medium tracking-wide">100% Authentic Quality</div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITIONS */}
      <section className="py-20 bg-surface-50 relative">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: "Lightning Fast Delivery", desc: "Get your products delivered within 24 hours across major cities." },
              { icon: ShieldCheck, title: "100% Secure Payments", desc: "Your transactions are protected by bank-level encryption." },
              { icon: ShoppingBag, title: "Curated Excellence", desc: "Every single product is hand-picked for maximum quality." },
            ].map((prop, i) => (
              <div key={i} className="card p-8 group hover:border-brand-300 hover:-translate-y-1 transition-all duration-300 bg-white">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-6 group-hover:bg-gradient-to-br group-hover:from-brand-600 group-hover:to-brand-500 group-hover:text-white transition-all duration-500 shadow-sm">
                  <prop.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-surface-900 mb-3">{prop.title}</h3>
                <p className="text-surface-600 leading-relaxed font-light">{prop.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES */}
      <section className="py-24 bg-white relative border-y border-surface-100">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-b from-brand-50/50 to-transparent -z-10 skew-x-12 transform origin-top" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="font-display text-4xl font-bold text-surface-900 tracking-tight">Shop by Category</h2>
            <p className="text-surface-500 mt-4 text-lg font-light">Explore our extensive collection of premium items organized just for you.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { name: 'Electronics', icon: '💻', color: 'bg-blue-50 text-blue-600 border-blue-100' },
              { name: 'Clothing', icon: '✨', color: 'bg-violet-50 text-violet-600 border-violet-100' },
              { name: 'Books', icon: '📚', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
              { name: 'Home & Kitchen', icon: '🛋️', color: 'bg-orange-50 text-orange-600 border-orange-100' },
              { name: 'Sports', icon: '🏃', color: 'bg-rose-50 text-rose-600 border-rose-100' }
            ].map((cat) => (
              <Link key={cat.name} href={`/products?category=${cat.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`}
                className="card p-8 flex flex-col items-center justify-center text-center hover:shadow-soft hover:-translate-y-2 transition-all duration-300 group border border-surface-100 hover:border-brand-200">
                <div className={`w-16 h-16 rounded-2xl ${cat.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm border`}>
                  {cat.icon}
                </div>
                <span className="font-semibold text-surface-800 text-lg group-hover:text-brand-600 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRENDING PRODUCTS */}
      <section className="py-24 bg-surface-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="font-display text-4xl font-bold text-surface-900 tracking-tight">Trending Now</h2>
              <p className="text-surface-500 mt-2 text-lg font-light">Handpicked essentials everyone is talking about.</p>
            </div>
            <Link href="/products" className="group flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700 transition-colors pb-1 border-b border-transparent hover:border-brand-600">
              View Entire Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <ProductGrid limit={8} />
        </div>
      </section>

      {/* 5. IMMERSIVE CTA */}
      <section className="relative py-32 overflow-hidden mx-4 sm:mx-8 mb-12 rounded-[3rem]">
        <div className="absolute inset-0 bg-surface-950" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=2000')] opacity-30 bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-surface-950/80 to-transparent" />
        
        <div className="relative max-w-4xl mx-auto px-6 text-center text-white z-10 glass-dark rounded-[2.5rem] p-12 lg:p-16 border-white/10 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold mb-8 backdrop-blur-md">
            Join the Revolution
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight drop-shadow-md text-white leading-tight">
            Ready to upgrade your<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-accent-400">Shopping Experience?</span>
          </h2>
          <p className="text-surface-300 text-lg md:text-xl mb-10 leading-relaxed font-light max-w-2xl mx-auto">
            Create an account today to get free next-day delivery, exclusive early access to drops, and seamless 30-day returns.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/register" className="btn-primary shadow-xl shadow-brand-500/30 px-10 py-4 text-lg border border-brand-400/50">
              Create Free Account
            </Link>
            <Link href="/products" className="btn-secondary bg-white/10 text-white border-white/20 hover:bg-white/20 hover:border-white/30 px-10 py-4 text-lg backdrop-blur-md">
              Start Shopping
            </Link>
          </div>
        </div>
      </section>
      
    </div>
  );
}
