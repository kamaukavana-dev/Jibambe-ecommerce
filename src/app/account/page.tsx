import type { Metadata } from 'next';
import { AccountView } from '@/components/account/account-view';

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Sign in to view your orders, saved addresses and wishlist on Jibambe.',
};

export default function AccountPage() {
  return (
    <div className="container-page py-12 lg:py-16">
      <AccountView />
    </div>
  );
}
