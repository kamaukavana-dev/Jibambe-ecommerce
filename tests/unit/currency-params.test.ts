import { describe, it, expect } from 'vitest';
import { formatKsh, discountPercent } from '@/lib/currency';
import { parseFilters, filtersToSearchParams, activeFilterCount } from '@/lib/plp-params';

describe('formatKsh', () => {
  it('formats with the KSh symbol and thousands separators, no decimals', () => {
    expect(formatKsh(145999)).toBe('KSh 145,999');
    expect(formatKsh(0)).toBe('KSh 0');
  });
  it('rounds to whole shillings', () => {
    expect(formatKsh(1499.6)).toBe('KSh 1,500');
  });
});

describe('discountPercent', () => {
  it('computes a rounded percentage', () => {
    expect(discountPercent(8000, 10000)).toBe(20);
  });
  it('returns null when there is no valid discount', () => {
    expect(discountPercent(10000)).toBeNull();
    expect(discountPercent(10000, 9000)).toBeNull();
  });
});

describe('plp params round-trip', () => {
  it('parses defaults from empty params', () => {
    const f = parseFilters({});
    expect(f).toMatchObject({ categories: [], sort: 'featured', page: 1 });
  });

  it('parses categories, price, flags and sort', () => {
    const f = parseFilters({
      category: 'computing,electronics',
      min: '1000',
      max: '50000',
      onSale: 'true',
      sort: 'price-asc',
      page: '2',
    });
    expect(f.categories).toEqual(['computing', 'electronics']);
    expect(f.minPrice).toBe(1000);
    expect(f.maxPrice).toBe(50000);
    expect(f.onSale).toBe(true);
    expect(f.sort).toBe('price-asc');
    expect(f.page).toBe(2);
  });

  it('drops unknown categories and invalid sorts', () => {
    const f = parseFilters({ category: 'computing,banana', sort: 'nonsense' });
    expect(f.categories).toEqual(['computing']);
    expect(f.sort).toBe('featured');
  });

  it('omits defaults when serializing (clean URLs)', () => {
    const sp = filtersToSearchParams(parseFilters({}));
    expect(sp.toString()).toBe('');
  });

  it('serializes then re-parses to the same filters', () => {
    const original = parseFilters({
      category: 'fashion',
      min: '2000',
      onSale: 'true',
      sort: 'rating-desc',
      page: '3',
    });
    const reparsed = parseFilters(
      Object.fromEntries(filtersToSearchParams(original).entries()),
    );
    expect(reparsed).toEqual(original);
  });

  it('counts active filters', () => {
    const f = parseFilters({ category: 'fashion,home', min: '2000', onSale: 'true' });
    expect(activeFilterCount(f)).toBe(4); // 2 categories + min + onSale
  });
});
