import Link from 'next/link';
import { ShoppingBag, Truck, ShieldCheck, RotateCcw, Phone } from 'lucide-react';
import { categories } from '@/data/categories';

const trustSignals = [
  { icon: Truck, title: 'Fast delivery', copy: 'Nationwide, 2–4 business days' },
  { icon: ShieldCheck, title: 'Genuine products', copy: 'Every item verified authentic' },
  { icon: RotateCcw, title: '7-day returns', copy: 'Changed your mind? Send it back' },
  { icon: Phone, title: 'Support', copy: 'Mon–Sat, 8am–6pm EAT' },
];

const linkColumns = [
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/shop' },
      { label: 'On Sale', href: '/shop?onSale=true' },
      { label: 'New Arrivals', href: '/shop?sort=newest' },
      { label: 'Wishlist', href: '/wishlist' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Delivery & Returns', href: '/shop' },
      { label: 'Track Order', href: '/shop' },
      { label: 'Contact Us', href: '/shop' },
      { label: 'FAQs', href: '/shop' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface-raised">
      {/* Trust signals */}
      <div className="border-b border-border">
        <div className="container-page grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {trustSignals.map((s) => (
            <div key={s.title} className="flex items-start gap-3">
              <s.icon className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
              <div>
                <p className="text-sm font-semibold text-ink">{s.title}</p>
                <p className="text-sm text-ink-muted">{s.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Link href="/" className="flex items-center gap-2" aria-label="Jibambe home">
            <span className="grid h-9 w-9 place-items-center rounded bg-accent text-accent-fg">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <span className="font-display text-xl font-semibold text-ink">Jibambe</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-ink-muted">
            Kenya’s modern marketplace. Genuine products, fair prices in KSh, delivered to your
            door.
          </p>
        </div>

        <nav aria-label="Categories">
          <h2 className="text-sm font-semibold text-ink">Categories</h2>
          <ul className="mt-4 space-y-2.5">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/shop?category=${c.slug}`}
                  className="text-sm text-ink-muted transition-colors duration-micro hover:text-accent"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {linkColumns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-sm font-semibold text-ink">{col.title}</h2>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink-muted transition-colors duration-micro hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-sm text-ink-subtle sm:flex-row">
          <p>© {2026} Jibambe. A portfolio rebuild by Daniel Kamau.</p>
          <p>Prices in Kenyan Shillings (KSh). Demo store — no real transactions.</p>
        </div>
      </div>
    </footer>
  );
}
