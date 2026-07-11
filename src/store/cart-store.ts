'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartLine, Product } from '@/types';
import { buildLineKey, clampQuantity, computeTotals, type CartTotals } from '@/lib/cart';

interface AddPayload {
  product: Product;
  quantity?: number;
  unitPrice: number;
  variantLabel?: string;
}

interface CartState {
  lines: CartLine[];
  /** Drawer open state lives here so any component can open/close it. */
  isOpen: boolean;
  addItem: (payload: AddPayload) => void;
  removeItem: (lineKey: string) => void;
  setQuantity: (lineKey: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  setOpen: (open: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,

      addItem: ({ product, quantity = 1, unitPrice, variantLabel }) =>
        set((state) => {
          const lineKey = buildLineKey(product.id, variantLabel);
          const existing = state.lines.find((l) => l.lineKey === lineKey);

          if (existing) {
            return {
              isOpen: true,
              lines: state.lines.map((l) =>
                l.lineKey === lineKey
                  ? { ...l, quantity: clampQuantity(l.quantity + quantity, product.stock) }
                  : l,
              ),
            };
          }

          const line: CartLine = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            image: product.images[0] ?? '',
            unitPrice,
            compareAtPrice: product.compareAtPrice,
            quantity: clampQuantity(quantity, product.stock),
            variantLabel,
            lineKey,
          };
          return { isOpen: true, lines: [...state.lines, line] };
        }),

      removeItem: (lineKey) =>
        set((state) => ({ lines: state.lines.filter((l) => l.lineKey !== lineKey) })),

      setQuantity: (lineKey, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.lineKey !== lineKey)
              : state.lines.map((l) =>
                  l.lineKey === lineKey ? { ...l, quantity: Math.floor(quantity) } : l,
                ),
        })),

      clear: () => set({ lines: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: 'jibambe-cart',
      storage: createJSONStorage(() => localStorage),
      // Never persist the drawer's open state — only the contents.
      partialize: (state) => ({ lines: state.lines }),
    },
  ),
);

/**
 * Derived totals selector. Kept out of the store so it recomputes from the
 * single source of truth (lines) rather than duplicating derived state.
 */
export function useCartTotals(): CartTotals {
  const lines = useCartStore((s) => s.lines);
  return computeTotals(lines);
}
