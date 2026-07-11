'use client';

import type { SortKey } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SORT_LABELS } from '@/lib/plp-params';
import { useFilterNav } from './use-filter-nav';

export function SortSelect() {
  const { filters, apply } = useFilterNav();
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="hidden text-sm text-ink-muted sm:inline">
        Sort
      </label>
      <Select value={filters.sort} onValueChange={(v) => apply({ sort: v as SortKey })}>
        <SelectTrigger id="sort" className="min-w-[160px]" aria-label="Sort products">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
            <SelectItem key={key} value={key}>
              {SORT_LABELS[key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
