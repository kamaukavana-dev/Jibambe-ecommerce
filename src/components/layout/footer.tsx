import Link from 'next/link';
import { ShoppingBag, Truck, ShieldCheck, RotateCcw, Phone, Mail, MapPin } from 'lucide-react';
import { categories } from '@/data/categories';
import { Newsletter } from './newsletter';
import { WhatsAppIcon, InstagramIcon, XIcon } from './brand-icons';

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
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'My Account', href: '/account' },
    ],
  },
];

// Icon-only contact links. The phone number lives only inside the WhatsApp
// href target — never rendered as visible text.
const reachUs = [
  { label: 'Chat on WhatsApp', href: 'https://wa.me/254796367272', Icon: WhatsAppIcon, external: true },
  { label: 'Email us', href: 'mailto:kamaukavana@gmail.com', Icon: Mail, external: false },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/kavana.daniel',
    Icon: InstagramIcon,
    external: true,
  },
  { label: 'X (Twitter)', href: 'https://x.com/DanielKavana', Icon: XIcon, external: true },
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

      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2">
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

          {/* Reach us — icon only */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-ink">Reach us</h2>
            <div className="mt-3 flex items-center gap-2">
              {reachUs.map(({ label, href, Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  title={label}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="grid h-11 w-11 place-items-center rounded-full border border-border text-ink-muted transition-colors duration-micro hover:border-accent hover:text-accent"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-sm text-ink-muted">
              <MapPin className="h-4 w-4 shrink-0 text-ink-subtle" aria-hidden="true" />
              Nairobi, Kenya
            </p>
          </div>
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

      {/* Newsletter band */}
      <div className="border-t border-border">
        <div className="container-page py-10">
          <div className="mx-auto max-w-md">
            <Newsletter />
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-sm text-ink-subtle sm:flex-row">
          <p>© 2026 Jibambe. All rights reserved.</p>
          <p>Prices shown in Kenyan Shillings (KSh), VAT included.</p>
        </div>
      </div>
    </footer>
  );
}
