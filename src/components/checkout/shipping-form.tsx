'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { Input, Label, FieldError } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCheckoutStore, type ShippingDetails } from '@/store/checkout-store';
import { required, email, kenyanPhone, minLength, validateForm, type Validator } from '@/lib/validation';

type Field = keyof ShippingDetails;

const validators: Record<Field, Validator> = {
  fullName: required('Full name'),
  email,
  phone: kenyanPhone,
  address: minLength(5, 'Address'),
  city: required('City / town'),
  county: required('County'),
  postalCode: required('Postal code'),
};

const fieldConfig: Array<{
  name: Field;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  full?: boolean;
}> = [
  { name: 'fullName', label: 'Full name', autoComplete: 'name', full: true },
  { name: 'email', label: 'Email', type: 'email', autoComplete: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel', autoComplete: 'tel', placeholder: '07XX XXX XXX' },
  { name: 'address', label: 'Street address', autoComplete: 'street-address', full: true },
  { name: 'city', label: 'City / town', autoComplete: 'address-level2' },
  { name: 'county', label: 'County', autoComplete: 'address-level1' },
  { name: 'postalCode', label: 'Postal code', autoComplete: 'postal-code' },
];

/**
 * Shipping details form. Validation is real: inline errors, a11y wiring
 * (aria-invalid, aria-describedby, role=alert), field-level revalidation on
 * change once touched, and a submit that blocks navigation on any error.
 */
export function ShippingForm() {
  const router = useRouter();
  const setShipping = useCheckoutStore((s) => s.setShipping);
  const existing = useCheckoutStore((s) => s.shipping);

  const [values, setValues] = useState<ShippingDetails>(
    existing ?? {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      county: '',
      postalCode: '',
    },
  );
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});

  const setField = (name: Field, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (touched[name]) {
      const err = validators[name](value);
      setErrors((e) => ({ ...e, [name]: err }));
    }
  };

  const blurField = (name: Field) => {
    setTouched((t) => ({ ...t, [name]: true }));
    setErrors((e) => ({ ...e, [name]: validators[name](values[name]) }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const allErrors = validateForm(values, validators);
    setErrors(allErrors);
    setTouched(Object.fromEntries(fieldConfig.map((f) => [f.name, true])) as Record<Field, boolean>);
    if (Object.keys(allErrors).length > 0) {
      // Move focus to the first invalid field for keyboard/AT users.
      const firstError = fieldConfig.find((f) => allErrors[f.name]);
      if (firstError) document.getElementById(firstError.name)?.focus();
      return;
    }
    setShipping(values);
    router.push('/checkout/payment');
  };

  return (
    <form onSubmit={onSubmit} noValidate>
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink">Shipping details</h1>
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        {fieldConfig.map((f) => {
          const err = errors[f.name];
          return (
            <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
              <Label htmlFor={f.name}>{f.label}</Label>
              <Input
                id={f.name}
                name={f.name}
                type={f.type ?? 'text'}
                autoComplete={f.autoComplete}
                placeholder={f.placeholder}
                value={values[f.name]}
                invalid={Boolean(err)}
                aria-describedby={err ? `${f.name}-error` : undefined}
                onChange={(e) => setField(f.name, e.target.value)}
                onBlur={() => blurField(f.name)}
              />
              <FieldError id={`${f.name}-error`}>{err}</FieldError>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <Button type="submit" size="lg">
          Continue to payment
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
