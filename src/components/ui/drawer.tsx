'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Slide-over drawer built on Radix Dialog — so focus trapping, Escape-to-close,
 * scroll locking and `aria-modal` come for free (a11y requirement). Framer
 * Motion animates the slide from the right (spatial: the cart lives top-right);
 * the animation collapses to a fade under prefers-reduced-motion.
 */
interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  side?: 'right' | 'left';
  className?: string;
}

export function Drawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  side = 'right',
  className,
}: DrawerProps) {
  const reduce = useReducedMotion();
  const offX = side === 'right' ? '100%' : '-100%';

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.aside
                className={cn(
                  'fixed inset-y-0 z-50 flex w-full max-w-md flex-col bg-surface shadow-lg',
                  side === 'right' ? 'right-0' : 'left-0',
                  className,
                )}
                initial={reduce ? { opacity: 0 } : { x: offX }}
                animate={reduce ? { opacity: 1 } : { x: 0 }}
                exit={reduce ? { opacity: 0 } : { x: offX }}
                transition={{ type: 'tween', ease: [0.2, 0, 0, 1], duration: 0.32 }}
              >
                <header className="flex items-center justify-between border-b border-border px-5 py-4">
                  <Dialog.Title className="font-display text-lg font-semibold text-ink">
                    {title}
                  </Dialog.Title>
                  {description && (
                    <Dialog.Description className="sr-only">{description}</Dialog.Description>
                  )}
                  <Dialog.Close
                    className="-mr-2 grid h-10 w-10 place-items-center rounded text-ink-muted transition-colors duration-micro hover:bg-surface-sunken hover:text-ink"
                    aria-label="Close"
                  >
                    <X className="h-5 w-5" />
                  </Dialog.Close>
                </header>
                {children}
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
