'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Package, MapPin, Heart, LogOut, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useAccountStore, type Account } from '@/store/account-store';
import { formatKsh } from '@/lib/currency';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';

const statusStyles: Record<string, string> = {
  Delivered: 'bg-success-subtle text-success',
  'In transit': 'bg-accent-subtle text-accent',
  Processing: 'bg-surface-sunken text-ink-muted',
};

export function AccountDashboard({ user }: { user: Account }) {
  const orders = useAccountStore((s) => s.orders);
  const addresses = useAccountStore((s) => s.addresses);
  const removeAddress = useAccountStore((s) => s.removeAddress);
  const addAddress = useAccountStore((s) => s.addAddress);
  const signOut = useAccountStore((s) => s.signOut);

  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Hi, {user.name.split(' ')[0]}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">{user.email}</p>
        </div>
        <Button variant="secondary" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>

      {/* Order history */}
      <section>
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <Package className="h-5 w-5 text-accent" aria-hidden="true" />
          Order history
        </h2>
        {orders.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-border p-8 text-center">
            <p className="text-ink-muted">You haven’t placed any orders yet.</p>
            <Button asChild className="mt-4">
              <Link href="/shop">
                Start shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-surface-raised">
            {orders.map((o) => (
              <li key={o.orderNumber} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-medium text-ink">{o.orderNumber}</p>
                  <p className="text-sm text-ink-muted">
                    {new Date(o.date).toLocaleDateString('en-KE', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}{' '}
                    · {o.itemCount} {o.itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[o.status] ?? ''}`}
                  >
                    {o.status}
                  </span>
                  <span className="font-semibold tabular-nums text-ink">{formatKsh(o.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Saved addresses */}
      <section>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <MapPin className="h-5 w-5 text-accent" aria-hidden="true" />
            Saved addresses
          </h2>
          {!adding && (
            <Button variant="ghost" size="sm" onClick={() => setAdding(true)}>
              <Plus className="h-4 w-4" />
              Add
            </Button>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className="rounded-lg border border-border bg-surface-raised p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-ink">{a.label}</p>
                <button
                  type="button"
                  onClick={() => removeAddress(a.id)}
                  aria-label={`Remove ${a.label} address`}
                  className="grid h-8 w-8 place-items-center rounded text-ink-subtle transition-colors duration-micro hover:bg-danger-subtle hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-1 text-sm text-ink-muted">
                {a.line}
                <br />
                {a.city}, {a.county}
              </p>
            </div>
          ))}
          {addresses.length === 0 && !adding && (
            <p className="text-sm text-ink-muted">No saved addresses yet.</p>
          )}
        </div>

        {adding && <AddressForm onDone={() => setAdding(false)} onAdd={addAddress} />}
      </section>

      {/* Wishlist link */}
      <section>
        <Link
          href="/wishlist"
          className="flex items-center justify-between rounded-lg border border-border bg-surface-raised p-4 transition-colors duration-micro hover:border-accent"
        >
          <span className="flex items-center gap-2 font-medium text-ink">
            <Heart className="h-5 w-5 text-accent" aria-hidden="true" />
            Your wishlist
          </span>
          <ArrowRight className="h-4 w-4 text-ink-muted" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}

function AddressForm({
  onAdd,
  onDone,
}: {
  onAdd: (a: { label: string; line: string; city: string; county: string; phone: string }) => void;
  onDone: () => void;
}) {
  const [form, setForm] = useState({ label: '', line: '', city: '', county: '', phone: '' });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const valid = form.label.trim() && form.line.trim() && form.city.trim();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        onAdd(form);
        onDone();
      }}
      className="mt-4 grid gap-4 rounded-lg border border-border bg-surface-raised p-4 sm:grid-cols-2"
    >
      <div>
        <Label htmlFor="addr-label">Label</Label>
        <Input id="addr-label" placeholder="Home, Office…" value={form.label} onChange={set('label')} />
      </div>
      <div>
        <Label htmlFor="addr-line">Address</Label>
        <Input id="addr-line" placeholder="Estate, street" value={form.line} onChange={set('line')} />
      </div>
      <div>
        <Label htmlFor="addr-city">Town / City</Label>
        <Input id="addr-city" value={form.city} onChange={set('city')} />
      </div>
      <div>
        <Label htmlFor="addr-county">County</Label>
        <Input id="addr-county" value={form.county} onChange={set('county')} />
      </div>
      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit" disabled={!valid}>
          Save address
        </Button>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
