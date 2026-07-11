'use client';

import Image from 'next/image';
import { useCartStore, useCartTotals } from '@/store/cart-store';
import { formatKsh } from '@/lib/currency';
import { OrderSummary } from './order-summary';

/**
 * The checkout-side order summary: a compact line-item list plus the totals
 * card. Reads live from the cart store so edits elsewhere stay in sync.
 */
export function CheckoutSummary() {
  const lines = useCartStore((s) => s.lines);
  const totals = useCartTotals();

  return (
    <div className="lg:sticky lg:top-8 lg:self-start">
      <div className="mb-4 rounded-lg border border-border bg-surface-raised p-5">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">
          Your order ({totals.itemCount})
        </h2>
        <ul className="space-y-3">
          {lines.map((line) => (
            <li key={line.lineKey} className="flex gap-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-surface-sunken">
                <Image src={line.image} alt="" fill sizes="56px" className="object-cover" />
                <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-ink px-1 text-[11px] font-semibold text-ink-inverse">
                  {line.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-medium text-ink">{line.name}</p>
                {line.variantLabel && (
                  <p className="text-xs text-ink-muted">{line.variantLabel}</p>
                )}
              </div>
              <span className="text-sm font-medium tabular-nums text-ink">
                {formatKsh(line.unitPrice * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <OrderSummary totals={totals} />
    </div>
  );
}
