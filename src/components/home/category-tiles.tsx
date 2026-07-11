import Link from 'next/link';
import Image from 'next/image';
import { categories } from '@/data/categories';

/**
 * Category entry points. Each tile pairs a representative product image with
 * the category name and tagline. Images map to real catalog photos.
 */
const categoryImage: Record<string, string> = {
  electronics: '/products/sony-wh1000xm5-1.jpg',
  computing: '/products/macbook-air-m2-1.jpg',
  fashion: '/products/air-jordan-1-retro-1.jpg',
  home: '/products/kitchenaid-stand-mixer-1.jpg',
  beauty: '/products/chanel-no5-perfume-1.jpg',
  sports: '/products/adidas-ultraboost-1.jpg',
};

export function CategoryTiles() {
  return (
    <section className="container-page mt-16">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/shop?category=${c.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface-raised transition-shadow duration-state hover:shadow"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-surface-sunken">
              <Image
                src={categoryImage[c.slug] ?? ''}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-cover transition-transform duration-overlay ease-standard group-hover:scale-105"
              />
            </div>
            <div className="p-3">
              <p className="text-sm font-semibold text-ink group-hover:text-accent">{c.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
