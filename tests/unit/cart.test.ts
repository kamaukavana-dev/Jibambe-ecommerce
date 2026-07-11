import { describe, it, expect } from 'vitest';
import type { CartLine } from '@/types';
import {
  cartItemCount,
  cartSubtotal,
  cartSavings,
  shippingFor,
  computeTotals,
  buildLineKey,
  clampQuantity,
  FREE_SHIPPING_THRESHOLD,
  FLAT_SHIPPING_FEE,
} from '@/lib/cart';

const line = (over: Partial<CartLine> = {}): CartLine => ({
  productId: 1,
  slug: 'x',
  name: 'X',
  image: '',
  unitPrice: 1000,
  quantity: 1,
  lineKey: '1',
  ...over,
});

describe('cart quantities', () => {
  it('sums quantities across lines', () => {
    expect(cartItemCount([line({ quantity: 2 }), line({ quantity: 3, lineKey: '2' })])).toBe(5);
  });

  it('is zero for an empty cart', () => {
    expect(cartItemCount([])).toBe(0);
  });
});

describe('cartSubtotal', () => {
  it('multiplies unit price by quantity per line', () => {
    const lines = [
      line({ unitPrice: 1000, quantity: 2 }),
      line({ unitPrice: 500, quantity: 3, lineKey: '2' }),
    ];
    expect(cartSubtotal(lines)).toBe(2000 + 1500);
  });
});

describe('cartSavings', () => {
  it('counts (compareAt - price) * qty only for discounted lines', () => {
    const lines = [
      line({ unitPrice: 800, compareAtPrice: 1000, quantity: 2 }), // saves 400
      line({ unitPrice: 500, quantity: 1, lineKey: '2' }), // no compareAt
      line({ unitPrice: 500, compareAtPrice: 400, quantity: 1, lineKey: '3' }), // compareAt < price -> 0
    ];
    expect(cartSavings(lines)).toBe(400);
  });
});

describe('shippingFor', () => {
  it('is free at or above the threshold', () => {
    expect(shippingFor(FREE_SHIPPING_THRESHOLD)).toBe(0);
    expect(shippingFor(FREE_SHIPPING_THRESHOLD + 1)).toBe(0);
  });

  it('is the flat fee below the threshold', () => {
    expect(shippingFor(FREE_SHIPPING_THRESHOLD - 1)).toBe(FLAT_SHIPPING_FEE);
  });

  it('is free for an empty cart (no phantom fee)', () => {
    expect(shippingFor(0)).toBe(0);
  });
});

describe('computeTotals', () => {
  it('derives every total consistently', () => {
    const lines = [line({ unitPrice: 10000, quantity: 2 })]; // 20,000 subtotal
    const t = computeTotals(lines);
    expect(t.subtotal).toBe(20000);
    expect(t.itemCount).toBe(2);
    expect(t.shipping).toBe(FLAT_SHIPPING_FEE);
    expect(t.total).toBe(20000 + FLAT_SHIPPING_FEE);
    expect(t.freeShippingRemaining).toBe(FREE_SHIPPING_THRESHOLD - 20000);
  });

  it('unlocks free shipping and reports zero remaining past the threshold', () => {
    const t = computeTotals([line({ unitPrice: 60000, quantity: 1 })]);
    expect(t.shipping).toBe(0);
    expect(t.freeShippingRemaining).toBe(0);
    expect(t.total).toBe(60000);
  });

  it('extracts the VAT portion already contained in the price (16%)', () => {
    const t = computeTotals([line({ unitPrice: 11600, quantity: 1 })]);
    // 11600 includes 16% VAT => net 10000, VAT 1600.
    expect(t.taxIncluded).toBe(1600);
  });
});

describe('buildLineKey', () => {
  it('separates the same product by variant', () => {
    expect(buildLineKey(1, 'Black · 256GB')).not.toBe(buildLineKey(1, 'Blue · 512GB'));
  });
  it('is stable without a variant', () => {
    expect(buildLineKey(1)).toBe('1');
  });
});

describe('clampQuantity', () => {
  it('never drops below 1', () => {
    expect(clampQuantity(0, 10)).toBe(1);
    expect(clampQuantity(-5, 10)).toBe(1);
  });
  it('caps at available stock', () => {
    expect(clampQuantity(15, 10)).toBe(10);
  });
  it('floors fractional input and handles NaN', () => {
    expect(clampQuantity(3.9, 10)).toBe(3);
    expect(clampQuantity(Number.NaN, 10)).toBe(1);
  });
});
