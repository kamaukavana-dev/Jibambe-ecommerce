import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { collections, collectionBySlug } from '@/data/collections';
import { getProductsByIds } from '@/lib/catalog';
import { ProductGrid } from '@/components/product/product-grid';

/** Editorial collection landing. Statically generated for every collection. */
export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const collection = collectionBySlug.get(params.slug);
  if (!collection) return {};
  return {
    title: collection.title,
    description: collection.description,
    openGraph: { title: collection.title, description: collection.description },
  };
}

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = collectionBySlug.get(params.slug);
  if (!collection) notFound();

  const items = getProductsByIds(collection.productIds);

  return (
    <div className="pb-8">
      <section className="relative min-h-[280px] overflow-hidden sm:min-h-[360px]">
        <Image
          src={collection.heroImage}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/40 to-ink/20" />
        <div className="container-page relative flex min-h-[280px] flex-col justify-end py-10 sm:min-h-[360px]">
          <p className="text-sm font-semibold uppercase tracking-wide text-stone-200">
            {collection.subtitle}
          </p>
          <h1 className="mt-1 max-w-2xl font-display text-4xl font-semibold text-white sm:text-5xl">
            {collection.title}
          </h1>
          <p className="mt-3 max-w-xl text-stone-200">{collection.description}</p>
        </div>
      </section>

      <section className="container-page mt-10">
        <ProductGrid products={items} priorityCount={4} />
      </section>
    </div>
  );
}
