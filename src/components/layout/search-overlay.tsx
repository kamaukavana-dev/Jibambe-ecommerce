'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Search, X, ArrowRight } from 'lucide-react';
import { useUiStore } from '@/store/ui-store';
import { useDebouncedValue } from '@/lib/use-debounced-value';
import { searchProducts } from '@/lib/catalog';
import { formatKsh } from '@/lib/currency';

/**
 * Command-palette search. Opens with the header trigger or ⌘K / Ctrl-K. Results
 * are computed client-side against the catalog and debounced so we don't filter
 * on every keystroke. Enter jumps to the full /search results page.
 */
export function SearchOverlay() {
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const open = useUiStore((s) => s.searchOpen);
  const setOpen = useUiStore((s) => s.setSearchOpen);
  const close = useUiStore((s) => s.closeSearch);
  const [query, setQuery] = useState('');
  const debounced = useDebouncedValue(query, 180);

  // ⌘K / Ctrl-K global shortcut.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  // Close the overlay whenever the route changes (e.g. picking a result), so
  // it never lingers over the destination page.
  useEffect(() => {
    close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Reset the query shortly after close so it doesn't flash on reopen.
  useEffect(() => {
    if (!open) {
      const id = setTimeout(() => setQuery(''), 200);
      return () => clearTimeout(id);
    }
  }, [open]);

  const results = useMemo(
    () => (debounced.trim() ? searchProducts(debounced).slice(0, 6) : []),
    [debounced],
  );

  const goToResults = () => {
    if (!query.trim()) return;
    // Navigate first, then close — closing the Radix dialog before pushing can
    // swallow the navigation as the portal unmounts.
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    close();
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
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
              <motion.div
                className="fixed inset-x-0 top-0 z-50 mx-auto w-full max-w-2xl px-4 pt-4 sm:pt-20"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
                transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
              >
                <Dialog.Title className="sr-only">Search products</Dialog.Title>
                <div className="overflow-hidden rounded-lg border border-border bg-surface-raised shadow-lg">
                  <div className="flex items-center gap-3 border-b border-border px-4">
                    <Search className="h-5 w-5 shrink-0 text-ink-subtle" />
                    {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && goToResults()}
                      placeholder="Search products, brands and categories…"
                      className="h-14 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-subtle"
                      aria-label="Search products"
                    />
                    <Dialog.Close
                      className="grid h-9 w-9 place-items-center rounded text-ink-subtle transition-colors duration-micro hover:bg-surface-sunken hover:text-ink"
                      aria-label="Close search"
                    >
                      <X className="h-5 w-5" />
                    </Dialog.Close>
                  </div>

                  <div className="max-h-[60vh] overflow-y-auto">
                    {debounced.trim() && results.length === 0 && (
                      <div className="px-4 py-10 text-center">
                        <p className="text-sm text-ink-muted">
                          No products match{' '}
                          <span className="font-medium text-ink">“{debounced}”</span>.
                        </p>
                        <p className="mt-1 text-sm text-ink-subtle">
                          Try a brand, category, or a simpler term.
                        </p>
                      </div>
                    )}

                    {results.length > 0 && (
                      <ul className="p-2">
                        {results.map((p) => (
                          <li key={p.id}>
                            <Link
                              href={`/product/${p.slug}`}
                              onClick={close}
                              className="flex items-center gap-3 rounded-md px-2 py-2 transition-colors duration-micro hover:bg-surface-sunken"
                            >
                              <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-surface-sunken">
                                <Image
                                  src={p.images[0] ?? ''}
                                  alt=""
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium text-ink">
                                  {p.name}
                                </span>
                                <span className="block text-xs text-ink-subtle">{p.brand}</span>
                              </span>
                              <span className="text-sm font-semibold tabular-nums text-ink">
                                {formatKsh(p.price)}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}

                    {query.trim() && (
                      <button
                        type="button"
                        onClick={goToResults}
                        className="flex w-full items-center justify-between border-t border-border px-4 py-3 text-sm font-medium text-accent transition-colors duration-micro hover:bg-surface-sunken"
                      >
                        See all results for “{query.trim()}”
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    )}

                    {!query.trim() && (
                      <div className="px-4 py-8 text-center text-sm text-ink-subtle">
                        Start typing to search the catalogue.
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
