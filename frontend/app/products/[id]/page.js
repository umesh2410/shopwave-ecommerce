'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/layout/Navbar';
import { productAPI, cartAPI, reviewAPI } from '../../../services/api';
import { useAuthStore } from '../../../hooks/useStore';
import { ShoppingCart, Zap, Star, Shield, Truck, Minus, Plus, ArrowLeft, Heart, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const res = await productAPI.getOne(id);
      setProduct(res.data);
      
      const revRes = await reviewAPI.getForProduct(id);
      setReviews(revRes.data);
    } catch {
      toast.error('Product not found');
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login first'); return; }
    setAdding(true);
    try {
      await cartAPI.add({ product_id: product.id, quantity });
      toast.success(`${quantity} item(s) added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) { router.push('/auth/login'); return; }
    await handleAddToCart();
    router.push('/cart');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to submit a review'); return; }
    
    setSubmittingReview(true);
    try {
      await reviewAPI.create(id, { rating: reviewRating, comment: reviewText });
      toast.success('Review submitted successfully!');
      setReviewText('');
      setReviewRating(5);
      // Reload product and reviews
      loadProduct();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50">
        <Navbar />
        <div className="pt-32 pb-20 flex items-center justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-t-2 border-brand-500 animate-spin" />
            <div className="absolute inset-2 rounded-full border-r-2 border-accent-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.7s'}} />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null;

  return (
    <div className="min-h-screen bg-surface-50 selection:bg-brand-500/30">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-surface-500 mb-8 font-medium">
            <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-brand-600 transition-colors">Products</Link>
            <span>/</span>
            <span className="text-surface-900 line-clamp-1 max-w-xs">{product.name}</span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
            {/* Left: Sticky Image Showcase */}
            <div className="w-full lg:w-1/2">
              <div className="sticky top-28">
                <div className="relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full bg-white rounded-[2rem] overflow-hidden border border-surface-200/50 shadow-soft group">
                  <img
                    src={product.image_url || `https://via.placeholder.com/800x1000?text=${encodeURIComponent(product.name)}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  
                  {/* Floating Action Buttons */}
                  <div className="absolute top-6 right-6 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0">
                    <button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-surface-600 hover:text-red-500 hover:bg-white transition-all transform hover:scale-110">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="w-12 h-12 rounded-full bg-white/90 backdrop-blur shadow-lg flex items-center justify-center text-surface-600 hover:text-brand-600 hover:bg-white transition-all transform hover:scale-110">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Product Information */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <div className="animate-slide-up">
                
                {/* Meta Tags */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  {discount > 0 && (
                    <span className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold tracking-wide shadow-sm border border-red-100">
                      SAVE {discount}%
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full bg-surface-100 text-surface-600 text-xs font-semibold tracking-wide border border-surface-200">
                    {product.category_name}
                  </span>
                  <div className="flex items-center gap-1.5 ml-auto sm:ml-0 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                     <Star className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                     <span className="text-xs font-bold text-orange-700">{Math.round(product.rating || 0)}</span>
                     <span className="text-xs font-medium text-orange-600/70">({product.review_count || 0})</span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="font-display text-4xl sm:text-5xl font-extrabold text-surface-900 leading-[1.1] tracking-tight mb-6">
                  {product.name}
                </h1>

                {/* Price Block */}
                <div className="flex items-end gap-4 mb-8 pb-8 border-b border-surface-200">
                  <div className="flex flex-col">
                    <span className="text-sm text-surface-500 font-medium mb-1">Current Price</span>
                    <span className="text-4xl sm:text-5xl font-bold text-surface-900 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-surface-900 to-surface-700">
                      ₹{parseFloat(product.price).toLocaleString()}
                    </span>
                  </div>
                  {product.compare_price && (
                    <div className="flex flex-col pb-1.5">
                       <span className="text-xl sm:text-2xl text-surface-400 line-through decoration-surface-300 font-medium">
                        ₹{parseFloat(product.compare_price).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-3 mb-8">
                  <div className={`relative flex h-3 w-3`}>
                    {product.stock > 0 && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${product.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  </div>
                  <span className={`text-sm font-semibold tracking-wide uppercase ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of stock'}
                  </span>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="mb-10">
                    <h3 className="text-sm font-semibold text-surface-900 uppercase tracking-wider mb-4">About this product</h3>
                    <p className="text-surface-600 leading-relaxed font-light text-lg">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Actions Form */}
                {(!user || user.role !== 'admin') && (
                  <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-surface-200 shadow-soft mb-10">
                    {/* Quantity */}
                    {product.stock > 0 && (
                      <div className="mb-8">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-semibold text-surface-900 tracking-wide uppercase">Select Quantity</span>
                        </div>
                        <div className="inline-flex items-center bg-surface-50 rounded-2xl p-1.5 border border-surface-200 shadow-inner">
                          <button
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                            className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-surface-700 hover:text-brand-600 hover:shadow transition-all"
                          >
                            <Minus className="w-5 h-5" />
                          </button>
                          <span className="w-16 text-center font-bold text-lg text-surface-900">{quantity}</span>
                          <button
                            onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                            className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-surface-700 hover:text-brand-600 hover:shadow transition-all"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={handleAddToCart}
                        disabled={adding || product.stock === 0}
                        className="btn-secondary flex-1 py-4 text-base sm:text-lg group"
                      >
                        <ShoppingCart className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Add to Cart
                      </button>
                      <button
                        onClick={handleBuyNow}
                        disabled={product.stock === 0}
                        className="btn-primary flex-1 py-4 text-base sm:text-lg shadow-brand-500/25 group"
                      >
                        <Zap className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                        Buy it Now
                      </button>
                    </div>
                  </div>
                )}

                {/* Trust Badges Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-surface-50 border border-surface-100 hover:border-surface-200 hover:bg-white transition-colors">
                    <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-surface-900 mb-1">Free Delivery</div>
                      <div className="text-sm text-surface-500 leading-snug">Enter your postal code for delivery availability.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-surface-50 border border-surface-100 hover:border-surface-200 hover:bg-white transition-colors">
                    <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-semibold text-surface-900 mb-1">Return Delivery</div>
                      <div className="text-sm text-surface-500 leading-snug">Free 30 days delivery returns. Details apply.</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="mt-20 pt-16 border-t border-surface-200">
            <h2 className="font-display text-3xl font-bold text-surface-900 mb-8">Customer Reviews</h2>
            
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <div className="bg-white p-8 rounded-[2rem] border border-surface-200 shadow-soft sticky top-28">
                  <h3 className="text-xl font-bold text-surface-900 mb-6">Write a Review</h3>
                  {user ? (
                    <form onSubmit={handleSubmitReview}>
                      <div className="mb-4">
                        <label className="block text-sm font-semibold text-surface-700 mb-2">Rating</label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="focus:outline-none"
                            >
                              <Star className={`w-8 h-8 transition-colors ${reviewRating >= star ? 'fill-orange-500 text-orange-500' : 'text-surface-300 fill-surface-100'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="mb-6">
                        <label className="block text-sm font-semibold text-surface-700 mb-2">Comment</label>
                        <textarea
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="What did you like or dislike?"
                          className="w-full h-32 p-4 rounded-xl border border-surface-200 focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none"
                          required
                        />
                      </div>
                      <button 
                        type="submit" 
                        disabled={submittingReview}
                        className="btn-primary w-full py-3 shadow-brand-500/25"
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-surface-600 mb-4">Please log in to share your thoughts.</p>
                      <Link href="/auth/login" className="btn-secondary w-full py-3 inline-block">Login to Review</Link>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="lg:col-span-2 space-y-6">
                {reviews.length === 0 ? (
                  <div className="text-center py-16 bg-surface-50 rounded-[2rem] border border-dashed border-surface-200">
                    <Star className="w-12 h-12 text-surface-300 fill-surface-200 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-surface-900 mb-2">No reviews yet</h3>
                    <p className="text-surface-500">Be the first to review this product!</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-2xl border border-surface-100 shadow-sm animate-fade-in">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold uppercase">
                            {review.user_name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-surface-900">{review.user_name}</div>
                            <div className="text-xs text-surface-500">{new Date(review.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-orange-500 text-orange-500' : 'fill-surface-200 text-surface-200'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-surface-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
