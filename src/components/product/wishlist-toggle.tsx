'use client';

import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/store/wishlist-store';
import { useHydrated } from '@/lib/use-hydrated';
import { cn } from '@/lib/utils';

/**
 * Wishlist toggle. Reads persisted state but only reflects it after hydration
 * to avoid an SSR mismatch. `aria-pressed` communicates the toggle state to AT,
 * and the label changes with it.
 */
interface WishlistToggleProps {
  productId: number;
  productName: string;
  className?: string;
  variant?: 'floating' | 'inline';
}

export function WishlistToggle({
  productId,
  productName,
  className,
  variant = 'floating',
}: WishlistToggleProps) {
  const hydrated = useHydrated();
  const toggle = useWishlistStore((s) => s.toggle);
  const items = useWishlistStore((s) => s.items);
  const active = hydrated && items.some((i) => i.productId === productId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${productName} from wishlist` : `Add ${productName} to wishlist`}
      className={cn(
        'grid place-items-center rounded-full transition-colors duration-micro',
        variant === 'floating'
          ? 'h-9 w-9 bg-surface-raised/90 shadow-sm backdrop-blur hover:bg-surface-raised'
          : 'h-11 w-11 border border-border-strong hover:bg-surface-sunken',
        className,
      )}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-colors duration-micro',
          active ? 'fill-danger text-danger' : 'text-ink-muted',
        )}
      />
    </button>
  );
}
