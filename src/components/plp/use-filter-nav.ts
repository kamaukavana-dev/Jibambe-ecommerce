'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ProductFilters } from '@/types';
import { filtersToSearchParams, parseFilters } from '@/lib/plp-params';

/**
 * Reads the current filters from the URL and returns helpers to update them.
 * Every filter change resets the page to 1 (except an explicit page change),
 * and navigation uses `scroll: false` so changing a filter doesn't jump the
 * viewport to the top mid-interaction.
 */
export function useFilterNav() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = parseFilters(Object.fromEntries(searchParams.entries()));

  const apply = useCallback(
    (next: Partial<ProductFilters>, opts?: { keepPage?: boolean }) => {
      const merged: ProductFilters = {
        ...filters,
        ...next,
        page: opts?.keepPage ? (next.page ?? filters.page) : 1,
      };
      const sp = filtersToSearchParams(merged);
      const qs = sp.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [filters, pathname, router],
  );

  const toggleCategory = useCallback(
    (slug: ProductFilters['categories'][number]) => {
      const set = new Set(filters.categories);
      if (set.has(slug)) set.delete(slug);
      else set.add(slug);
      apply({ categories: Array.from(set) });
    },
    [filters.categories, apply],
  );

  const clearAll = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return { filters, apply, toggleCategory, clearAll };
}
