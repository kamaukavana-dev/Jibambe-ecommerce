'use client';

import { useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Search, SearchX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/product/product-grid';
import { searchProducts } from '@/lib/catalog';
import { useDebouncedValue } from '@/lib/use-debounced-value';

/**
 * Full search results page. Seeds from the ?q= param, lets the user refine in
 * place (debounced), and keeps the URL in sync so results stay shareable.
 * Empty state is designed and suggests next steps.
 */
export function SearchView({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);
  const debounced = useDebouncedValue(query, 200);

  const results = useMemo(
    () => (debounced.trim() ? searchProducts(debounced) : []),
    [debounced],
  );

  // Reflect the debounced query in the URL without a navigation/scroll.
  const syncUrl = (q: string) => {
    const url = q.trim() ? `${pathname}?q=${encodeURIComponent(q.trim())}` : pathname;
    window.history.replaceState(null, '', url);
  };

  return (
    <div>
      <div className="relative mb-8 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-subtle" />
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        <Input
          autoFocus
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            syncUrl(e.target.value);
          }}
          placeholder="Search products, brands and categories…"
          className="h-12 pl-11 text-base"
          aria-label="Search products"
        />
      </div>

      {!debounced.trim() ? (
        <p className="text-ink-muted">Type above to search the catalogue.</p>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-20 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-surface-sunken">
            <SearchX className="h-6 w-6 text-ink-subtle" />
          </div>
          <h2 className="mt-4 font-display text-lg font-semibold text-ink">No results</h2>
          <p className="mt-1 max-w-sm text-ink-muted">
            Nothing matches <span className="font-medium text-ink">“{debounced}”</span>. Try a
            brand or category name, or browse everything.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => router.push('/shop')}>
            Browse all products
          </Button>
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm text-ink-muted" aria-live="polite">
            <span className="font-semibold text-ink">{results.length}</span>{' '}
            {results.length === 1 ? 'result' : 'results'} for “{debounced}”
          </p>
          <ProductGrid products={results} priorityCount={4} />
        </>
      )}
    </div>
  );
}
