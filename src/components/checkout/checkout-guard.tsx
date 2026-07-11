'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart-store';
import { useCheckoutStore } from '@/store/checkout-store';
import { useHydrated } from '@/lib/use-hydrated';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Blocks the shipping/payment steps when the cart is empty (e.g. deep-link or
 * post-order refresh) and redirects to /cart. With `requireShipping`, it also
 * bounces to the shipping step if that step hasn't been completed — so the flow
 * can't be skipped by deep-linking. Renders a skeleton until hydrated so we
 * never flash protected content or redirect on stale SSR state.
 */
export function CheckoutGuard({
  children,
  requireShipping = false,
}: {
  children: React.ReactNode;
  requireShipping?: boolean;
}) {
  const router = useRouter();
  const hydrated = useHydrated();
  const isEmpty = useCartStore((s) => s.lines.length === 0);
  const hasShipping = useCheckoutStore((s) => s.shipping !== null);
  const shippingMissing = requireShipping && !hasShipping;

  useEffect(() => {
    if (!hydrated) return;
    if (isEmpty) router.replace('/cart');
    else if (shippingMissing) router.replace('/checkout/shipping');
  }, [hydrated, isEmpty, shippingMissing, router]);

  if (!hydrated || isEmpty || shippingMissing) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <Skeleton className="h-96 w-full rounded-lg" />
        <Skeleton className="h-64 w-full rounded-lg" />
      </div>
    );
  }

  return <>{children}</>;
}
