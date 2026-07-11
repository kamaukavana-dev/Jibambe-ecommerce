'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { categories } from '@/data/categories';
import { useUiStore } from '@/store/ui-store';
import { Drawer } from '@/components/ui/drawer';

/**
 * Mobile category navigation. Shares the accessible Drawer primitive (focus
 * trap, Escape, scroll lock). Links close the drawer on navigation.
 */
export function MobileNav() {
  const open = useUiStore((s) => s.mobileNavOpen);
  const setOpen = useUiStore((s) => s.setMobileNavOpen);
  const close = useUiStore((s) => s.closeMobileNav);

  return (
    <Drawer open={open} onOpenChange={setOpen} title="Browse" side="left">
      <nav aria-label="Categories" className="flex-1 overflow-y-auto p-4">
        <Link
          href="/shop"
          onClick={close}
          className="flex items-center justify-between rounded px-3 py-3 text-base font-medium text-ink transition-colors duration-micro hover:bg-surface-sunken"
        >
          All Products
          <ChevronRight className="h-5 w-5 text-ink-subtle" />
        </Link>
        <div className="my-2 h-px bg-border" />
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop?category=${c.slug}`}
            onClick={close}
            className="flex items-center justify-between rounded px-3 py-3 text-base text-ink transition-colors duration-micro hover:bg-surface-sunken"
          >
            <span>
              {c.name}
              <span className="mt-0.5 block text-xs text-ink-subtle">{c.tagline}</span>
            </span>
            <ChevronRight className="h-5 w-5 shrink-0 text-ink-subtle" />
          </Link>
        ))}
      </nav>
    </Drawer>
  );
}
