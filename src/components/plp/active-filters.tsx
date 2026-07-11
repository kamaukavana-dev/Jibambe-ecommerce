'use client';

import { X } from 'lucide-react';
import { categoryBySlug } from '@/data/categories';
import { formatKsh } from '@/lib/currency';
import { activeFilterCount } from '@/lib/plp-params';
import { useFilterNav } from './use-filter-nav';

/**
 * Removable chips summarising the active filters, plus a "Clear all". Gives
 * users a clear model of what's narrowing their results and a one-tap escape.
 */
export function ActiveFilters() {
  const { filters, toggleCategory, apply, clearAll } = useFilterNav();
  if (activeFilterCount(filters) === 0) return null;

  const chip = (key: string, label: string, onRemove: () => void) => (
    <button
      key={key}
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface-raised py-1 pl-3 pr-2 text-sm text-ink transition-colors duration-micro hover:bg-surface-sunken"
    >
      {label}
      <X className="h-3.5 w-3.5 text-ink-muted" />
      <span className="sr-only">Remove filter</span>
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.categories.map((slug) =>
        chip(slug, categoryBySlug.get(slug)?.name ?? slug, () => toggleCategory(slug)),
      )}
      {typeof filters.minPrice === 'number' &&
        chip('min', `From ${formatKsh(filters.minPrice)}`, () => apply({ minPrice: undefined }))}
      {typeof filters.maxPrice === 'number' &&
        chip('max', `Up to ${formatKsh(filters.maxPrice)}`, () => apply({ maxPrice: undefined }))}
      {filters.onSale && chip('sale', 'On sale', () => apply({ onSale: false }))}
      {filters.inStockOnly && chip('stock', 'In stock', () => apply({ inStockOnly: false }))}
      <button
        type="button"
        onClick={clearAll}
        className="ml-1 text-sm font-medium text-accent underline-offset-4 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
