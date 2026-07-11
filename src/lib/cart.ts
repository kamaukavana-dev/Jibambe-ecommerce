import type { CartLine } from '@/types';

/**
 * Pure cart arithmetic — no React, no store, no side effects. This is the
 * money math, so it is unit-tested in isolation (see tests/unit/cart.test.ts).
 * The Zustand store composes these; it does not reimplement them.
 */

/** Free shipping over this subtotal (KSh). Below it, a flat fee applies. */
export const FREE_SHIPPING_THRESHOLD = 50000;
export const FLAT_SHIPPING_FEE = 499;
/** VAT is already included in Kenyan shelf prices; we surface it for the receipt. */
export const VAT_RATE = 0.16;

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  /** Sum of (compareAt - price) across lines that are on sale. */
  savings: number;
  shipping: number;
  /** VAT portion already contained within the subtotal (informational). */
  taxIncluded: number;
  total: number;
  freeShippingRemaining: number;
}

export function lineSubtotal(line: Pick<CartLine, 'unitPrice' | 'quantity'>): number {
  return line.unitPrice * line.quantity;
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}

export function cartSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + lineSubtotal(l), 0);
}

export function cartSavings(lines: CartLine[]): number {
  return lines.reduce((sum, l) => {
    if (l.compareAtPrice && l.compareAtPrice > l.unitPrice) {
      return sum + (l.compareAtPrice - l.unitPrice) * l.quantity;
    }
    return sum;
  }, 0);
}

export function shippingFor(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_FEE;
}

/** Compute every derived total for a cart in one pass-friendly call. */
export function computeTotals(lines: CartLine[]): CartTotals {
  const subtotal = cartSubtotal(lines);
  const shipping = shippingFor(subtotal);
  const taxIncluded = Math.round(subtotal - subtotal / (1 + VAT_RATE));
  return {
    itemCount: cartItemCount(lines),
    subtotal,
    savings: cartSavings(lines),
    shipping,
    taxIncluded,
    total: subtotal + shipping,
    freeShippingRemaining: Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal),
  };
}

/**
 * Stable key that distinguishes the same product bought with different variant
 * selections, so "iPhone / Black / 256GB" and "iPhone / Blue / 512GB" are two
 * lines but a repeat add of the exact same config increments quantity.
 */
export function buildLineKey(productId: number, variantLabel?: string): string {
  return variantLabel ? `${productId}::${variantLabel}` : `${productId}`;
}

/** Clamp a requested quantity to [1, stock]. */
export function clampQuantity(requested: number, stock: number): number {
  if (Number.isNaN(requested)) return 1;
  return Math.max(1, Math.min(Math.floor(requested), Math.max(1, stock)));
}
