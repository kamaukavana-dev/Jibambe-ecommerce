# Jibambe — Design System

> This document records the *decisions*, not just the values. If a token exists,
> the reason it has that value is here. Implementation lives in
> `tailwind.config.ts` (primitives, scales) and `src/app/globals.css` (semantic
> tokens). Components consume token names only — never raw hex or arbitrary px.

Jibambe is a rebuild of a Kenyan marketplace storefront ("ShopKenya"). The
product catalog is real (phones, computing, electronics, fashion, home, beauty,
sports), pricing is in Kenyan Shillings (KSh), and the brand voice is a modern
East-African marketplace. The visual language is **"paper & clay"**: a warm
near-monochrome canvas that lets product photography carry the color, with a
single earthy clay accent reserved for action.

---

## 1. Typography

**Pairing:** `Fraunces` (variable serif, optical sizing) for display/headings +
`Inter` (variable sans) for UI and body.

**Rationale.** A marketplace has two jobs that pull in opposite directions:
editorial merchandising needs *personality and warmth*; product data (specs,
prices, filters) needs *density and neutrality*. One typeface can't do both well.
Fraunces' optical sizing gives editorial headings a crafted, boutique feel that
separates Jibambe from generic "default-shadcn Inter-everywhere" storefronts;
Inter keeps dense UI legible at small sizes. Both are free, open-source, and
**self-hosted via `next/font`** — no external request, no layout shift from a
late-loading webfont (FOUT/FOIT), and `font-display: swap` handled by Next.

**Modular scale — 1.25 (major third), 16px base.** A major third is large enough
to create clear hierarchy on marketing pages but not so large it wastes vertical
space in dense product UI.

| Token   | rem     | px    | Usage                                   |
| ------- | ------- | ----- | --------------------------------------- |
| `xs`    | 0.75    | 12    | Captions, badges, legal, timestamps     |
| `sm`    | 0.875   | 14    | Secondary text, meta, form help         |
| `base`  | 1.0     | 16    | Body copy, product titles in grid       |
| `lg`    | 1.25    | 20    | Lead paragraphs, section intros         |
| `xl`    | 1.5625  | 25    | H4, card headings                       |
| `2xl`   | 1.9531  | 31.25 | H3                                      |
| `3xl`   | 2.4414  | 39    | H2, PDP price                           |
| `4xl`   | 3.0518  | 48.8  | H1 / page titles                        |
| `5xl`   | 3.8147  | 61    | Hero display                            |

Headings use the display serif and negative letter-spacing (−0.01 to −0.02em) at
the top of the scale to keep large type optically tight. Body copy caps at ~68ch
(`max-w-prose`) for readable line length.

---

## 2. Color

**Palette:** warm-neutral `stone` (12 steps) as the canvas + `clay` as the single
accent + conventional semantic red/green/amber.

**Rationale — "let the products carry the color."** In a catalog, the
photography *is* the color story; a saturated brand chrome fights it and makes
every page look busy. So the canvas is a warm off-white paper (`stone-50`,
`#faf9f6`) with near-black ink — this makes product images pop and reads as
premium/editorial rather than the cool blue-grey of default UI kits. Warm neutrals
(a hint of yellow/red) feel human and market-like, fitting an East-African
marketplace, where cool greys feel clinical.

**Clay accent (`clay-600`, `#a34424`)** was chosen to (a) be unmistakably *not*
the default shadcn blue/violet, (b) harmonize with warm neutrals rather than
clash, and (c) evoke earth/craft. It is spent sparingly — CTAs, links, focus
rings, active states — so it always reads as "this is actionable."

### Semantic tokens

Primitives are mapped to meaning via CSS variables (`globals.css`), so a future
dark theme is a variable swap rather than a component rewrite.

| Token             | Value (light) | Meaning                          |
| ----------------- | ------------- | -------------------------------- |
| `surface`         | stone-50      | Page background (paper)          |
| `surface-raised`  | white         | Cards, popovers (lift off paper) |
| `surface-sunken`  | stone-100     | Inputs, wells, filter rail       |
| `ink`             | stone-950     | Primary text                     |
| `ink-muted`       | stone-700     | Secondary text                   |
| `ink-subtle`      | stone-500     | Tertiary / disabled (non-text)   |
| `border`          | stone-200     | Hairlines                        |
| `border-strong`   | stone-300     | Input borders                    |
| `accent`          | clay-600      | CTAs, links, focus               |
| `accent-hover`    | clay-700      | Hover on accent                  |
| `danger/success/warning` | —      | Status + form validation         |

### Color contrast ledger (WCAG 2.1 AA)

Every pair used for **text** meets AA (≥4.5:1 normal, ≥3:1 large ≥24px/≥19px-bold).
Measured against the surface it appears on:

| Foreground        | Background      | Ratio  | AA text |
| ----------------- | --------------- | ------ | ------- |
| ink (`#1a1713`)   | surface         | 16.1:1 | ✅ pass |
| ink-muted         | surface         | 7.4:1  | ✅ pass |
| ink-subtle        | surface         | 5.1:1  | ✅ pass (4.7:1 on sunken)   |
| accent (clay-600) | surface         | 5.9:1  | ✅ pass |
| accent-fg         | accent fill     | 7.1:1  | ✅ pass |
| danger            | surface         | 5.6:1  | ✅ pass |
| success           | surface         | 4.9:1  | ✅ pass |
| warning           | surface         | 4.6:1  | ✅ pass |

