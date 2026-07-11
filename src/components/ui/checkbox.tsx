'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Styled Radix checkbox. Accessible by default (role, keyboard, aria-checked);
 * pair with a <label htmlFor> or wrap in a label for a clickable row.
 */
export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'grid h-5 w-5 shrink-0 place-items-center rounded-sm border border-border-strong bg-surface-raised',
      'transition-colors duration-micro',
      'data-[state=checked]:border-accent data-[state=checked]:bg-accent data-[state=checked]:text-accent-fg',
      'disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator>
      <Check className="h-3.5 w-3.5" strokeWidth={3} />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = 'Checkbox';
