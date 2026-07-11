import type { CategorySlug, ProductFilters, SortKey } from '@/types';
import { categories } from '@/data/categories';

/**
 * Bidirectional mapping between URL search params and the ProductFilters shape.
 * Kept pure and framework-free so it's unit-testable and usable on both the
 * server (page reads searchParams) and client (controls write them).
 */

const VALID_SORTS: SortKey[] = ['featured', 'price-asc', 'price-desc', 'rating-desc', 'newest'];
const VALID_CATEGORIES = new Set<string>(categories.map((c) => c.slug));

export const SORT_LABELS: Record<SortKey, string> = {
  featured: 'Featured',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  'rating-desc': 'Top rated',
  newest: 'Newest',
};

/** URL search params can arrive as string | string[] | undefined (Next.js). */
export type RawSearchParams = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function toInt(v: string | undefined): number | undefined {
  if (v === undefined) return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : undefined;
}

export function parseFilters(params: RawSearchParams): ProductFilters {
  const categoryRaw = first(params.category);
  const categoriesList = categoryRaw
    ? categoryRaw
        .split(',')
        .filter((c): c is CategorySlug => VALID_CATEGORIES.has(c))
    : [];

  const sortRaw = first(params.sort);
  const sort: SortKey = VALID_SORTS.includes(sortRaw as SortKey)
    ? (sortRaw as SortKey)
    : 'featured';

  return {
    categories: categoriesList,
    minPrice: toInt(first(params.min)),
    maxPrice: toInt(first(params.max)),
    onSale: first(params.onSale) === 'true',
    inStockOnly: first(params.inStock) === 'true',
    query: first(params.q)?.trim() || undefined,
    sort,
    page: Math.max(1, toInt(first(params.page)) ?? 1),
  };
}

/**
 * Serialize filters back to a URLSearchParams. Defaults are omitted so the URL
 * stays clean (e.g. no `?sort=featured&page=1`).
 */
export function filtersToSearchParams(filters: ProductFilters): URLSearchParams {
  const sp = new URLSearchParams();
  if (filters.categories.length) sp.set('category', filters.categories.join(','));
  if (typeof filters.minPrice === 'number') sp.set('min', String(filters.minPrice));
  if (typeof filters.maxPrice === 'number') sp.set('max', String(filters.maxPrice));
  if (filters.onSale) sp.set('onSale', 'true');
  if (filters.inStockOnly) sp.set('inStock', 'true');
  if (filters.query) sp.set('q', filters.query);
  if (filters.sort !== 'featured') sp.set('sort', filters.sort);
  if (filters.page > 1) sp.set('page', String(filters.page));
  return sp;
}

/** Count of active, user-facing filters (for the mobile "Filters (n)" badge). */
export function activeFilterCount(filters: ProductFilters): number {
  let n = filters.categories.length;
  if (typeof filters.minPrice === 'number') n += 1;
  if (typeof filters.maxPrice === 'number') n += 1;
  if (filters.onSale) n += 1;
  if (filters.inStockOnly) n += 1;
  return n;
}
