import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth Store
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => {
        set({ user, token });
        if (typeof window !== 'undefined') localStorage.setItem('token', token);
      },
      logout: () => {
        set({ user: null, token: null });
        if (typeof window !== 'undefined') localStorage.removeItem('token');
      },
      isAdmin: () => {
        const state = get();
        return state.user?.role === 'admin';
      },
      isManager: () => {
        const state = get();
        return state.user?.role === 'manager' || state.user?.role === 'admin';
      },
      initialize: () => {},
    }),
    { name: 'auth-store', partialize: (state) => ({ user: state.user, token: state.token }) }
  )
);

// Cart Store
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      setCart: (items, total) => set({ items, total }),
      addItem: (item) => {
        const items = get().items;
        const existing = items.find((i) => i.product_id === item.product_id);
        if (existing) {
          const updated = items.map((i) => i.product_id === item.product_id ? { ...i, quantity: i.quantity + item.quantity } : i);
          set({ items: updated, total: updated.reduce((s, i) => s + i.price * i.quantity, 0) });
        } else {
          const updated = [...items, item];
          set({ items: updated, total: updated.reduce((s, i) => s + i.price * i.quantity, 0) });
        }
      },
      removeItem: (id) => {
        const updated = get().items.filter((i) => i.id !== id);
        set({ items: updated, total: updated.reduce((s, i) => s + i.price * i.quantity, 0) });
      },
      clearCart: () => set({ items: [], total: 0 }),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'cart-store' }
  )
);
