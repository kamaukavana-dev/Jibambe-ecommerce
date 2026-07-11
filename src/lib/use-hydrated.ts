'use client';

import { useEffect, useState } from 'react';

/**
 * True only after the first client render. Persisted Zustand stores read from
 * localStorage, which isn't available during SSR — rendering their values
 * before hydration causes a mismatch. Components gate localStorage-derived UI
 * (cart badge count, wishlist state) behind this so the server and first client
 * render agree, then update once hydrated.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
