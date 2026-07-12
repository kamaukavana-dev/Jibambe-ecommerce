'use client';

import { useState } from 'react';
import { Tag, X, Check } from 'lucide-react';
import { useCartStore } from '@/store/cart-store';
import { Button } from '@/components/ui/button';
import { Input, FieldError } from '@/components/ui/input';

/**
 * Coupon entry for the cart. Validation lives in the store (applyCoupon), which
 * checks the code against the hardcoded list and the current subtotal. Invalid
 * codes surface an inline error; a valid one shows the applied state with a way
 * to remove it.
 */
export function CouponField() {
  const applied = useCartStore((s) => s.coupon);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function onApply(e: React.FormEvent) {
    e.preventDefault();
    const result = applyCoupon(code);
    if (result.ok) {
      setError(null);
      setNotice(result.message);
      setCode('');
    } else {
      setNotice(null);
      setError(result.message);
    }
  }

  if (applied) {
    return (
      <div className="mt-4 rounded-lg border border-border bg-surface-raised p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-medium text-success">
            <Check className="h-4 w-4" aria-hidden="true" />
            Code <span className="font-semibold">{applied}</span> applied
          </p>
          <button
            type="button"
            onClick={() => {
              removeCoupon();
              setNotice(null);
            }}
            className="flex items-center gap-1 rounded px-2 py-1 text-sm text-ink-muted transition-colors duration-micro hover:bg-surface-sunken hover:text-ink"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onApply} className="mt-4 rounded-lg border border-border bg-surface-raised p-4">
      <label htmlFor="coupon" className="flex items-center gap-2 text-sm font-medium text-ink">
        <Tag className="h-4 w-4 text-ink-muted" aria-hidden="true" />
        Have a promo code?
      </label>
      <div className="mt-2 flex gap-2">
        <Input
          id="coupon"
          name="coupon"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (error) setError(null);
          }}
          placeholder="e.g. JIBAMBE10"
          autoComplete="off"
          spellCheck={false}
          invalid={!!error}
          aria-describedby={error ? 'coupon-error' : undefined}
          className="flex-1"
        />
        <Button type="submit" variant="secondary" disabled={code.trim().length === 0}>
          Apply
        </Button>
      </div>
      <FieldError id="coupon-error">{error}</FieldError>
      {notice && !error && <p className="mt-1.5 text-sm text-success">{notice}</p>}
    </form>
  );
}
