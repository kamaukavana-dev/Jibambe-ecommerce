'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatKsh } from '@/lib/currency';
import { useFilterNav } from './use-filter-nav';

/**
 * Min/max price filter. Uses number inputs (accessible, keyboard-friendly, no
 * fiddly dual-thumb slider on mobile) with the catalogue's actual bounds as
 * placeholders. Applies on blur/submit rather than every keystroke.
 */
export function PriceRange({ min, max }: { min: number; max: number }) {
  const { filters, apply } = useFilterNav();
  const [lo, setLo] = useState<string>(filters.minPrice?.toString() ?? '');
  const [hi, setHi] = useState<string>(filters.maxPrice?.toString() ?? '');

  // Keep local inputs in sync when filters change from elsewhere (e.g. chips).
  useEffect(() => {
    setLo(filters.minPrice?.toString() ?? '');
    setHi(filters.maxPrice?.toString() ?? '');
  }, [filters.minPrice, filters.maxPrice]);

  const submit = () => {
    const minPrice = lo === '' ? undefined : Math.max(0, Number.parseInt(lo, 10) || 0);
    const maxPrice = hi === '' ? undefined : Number.parseInt(hi, 10) || undefined;
    apply({ minPrice, maxPrice });
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label htmlFor="price-min" className="sr-only">
            Minimum price
          </label>
          <Input
            id="price-min"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder={formatKsh(min).replace('KSh ', '')}
            value={lo}
            onChange={(e) => setLo(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </div>
        <span className="text-ink-subtle" aria-hidden="true">
          –
        </span>
        <div className="flex-1">
          <label htmlFor="price-max" className="sr-only">
            Maximum price
          </label>
          <Input
            id="price-max"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder={formatKsh(max).replace('KSh ', '')}
            value={hi}
            onChange={(e) => setHi(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
          />
        </div>
      </div>
      <Button variant="outline" size="sm" className="mt-3 w-full" onClick={submit}>
        Apply price
      </Button>
    </div>
  );
}
