import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { products, productBySlug } from '@/data/products';
import { categoryBySlug } from '@/data/categories';
import { relatedProducts } from '@/lib/catalog';
import { formatKsh } from '@/lib/currency';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/cart';
import { ProductGallery } from '@/components/product/product-gallery';
import { BuyBox } from '@/components/product/buy-box';
import { Reviews } from '@/components/product/reviews';
import { ProductGrid } from '@/components/product/product-grid';
import { SectionHeading } from '@/components/home/section-heading';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

/** Pre-render every product page at build time. */
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = productBySlug.get(params.slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      images: [{ url: product.images[0] ?? '', width: 900, height: 900, alt: product.name }],
    },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = productBySlug.get(params.slug);
  if (!product) notFound();

  const category = categoryBySlug.get(product.category);
  const related = relatedProducts(product);

  // Product structured data (schema.org) for rich results. Rendered server-side.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images,
    description: product.description,
    brand: { '@type': 'Brand', name: product.brand },
    sku: `JIB-${product.id}`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviews.length,
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'KES',
      price: product.price,
      availability:
        product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <div className="container-page py-8">
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-subtle">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-accent">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/shop" className="hover:text-accent">
              Shop
            </Link>
          </li>
          {category && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link href={`/shop?category=${category.slug}`} className="hover:text-accent">
                  {category.name}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true">/</li>
          <li className="truncate text-ink-muted">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />
        <BuyBox product={product} />
      </div>

      {/* Details / features / reviews */}
      <div className="mt-16 max-w-content">
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <p className="max-w-prose leading-relaxed text-ink-muted">{product.details}</p>
          </TabsContent>

          <TabsContent value="features">
            <ul className="grid gap-3 sm:grid-cols-2">
              {product.features.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-ink-muted">
                  <Check className="h-5 w-5 shrink-0 text-accent" />
                  {f}
                </li>
              ))}
            </ul>
          </TabsContent>

          <TabsContent value="reviews">
            <Reviews reviews={product.reviews} rating={product.rating} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Related */}
      <section className="mt-20">
        <SectionHeading
          subtitle="You might also like"
          title="Related products"
          href={category ? `/shop?category=${category.slug}` : '/shop'}
        />
        <ProductGrid products={related} />
      </section>

      {/* Trust footnote */}
      <p className="mt-10 text-center text-sm text-ink-subtle">
        Price shown in Kenyan Shillings ({formatKsh(product.price)}), VAT included. Free delivery
        on orders over {formatKsh(FREE_SHIPPING_THRESHOLD)}.
      </p>
    </div>
  );
}
