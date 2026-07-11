import type { Metadata } from 'next';
import { products } from '@/data/products';
import { categoryBySlug } from '@/data/categories';
import { filterProducts } from '@/lib/catalog';
import { parseFilters, type RawSearchParams } from '@/lib/plp-params';
import { ProductGrid } from '@/components/product/product-grid';
import { FilterSidebar } from '@/components/plp/filter-sidebar';
import { PlpControls } from '@/components/plp/plp-controls';
import { ActiveFilters } from '@/components/plp/active-filters';
import { Pagination } from '@/components/plp/pagination';
import { EmptyResults } from '@/components/plp/empty-results';

/**
 * Product Listing Page. Server-rendered from the URL's search params so results
 * are shareable, indexable and correct on first paint; the filter/sort/paginate
 * controls are client components that write back to the URL, which re-renders
 * this server component. Filtering happens in pure lib code (filterProducts).
 */
export const metadata: Metadata = {
  title: 'Shop all products',
  description:
    'Browse the full Jibambe catalogue — filter by category, price and availability, and sort to find exactly what you need.',
};

export default function ShopPage({ searchParams }: { searchParams: RawSearchParams }) {
  const filters = parseFilters(searchParams);
  const { items, total, totalPages, page } = filterProducts(filters);

  // A single active category gets a nicer H1 than the generic "All products".
  const single =
    filters.categories.length === 1 ? categoryBySlug.get(filters.categories[0]!) : undefined;
  const heading = single ? single.name : 'All products';
  const sub = single ? single.tagline : 'The full catalogue, from phones to fitness.';

  return (
    <div className="container-page py-8">
      <header className="mb-6">
        <nav aria-label="Breadcrumb" className="mb-2 text-sm text-ink-subtle">
          <ol className="flex items-center gap-1.5">
            <li>Home</li>
            <li aria-hidden="true">/</li>
            <li className="text-ink-muted">Shop</li>
          </ol>
        </nav>
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">{heading}</h1>
        <p className="mt-1 text-ink-muted">{sub}</p>
      </header>

      <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-10">
        {/* Persistent desktop filter rail */}
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-40">
            <FilterSidebar allProducts={products} />
          </div>
        </aside>

        <div>
          <PlpControls total={total} allProducts={products} />

          <div className="mt-4">
            <ActiveFilters />
          </div>

          <div className="mt-6">
            {items.length === 0 ? (
              <EmptyResults query={filters.query} />
            ) : (
              <>
                <ProductGrid products={items} priorityCount={4} />
                <Pagination page={page} totalPages={totalPages} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
