'use client';

import { create } from 'zustand';

/**
 * Ephemeral UI state that isn't persisted — the search overlay and mobile menu
 * open flags. Kept in a store (not context) so the header, keyboard shortcut
 * handler and overlay can all read/write without a provider wrapping the tree.
 */
interface UiState {
  searchOpen: boolean;
  mobileNavOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  setSearchOpen: (open: boolean) => void;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  setMobileNavOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
  searchOpen: false,
  mobileNavOpen: false,
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  setSearchOpen: (searchOpen) => set({ searchOpen }),
  openMobileNav: () => set({ mobileNavOpen: true }),
  closeMobileNav: () => set({ mobileNavOpen: false }),
  setMobileNavOpen: (mobileNavOpen) => set({ mobileNavOpen }),
}));
