import type { Metadata } from 'next';
import { SearchView } from '@/components/search/search-view';
import type { RawSearchParams } from '@/lib/plp-params';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search the Jibambe catalogue by product, brand or category.',
  robots: { index: false, follow: true },
};

export default function SearchPage({ searchParams }: { searchParams: RawSearchParams }) {
  const q = typeof searchParams.q === 'string' ? searchParams.q : '';

  return (
    <div className="container-page py-8">
      <h1 className="mb-6 font-display text-3xl font-semibold text-ink sm:text-4xl">Search</h1>
      <SearchView initialQuery={q} />
    </div>
  );
}
