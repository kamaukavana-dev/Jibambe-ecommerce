import { describe, it, expect } from 'vitest';
import {
  filterProducts,
  searchProducts,
  sortProducts,
  relatedProducts,
  priceBounds,
  PAGE_SIZE,
} from '@/lib/catalog';
import { products } from '@/data/products';
import type { ProductFilters } from '@/types';

const baseFilters = (over: Partial<ProductFilters> = {}): ProductFilters => ({
  categories: [],
  sort: 'featured',
  page: 1,
  ...over,
});

describe('catalog integrity', () => {
  it('has at least 24 products across 4+ categories with unique slugs/ids', () => {
    expect(products.length).toBeGreaterThanOrEqual(24);
    expect(new Set(products.map((p) => p.category)).size).toBeGreaterThanOrEqual(4);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
  });

  it('never sells a compare-at price below the current price', () => {
    for (const p of products) {
      if (p.compareAtPrice !== undefined) expect(p.compareAtPrice).toBeGreaterThan(p.price);
    }
  });
});

describe('searchProducts', () => {
  it('finds by brand', () => {
    const r = searchProducts('samsung');
    expect(r.length).toBeGreaterThan(0);
    expect(r.every((p) => `${p.brand} ${p.name}`.toLowerCase().includes('samsung'))).toBe(true);
  });

  it('ranks a name match above a description-only match', () => {
    const r = searchProducts('iphone');
    expect(r[0]?.name.toLowerCase()).toContain('iphone');
  });

  it('is case- and space-insensitive and ANDs terms', () => {
    expect(searchProducts('  GALAXY   ultra ').length).toBeGreaterThan(0);
  });

  it('returns nothing for gibberish', () => {
    expect(searchProducts('zzzznotathing')).toHaveLength(0);
  });

  it('returns nothing for an empty query', () => {
    expect(searchProducts('   ')).toHaveLength(0);
  });
});

describe('sortProducts', () => {
  it('sorts price ascending and descending', () => {
    const asc = sortProducts(products, 'price-asc');
    const desc = sortProducts(products, 'price-desc');
    expect(asc[0]!.price).toBeLessThanOrEqual(asc[asc.length - 1]!.price);
    expect(desc[0]!.price).toBeGreaterThanOrEqual(desc[desc.length - 1]!.price);
  });

  it('does not mutate the input array', () => {
    const before = products.map((p) => p.id);
    sortProducts(products, 'price-desc');
    expect(products.map((p) => p.id)).toEqual(before);
  });
});

describe('filterProducts', () => {
  it('paginates to PAGE_SIZE and reports totals', () => {
    const r = filterProducts(baseFilters());
    expect(r.items.length).toBeLessThanOrEqual(PAGE_SIZE);
    expect(r.total).toBe(products.length);
    expect(r.totalPages).toBe(Math.ceil(products.length / PAGE_SIZE));
  });

  it('filters by category', () => {
    const r = filterProducts(baseFilters({ categories: ['computing'] }));
    expect(r.items.every((p) => p.category === 'computing')).toBe(true);
    expect(r.total).toBe(products.filter((p) => p.category === 'computing').length);
  });

  it('applies a price range', () => {
    const r = filterProducts(baseFilters({ minPrice: 10000, maxPrice: 50000 }));
    expect(r.items.every((p) => p.price >= 10000 && p.price <= 50000)).toBe(true);
  });

  it('restricts to on-sale items', () => {
    const r = filterProducts(baseFilters({ onSale: true }));
    expect(r.items.every((p) => p.compareAtPrice !== undefined)).toBe(true);
  });

  it('clamps an out-of-range page to the last page', () => {
    const r = filterProducts(baseFilters({ page: 999 }));
    expect(r.page).toBe(r.totalPages);
    expect(r.items.length).toBeGreaterThan(0);
  });

  it('combines search with a category filter', () => {
    const r = filterProducts(baseFilters({ query: 'apple', categories: ['computing'] }));
    expect(r.items.every((p) => p.category === 'computing')).toBe(true);
  });
});

describe('relatedProducts', () => {
  it('excludes the product itself and prefers same category', () => {
    const p = products.find((x) => x.category === 'electronics')!;
    const related = relatedProducts(p, 4);
    expect(related).toHaveLength(4);
    expect(related.some((r) => r.id === p.id)).toBe(false);
    expect(related.some((r) => r.category === 'electronics')).toBe(true);
  });
});

describe('priceBounds', () => {
  it('returns the catalogue min and max', () => {
    const { min, max } = priceBounds();
    expect(min).toBe(Math.min(...products.map((p) => p.price)));
    expect(max).toBe(Math.max(...products.map((p) => p.price)));
  });
});
