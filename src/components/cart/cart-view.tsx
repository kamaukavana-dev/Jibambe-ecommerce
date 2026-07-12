'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore, useCartTotals } from '@/store/cart-store';
import { useHydrated } from '@/lib/use-hydrated';
import { formatKsh } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { Skeleton } from '@/components/ui/skeleton';
import { OrderSummary } from '@/components/checkout/order-summary';
import { CouponField } from '@/components/cart/coupon-field';

/**
 * Full cart page. Guards against SSR/hydration mismatch (localStorage-backed)
 * with a skeleton, and treats the empty state as a designed screen, not a blank.
 */
export function CartView() {
  const hydrated = useHydrated();
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totals = useCartTotals();

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-lg" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-24 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-surface-sunken">
          <ShoppingBag className="h-7 w-7 text-ink-subtle" />
        </div>
        <h2 className="mt-4 font-display text-xl font-semibold text-ink">Your cart is empty</h2>
        <p className="mt-1 max-w-sm text-ink-muted">
          Once you add products they’ll appear here, ready for checkout.
        </p>
        <Button asChild className="mt-6">
          <Link href="/shop">
            Browse products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <ul className="divide-y divide-border rounded-lg border border-border bg-surface-raised">
        {lines.map((line) => (
          <li key={line.lineKey} className="flex gap-4 p-4 sm:p-5">
            <Link
              href={`/product/${line.slug}`}
              className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-surface-sunken sm:h-28 sm:w-28"
            >
              <Image src={line.image} alt={line.name} fill sizes="112px" className="object-cover" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/product/${line.slug}`}
                    className="line-clamp-2 font-medium text-ink hover:text-accent"
                  >
                    {line.name}
                  </Link>
                  {line.variantLabel && (
                    <p className="mt-0.5 text-sm text-ink-muted">{line.variantLabel}</p>
                  )}
                  <p className="mt-1 text-sm text-ink-muted">{formatKsh(line.unitPrice)} each</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(line.lineKey)}
                  className="-mr-1 grid h-9 w-9 shrink-0 place-items-center rounded text-ink-subtle transition-colors duration-micro hover:bg-danger-subtle hover:text-danger"
                  aria-label={`Remove ${line.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-auto flex items-center justify-between pt-3">
                <div>
                  <QuantityStepper
                    value={line.quantity}
                    onChange={(q) => setQuantity(line.lineKey, q)}
                    max={line.maxStock}
                    label={`Quantity for ${line.name}`}
                  />
                  {line.quantity >= line.maxStock && (
                    <p className="mt-1 text-xs text-ink-subtle">
                      Max available: {line.maxStock}
                    </p>
                  )}
                </div>
                <span className="font-semibold tabular-nums text-ink">
                  {formatKsh(line.unitPrice * line.quantity)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="lg:sticky lg:top-40 lg:self-start">
        <OrderSummary totals={totals}>
          {totals.freeShippingRemaining > 0 ? (
            <p className="mt-3 rounded bg-surface-sunken px-3 py-2 text-xs text-ink-muted">
              Add {formatKsh(totals.freeShippingRemaining)} more for free delivery.
            </p>
          ) : (
            <p className="mt-3 rounded bg-success-subtle px-3 py-2 text-xs font-medium text-success">
              You’ve unlocked free delivery.
            </p>
          )}
        </OrderSummary>
        <CouponField />
        <Button asChild size="lg" className="mt-4 w-full">
          <Link href="/checkout/shipping">
            Proceed to checkout
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="ghost" className="mt-2 w-full">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
