'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import type { Product } from '@/types';
import { Drawer } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { FilterSidebar } from './filter-sidebar';
import { SortSelect } from './sort-select';
import { useFilterNav } from './use-filter-nav';
import { activeFilterCount } from '@/lib/plp-params';

/**
 * The PLP toolbar. On desktop, filters live in a persistent left rail (rendered
 * by the page) and this shows the result count + sort. On mobile/tablet, the
 * filter rail collapses into a drawer opened from the "Filters" button here.
 */
export function PlpControls({ total, allProducts }: { total: number; allProducts: Product[] }) {
  const [open, setOpen] = useState(false);
  const { filters } = useFilterNav();
  const count = activeFilterCount(filters);

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm text-ink-muted" aria-live="polite">
        <span className="font-semibold text-ink">{total}</span>{' '}
        {total === 1 ? 'product' : 'products'}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          id="plp-filters-button"
          className="lg:hidden"
          onClick={() => setOpen(true)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {count > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs font-semibold text-accent-fg">
              {count}
            </span>
          )}
        </Button>
        <SortSelect />
      </div>

      <Drawer
        open={open}
        onOpenChange={setOpen}
        title="Filters"
        side="left"
        returnFocusTo="#plp-filters-button"
      >
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <FilterSidebar allProducts={allProducts} />
        </div>
        <div className="border-t border-border p-4">
          <Button className="w-full" onClick={() => setOpen(false)}>
            Show {total} {total === 1 ? 'result' : 'results'}
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
