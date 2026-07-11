'use client';

import { SearchX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFilterNav } from './use-filter-nav';

/** Designed empty state for when filters/search return nothing. */
export function EmptyResults({ query }: { query?: string }) {
  const { clearAll } = useFilterNav();
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-surface-sunken">
        <SearchX className="h-6 w-6 text-ink-subtle" />
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-ink">No products found</h3>
      <p className="mt-1 max-w-sm text-sm text-ink-muted">
        {query ? (
          <>
            Nothing matches <span className="font-medium text-ink">“{query}”</span> with the
            current filters.
          </>
        ) : (
          'No products match the current filters. Try widening your price range or removing a facet.'
        )}
      </p>
      <Button variant="outline" className="mt-6" onClick={clearAll}>
        Clear filters
      </Button>
    </div>
  );
}
