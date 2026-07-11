'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

/**
 * Route-level error boundary. Renders when a segment throws during render, so
 * users see a designed recovery state instead of a blank screen. `reset` retries
 * the segment.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a real app this would go to an error reporter (Sentry, etc.).
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <h1 className="font-display text-2xl font-semibold text-ink">Something went wrong</h1>
      <p className="mt-2 max-w-md text-ink-muted">
        We hit an unexpected error loading this page. You can try again — if it keeps happening,
        head back home.
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <a href="/">Back home</a>
        </Button>
      </div>
    </div>
  );
}