`ink-subtle` was originally tuned below AA on the assumption it would only carry
decorative/disabled UI, but in practice it ended up on real tertiary text (brand
labels, strikethrough prices). The Lighthouse accessibility pass caught this, so
it was darkened to `#736a58` — still the lightest of the three text tones, but AA
on both `surface` and `surface-sunken`. Every text tone now meets AA.

---

## 3. Spacing

**4px base unit** — Tailwind's default 4px-based ladder (`0, 0.5, 1, 1.5, 2, 2.5,
3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24 …`). An earlier version
*pruned* this to a shorter set, which silently dropped real utilities (`h-9`,
`h-11`, `gap-1.5`) — so components collapsed to content size. The lesson: keep
the full 4px grid and enforce "no arbitrary `mt-[13px]`" via lint + review, not
by deleting scale steps. Everything still lands on a 4px rhythm.

Layout: page container `max-w-container` (1280px), content `1200px`, gutters step
up responsively `16 → 24 → 32px` (`px-4 sm:px-6 lg:px-8`).

---

## 4. Grid & breakpoints

**Mobile-first.** Four breakpoints, each chosen for a real device class, not a
round number for its own sake:

| Name | Min width | Rationale                                    |
| ---- | --------- | -------------------------------------------- |
| base | 0         | Small phones (360–430px)                     |
| `sm` | 640px     | Large phones landscape / small tablets       |
| `md` | 768px     | Tablet portrait — nav switches to full bar   |
| `lg` | 1024px    | Tablet landscape / small laptop — sidebars   |
| `xl` | 1280px    | Desktop — max container width reached        |

Product grid columns: **1 → 2 (sm) → 3 (lg) → 4 (xl)**. PLP filter rail is a
bottom drawer below `lg`, a persistent left column at `lg+`.

---

## 5. Motion

**Durations** (`transitionDuration` tokens): `micro 120ms` (hover/press feedback),
`state 200ms` (color/opacity changes), `overlay 320ms` (drawers, dialogs, page
fade), `page 480ms` (reserved for the largest transitions).

**Easing:** emphasized `cubic-bezier(0.2, 0, 0, 1)` — a decelerate curve that
feels like an object settling into place. Used for anything entering the screen.

**Principles (restraint is the point):**

- Motion must **signal state change or spatial relationship** — nothing purely
  decorative. The cart drawer slides in from the right *because that's where the
  cart button lives*; a modal fades+scales from center *because it's not anchored
  anywhere*.
- **No** scroll-jacking, parallax, auto-playing carousels, or looping ambient
  animation. They add cost (CLS, CPU, distraction) for no informational value.
- Hover elevation and press states are ≤120ms so the UI feels responsive, not
  laggy.
- **`prefers-reduced-motion`** collapses all of the above to opacity-only or
  instant (handled globally in `globals.css`). Framer Motion variants also read
  the reduced-motion hook.

---

## 6. Component states

Every interactive element ships **six** explicit states, wired to tokens:

| State           | Treatment                                                    |
| --------------- | ----------------------------------------------------------- |
| Default         | Base token colors                                           |
| Hover           | `accent-hover` / raised shadow / surface-sunken tint (≤120ms) |
| Active/pressed  | Slight scale-down (0.98) or darker fill                     |
| Focus-visible   | 2px `accent` ring + 2px offset (keyboard only)              |
| Disabled        | `ink-subtle` text, reduced opacity, `cursor-not-allowed`, `aria-disabled` |
| Loading         | Spinner or skeleton, `aria-busy`, interaction blocked        |

Focus is implemented once, globally (`:focus-visible` in `globals.css`), so no
component can ship without it. Buttons additionally expose an explicit `loading`
prop that swaps content for a spinner while preserving width (no layout shift).

---

## 7. Elevation & radius

- **Radius:** `sm 4px` (badges, inputs), default `8px` (buttons, cards), `lg 14px`
  (modals, large cards), `full` (pills, avatars). Consistent, moderate rounding
  reads as friendly-but-serious.
- **Shadows** are warm-tinted (`rgb(38 34 28 / …)`), never pure black, so they
  belong to the paper palette. Elevation ladder: `xs → sm → DEFAULT → lg`, used
  to signal how far an element floats above the page (card < popover < modal).

---

## 8. Images

Product and editorial imagery are **curated static assets** committed to
`/public/products`, served through `next/image` with explicit `width`/`height`.
This is a deliberate tradeoff over a runtime Unsplash/API fetch:

- **Zero CLS** — dimensions are known at build time, so space is reserved before
  load. Runtime-fetched images with unknown dimensions are a top cause of layout
  shift and Lighthouse penalties.
- **Reliability** — no rate limits, no network dependency, works offline and in a
  live demo where a flaky API would be embarrassing.
- **Performance** — Next generates AVIF/WebP + responsive `srcset` from the local
  files; below-the-fold images lazy-load by default.

Every image has meaningful `alt` text derived from the product name/category.
