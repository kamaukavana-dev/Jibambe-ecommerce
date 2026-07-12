'use client';

import { useAccountStore } from '@/store/account-store';
import { useHydrated } from '@/lib/use-hydrated';
import { Skeleton } from '@/components/ui/skeleton';
import { AuthForm } from './auth-form';
import { AccountDashboard } from './account-dashboard';

/**
 * Account entry point. Branches on the client-side (mock) auth state, guarding
 * against SSR/hydration mismatch since the user is read from localStorage.
 */
export function AccountView() {
  const hydrated = useHydrated();
  const user = useAccountStore((s) => s.user);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-md">
        <Skeleton className="h-96 w-full rounded-lg" />
      </div>
    );
  }

  return user ? <AccountDashboard user={user} /> : <AuthForm />;
}
