'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft } from 'lucide-react';
import { Input, Label, FieldError } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCartTotals } from '@/store/cart-store';
import { useCheckoutStore } from '@/store/checkout-store';
import {
  cardNumber as cardNumberRule,
  cvc as cvcRule,
  expiryValidator,
  required,
  validateForm,
  type Validator,
} from '@/lib/validation';
import { formatKsh } from '@/lib/currency';

interface PaymentValues {
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}
type Field = keyof PaymentValues;

/** Group digits into 4s for readable card entry. */
function formatCardNumber(v: string): string {
  return v
    .replace(/\D/g, '')
    .slice(0, 19)
    .replace(/(.{4})/g, '$1 ')
    .trim();
}
function formatExpiry(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length <= 2 ? d : `${d.slice(0, 2)}/${d.slice(2)}`;
}

export function PaymentForm() {
  const router = useRouter();
  const setOrder = useCheckoutStore((s) => s.setOrder);
  const shipping = useCheckoutStore((s) => s.shipping);
  const totals = useCartTotals();

  const [values, setValues] = useState<PaymentValues>({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
  });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  // Validators are constructed at render (runtime) so expiry compares to "now".
  const validators: Record<Field, Validator> = {
    cardName: required('Name on card'),
    cardNumber: cardNumberRule,
    expiry: expiryValidator(new Date()),
    cvc: cvcRule,
  };

  const setField = (name: Field, value: string) => {
    const formatted =
      name === 'cardNumber' ? formatCardNumber(value) : name === 'expiry' ? formatExpiry(value) : value;
    setValues((v) => ({ ...v, [name]: formatted }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: validators[name](formatted) }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allErrors = validateForm(values, validators);
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) return;

    setSubmitting(true);
    // Simulate a payment round-trip, then confirm the order.
    setTimeout(() => {
      const orderNumber = `JIB-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrder({
        orderNumber,
        email: shipping?.email ?? '',
        total: totals.total,
        itemCount: totals.itemCount,
      });
      // The cart is cleared on the confirmation page (not here) so emptying it
      // doesn't trip this guarded page's empty-cart redirect mid-navigation.
      router.push('/checkout/confirmation');
    }, 900);
  };

  const fields: Array<{ name: Field; label: string; placeholder?: string; full?: boolean; inputMode?: 'numeric'; autoComplete?: string }> = [
    { name: 'cardName', label: 'Name on card', full: true, autoComplete: 'cc-name' },
    { name: 'cardNumber', label: 'Card number', placeholder: '4242 4242 4242 4242', full: true, inputMode: 'numeric', autoComplete: 'cc-number' },
    { name: 'expiry', label: 'Expiry (MM/YY)', placeholder: '08/28', inputMode: 'numeric', autoComplete: 'cc-exp' },
    { name: 'cvc', label: 'CVC', placeholder: '123', inputMode: 'numeric', autoComplete: 'cc-csc' },
  ];

  return (
    <form onSubmit={onSubmit} noValidate>
      <h1 className="mb-2 font-display text-2xl font-semibold text-ink">Payment</h1>
      <p className="mb-6 flex items-center gap-1.5 text-sm text-ink-muted">
        <Lock className="h-4 w-4 text-success" />
        This is a demo — use any Luhn-valid number (e.g. 4242 4242 4242 4242). No real charge.
      </p>

      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        {fields.map((f) => {
          const err = errors[f.name];
          return (
            <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
              <Label htmlFor={f.name}>{f.label}</Label>
              <Input
                id={f.name}
                name={f.name}
                inputMode={f.inputMode}
                placeholder={f.placeholder}
                autoComplete={f.autoComplete}
                value={values[f.name]}
                invalid={Boolean(err)}
                aria-describedby={err ? `${f.name}-error` : undefined}
                onChange={(e) => setField(f.name, e.target.value)}
                onBlur={() => setErrors((prev) => ({ ...prev, [f.name]: validators[f.name](values[f.name]) }))}
              />
              <FieldError id={`${f.name}-error`}>{err}</FieldError>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between gap-3">
        <Button type="button" variant="ghost" onClick={() => router.push('/checkout/shipping')}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button type="submit" size="lg" loading={submitting}>
          {submitting ? 'Processing…' : `Pay ${formatKsh(totals.total)}`}
        </Button>
      </div>
    </form>
  );
}
