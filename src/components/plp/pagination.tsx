'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFilterNav } from './use-filter-nav';

/**
 * Accessible pagination. Chosen over infinite scroll for SEO (each page is a
 * shareable URL), keyboard access, and zero layout shift. Renders a windowed
 * range with ellipses; current page is aria-current.
 */
function pageWindow(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | 'gap')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push('gap');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push('gap');
  pages.push(total);
  return pages;
}

export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const { apply } = useFilterNav();
  if (totalPages <= 1) return null;

  const go = (p: number) => apply({ page: p }, { keepPage: true });
  const pages = pageWindow(page, totalPages);

  const navBtn =
    'grid h-10 min-w-10 place-items-center rounded px-2 text-sm transition-colors duration-micro';

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        className={cn(navBtn, 'text-ink-muted hover:bg-surface-sunken disabled:opacity-40 disabled:hover:bg-transparent')}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {pages.map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} className="px-1 text-ink-subtle" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              navBtn,
              p === page
                ? 'bg-ink font-semibold text-ink-inverse'
                : 'text-ink hover:bg-surface-sunken',
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        className={cn(navBtn, 'text-ink-muted hover:bg-surface-sunken disabled:opacity-40 disabled:hover:bg-transparent')}
        aria-label="Next page"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </nav>
  );
}
