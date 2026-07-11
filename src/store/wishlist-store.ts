'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WishlistItem } from '@/types';

interface WishlistState {
  items: WishlistItem[];
  toggle: (productId: number) => void;
  remove: (productId: number) => void;
  has: (productId: number) => boolean;
  clear: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (productId) =>
        set((state) => {
          const exists = state.items.some((i) => i.productId === productId);
          return {
            items: exists
              ? state.items.filter((i) => i.productId !== productId)
              : // addedAt uses ISO string; acceptable because this only runs in
                // the browser on user interaction (not during SSR/build).
                [...state.items, { productId, addedAt: new Date().toISOString() }],
          };
        }),
      remove: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      has: (productId) => get().items.some((i) => i.productId === productId),
      clear: () => set({ items: [] }),
    }),
    {
      name: 'jibambe-wishlist',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
