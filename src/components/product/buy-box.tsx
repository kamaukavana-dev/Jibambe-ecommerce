'use client';

import { useMemo, useState } from 'react';
import { Check, ShoppingBag, Truck } from 'lucide-react';
import type { Product } from '@/types';
import { useCartStore } from '@/store/cart-store';
import { clampQuantity } from '@/lib/cart';
import { cn } from '@/lib/utils';
import { PriceDisplay } from './price-display';
import { RatingStars } from './rating-stars';
import { StockBadge } from './stock-badge';
import { WishlistToggle } from './wishlist-toggle';
import { QuantityStepper } from '@/components/ui/quantity-stepper';
import { Button } from '@/components/ui/button';

/**
 * The PDP purchase panel. Owns variant selection state, recomputes price/stock
 * from the chosen options, and adds a correctly-keyed line to the cart. Add is
 * blocked until every variant group has an in-stock selection.
 */
export function BuyBox({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);

  // Selected option index per variant group. Default to the first in-stock
  // option in each group so the box is usable immediately.
  const [selected, setSelected] = useState<number[]>(() =>
    (product.variants ?? []).map((g) => {
      const idx = g.options.findIndex((o) => o.inStock);
      return idx === -1 ? 0 : idx;
    }),
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { unitPrice, variantLabel, selectionInStock } = useMemo(() => {
    const groups = product.variants ?? [];
    let delta = 0;
    let inStock = true;
    const parts: string[] = [];
    groups.forEach((g, gi) => {
      const opt = g.options[selected[gi] ?? 0];
      if (!opt) return;
      delta += opt.priceDelta ?? 0;
      if (!opt.inStock) inStock = false;
      parts.push(opt.label);
    });
    return {
      unitPrice: product.price + delta,
      variantLabel: parts.length ? parts.join(' · ') : undefined,
      selectionInStock: inStock,
    };
  }, [product, selected]);

  const outOfStock = product.stock <= 0 || !selectionInStock;
  const compareAt = product.compareAtPrice
    ? product.compareAtPrice + (unitPrice - product.price)
    : undefined;

  const handleAdd = () => {
    if (outOfStock) return;
    addItem({
      product,
      quantity: clampQuantity(quantity, product.stock),
      unitPrice,
      variantLabel,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div>
      <p className="text-sm font-medium uppercase tracking-wide text-ink-subtle">
        {product.brand}
      </p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink sm:text-4xl">
        {product.name}
      </h1>

      <div className="mt-3 flex items-center gap-3">
        <RatingStars rating={product.rating} count={product.reviews.length} />
        <span className="text-sm text-ink-subtle">·</span>
        <span className="text-sm text-ink-muted">{product.sold} sold</span>
      </div>

      <div className="mt-5">
        <PriceDisplay price={unitPrice} compareAtPrice={compareAt} size="lg" />
      </div>

      <p className="mt-4 text-ink-muted">{product.description}</p>

      {/* Variant groups */}
      {(product.variants ?? []).map((group, gi) => (
        <fieldset key={group.name} className="mt-6">
          <legend className="mb-2 text-sm font-medium text-ink">
            {group.name}:{' '}
            <span className="text-ink-muted">{group.options[selected[gi] ?? 0]?.label}</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {group.options.map((opt, oi) => {
              const isSelected = (selected[gi] ?? 0) === oi;
              const disabled = !opt.inStock;
              if (group.type === 'swatch') {
                return (
                  <button
                    key={opt.label}
                    type="button"
                    disabled={disabled}
                    onClick={() =>
                      setSelected((s) => s.map((v, i) => (i === gi ? oi : v)))
                    }
                    aria-pressed={isSelected}
                    aria-label={`${opt.label}${disabled ? ' (out of stock)' : ''}`}
                    title={opt.label}
                    className={cn(
                      'relative grid h-9 w-9 place-items-center rounded-full border-2 transition-transform duration-micro',
                      isSelected ? 'border-accent' : 'border-border-strong',
                      disabled && 'cursor-not-allowed opacity-40',
                    )}
                  >
                    <span
                      className="h-6 w-6 rounded-full border border-black/10"
                      style={{ backgroundColor: opt.swatch }}
                    />
                    {isSelected && (
                      <Check
                        className="absolute h-4 w-4 text-white mix-blend-difference"
                        strokeWidth={3}
                      />
                    )}
                  </button>
                );
              }
              return (
                <button
                  key={opt.label}
                  type="button"
                  disabled={disabled}
                  onClick={() => setSelected((s) => s.map((v, i) => (i === gi ? oi : v)))}
                  aria-pressed={isSelected}
                  className={cn(
                    'h-10 rounded border px-4 text-sm font-medium transition-colors duration-micro',
                    isSelected
                      ? 'border-accent bg-accent-subtle text-accent'
                      : 'border-border-strong text-ink hover:border-ink-subtle',
                    disabled &&
                      'cursor-not-allowed text-ink-subtle line-through opacity-60 hover:border-border-strong',
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      {/* Stock + quantity + actions */}
      <div className="mt-6 flex items-center gap-3">
        <StockBadge stock={product.stock} />
        {!outOfStock && (
          <span className="text-sm text-ink-muted">Ready to ship</span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          max={Math.max(1, product.stock)}
        />
        <Button
          size="lg"
          className="flex-1"
          onClick={handleAdd}
          disabled={outOfStock}
        >
          {added ? (
            <>
              <Check className="h-5 w-5" /> Added to cart
            </>
          ) : (
            <>
              <ShoppingBag className="h-5 w-5" />
              {outOfStock ? 'Out of stock' : 'Add to cart'}
            </>
          )}
        </Button>
        <WishlistToggle
          productId={product.id}
          productName={product.name}
          variant="inline"
        />
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-lg border border-border bg-surface-sunken p-4">
        <Truck className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
        <p className="text-sm text-ink-muted">
          <span className="font-medium text-ink">Free delivery</span> on orders over KSh&nbsp;50,000.
          Nationwide delivery in 2–4 business days.
        </p>
      </div>
    </div>
  );
}
