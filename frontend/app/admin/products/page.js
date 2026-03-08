'use client';
import { useState, useEffect } from 'react';
import { productAPI, adminAPI } from '../../../services/api';
import Navbar from '../../../components/layout/Navbar';
import { Plus, Pencil, Trash2, X, Upload, Search, PackageSearch, PackageOpen, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', description: '', price: '', compare_price: '', stock: '', category_id: '', image_url: '', is_featured: false, is_active: true };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const load = () => productAPI.getAll({ limit: 50 }).then(res => setProducts(res.data.products)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const openEdit = (p) => { setForm({ ...p, price: p.price, compare_price: p.compare_price || '' }); setEditing(p.id); setShowModal(true); };
  const openCreate = () => { setForm(EMPTY_FORM); setEditing(null); setShowModal(true); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) { await productAPI.update(editing, form); toast.success('Product updated'); }
      else { await productAPI.create(form); toast.success('Product created'); }
      setShowModal(false);
      load();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!confirm('Are you sure you want to permanently delete this product?')) return;
    try { await productAPI.delete(id); toast.success('Product deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const handleBulkUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await productAPI.bulkUpload(formData);
      toast.success(res.data.message || 'Upload successful');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Bulk upload failed');
    } finally {
      setUploading(false);
      e.target.value = ''; // reset input
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await adminAPI.uploadImage(formData);
      setForm({ ...form, image_url: res.data.url });
      toast.success('Image uploaded successfully!');
    } catch (err) {
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-surface-50 selection:bg-brand-500/30">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-surface-200 animate-slide-up">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-surface-900 tracking-tight">Product Inventory</h1>
              <p className="text-surface-500 mt-2">Manage your catalog, prices, and stock.</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <label className={`btn-secondary px-4 py-2 border-surface-200 bg-white shadow-sm flex items-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-brand-300'}`}>
                 {uploading ? <div className="animate-spin w-4 h-4 border-2 border-surface-400 border-t-transparent rounded-full" /> : <Upload size={16} />} 
                 {uploading ? 'Uploading...' : 'Bulk Import CSV'}
                 <input type="file" accept=".csv" className="hidden" onChange={handleBulkUpload} disabled={uploading} />
              </label>
              <button onClick={openCreate} className="btn-primary px-5 py-2 flex items-center gap-2 shadow-brand-500/25">
                 <Plus size={18} /> Add New Product
              </button>
            </div>
          </div>

          {/* Search/Filter Bar */}
          <div className="flex bg-white p-2 rounded-2xl border border-surface-200 shadow-sm mb-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
             <div className="relative flex-1 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 w-5 h-5 group-focus-within:text-brand-500 transition-colors" />
               <input
                 className="w-full bg-transparent text-surface-900 pl-11 pr-4 py-2.5 text-sm outline-none placeholder:text-surface-400 font-medium"
                 placeholder="Search products by name..."
               />
             </div>
          </div>

          {loading ? (
             <div className="flex justify-center py-20">
               <div className="relative w-12 h-12">
                 <div className="absolute inset-0 rounded-full border-t-2 border-brand-500 animate-spin" />
               </div>
             </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-16 text-center border border-surface-200 shadow-sm animate-fade-in">
               <div className="w-24 h-24 bg-surface-50 rounded-full flex items-center justify-center text-surface-400 mx-auto mb-6 border border-surface-100">
                 <PackageOpen size={40} strokeWidth={1.5} />
               </div>
               <h3 className="font-display text-2xl font-bold text-surface-900 mb-3">No Products Yet</h3>
               <p className="text-surface-500 max-w-sm mx-auto mb-8 text-lg">Your inventory is empty. Start adding products manually or bulk import them from a CSV.</p>
               <button onClick={openCreate} className="btn-primary px-8 py-3 mx-auto">
                 Add Your First Product
               </button>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-surface-200 shadow-soft overflow-hidden animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-50/50 border-b border-surface-200">
                      {['Product', 'Price', 'Inventory', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-4 text-[11px] font-bold text-surface-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-surface-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-xl bg-surface-50 overflow-hidden shrink-0 border border-surface-100">
                               {p.image_url ? (
                                 <img src={p.image_url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center text-surface-300"><PackageSearch size={20} /></div>
                               )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-surface-900 text-sm truncate max-w-[200px] sm:max-w-xs">{p.name}</p>
                              <p className="text-xs text-brand-600 font-medium mt-0.5">{p.category_name || 'Uncategorized'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-black text-surface-900">₹{parseFloat(p.price).toLocaleString()}</span>
                            {p.compare_price && parseFloat(p.compare_price) > parseFloat(p.price) && (
                              <span className="text-xs text-surface-400 line-through">₹{parseFloat(p.compare_price).toLocaleString()}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                              p.stock > 10 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                              p.stock > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                              'bg-red-50 text-red-700 border-red-200'
                           }`}>
                             {p.stock > 0 ? `${p.stock} IN STOCK` : 'OUT OF STOCK'}
                           </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${
                            p.is_active ? 'bg-surface-50 text-surface-700 border-surface-200' : 'bg-surface-100 text-surface-400 border-transparent'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${p.is_active ? 'bg-emerald-500' : 'bg-surface-300'}`} />
                            {p.is_active ? 'Active' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEdit(p)} className="w-8 h-8 rounded-lg border border-surface-200 bg-white flex items-center justify-center text-surface-500 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 transition-all shadow-sm">
                               <Pencil size={14} />
                            </button>
                            <button onClick={() => remove(p.id)} className="w-8 h-8 rounded-lg border border-surface-200 bg-white flex items-center justify-center text-surface-500 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm">
                               <Trash2 size={14} />
                            </button>
                          </div>
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

      {/* Edit/Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6">
          <div className="fixed inset-0 bg-surface-900/40 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)} />
          
          <div className="relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
            
            <div className="flex justify-between items-center p-6 sm:p-8 border-b border-surface-100 shrink-0">
              <h2 className="font-display text-2xl font-bold text-surface-900">{editing ? 'Edit Product' : 'Create New Product'}</h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-50 text-surface-500 hover:bg-surface-100 hover:text-surface-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar">
              <form id="product-form" onSubmit={save} className="space-y-6">
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-surface-700">Product Name *</label>
                  <input type="text" className="w-full bg-surface-50 border border-surface-200 text-surface-900 p-3.5 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-medium" placeholder="Premium Leather Wallet" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-surface-700">Description</label>
                  <textarea className="w-full bg-surface-50 border border-surface-200 text-surface-900 p-3.5 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-medium min-h-[120px] resize-y custom-scrollbar" placeholder="Detailed product description..." value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-surface-700">Selling Price (₹) *</label>
                    <input type="number" step="0.01" min="0" className="w-full bg-surface-50 border border-surface-200 text-surface-900 p-3.5 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-bold text-lg" placeholder="1999" value={form.price || ''} onChange={e => setForm({ ...form, price: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-surface-700">Compare at Price (₹)</label>
                    <input type="number" step="0.01" min="0" className="w-full bg-surface-50 border border-surface-200 text-surface-900 p-3.5 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-medium text-surface-500" placeholder="2999" value={form.compare_price || ''} onChange={e => setForm({ ...form, compare_price: e.target.value })} />
                    <p className="text-[10px] text-surface-400 font-medium uppercase tracking-wider mt-1">Leave empty if no discount</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-surface-700">Stock Quantity *</label>
                    <input type="number" min="0" className="w-full bg-surface-50 border border-surface-200 text-surface-900 p-3.5 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none font-medium" placeholder="100" value={form.stock || ''} onChange={e => setForm({ ...form, stock: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-surface-700">Product Image</label>
                    <div className="flex gap-4 items-end">
                      {form.image_url && (
                        <div className="w-16 h-16 rounded-xl border border-surface-200 overflow-hidden shrink-0">
                          <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1">
                        <label className={`w-full flex items-center justify-center gap-2 bg-surface-50 border-2 border-dashed border-surface-300 text-surface-600 p-3.5 rounded-xl transition-all cursor-pointer hover:bg-surface-100 hover:border-brand-400 ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                          {uploadingImage ? (
                            <><div className="animate-spin w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full" /> Uploading...</>
                          ) : (
                            <><ImageIcon className="w-5 h-5" /> Select Image</>
                          )}
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                        </label>
                      </div>
                    </div>
                    <p className="text-[10px] text-surface-400 font-medium uppercase tracking-wider mt-1">Accepts JPG, PNG. Max 5MB.</p>
                  </div>
                </div>

                <div className="p-5 bg-surface-50 rounded-2xl border border-surface-200 flex flex-wrap gap-8">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-end justify-center">
                      <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="peer sr-only" />
                      <div className="w-11 h-6 bg-surface-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 transition-colors"></div>
                    </div>
                    <span className="text-sm font-bold text-surface-700 select-none">Active Product</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-end justify-center">
                      <input type="checkbox" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} className="peer sr-only" />
                      <div className="w-11 h-6 bg-surface-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500 transition-colors"></div>
                    </div>
                    <span className="text-sm font-bold text-surface-700 select-none">Featured</span>
                  </label>
                </div>
                
              </form>
            </div>
            
            <div className="p-6 sm:p-8 border-t border-surface-100 bg-surface-50 flex justify-end gap-3 shrink-0">
               <button type="button" onClick={() => setShowModal(false)} className="px-6 py-3 rounded-xl font-bold text-surface-700 bg-white border border-surface-200 hover:bg-surface-50 transition-colors shadow-sm">
                 Cancel
               </button>
               <button type="submit" form="product-form" disabled={saving} className="btn-primary px-8 py-3 shadow-brand-500/25 min-w-[140px]">
                 {saving ? 'Saving...' : (editing ? 'Save Changes' : 'Create Product')}
               </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
