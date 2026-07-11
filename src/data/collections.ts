import type { Collection } from '@/types';

/**
 * Editorial collections for the home page — curated groupings that merchandise
 * the catalog by theme rather than raw category. Each references product ids
 * from products.ts.
 */
export const collections: Collection[] = [
  {
    slug: 'work-from-anywhere',
    title: 'Work From Anywhere',
    subtitle: 'The mobile office',
    description:
      'Featherweight laptops, tablets and the accessories that turn any table into a desk.',
    heroImage: '/products/macbook-air-m2-1.jpg',
    productIds: [3, 16, 8, 28, 15],
    accent: 'stone',
  },
  {
    slug: 'sound-and-vision',
    title: 'Sound & Vision',
    subtitle: 'Home entertainment',
    description: 'Big-screen 4K, cinema-grade audio and speakers that follow you room to room.',
    heroImage: '/products/samsung-55-4k-tv-1.jpg',
    productIds: [6, 4, 17, 10],
    accent: 'clay',
  },
  {
    slug: 'the-flagship-edit',
    title: 'The Flagship Edit',
    subtitle: 'Phones at their peak',
    description: 'The three phones worth upgrading for this year, side by side.',
    heroImage: '/products/iphone-15-pro-max-1.jpg',
    productIds: [2, 1, 27, 9],
    accent: 'stone',
  },
  {
    slug: 'move-well',
    title: 'Move Well',
    subtitle: 'Fitness & fashion',
    description: 'Kit that keeps up on the court, the trail and the commute home.',
    heroImage: '/products/adidas-ultraboost-1.jpg',
    productIds: [24, 5, 14, 18, 26],
    accent: 'clay',
  },
];

export const collectionBySlug = new Map(collections.map((c) => [c.slug, c]));
