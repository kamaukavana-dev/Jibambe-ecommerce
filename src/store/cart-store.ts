'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartLine, Product } from '@/types';
import {
  buildLineKey,
  clampQuantity,
  computeTotals,
  findCoupon,
  cartSubtotal,
  type CartTotals,
} from '@/lib/cart';

interface AddPayload {
  product: Product;
  quantity?: number;
  unitPrice: number;
  variantLabel?: string;
}

/** Result of trying to apply a coupon, surfaced to the UI. */
export interface CouponResult {
  ok: boolean;
  message: string;
}

interface CartState {
  lines: CartLine[];
  /** Applied coupon code, or null. Persisted with the cart. */
  coupon: string | null;
  /** Drawer open state lives here so any component can open/close it. */
  isOpen: boolean;
  addItem: (payload: AddPayload) => void;
  removeItem: (lineKey: string) => void;
  setQuantity: (lineKey: string, quantity: number) => void;
  applyCoupon: (code: string) => CouponResult;
  removeCoupon: () => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  setOpen: (open: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      coupon: null,
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
            maxStock: product.stock,
          };
          return { isOpen: true, lines: [...state.lines, line] };
        }),

      removeItem: (lineKey) =>
        set((state) => ({ lines: state.lines.filter((l) => l.lineKey !== lineKey) })),

      // Stock-aware: a line can never be pushed above the units available at
      // add time. quantity <= 0 removes the line entirely.
      setQuantity: (lineKey, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.lineKey !== lineKey)
              : state.lines.map((l) =>
                  l.lineKey === lineKey
                    ? { ...l, quantity: clampQuantity(quantity, l.maxStock) }
                    : l,
                ),
        })),

      applyCoupon: (code) => {
        const coupon = findCoupon(code);
        if (!coupon) {
          return { ok: false, message: `“${code.trim()}” is not a valid code.` };
        }
        const subtotal = cartSubtotal(get().lines);
        if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
          return {
            ok: false,
            message: `Add more to reach the KSh ${coupon.minSubtotal.toLocaleString('en-KE')} minimum for this code.`,
          };
        }
        set({ coupon: coupon.code });
        return { ok: true, message: coupon.label };
      },

      removeCoupon: () => set({ coupon: null }),

      clear: () => set({ lines: [], coupon: null }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: 'jibambe-cart',
      storage: createJSONStorage(() => localStorage),
      // Never persist the drawer's open state — only the contents + coupon.
      partialize: (state) => ({ lines: state.lines, coupon: state.coupon }),
    },
  ),
);

/**
 * Derived totals selector. Kept out of the store so it recomputes from the
 * single source of truth (lines + coupon) rather than duplicating derived
 * state. A stored coupon that no longer qualifies simply yields no discount.
 */
export function useCartTotals(): CartTotals {
  const lines = useCartStore((s) => s.lines);
  const coupon = useCartStore((s) => s.coupon);
  return computeTotals(lines, coupon ? findCoupon(coupon) : null);
}
