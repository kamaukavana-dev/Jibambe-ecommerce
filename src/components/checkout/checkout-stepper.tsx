'use client';

import { usePathname } from 'next/navigation';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { key: 'shipping', label: 'Shipping', href: '/checkout/shipping' },
  { key: 'payment', label: 'Payment', href: '/checkout/payment' },
  { key: 'confirmation', label: 'Confirmation', href: '/checkout/confirmation' },
] as const;

/** Visual progress indicator for the 3-step checkout. */
export function CheckoutStepper() {
  const pathname = usePathname();
  const currentIndex = Math.max(
    0,
    steps.findIndex((s) => pathname.startsWith(s.href)),
  );

  return (
    <nav aria-label="Checkout progress" className="mb-10">
      <ol className="flex items-center">
        {steps.map((step, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          return (
            <li key={step.key} className="flex flex-1 items-center last:flex-none">
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    'grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 text-sm font-semibold transition-colors duration-state',
                    done && 'border-accent bg-accent text-accent-fg',
                    active && 'border-accent text-accent',
                    !done && !active && 'border-border-strong text-ink-subtle',
                  )}
                  aria-current={active ? 'step' : undefined}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={cn(
                    'text-sm font-medium',
                    active ? 'text-ink' : 'text-ink-muted',
                    'hidden sm:inline',
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <span
                  className={cn(
                    'mx-3 h-px flex-1 transition-colors duration-state',
                    done ? 'bg-accent' : 'bg-border',
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
