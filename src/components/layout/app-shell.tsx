'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';
import { CartDrawer } from './cart-drawer';
import { SearchOverlay } from './search-overlay';

/**
 * Chooses the page chrome by route. Checkout is a deliberately distraction-
 * reduced flow — it renders its own minimal header + step indicator (see
 * app/checkout/layout.tsx) and hides the global nav, cart drawer, search and
 * footer so nothing competes with completing the order. Everywhere else gets
 * the full storefront chrome. `children` stays server-rendered — only the shell
 * decision is client-side.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const minimal = pathname.startsWith('/checkout');

  return (
    <>
      {!minimal && <Header />}
      <main id="main" className="flex-1">
        {children}
      </main>
      {!minimal && <Footer />}
      {!minimal && <CartDrawer />}
      {!minimal && <SearchOverlay />}
    </>
  );
}
