import type { Product } from '@/types';
import { ProductCard } from './product-card';
import { cn } from '@/lib/utils';

/**
 * Responsive product grid: 1 → 2 (sm) → 3 (lg) → 4 (xl) columns, per the
 * design system. `priorityCount` eager-loads the first row's images (above the
 * fold) so the LCP image isn't lazy.
 */
export function ProductGrid({
  products,
  priorityCount = 0,
  className,
}: {
  products: Product[];
  priorityCount?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className,
      )}
    >
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
