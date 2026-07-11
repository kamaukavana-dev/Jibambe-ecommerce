import { Hero } from '@/components/home/hero';
import { CategoryTiles } from '@/components/home/category-tiles';
import { CollectionFeature } from '@/components/home/collection-feature';
import { SectionHeading } from '@/components/home/section-heading';
import { ProductGrid } from '@/components/product/product-grid';
import { bestsellers, newArrivals } from '@/lib/catalog';
import { collections } from '@/data/collections';

/**
 * Home — statically generated. Editorial-first: hero, category entry points,
 * two merchandised collection features interleaved with product rails, so it
 * reads as a curated storefront rather than a single flat grid.
 */
export default function HomePage() {
  const topSellers = bestsellers(4);
  const fresh = newArrivals(4);
  const [first, second] = collections;

  return (
    <div className="pb-8">
      <Hero />
      <CategoryTiles />

      {/* Bestsellers */}
      <section className="container-page mt-16">
        <SectionHeading
          subtitle="Loved by shoppers"
          title="This week’s bestsellers"
          href="/shop?sort=featured"
        />
        <ProductGrid products={topSellers} />
      </section>

      {first && <CollectionFeature collection={first} />}

      {/* New arrivals */}
      <section className="container-page mt-16">
        <SectionHeading
          subtitle="Just landed"
          title="New arrivals"
          href="/shop?sort=newest"
        />
        <ProductGrid products={fresh} />
      </section>

      {second && <CollectionFeature collection={second} reverse />}
    </div>
  );
}
