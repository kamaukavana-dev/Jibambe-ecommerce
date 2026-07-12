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
  /** Amount removed by an applied coupon (0 if none / not eligible). */
  discount: number;
  /** The coupon code actually applied to this total, if any. */
  couponCode?: string;
  shipping: number;
  /** VAT portion already contained within the subtotal (informational). */
  taxIncluded: number;
  total: number;
  freeShippingRemaining: number;
}

/**
 * Hardcoded promo codes. This is a mock store, so codes live in the client —
 * there is no server to validate against and nothing sensitive here.
 */
export interface Coupon {
  code: string;
  /** Short human label shown once applied. */
  label: string;
  kind: 'percent' | 'fixed';
  /** Percentage (0–100) for 'percent', or KSh amount for 'fixed'. */
  value: number;
  /** Minimum subtotal (KSh) required for the code to apply. */
  minSubtotal?: number;
}

export const COUPONS: Coupon[] = [
  { code: 'JIBAMBE10', label: '10% off your order', kind: 'percent', value: 10 },
  {
    code: 'KARIBU500',
    label: 'KSh 500 off orders over KSh 10,000',
    kind: 'fixed',
    value: 500,
    minSubtotal: 10000,
  },
];

/** Look up a coupon by code, case-insensitively and trimmed. */
export function findCoupon(code: string): Coupon | undefined {
  const normalized = code.trim().toUpperCase();
  return COUPONS.find((c) => c.code === normalized);
}

/**
 * Discount a coupon yields against a subtotal. Returns 0 when the coupon is
 * absent or the subtotal is below its minimum — so a stored code silently
 * stops discounting if the cart later drops under the threshold. Never exceeds
 * the subtotal.
 */
export function discountFor(subtotal: number, coupon?: Coupon | null): number {
  if (!coupon || subtotal <= 0) return 0;
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) return 0;
  const raw =
    coupon.kind === 'percent' ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  return Math.min(raw, subtotal);
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

/**
 * Compute every derived total for a cart in one pass-friendly call. Free
 * shipping is judged on the pre-discount subtotal (a coupon shouldn't drop you
 * under the delivery threshold), while the coupon discount comes off the total.
 */
export function computeTotals(lines: CartLine[], coupon?: Coupon | null): CartTotals {
  const subtotal = cartSubtotal(lines);
  const shipping = shippingFor(subtotal);
  const discount = discountFor(subtotal, coupon);
  const taxIncluded = Math.round(subtotal - subtotal / (1 + VAT_RATE));
  return {
    itemCount: cartItemCount(lines),
    subtotal,
    savings: cartSavings(lines),
    discount,
    couponCode: discount > 0 ? coupon?.code : undefined,
    shipping,
    taxIncluded,
    total: Math.max(0, subtotal - discount + shipping),
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
