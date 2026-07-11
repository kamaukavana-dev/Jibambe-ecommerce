import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-display text-5xl font-semibold text-accent">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
        We couldn’t find that page
      </h1>
      <p className="mt-2 max-w-md text-ink-muted">
        The link may be broken or the product may have sold out and been removed. Let’s get you
        back to shopping.
      </p>
      <div className="mt-8 flex gap-3">
        <Button asChild>
          <Link href="/">Back home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/shop">Browse products</Link>
        </Button>
      </div>
    </div>
  );
}
