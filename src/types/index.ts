/**
 * Domain types for the Jibambe storefront. These are the single source of
 * truth — the mock data in /data is typed against them, and every component
 * consumes these shapes rather than inventing ad-hoc props.
 */

export type CategorySlug =
  | 'electronics'
  | 'computing'
  | 'fashion'
  | 'home'
  | 'beauty'
  | 'sports';

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Short editorial line used on collection tiles / hero. */
  tagline: string;
  icon: string;
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
  /** ISO date string. */
  date: string;
}

/**
 * A selectable product variant axis (e.g. Colour, Storage, Size). Each option
 * can independently adjust price and stock, so the PDP can reflect that a
 * larger storage tier costs more or a colour is out of stock.
 */
export interface VariantOption {
  label: string;
  /** Optional hex for colour swatches. */
  swatch?: string;
  /** Delta applied to base price in KSh (can be negative). */
  priceDelta?: number;
  inStock: boolean;
}

export interface VariantGroup {
  /** e.g. "Colour", "Storage". */
  name: string;
  type: 'swatch' | 'pill';
  options: VariantOption[];
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  /** Current price in KSh (integer — no sub-shilling pricing). */
  price: number;
  /** Original / compare-at price in KSh; present only when on sale. */
  compareAtPrice?: number;
  description: string;
  /** Long-form marketing copy for the PDP. */
  details: string;
  /** Ordered list of image paths under /public. First is the primary. */
  images: string[];
  /** Units available. 0 = out of stock. */
  stock: number;
  /** Units sold — drives "bestseller" / social proof. */
  sold: number;
  rating: number;
  reviews: Review[];
  features: string[];
  variants?: VariantGroup[];
  /** Curated flags for merchandising. */
  tags?: ProductTag[];
}

export type ProductTag = 'new' | 'bestseller' | 'featured' | 'sale';

export interface Collection {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  /** Product ids featured in this collection. */
  productIds: number[];
  accent: 'clay' | 'stone';
}

/** A line in the cart: a product reference + chosen variants + quantity. */
export interface CartLine {
  productId: number;
  slug: string;
  name: string;
  image: string;
  /** Unit price in KSh with variant deltas already applied. */
  unitPrice: number;
  compareAtPrice?: number;
  quantity: number;
  /** Human-readable variant summary, e.g. "Black · 256GB". */
  variantLabel?: string;
  /** Stable key distinguishing same product with different variants. */
  lineKey: string;
  /** Units available at add time — the cap the quantity can never exceed. */
  maxStock: number;
}

export interface WishlistItem {
  productId: number;
  addedAt: string;
}

// ---- Filtering / sorting (PLP) ----

export type SortKey =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'newest';

export interface ProductFilters {
  categories: CategorySlug[];
  minPrice?: number;
  maxPrice?: number;
  /** Filter to products that have at least one of these tags. */
  onSale?: boolean;
  inStockOnly?: boolean;
  /** Free-text query (search page / PLP). */
  query?: string;
  sort: SortKey;
  page: number;
}
