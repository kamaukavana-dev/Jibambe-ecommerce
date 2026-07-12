'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Heart, ShoppingBag, Menu, User } from 'lucide-react';
import { categories } from '@/data/categories';
import { useCartStore, useCartTotals } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { useUiStore } from '@/store/ui-store';
import { useHydrated } from '@/lib/use-hydrated';
import { cn } from '@/lib/utils';
import { MobileNav } from './mobile-nav';

function CountBubble({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-[11px] font-semibold leading-none text-accent-fg">
      {count > 99 ? '99+' : count}
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const openCart = useCartStore((s) => s.openCart);
  const openSearch = useUiStore((s) => s.openSearch);
  const openMobileNav = useUiStore((s) => s.openMobileNav);
  const { itemCount } = useCartTotals();
  const wishlistCount = useWishlistStore((s) => s.items.length);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      {/* Promo banner — carried over from the original, restrained */}
      <div className="bg-ink text-ink-inverse">
        <div className="container-page flex h-9 items-center justify-center text-xs sm:text-sm">
          <p>
            Free delivery on orders over{' '}
            <span className="font-semibold">KSh&nbsp;50,000</span> · Genuine products, guaranteed
          </p>
        </div>
      </div>

      <div className="container-page flex h-16 items-center gap-3 sm:gap-6">
        <button
          type="button"
          id="menu-button"
          onClick={openMobileNav}
          className="grid h-11 w-11 place-items-center rounded text-ink-muted transition-colors duration-micro hover:bg-surface-sunken hover:text-ink lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Jibambe home">
          <span className="grid h-9 w-9 place-items-center rounded bg-accent text-accent-fg">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-ink">
            Jibambe
          </span>
        </Link>

        {/* Search trigger — expands into the overlay */}
        <button
          type="button"
          id="search-trigger"
          onClick={openSearch}
          className="ml-auto flex h-11 max-w-md flex-1 items-center gap-3 rounded-full border border-border-strong bg-surface-sunken px-4 text-left text-sm text-ink-subtle transition-colors duration-micro hover:border-ink-subtle lg:ml-6"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="truncate">Search products, brands and categories…</span>
          <kbd className="ml-auto hidden rounded border border-border-strong bg-surface px-1.5 py-0.5 text-[11px] font-medium text-ink-muted sm:inline">
            ⌘K
          </kbd>
        </button>

        <div className="flex items-center gap-1">
          <Link
            href="/account"
            className="relative hidden h-11 w-11 place-items-center rounded text-ink-muted transition-colors duration-micro hover:bg-surface-sunken hover:text-ink sm:grid"
            aria-label="My account"
          >
            <User className="h-6 w-6" />
          </Link>
          <Link
            href="/wishlist"
            className="relative grid h-11 w-11 place-items-center rounded text-ink-muted transition-colors duration-micro hover:bg-surface-sunken hover:text-ink"
            aria-label={`Wishlist${hydrated && wishlistCount ? `, ${wishlistCount} items` : ''}`}
          >
            <Heart className="h-6 w-6" />
            {hydrated && <CountBubble count={wishlistCount} />}
          </Link>
          <button
            type="button"
            id="cart-button"
            onClick={openCart}
            className="relative grid h-11 w-11 place-items-center rounded text-ink-muted transition-colors duration-micro hover:bg-surface-sunken hover:text-ink"
            aria-label={`Cart${hydrated && itemCount ? `, ${itemCount} items` : ''}`}
          >
            <ShoppingBag className="h-6 w-6" />
            {hydrated && <CountBubble count={itemCount} />}
          </button>
        </div>
      </div>

      {/* Category nav — desktop */}
      <nav aria-label="Product categories" className="hidden border-t border-border lg:block">
        <div className="container-page flex h-12 items-center gap-1">
          <Link
            href="/shop"
            className={cn(
              'rounded px-3 py-2 text-sm font-medium transition-colors duration-micro hover:bg-surface-sunken',
              pathname === '/shop' ? 'text-accent' : 'text-ink-muted hover:text-ink',
            )}
          >
            All Products
          </Link>
          {categories.map((c) => {
            const href = `/shop?category=${c.slug}`;
            return (
              <Link
                key={c.slug}
                href={href}
                className="rounded px-3 py-2 text-sm font-medium text-ink-muted transition-colors duration-micro hover:bg-surface-sunken hover:text-ink"
              >
                {c.name}
              </Link>
            );
          })}
        </div>
      </nav>

      <MobileNav />
    </header>
  );
}
