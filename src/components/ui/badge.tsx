import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-semibold uppercase tracking-wide',
  {
    variants: {
      variant: {
        neutral: 'bg-surface-sunken text-ink-muted',
        accent: 'bg-accent text-accent-fg',
        sale: 'bg-danger text-white',
        new: 'bg-ink text-ink-inverse',
        success: 'bg-success-subtle text-success',
        warning: 'bg-warning-subtle text-warning',
        outline: 'border border-border-strong text-ink-muted',
      },
    },
    defaultVariants: { variant: 'neutral' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
