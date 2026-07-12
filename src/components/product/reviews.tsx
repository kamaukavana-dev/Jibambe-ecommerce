import type { Review } from '@/types';
import { RatingStars } from './rating-stars';
import { ReviewAvatar } from './review-avatar';

/** Review list with an aggregate summary. Server-rendered (static content). */
export function Reviews({ reviews, rating }: { reviews: Review[]; rating: number }) {
  if (reviews.length === 0) {
    return <p className="text-ink-muted">No reviews yet — be the first to review this product.</p>;
  }

  return (
    <div>
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <p className="font-display text-4xl font-semibold text-ink">{rating.toFixed(1)}</p>
        <div>
          <RatingStars rating={rating} size="md" />
          <p className="mt-1 text-sm text-ink-muted">
            Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </p>
        </div>
      </div>

      <ul className="divide-y divide-border">
        {reviews.map((r, i) => (
          <li key={`${r.author}-${i}`} className="py-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <ReviewAvatar name={r.author} className="h-9 w-9 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-ink">{r.author}</p>
                  <RatingStars rating={r.rating} />
                </div>
              </div>
              <time className="text-xs text-ink-subtle" dateTime={r.date}>
                {new Date(r.date).toLocaleDateString('en-KE', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
            </div>
            <p className="mt-3 text-ink-muted">{r.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
