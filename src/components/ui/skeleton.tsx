import { cn } from '@/lib/utils';

/**
 * Loading placeholder. Uses the token-driven `.skeleton` shimmer from
 * globals.css (which collapses under prefers-reduced-motion). Give it explicit
 * dimensions matching the content it stands in for, so there is no layout shift
 * when the real content arrives.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton rounded', className)} aria-hidden="true" />;
}
