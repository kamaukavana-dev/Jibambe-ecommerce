import type { Metadata } from 'next';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { CheckoutStepper } from '@/components/checkout/checkout-stepper';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: { index: false, follow: false },
};

/**
 * Checkout wrapper: a distraction-reduced shell (own compact header link, no
 * marketing nav pulling focus) with the shared step indicator. Each step page
 * renders inside.
 */
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-page max-w-content py-8">
      <Link href="/" className="mb-8 flex items-center gap-2" aria-label="Jibambe home">
        <span className="grid h-8 w-8 place-items-center rounded bg-accent text-accent-fg">
          <ShoppingBag className="h-4 w-4" />
        </span>
        <span className="font-display text-lg font-semibold text-ink">Jibambe</span>
      </Link>
      <CheckoutStepper />
      {children}
    </div>
  );
}
