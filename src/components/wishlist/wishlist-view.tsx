'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlist-store';
import { useHydrated } from '@/lib/use-hydrated';
import { productById } from '@/data/products';
import { ProductGrid } from '@/components/product/product-grid';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Wishlist page view. Resolves persisted product ids to products (filtering out
 * any that no longer exist), with a hydration skeleton and a designed empty
 * state. Most recently added appears first.
 */
export function WishlistView() {
  const hydrated = useHydrated();
  const items = useWishlistStore((s) => s.items);
  const clear = useWishlistStore((s) => s.clear);

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-lg" />
        ))}
      </div>
    );
  }

  const products = [...items]
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
    .map((i) => productById.get(i.productId))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-24 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-surface-sunken">
          <Heart className="h-7 w-7 text-ink-subtle" />
        </div>
        <h2 className="mt-4 font-display text-xl font-semibold text-ink">
          Your wishlist is empty
        </h2>
        <p className="mt-1 max-w-sm text-ink-muted">
          Tap the heart on any product to save it here for later.
        </p>
        <Button asChild className="mt-6">
          <Link href="/shop">Find something you love</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-ink-muted">
          <span className="font-semibold text-ink">{products.length}</span>{' '}
          {products.length === 1 ? 'item' : 'items'} saved
        </p>
        <button
          type="button"
          onClick={clear}
          className="text-sm font-medium text-ink-muted underline-offset-4 hover:text-danger hover:underline"
        >
          Clear wishlist
        </button>
      </div>
      <ProductGrid products={products} priorityCount={4} />
    </div>
  );
}
