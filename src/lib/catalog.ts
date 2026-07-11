import type { Product, ProductFilters, SortKey } from '@/types';
import { products } from '@/data/products';

/**
 * Pure catalog querying — filter, sort, search, paginate, relate. No React, no
 * URL parsing (that lives in the PLP), no store. Unit-tested in isolation.
 */

export const PAGE_SIZE = 8;

export function priceBounds(list: Product[] = products): { min: number; max: number } {
  if (list.length === 0) return { min: 0, max: 0 };
  let min = Infinity;
  let max = -Infinity;
  for (const p of list) {
    if (p.price < min) min = p.price;
    if (p.price > max) max = p.price;
  }
  return { min, max };
}

/** Normalise text for case/diacritic-insensitive matching. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // strip combining diacritics
    .trim();
}

/**
 * Lightweight relevance search across name, brand, category, description and
 * features. Returns products that match ALL whitespace-separated terms (AND),
 * ranked by where the match lands (name > brand > features > description).
 */
export function searchProducts(query: string, list: Product[] = products): Product[] {
  const q = normalize(query);
  if (!q) return [];
  const terms = q.split(/\s+/);

  const scored: Array<{ product: Product; score: number }> = [];
  for (const product of list) {
    const name = normalize(product.name);
    const brand = normalize(product.brand);
    const category = product.category;
    const features = normalize(product.features.join(' '));
    const description = normalize(product.description);
    const haystack = `${name} ${brand} ${category} ${features} ${description}`;

    if (!terms.every((t) => haystack.includes(t))) continue;

    let score = 0;
    for (const t of terms) {
      if (name.includes(t)) score += 8;
      if (name.startsWith(t)) score += 4;
      if (brand.includes(t)) score += 5;
      if (category.includes(t)) score += 3;
      if (features.includes(t)) score += 2;
      if (description.includes(t)) score += 1;
    }
    scored.push({ product, score });
  }

  return scored.sort((a, b) => b.score - a.score).map((s) => s.product);
}

const sorters: Record<SortKey, (a: Product, b: Product) => number> = {
  featured: (a, b) => b.sold - a.sold,
  'price-asc': (a, b) => a.price - b.price,
  'price-desc': (a, b) => b.price - a.price,
  'rating-desc': (a, b) => b.rating - a.rating,
  // "Newest" approximated by highest id (catalog is append-ordered).
  newest: (a, b) => b.id - a.id,
};

export function sortProducts(list: Product[], sort: SortKey): Product[] {
  return [...list].sort(sorters[sort]);
}

export interface FilterResult {
  items: Product[];
  total: number;
  totalPages: number;
  page: number;
}

/**
 * Apply the full PLP filter/sort/paginate pipeline and return the current page
 * plus pagination metadata. Filtering happens before sorting before slicing.
 */
export function filterProducts(
  filters: ProductFilters,
  list: Product[] = products,
): FilterResult {
  let items = filters.query ? searchProducts(filters.query, list) : [...list];

  if (filters.categories.length > 0) {
    const set = new Set(filters.categories);
    items = items.filter((p) => set.has(p.category));
  }
  if (typeof filters.minPrice === 'number') {
    items = items.filter((p) => p.price >= filters.minPrice!);
  }
  if (typeof filters.maxPrice === 'number') {
    items = items.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.onSale) {
    items = items.filter((p) => typeof p.compareAtPrice === 'number');
  }
  if (filters.inStockOnly) {
    items = items.filter((p) => p.stock > 0);
  }

  // A text query already returns relevance order; only re-sort when the user
  // explicitly picked a non-default sort.
  if (!filters.query || filters.sort !== 'featured') {
    items = sortProducts(items, filters.sort);
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, filters.page), totalPages);
  const start = (page - 1) * PAGE_SIZE;
  return {
    items: items.slice(start, start + PAGE_SIZE),
    total,
    totalPages,
    page,
  };
}

/** Related products: same category first, then bestsellers, excluding self. */
export function relatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .sort((a, b) => b.sold - a.sold);

  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const fillers = products
    .filter((p) => p.id !== product.id && p.category !== product.category)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, limit - sameCategory.length);

  return [...sameCategory, ...fillers];
}

export function getProductsByIds(ids: number[]): Product[] {
  const byId = new Map(products.map((p) => [p.id, p]));
  return ids.map((id) => byId.get(id)).filter((p): p is Product => Boolean(p));
}

export function featuredProducts(limit = 8): Product[] {
  return products.filter((p) => p.tags?.includes('featured')).slice(0, limit);
}

export function bestsellers(limit = 8): Product[] {
  return [...products].sort((a, b) => b.sold - a.sold).slice(0, limit);
}

export function newArrivals(limit = 8): Product[] {
  return products.filter((p) => p.tags?.includes('new')).slice(0, limit);
}
