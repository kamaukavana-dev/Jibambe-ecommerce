import { describe, it, expect } from 'vitest';
import {
  email,
  kenyanPhone,
  luhnValid,
  cardNumber,
  cvc,
  expiryValidator,
  required,
  minLength,
  validateForm,
} from '@/lib/validation';

describe('email', () => {
  it('accepts a normal address', () => {
    expect(email('daniel@example.com')).toBeUndefined();
  });
  it('rejects malformed addresses and empties', () => {
    expect(email('nope')).toBeDefined();
    expect(email('a@b')).toBeDefined();
    expect(email('')).toBeDefined();
  });
});

describe('kenyanPhone', () => {
  it('accepts 07/01 and +254 formats, with spaces', () => {
    expect(kenyanPhone('0712345678')).toBeUndefined();
    expect(kenyanPhone('0112345678')).toBeUndefined();
    expect(kenyanPhone('+254712345678')).toBeUndefined();
    expect(kenyanPhone('0712 345 678')).toBeUndefined();
  });
  it('rejects wrong length or prefix', () => {
    expect(kenyanPhone('071234567')).toBeDefined();
    expect(kenyanPhone('0812345678')).toBeDefined();
    expect(kenyanPhone('')).toBeDefined();
  });
});

describe('luhnValid / cardNumber', () => {
  it('accepts known Luhn-valid test numbers', () => {
    expect(luhnValid('4242424242424242')).toBe(true);
    expect(cardNumber('4242 4242 4242 4242')).toBeUndefined();
  });
  it('rejects a number that fails the checksum', () => {
    expect(luhnValid('4242424242424241')).toBe(false);
    expect(cardNumber('1234 5678 9012 3456')).toBeDefined();
  });
});

describe('cvc', () => {
  it('accepts 3–4 digits', () => {
    expect(cvc('123')).toBeUndefined();
    expect(cvc('1234')).toBeUndefined();
  });
  it('rejects wrong length / non-digits', () => {
    expect(cvc('12')).toBeDefined();
    expect(cvc('12a')).toBeDefined();
  });
});

describe('expiryValidator', () => {
  const now = new Date(2026, 5, 15); // 15 June 2026 (month is 0-indexed)
  const validate = expiryValidator(now);
  it('accepts a future expiry', () => {
    expect(validate('08/28')).toBeUndefined();
  });
  it('accepts the current month', () => {
    expect(validate('06/26')).toBeUndefined();
  });
  it('rejects a past expiry and bad formats', () => {
    expect(validate('05/26')).toBeDefined();
    expect(validate('13/28')).toBeDefined();
    expect(validate('8-28')).toBeDefined();
  });
});

describe('validateForm', () => {
  it('returns an error map for failing fields only', () => {
    const errors = validateForm(
      { name: '', bio: 'hello' },
      { name: required('Name'), bio: minLength(3, 'Bio') },
    );
    expect(errors.name).toBeDefined();
    expect(errors.bio).toBeUndefined();
  });

  it('is empty when everything passes', () => {
    const errors = validateForm({ name: 'Daniel' }, { name: required('Name') });
    expect(Object.keys(errors)).toHaveLength(0);
  });
});
