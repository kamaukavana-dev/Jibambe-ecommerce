import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Consistent section header for the home page: an editorial title with an
 * optional "see all" link that stays keyboard-reachable.
 */
export function SectionHeading({
  title,
  subtitle,
  href,
  linkLabel = 'See all',
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        {subtitle && (
          <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-accent">
            {subtitle}
          </p>
        )}
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-ink-muted transition-colors duration-micro hover:text-accent"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform duration-micro group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
