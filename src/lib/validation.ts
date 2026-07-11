/**
 * Pure form-validation rules for checkout. Framework-free and unit-tested so
 * the checkout forms and the tests share one source of truth. Each validator
 * returns an error string or undefined (valid).
 */

export type Validator = (value: string) => string | undefined;

export const required =
  (label = 'This field'): Validator =>
  (v) =>
    v.trim() === '' ? `${label} is required` : undefined;

export const email: Validator = (v) => {
  if (v.trim() === '') return 'Email is required';
  // Deliberately simple, permissive email shape — good enough for a demo,
  // avoids rejecting valid-but-unusual addresses.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? undefined : 'Enter a valid email address';
};

/** Kenyan phone: 07XXXXXXXX / 01XXXXXXXX or +2547XXXXXXXX (spaces allowed). */
export const kenyanPhone: Validator = (v) => {
  const cleaned = v.replace(/[\s-]/g, '');
  if (cleaned === '') return 'Phone number is required';
  return /^(?:\+?254|0)(?:7|1)\d{8}$/.test(cleaned)
    ? undefined
    : 'Enter a valid Kenyan phone number';
};

export const minLength =
  (n: number, label = 'This field'): Validator =>
  (v) =>
    v.trim().length < n ? `${label} must be at least ${n} characters` : undefined;

/** Luhn check for card numbers (ignores spaces). */
export function luhnValid(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(digits)) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

export const cardNumber: Validator = (v) => {
  const cleaned = v.replace(/\s/g, '');
  if (cleaned === '') return 'Card number is required';
  return luhnValid(cleaned) ? undefined : 'Enter a valid card number';
};

/** Expiry MM/YY, and not in the past relative to the provided reference date. */
export function expiryValidator(now: Date): Validator {
  return (v) => {
    const m = v.trim().match(/^(\d{2})\s*\/\s*(\d{2})$/);
    if (!m) return 'Use MM/YY format';
    const month = Number(m[1]);
    const year = 2000 + Number(m[2]);
    if (month < 1 || month > 12) return 'Invalid month';
    const expiry = new Date(year, month, 0, 23, 59, 59); // last day of month
    return expiry < now ? 'Card has expired' : undefined;
  };
}

export const cvc: Validator = (v) => {
  if (v.trim() === '') return 'CVC is required';
  return /^\d{3,4}$/.test(v.trim()) ? undefined : 'CVC must be 3–4 digits';
};

/**
 * Validate a record of values against a record of validators. Returns a map of
 * field -> error for every failing field (empty map = all valid).
 */
export function validateForm<K extends string>(
  values: Record<K, string>,
  validators: Partial<Record<K, Validator>>,
): Partial<Record<K, string>> {
  const errors: Partial<Record<K, string>> = {};
  for (const key in validators) {
    const validate = validators[key];
    if (!validate) continue;
    const error = validate(values[key] ?? '');
    if (error) errors[key] = error;
  }
  return errors;
}
