'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import type { Product } from '@/types';
import { discountPercent } from '@/lib/currency';
import { useCartStore } from '@/store/cart-store';
import { PriceDisplay } from './price-display';
import { RatingStars } from './rating-stars';
import { WishlistToggle } from './wishlist-toggle';
import { Badge } from '@/components/ui/badge';

/**
 * The catalog's workhorse card — used on Home, PLP, search, wishlist and
 * related rails. The whole card is a link to the PDP; the wishlist and quick-add
 * controls stopPropagation so they act without navigating. Image uses a fixed
 * aspect ratio so the grid never shifts as images load.
 */
interface ProductCardProps {
  product: Product;
  /** Priority-load the first row of images (above the fold). */
  priority?: boolean;
  sizes?: string;
}

export function ProductCard({
  product,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
}: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const pct = discountPercent(product.price, product.compareAtPrice);
  const hasVariants = Boolean(product.variants?.length);
  const outOfStock = product.stock <= 0;

  const quickAdd = () => {
    // Products with variants must be configured on the PDP; quick-add only
    // applies to simple products.
    addItem({ product, unitPrice: product.price });
  };

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-sunken">
        <Link href={`/product/${product.slug}`} className="absolute inset-0" aria-label={product.name}>
          <Image
            src={product.images[0] ?? ''}
            alt={product.name}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-overlay ease-standard group-hover:scale-105"
          />
        </Link>

        {/* Merchandising badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {pct !== null && <Badge variant="sale">−{pct}%</Badge>}
          {product.tags?.includes('new') && pct === null && <Badge variant="new">New</Badge>}
          {product.tags?.includes('bestseller') && (
            <Badge variant="accent">Bestseller</Badge>
          )}
        </div>

        <div className="absolute right-3 top-3">
          <WishlistToggle productId={product.id} productName={product.name} />
        </div>

        {/* Quick add — appears on hover/focus for non-variant, in-stock items */}
        {!hasVariants && !outOfStock && (
          <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-state ease-standard group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100">
            <button
              type="button"
              onClick={quickAdd}
              className="flex h-10 w-full items-center justify-center gap-2 rounded bg-ink text-sm font-medium text-ink-inverse shadow-sm transition-colors duration-micro hover:bg-stone-800"
            >
              <ShoppingBag className="h-4 w-4" />
              Quick add
            </button>
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-x-3 bottom-3">
            <Badge variant="outline" className="bg-surface-raised/90 backdrop-blur">
              Out of stock
            </Badge>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-subtle">
          {product.brand}
        </p>
        <h3 className="mt-0.5 line-clamp-2 text-sm font-medium text-ink">
          <Link
            href={`/product/${product.slug}`}
            className="transition-colors duration-micro hover:text-accent"
          >
            {product.name}
          </Link>
        </h3>
        <div className="mt-1.5">
          <RatingStars rating={product.rating} count={product.reviews.length} />
        </div>
        <div className="mt-2">
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} size="sm" />
        </div>
      </div>
    </article>
  );
}
