# Jibambe — Storefront

A production-grade rebuild of a Kenyan marketplace storefront (originally
"ShopKenya", a first-year vanilla HTML/CSS/JS project). Frontend-only, no real
backend — but built to the standard of something that ships to real users.
Prices are in Kenyan Shillings (KSh); the catalogue, reviews and copy are real,
not `Lorem ipsum`.

**Live metrics** (Lighthouse desktop, production build, measured — not
estimated): Performance **99–100**, Accessibility **100**, Best-Practices 96,
SEO 100 across Home, PLP and PDP.

> Design decisions and their rationale live in [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).
> This file is about *architecture* — why the code is shaped the way it is.

---

## Stack

| Concern     | Choice                              | Why                                                      |
| ----------- | ----------------------------------- | -------------------------------------------------------- |
| Framework   | Next.js 14 (App Router, RSC)        | SSG/SSR for SEO + a clear server/client split            |
| Language    | TypeScript (strict + `noUncheckedIndexedAccess`) | Catch bugs at the type layer, no unexplained `any` |
| Styling     | Tailwind + design tokens            | Token-driven, no scattered arbitrary values              |
| Primitives  | Radix UI (customised)               | Accessible-by-default focus/keyboard/ARIA                |
| State       | Zustand + `persist`                 | Minimal, localStorage-backed cart/wishlist               |
| Animation   | Framer Motion                       | Deliberate, reduced-motion-aware                         |
| Testing     | Vitest + Playwright                 | Pure-logic unit tests + real browser flows               |

## Architecture — the decisions that matter

**1. The URL is the source of truth for the PLP.**
Filters, sort and pagination are encoded in `searchParams`. The shop page is a
Server Component that reads them and computes results server-side (shareable,
indexable, correct on first paint); the filter controls are Client Components
that write back to the URL, which re-renders the server tree. No client-side
filter state to drift out of sync. Parsing/serialising is a pure module
(`lib/plp-params.ts`) tested in isolation.

**2. Business logic is pure and framework-free.**
Cart maths (`lib/cart.ts`), catalogue filter/sort/search (`lib/catalog.ts`),
currency (`lib/currency.ts`) and form validation (`lib/validation.ts`) are plain
functions with no React or store imports. The Zustand stores and components
*compose* them; they never reimplement them. This is why 55 unit tests cover the
risky parts (money, discounts, Luhn, filtering) without a browser.

**3. Server shells, client islands.**
Pages render as much on the server as possible (Home, PLP, PDP, collections are
SSG/SSR with metadata + Product JSON-LD). Interactivity is isolated to small
client components (cart drawer, buy box, filters, search) so the server/client
boundary is deliberate, not accidental. Persisted-store values are gated behind
a `useHydrated()` guard to avoid SSR mismatch on cart/wishlist counts.

**4. Images are curated static assets.**
Real product photos are downloaded once (`scripts/fetch-images.mjs`) into
`/public/products` and served through `next/image` at known dimensions. This
buys zero CLS and reliability (no runtime third-party image fetch to fail during
a demo) — the tradeoff is discussed in `DESIGN_SYSTEM.md §8`.

**5. Checkout is multi-route, guarded, and honest about state.**
`/checkout/shipping → /payment → /confirmation` are real routes (browser
back/forward works, steps are deep-linkable). A `CheckoutGuard` redirects
empty-cart or skipped-step access. The cart is cleared on the *confirmation*
page, not the guarded payment page — otherwise emptying it would trip the
guard's own redirect (a bug the E2E flow caught).

## Folder structure

```
src/
  app/          route segments (home, shop, product, cart, checkout, wishlist, search)
  components/
    ui/         design-system primitives (Button, Input, Drawer, Select, …)
    product/    catalogue components (Card, Gallery, BuyBox, PriceDisplay, …)
    plp/        listing filters/sort/pagination
    checkout/   stepper, forms, guards, summaries
    layout/     header, footer, cart drawer, search overlay
    home/       hero, category tiles, collection features
  lib/          pure logic (cart, catalog, currency, validation, plp-params)
  store/        Zustand stores (cart, wishlist, checkout, ui)
  data/         mock catalogue (products, categories, collections)
  types/        domain types (single source of truth)
tests/
  unit/         Vitest — cart maths, filtering, validation, currency
  e2e/          Playwright — browse→checkout, search, wishlist/persistence
scripts/        one-off image curation
```

## Getting started

```bash
npm install
npm run dev            # http://localhost:3000
```

Images are committed, so nothing else is required. To re-fetch them:
`node scripts/fetch-images.mjs`.

## Quality gates

```bash
npm run typecheck          # tsc --noEmit, strict
npm run lint               # zero warnings enforced
npm run test               # 55 Vitest unit tests
npm run test:e2e:install   # one-time: Playwright browsers
npm run test:e2e           # 18 flows, desktop + mobile
npm run build              # production build
```

**Lighthouse** (requires Chrome):
```bash
npm run build && npm run start -- -p 3100
npx lighthouse http://localhost:3100/ --preset=desktop --view
```

## Honest scope notes

- **No backend.** Cart, wishlist and checkout persist to `localStorage` /
  `sessionStorage`. Payment is a mock (Luhn-validated, never charged).
- **Prices/stock are static mock data.** "Only N left" reflects the real mock
  count — it's not fabricated urgency.
- **Lighthouse numbers above are real**, measured on this machine's Chrome
  against a production build. Re-run the commands above to reproduce.

Built by Daniel Kamau as a portfolio piece. Original concept: ShopKenya.
