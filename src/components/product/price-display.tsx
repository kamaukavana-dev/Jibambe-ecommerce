import { formatKsh, discountPercent } from '@/lib/currency';
import { cn } from '@/lib/utils';

/**
 * Price with optional strikethrough compare-at price and a saving amount. The
 * strikethrough carries an sr-only "was" label so screen readers don't read two
 * bare numbers with no relationship.
 */
interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  sm: 'text-base',
  md: 'text-lg',
  lg: 'text-3xl',
} as const;

export function PriceDisplay({ price, compareAtPrice, size = 'md', className }: PriceDisplayProps) {
  const pct = discountPercent(price, compareAtPrice);
  return (
    <div className={cn('flex flex-wrap items-baseline gap-2', className)}>
      <span className={cn('font-semibold tabular-nums text-ink', sizes[size])}>
        {formatKsh(price)}
      </span>
      {pct !== null && compareAtPrice && (
        <>
          <span className="text-sm text-ink-subtle line-through tabular-nums">
            <span className="sr-only">Was </span>
            {formatKsh(compareAtPrice)}
          </span>
          <span className="text-sm font-semibold text-danger">−{pct}%</span>
        </>
      )}
    </div>
  );
}
