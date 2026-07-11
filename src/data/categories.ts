import type { Category } from '@/types';

/**
 * The six merchandising categories carried over from the original ShopKenya
 * catalog. Taglines are editorial, not filler.
 */
export const categories: Category[] = [
  {
    slug: 'electronics',
    name: 'Electronics',
    tagline: 'Phones, TVs & the gear that keeps you connected',
    icon: 'Smartphone',
  },
  {
    slug: 'computing',
    name: 'Computing',
    tagline: 'Laptops, tablets & desk setups that keep up',
    icon: 'Laptop',
  },
  {
    slug: 'fashion',
    name: 'Fashion',
    tagline: 'Footwear & wardrobe staples with staying power',
    icon: 'Shirt',
  },
  {
    slug: 'home',
    name: 'Home & Kitchen',
    tagline: 'Appliances that earn their place on the counter',
    icon: 'Home',
  },
  {
    slug: 'beauty',
    name: 'Beauty',
    tagline: 'Fragrance & skincare worth the shelf space',
    icon: 'Sparkles',
  },
  {
    slug: 'sports',
    name: 'Sports & Fitness',
    tagline: 'Kit for the court, the trail and the mat',
    icon: 'Dumbbell',
  },
];

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));
