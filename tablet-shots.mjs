import { chromium } from '@playwright/test';

const BASE = 'http://localhost:3100';
const OUT = '/tmp/jibambe-audit';
const b = await chromium.launch();

// Real iPad-class widths straddling the lg (1024px) breakpoint.
const viewports = [
  { name: 'portrait-768', width: 768, height: 1024 },
  { name: 'portrait-834', width: 834, height: 1112 },
  { name: 'landscape-1024', width: 1024, height: 768 },
];

async function shoot(ctx, url, file, opts = {}) {
  const p = await ctx.newPage();
  await p.goto(BASE + url, { waitUntil: 'domcontentloaded' });
  // Let images/layout settle without waiting for full networkidle (lazy images
  // below the fold keep the network busy indefinitely).
  await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => r(null))));
  await p.waitForTimeout(900);
  if (opts.openFilters) {
    const btn = p.locator('#plp-filters-button');
    if (await btn.isVisible().catch(() => false)) {
      await btn.click();
      await p.waitForTimeout(500);
    }
  }
  await p.waitForTimeout(300);
  await p.screenshot({ path: `${OUT}/${file}.png`, fullPage: opts.fullPage ?? false });
  await p.close();
}

for (const vp of viewports) {
  const ctx = await b.newContext({ viewport: { width: vp.width, height: vp.height } });
  // Seed a cart item so /cart and /checkout render populated.
  const seed = await ctx.newPage();
  await seed.goto(BASE + '/product/galaxy-s23-ultra', { waitUntil: 'domcontentloaded' });
  await seed.getByRole('button', { name: /add to cart/i }).click();
  await seed.waitForTimeout(500);
  await seed.close();

  await shoot(ctx, '/', `${vp.name}-home`);
  await shoot(ctx, '/shop', `${vp.name}-plp`);
  // Filter sidebar: persistent at lg+, drawer below — capture whichever applies.
  await shoot(ctx, '/shop', `${vp.name}-plp-filters`, { openFilters: true });
  await shoot(ctx, '/product/galaxy-s23-ultra', `${vp.name}-pdp`);
  await shoot(ctx, '/cart', `${vp.name}-cart`);
  await shoot(ctx, '/checkout/shipping', `${vp.name}-checkout`);
  await ctx.close();
  console.log(`captured ${vp.name}`);
}

await b.close();
