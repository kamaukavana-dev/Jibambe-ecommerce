'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore, useCartTotals } from '@/store/cart-store';
import { Drawer } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { formatKsh } from '@/lib/currency';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/cart';

/**
 * The global cart drawer. Opens automatically when an item is added (the store
 * flips isOpen) so the user gets immediate, in-context feedback rather than a
 * disembodied toast. Empty state is designed, not blank.
 */
export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const setOpen = useCartStore((s) => s.setOpen);
  const close = useCartStore((s) => s.closeCart);
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const totals = useCartTotals();

  const progress = Math.min(100, (totals.subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setOpen}
      title={`Your cart${totals.itemCount ? ` (${totals.itemCount})` : ''}`}
      description="Items in your shopping cart"
      returnFocusTo="#cart-button"
    >
      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-surface-sunken">
            <ShoppingBag className="h-7 w-7 text-ink-subtle" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-ink">Your cart is empty</h3>
          <p className="mt-1 max-w-xs text-sm text-ink-muted">
            Browse the catalogue and add something you love — it’ll show up here.
          </p>
          <Button asChild className="mt-6" onClick={close}>
            <Link href="/shop">Start shopping</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Free-shipping progress */}
          <div className="border-b border-border px-5 py-3">
            {totals.freeShippingRemaining > 0 ? (
              <p className="text-sm text-ink-muted">
                Add{' '}
                <span className="font-semibold text-ink">
                  {formatKsh(totals.freeShippingRemaining)}
                </span>{' '}
                more for free delivery
              </p>
            ) : (
              <p className="text-sm font-medium text-success">
                You’ve unlocked free delivery! 🎉
              </p>
            )}
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-sunken">
              <div
                className="h-full rounded-full bg-accent transition-[width] duration-overlay"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <ul className="flex-1 divide-y divide-border overflow-y-auto px-5">
            {lines.map((line) => (
              <li key={line.lineKey} className="flex gap-3 py-4">
                <Link
                  href={`/product/${line.slug}`}
                  onClick={close}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-surface-sunken"
                >
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/product/${line.slug}`}
                      onClick={close}
                      className="line-clamp-2 text-sm font-medium text-ink hover:text-accent"
                    >
                      {line.name}
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(line.lineKey)}
                      className="-mr-1 grid h-8 w-8 shrink-0 place-items-center rounded text-ink-subtle transition-colors duration-micro hover:bg-danger-subtle hover:text-danger"
                      aria-label={`Remove ${line.name} from cart`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {line.variantLabel && (
                    <p className="mt-0.5 text-xs text-ink-muted">{line.variantLabel}</p>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <QuantityStepper
                      value={line.quantity}
                      onChange={(q) => setQuantity(line.lineKey, q)}
                      max={line.maxStock}
                      label={`Quantity for ${line.name}`}
                      className="h-9"
                    />
                    <span className="text-sm font-semibold tabular-nums text-ink">
                      {formatKsh(line.unitPrice * line.quantity)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Summary */}
          <div className="border-t border-border bg-surface-raised px-5 py-4">
            <dl className="space-y-1.5 text-sm">
              <div className="flex justify-between text-ink-muted">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{formatKsh(totals.subtotal)}</dd>
              </div>
              <div className="flex justify-between text-ink-muted">
                <dt>Delivery</dt>
                <dd className="tabular-nums">
                  {totals.shipping === 0 ? 'Free' : formatKsh(totals.shipping)}
                </dd>
              </div>
              {totals.savings > 0 && (
                <div className="flex justify-between font-medium text-success">
                  <dt>You save</dt>
                  <dd className="tabular-nums">−{formatKsh(totals.savings)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2 text-base font-semibold text-ink">
                <dt>Total</dt>
                <dd className="tabular-nums">{formatKsh(totals.total)}</dd>
              </div>
            </dl>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button asChild variant="outline" onClick={close}>
                <Link href="/cart">View cart</Link>
              </Button>
              <Button asChild onClick={close}>
                <Link href="/checkout/shipping">Checkout</Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}
