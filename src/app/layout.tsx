import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CartDrawer } from '@/components/layout/cart-drawer';
import { SearchOverlay } from '@/components/layout/search-overlay';

// Self-hosted via next/font: no external request, no layout shift. `display:
// swap` avoids invisible text while the font loads. CSS variables feed the
// Tailwind fontFamily tokens (font-display / font-sans).
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['opsz'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const siteUrl = 'https://jibambe.example';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Jibambe — Online Shopping Made Easy',
    template: '%s · Jibambe',
  },
  description:
    'Jibambe is Kenya’s modern marketplace for phones, computing, electronics, fashion, home and beauty — genuine products, fair prices in KSh, fast delivery.',
  keywords: ['Kenya', 'online shopping', 'electronics', 'phones', 'fashion', 'Nairobi', 'KSh'],
  authors: [{ name: 'Daniel Kamau' }],
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: siteUrl,
    siteName: 'Jibambe',
    title: 'Jibambe — Online Shopping Made Easy',
    description: 'Kenya’s modern marketplace. Genuine products, fair prices, fast delivery.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jibambe — Online Shopping Made Easy',
    description: 'Kenya’s modern marketplace. Genuine products, fair prices, fast delivery.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="sr-only sr-only-focusable">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawer />
        <SearchOverlay />
      </body>
    </html>
  );
}
