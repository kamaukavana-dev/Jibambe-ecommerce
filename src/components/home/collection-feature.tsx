import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import type { Collection } from '@/types';
import { getProductsByIds } from '@/lib/catalog';
import { ProductCard } from '@/components/product/product-card';

/**
 * Editorial collection block — a large themed image and copy alongside a small
 * grid of the collection's products. This is the "merchandising, not just a
 * grid" requirement: the layout alternates image side per index for rhythm.
 */
export function CollectionFeature({
  collection,
  reverse = false,
}: {
  collection: Collection;
  reverse?: boolean;
}) {
  const items = getProductsByIds(collection.productIds).slice(0, 2);

  return (
    <section className="container-page mt-16">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Editorial panel */}
        <div
          className={`relative flex min-h-[320px] flex-col justify-end overflow-hidden rounded-xl ${
            reverse ? 'lg:order-2' : ''
          }`}
        >
          <Image
            src={collection.heroImage}
            alt={collection.title}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />
          <div className="relative p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-stone-200">
              {collection.subtitle}
            </p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-white">
              {collection.title}
            </h2>
            <p className="mt-2 max-w-sm text-sm text-stone-200">{collection.description}</p>
            <Link
              href={`/collections/${collection.slug}`}
              className="mt-4 inline-flex items-center gap-1.5 rounded bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors duration-micro hover:bg-stone-100"
            >
              Explore the edit
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Two products from the collection */}
        <div className={`grid grid-cols-2 gap-5 ${reverse ? 'lg:order-1' : ''}`}>
          {items.map((p) => (
            <ProductCard key={p.id} product={p} sizes="(max-width: 1024px) 50vw, 25vw" />
          ))}
        </div>
      </div>
    </section>
  );
}
