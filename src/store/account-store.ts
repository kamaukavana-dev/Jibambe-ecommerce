'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * MOCK account state. There is NO real authentication or backend here — this is
 * a frontend-only storefront. "Signing in" simply records a client-side user
 * object in localStorage so the UI can present a logged-in experience. Do not
 * mistake any of this for real security: no passwords are stored or verified
 * against anything, and nothing here protects real data.
 */

export interface Account {
  name: string;
  email: string;
}

export interface SavedAddress {
  id: string;
  label: string;
  line: string;
  city: string;
  county: string;
  phone: string;
}

export interface PastOrder {
  orderNumber: string;
  date: string;
  status: 'Delivered' | 'In transit' | 'Processing';
  total: number;
  itemCount: number;
}

/** Seed data so a freshly "signed-in" account looks lived-in, not empty. */
const SEED_ADDRESS: SavedAddress = {
  id: 'addr-home',
  label: 'Home',
  line: 'Kilimani, Wood Avenue',
  city: 'Nairobi',
  county: 'Nairobi',
  phone: '07XX XXX XXX',
};

const SEED_ORDERS: PastOrder[] = [
  {
    orderNumber: 'JIB-284015',
    date: '2026-05-28',
    status: 'Delivered',
    total: 34998,
    itemCount: 2,
  },
  {
    orderNumber: 'JIB-263440',
    date: '2026-04-11',
    status: 'Delivered',
    total: 15499,
    itemCount: 1,
  },
  {
    orderNumber: 'JIB-241887',
    date: '2026-02-03',
    status: 'Delivered',
    total: 88999,
    itemCount: 1,
  },
];

let addressSeq = 0;
const nextAddressId = (name: string) => `addr-${name.length}-${(addressSeq += 1)}`;

interface AccountState {
  user: Account | null;
  addresses: SavedAddress[];
  orders: PastOrder[];
  signUp: (name: string, email: string) => void;
  signIn: (email: string) => void;
  signOut: () => void;
  addAddress: (address: Omit<SavedAddress, 'id'>) => void;
  removeAddress: (id: string) => void;
}

/** Derive a friendly display name from an email local part. */
function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'there';
  const cleaned = local.replace(/[._-]+/g, ' ').trim();
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      user: null,
      addresses: [],
      orders: [],

      signUp: (name, email) =>
        set({
          user: { name: name.trim(), email: email.trim() },
          addresses: [SEED_ADDRESS],
          orders: [],
        }),

      // Mock sign-in: accept the credentials and present a populated account.
      signIn: (email) =>
        set({
          user: { name: nameFromEmail(email), email: email.trim() },
          addresses: [SEED_ADDRESS],
          orders: SEED_ORDERS,
        }),

      signOut: () => set({ user: null, addresses: [], orders: [] }),

      addAddress: (address) =>
        set((state) => ({
          addresses: [...state.addresses, { ...address, id: nextAddressId(address.label) }],
        })),

      removeAddress: (id) =>
        set((state) => ({ addresses: state.addresses.filter((a) => a.id !== id) })),
    }),
    {
      name: 'jibambe-account',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
