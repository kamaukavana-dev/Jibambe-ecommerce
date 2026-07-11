import type { Metadata } from 'next';
import { WishlistView } from '@/components/wishlist/wishlist-view';

export const metadata: Metadata = {
  title: 'Your wishlist',
  description: 'Products you’ve saved to buy later.',
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <div className="container-page py-8">
      <h1 className="mb-8 font-display text-3xl font-semibold text-ink sm:text-4xl">
        Your wishlist
      </h1>
      <WishlistView />
    </div>
  );
}
