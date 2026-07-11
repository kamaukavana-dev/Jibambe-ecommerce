import type { Metadata } from 'next';
import { CartView } from '@/components/cart/cart-view';

export const metadata: Metadata = {
  title: 'Your cart',
  description: 'Review the items in your cart before checkout.',
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <div className="container-page py-8">
      <h1 className="mb-8 font-display text-3xl font-semibold text-ink sm:text-4xl">Your cart</h1>
      <CartView />
    </div>
  );
}
