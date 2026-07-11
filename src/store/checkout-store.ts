'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  county: string;
  postalCode: string;
}

export interface ConfirmedOrder {
  orderNumber: string;
  email: string;
  total: number;
  itemCount: number;
}

interface CheckoutState {
  shipping: ShippingDetails | null;
  order: ConfirmedOrder | null;
  setShipping: (details: ShippingDetails) => void;
  setOrder: (order: ConfirmedOrder) => void;
  reset: () => void;
}

/**
 * Holds checkout progress across the multi-route flow (shipping → payment →
 * confirmation). Persisted to sessionStorage so a refresh mid-checkout doesn't
 * wipe the form, but it clears when the tab closes — we don't keep payment-
 * adjacent data around longer than the session.
 */
export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      shipping: null,
      order: null,
      setShipping: (shipping) => set({ shipping }),
      setOrder: (order) => set({ order }),
      reset: () => set({ shipping: null, order: null }),
    }),
    {
      name: 'jibambe-checkout',
      storage: createJSONStorage(() =>
        typeof window === 'undefined' ? (undefined as unknown as Storage) : sessionStorage,
      ),
    },
  ),
);
