import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Star rating. Renders a single accessible label ("4.8 out of 5") rather than
 * five separate icons for AT, and draws fractional fill with a clipped overlay.
 */
interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md';
  className?: string;
}

export function RatingStars({ rating, count, size = 'sm', className }: RatingStarsProps) {
  const dim = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span
        className="relative inline-flex"
        role="img"
        aria-label={`Rated ${rating} out of 5`}
      >
        <span className="flex text-border-strong">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={dim} strokeWidth={1.5} />
          ))}
        </span>
        <span
          className="absolute inset-0 flex overflow-hidden text-warning"
          style={{ width: `${pct}%` }}
          aria-hidden="true"
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn(dim, 'shrink-0 fill-current')} strokeWidth={1.5} />
          ))}
        </span>
      </span>
      {typeof count === 'number' && (
        <span className="text-sm text-ink-muted">
          {rating.toFixed(1)}
          <span className="text-ink-subtle"> ({count})</span>
        </span>
      )}
    </div>
  );
}
