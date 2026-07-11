import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Text input with an error state wired to the form-validation tokens. When
 * `invalid` is set the border/ring turn danger-coloured and `aria-invalid` is
 * emitted so assistive tech announces it.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'h-11 w-full rounded border bg-surface-raised px-3 text-sm text-ink',
        'placeholder:text-ink-subtle',
        'transition-[border-color,box-shadow] duration-micro',
        'disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:opacity-60',
        invalid
          ? 'border-danger focus-visible:ring-danger'
          : 'border-border-strong hover:border-ink-subtle',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn('mb-1.5 block text-sm font-medium text-ink', className)}
    {...props}
  />
));
Label.displayName = 'Label';

/** Inline field error — visible text plus an accessible live region. */
export function FieldError({ id, children }: { id?: string; children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-1.5 text-sm text-danger" role="alert">
      {children}
    </p>
  );
}
