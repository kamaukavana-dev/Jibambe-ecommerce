'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Package, Mail } from 'lucide-react';
import { useCheckoutStore } from '@/store/checkout-store';
import { useCartStore } from '@/store/cart-store';
import { useHydrated } from '@/lib/use-hydrated';
import { formatKsh } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Order confirmation. Reads the confirmed order from the checkout store; if a
 * user lands here without one (direct nav / refresh after reset) they're sent
 * home. The store isn't reset here so a refresh still shows the confirmation.
 */
export function ConfirmationView() {
  const router = useRouter();
  const hydrated = useHydrated();
  const order = useCheckoutStore((s) => s.order);
  const shipping = useCheckoutStore((s) => s.shipping);
  const clearCart = useCartStore((s) => s.clear);

  useEffect(() => {
    if (!hydrated) return;
    if (!order) {
      router.replace('/');
    } else {
      // Order placed — empty the cart now that we're on the (unguarded)
      // confirmation page. Safe to call repeatedly.
      clearCart();
    }
  }, [hydrated, order, router, clearCart]);

  if (!hydrated || !order) {
    return <Skeleton className="mx-auto h-96 w-full max-w-lg rounded-lg" />;
  }

  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-success-subtle">
        <CheckCircle2 className="h-9 w-9 text-success" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-semibold text-ink">Order confirmed</h1>
      <p className="mt-2 text-ink-muted">
        Thank you{shipping?.fullName ? `, ${shipping.fullName.split(' ')[0]}` : ''}! Your order is
        on its way through our system.
      </p>

      <div className="mt-8 rounded-lg border border-border bg-surface-raised p-6 text-left">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-accent" />
            <span className="text-sm text-ink-muted">Order number</span>
          </div>
          <span className="font-semibold tabular-nums text-ink">{order.orderNumber}</span>
        </div>
        <dl className="space-y-2.5 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Items</dt>
            <dd className="text-ink">{order.itemCount}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Total paid</dt>
            <dd className="font-semibold text-ink">{formatKsh(order.total)}</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-1.5 text-ink-muted">
              <Mail className="h-4 w-4" /> Receipt sent to
            </dt>
            <dd className="truncate text-ink">{order.email}</dd>
          </div>
        </dl>
      </div>

      <p className="mt-4 text-sm text-ink-subtle">
        Estimated delivery: 2–4 business days. You’ll get an SMS when it ships.
      </p>

      <div className="mt-8 flex justify-center gap-3">
        <Button asChild size="lg">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
