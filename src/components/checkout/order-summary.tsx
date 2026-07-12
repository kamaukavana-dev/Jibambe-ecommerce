import type { CartTotals } from '@/lib/cart';
import { formatKsh } from '@/lib/currency';

/**
 * Reusable order-summary card shared by the cart page and checkout steps.
 * Presentational — totals are computed by lib/cart and passed in.
 */
export function OrderSummary({
  totals,
  children,
}: {
  totals: CartTotals;
  children?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface-raised p-5">
      <h2 className="font-display text-lg font-semibold text-ink">Order summary</h2>
      <dl className="mt-4 space-y-2.5 text-sm">
        <div className="flex justify-between text-ink-muted">
          <dt>
            Subtotal
            <span className="text-ink-subtle"> · {totals.itemCount} items</span>
          </dt>
          <dd className="tabular-nums text-ink">{formatKsh(totals.subtotal)}</dd>
        </div>
        {totals.savings > 0 && (
          <div className="flex justify-between font-medium text-success">
            <dt>Discount savings</dt>
            <dd className="tabular-nums">−{formatKsh(totals.savings)}</dd>
          </div>
        )}
        {totals.discount > 0 && (
          <div className="flex justify-between font-medium text-success">
            <dt>Coupon {totals.couponCode && <span className="text-ink-subtle">({totals.couponCode})</span>}</dt>
            <dd className="tabular-nums">−{formatKsh(totals.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between text-ink-muted">
          <dt>Delivery</dt>
          <dd className="tabular-nums text-ink">
            {totals.shipping === 0 ? 'Free' : formatKsh(totals.shipping)}
          </dd>
        </div>
        <div className="flex justify-between text-ink-subtle">
          <dt>VAT included (16%)</dt>
          <dd className="tabular-nums">{formatKsh(totals.taxIncluded)}</dd>
        </div>
        <div className="mt-2 flex justify-between border-t border-border pt-3 text-base font-semibold text-ink">
          <dt>Total</dt>
          <dd className="tabular-nums">{formatKsh(totals.total)}</dd>
        </div>
      </dl>
      {children}
    </div>
  );
}
