import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Editorial hero. A single confident statement + one primary and one secondary
 * CTA, paired with a real product image. The image is `priority` (it's the LCP)
 * with explicit sizing to reserve space — no CLS. Intentionally not a carousel:
 * auto-rotating heroes hurt performance and accessibility for little gain.
 */
export function Hero() {
  return (
    <section className="container-page pt-6 sm:pt-10">
      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        {/* Copy side */}
        <div className="flex flex-col justify-center rounded-xl bg-ink px-6 py-10 text-ink-inverse sm:px-10 sm:py-14">
          <Badge variant="accent" className="w-fit">
            Black Friday · up to 30% off
          </Badge>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
            Everything you want, delivered across Kenya.
          </h1>
          <p className="mt-4 max-w-md text-base text-stone-300">
            Phones, laptops, fashion and the home essentials worth having — genuine, fairly
            priced, and at your door in days.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/shop">
                Shop the sale
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-stone-600 text-ink-inverse hover:bg-stone-800"
            >
              <Link href="/shop?sort=newest">New arrivals</Link>
            </Button>
          </div>
        </div>

        {/* Image side */}
        <div className="relative min-h-[280px] overflow-hidden rounded-xl bg-surface-sunken sm:min-h-[420px]">
          <Image
            src="/products/iphone-15-pro-max-1.jpg"
            alt="iPhone 15 Pro Max, one of this week's featured products"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 to-transparent p-6">
            <p className="text-sm font-medium text-stone-200">Featured this week</p>
            <p className="font-display text-xl font-semibold text-white">iPhone 15 Pro Max</p>
            <Link
              href="/product/iphone-15-pro-max"
              className="mt-1 inline-flex items-center gap-1 text-sm text-white underline-offset-4 hover:underline"
            >
              Shop now <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
