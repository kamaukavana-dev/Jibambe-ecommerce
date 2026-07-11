'use client';

import { Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Accessible quantity control. The number is an aria-live region so screen
 * readers announce changes; buttons disable at their bounds.
 */
interface QuantityStepperProps {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  className?: string;
  label?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  className,
  label = 'Quantity',
}: QuantityStepperProps) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div
      className={cn(
        'inline-flex h-11 items-center rounded border border-border-strong bg-surface-raised',
        className,
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={dec}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className="grid h-full w-10 place-items-center rounded-l text-ink-muted transition-colors duration-micro hover:bg-surface-sunken hover:text-ink disabled:pointer-events-none disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span
        className="w-10 select-none text-center text-sm font-medium tabular-nums"
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={inc}
        disabled={value >= max}
        aria-label="Increase quantity"
        className="grid h-full w-10 place-items-center rounded-r text-ink-muted transition-colors duration-micro hover:bg-surface-sunken hover:text-ink disabled:pointer-events-none disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
