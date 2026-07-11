'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { categories } from '@/data/categories';
import type { Product } from '@/types';
import { priceBounds } from '@/lib/catalog';
import { PriceRange } from './price-range';
import { useFilterNav } from './use-filter-nav';

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border py-5 first:pt-0">
      <h2 className="mb-3 text-sm font-semibold text-ink">{title}</h2>
      {children}
    </div>
  );
}

/**
 * The PLP faceted filter rail. Renders category checkboxes (with per-category
 * counts from the full catalogue), price range, and boolean facets. All state
 * lives in the URL via useFilterNav — this component holds none of its own.
 */
export function FilterSidebar({ allProducts }: { allProducts: Product[] }) {
  const { filters, toggleCategory, apply } = useFilterNav();
  const bounds = priceBounds(allProducts);

  const countFor = (slug: string) => allProducts.filter((p) => p.category === slug).length;

  return (
    <div>
      <FilterGroup title="Category">
        <ul className="space-y-1">
          {categories.map((c) => {
            const checked = filters.categories.includes(c.slug);
            return (
              <li key={c.slug}>
                <label className="flex cursor-pointer items-center gap-3 rounded px-1 py-1.5 text-sm transition-colors duration-micro hover:bg-surface-sunken">
                  <Checkbox checked={checked} onCheckedChange={() => toggleCategory(c.slug)} />
                  <span className="flex-1 text-ink">{c.name}</span>
                  <span className="text-xs tabular-nums text-ink-subtle">{countFor(c.slug)}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </FilterGroup>

      <FilterGroup title="Price (KSh)">
        <PriceRange min={bounds.min} max={bounds.max} />
      </FilterGroup>

      <FilterGroup title="Availability">
        <div className="space-y-1">
          <label className="flex cursor-pointer items-center gap-3 rounded px-1 py-1.5 text-sm transition-colors duration-micro hover:bg-surface-sunken">
            <Checkbox
              checked={filters.onSale ?? false}
              onCheckedChange={(v) => apply({ onSale: Boolean(v) })}
            />
            <span className="text-ink">On sale</span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded px-1 py-1.5 text-sm transition-colors duration-micro hover:bg-surface-sunken">
            <Checkbox
              checked={filters.inStockOnly ?? false}
              onCheckedChange={(v) => apply({ inStockOnly: Boolean(v) })}
            />
            <span className="text-ink">In stock only</span>
          </label>
        </div>
      </FilterGroup>
    </div>
  );
}
