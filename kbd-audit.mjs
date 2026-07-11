import { chromium } from '@playwright/test';

const BASE = 'http://localhost:3100';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
const p = await ctx.newPage();

const desc = () =>
  p.evaluate(() => {
    const el = document.activeElement;
    if (!el || el === document.body) return { LOST: true };
    const t = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 34);
    return {
      tag: el.tagName.toLowerCase(),
      role: el.getAttribute('role') || undefined,
      label: el.getAttribute('aria-label') || el.getAttribute('placeholder') || undefined,
      id: el.id || undefined,
      pressed: el.getAttribute('aria-pressed') || undefined,
      href: el.getAttribute('href') || undefined,
      text: t || undefined,
    };
  });

const line = (o) => {
  if (o.LOST) return '  ⚠️  FOCUS LOST (body)';
  const parts = [o.tag, o.role && `[${o.role}]`, o.id && `#${o.id}`, o.label && `"${o.label}"`, o.href && `→${o.href}`, o.text && !o.label && `“${o.text}”`, o.pressed && `pressed=${o.pressed}`].filter(Boolean);
  return '  ' + parts.join(' ');
};

async function sweep(n, label) {
  console.log(`\n## ${label}`);
  const seen = [];
  for (let i = 0; i < n; i++) {
    await p.keyboard.press('Tab');
    const d = await desc();
    seen.push(d);
    console.log(`${String(i + 1).padStart(2)}.` + line(d));
  }
  return seen;
}

const problems = [];

// ---------- HOME ----------
await p.goto(BASE);
await p.evaluate(() => document.body.focus());
console.log('=== HOME ===');
const home = await sweep(9, 'Tab order from top of Home');
if (home.some((d) => d.LOST)) problems.push('Home: focus lost mid-sweep');
// Skip link should be first and jump to #main.
if (!(home[0].href === '#main')) problems.push('Home: first Tab is not the skip link');

// ---------- HOME -> PLP via keyboard ----------
// Tab to the "All Products" nav link and activate it.
await p.goto(BASE);
await p.evaluate(() => document.body.focus());
let landed = false;
for (let i = 0; i < 20; i++) {
  await p.keyboard.press('Tab');
  const d = await desc();
  if (d.href === '/shop' && (d.text || '').match(/All Products/i)) {
    await p.keyboard.press('Enter');
    await p.waitForURL('**/shop');
    landed = true;
    break;
  }
}
console.log(`\nHome→PLP by keyboard: ${landed ? '✓ activated "All Products" nav link' : '✗ could not reach nav link'}`);
if (!landed) problems.push('Home: could not tab to and activate the All Products link');

// ---------- PLP FILTERS ----------
await p.goto(`${BASE}/shop`);
await p.evaluate(() => document.body.focus());
const plp = await sweep(16, 'Tab order across PLP (filters → controls → grid)');
if (plp.some((d) => d.LOST)) problems.push('PLP: focus lost mid-sweep');
// Toggle first category checkbox by keyboard (Space).
await p.goto(`${BASE}/shop`);
await p.evaluate(() => document.body.focus());
let cbFound = false;
for (let i = 0; i < 14; i++) {
  await p.keyboard.press('Tab');
  const d = await desc();
  if (d.role === 'checkbox' || d.tag === 'button' && d.role === 'checkbox') {
    cbFound = true;
    await p.keyboard.press('Space');
    await p.waitForTimeout(400);
    console.log(`\nPLP category checkbox toggled by Space → URL: ${new URL(p.url()).search || '(none)'}`);
    break;
  }
}
if (!cbFound) problems.push('PLP: could not reach a category checkbox by Tab');
// Sort select: focus and open with keyboard.
await p.goto(`${BASE}/shop`);
const sortTrigger = p.getByLabel('Sort products');
await sortTrigger.focus();
await p.keyboard.press('Enter');
await p.waitForTimeout(300);
const sortOpen = await p.evaluate(() => !!document.querySelector('[role="listbox"], [role="option"]'));
console.log(`Sort select opens by keyboard: ${sortOpen ? '✓' : '✗'}`);
if (!sortOpen) problems.push('PLP: sort select did not open via keyboard');
await p.keyboard.press('Escape');

// ---------- PDP VARIANTS + ADD TO CART ----------
await p.goto(`${BASE}/product/galaxy-s23-ultra`);
await p.evaluate(() => document.body.focus());
const pdp = await sweep(20, 'Tab order across PDP (gallery → variants → qty → add)');
if (pdp.some((d) => d.LOST)) problems.push('PDP: focus lost mid-sweep');
// Select a variant pill by keyboard: focus a pressed=false storage/pill button and Space it.
await p.goto(`${BASE}/product/galaxy-s23-ultra`);
await p.evaluate(() => document.body.focus());
let variantToggled = false;
for (let i = 0; i < 24; i++) {
  await p.keyboard.press('Tab');
  const d = await desc();
  if (d.tag === 'button' && d.pressed === 'false') {
    await p.keyboard.press('Enter');
    const after = await desc();
    variantToggled = after.pressed === 'true';
    console.log(`\nPDP variant selected by keyboard: ${variantToggled ? '✓' : '✗'} (${d.label || d.text})`);
    break;
  }
}
if (!variantToggled) problems.push('PDP: could not select a variant option by keyboard');

// Now tab to Add to cart and press Enter.
let addedFromKbd = false;
for (let i = 0; i < 20; i++) {
  await p.keyboard.press('Tab');
  const d = await desc();
  if (d.tag === 'button' && /add to cart/i.test(d.text || d.label || '')) {
    await p.keyboard.press('Enter');
    await p.waitForTimeout(600);
    addedFromKbd = true;
    break;
  }
}
console.log(`PDP add-to-cart by Enter: ${addedFromKbd ? '✓' : '✗'}`);
if (!addedFromKbd) problems.push('PDP: could not reach/activate Add to cart by keyboard');

// ---------- CART DRAWER FOCUS TRAP ----------
const drawerVisible = await p.getByRole('dialog').isVisible().catch(() => false);
console.log(`\n## Cart drawer`);
console.log(`Drawer opened after add: ${drawerVisible ? '✓' : '✗'}`);
if (drawerVisible) {
  const focusInside = await p.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"]');
    return dlg ? dlg.contains(document.activeElement) : false;
  });
  console.log(`Focus moved into drawer: ${focusInside ? '✓' : '✗'}`);
  if (!focusInside) problems.push('Cart drawer: focus did not move into the dialog');
  // Tab several times, ensure focus stays trapped inside the dialog.
  let escaped = false;
  for (let i = 0; i < 12; i++) {
    await p.keyboard.press('Tab');
    const inside = await p.evaluate(() => {
      const dlg = document.querySelector('[role="dialog"]');
      return dlg ? dlg.contains(document.activeElement) : false;
    });
    if (!inside) { escaped = true; break; }
  }
  console.log(`Focus trapped within drawer over 12 Tabs: ${escaped ? '✗ escaped' : '✓ trapped'}`);
  if (escaped) problems.push('Cart drawer: focus escaped the trap');
  // Escape closes and returns focus.
  await p.keyboard.press('Escape');
  await p.waitForTimeout(400);
  const closed = !(await p.getByRole('dialog').isVisible().catch(() => false));
  console.log(`Escape closes drawer: ${closed ? '✓' : '✗'}`);
  if (!closed) problems.push('Cart drawer: Escape did not close it');
  const returned = await desc();
  console.log(`Focus after close:` + line(returned));
  if (returned.LOST) problems.push('Cart drawer: focus lost after close (not returned to trigger)');
}

// ---------- CHECKOUT (keyboard) ----------
console.log(`\n## Checkout — shipping (keyboard entry)`);
await p.goto(`${BASE}/checkout/shipping`);
await p.waitForTimeout(600);
// Focus the first field and tab-fill each in order.
const shipping = [
  ['fullName', 'Daniel Kamau'],
  ['email', 'daniel@example.com'],
  ['phone', '0712345678'],
  ['address', '123 Kenyatta Avenue'],
  ['city', 'Nairobi'],
  ['county', 'Nairobi'],
  ['postalCode', '00100'],
];
await p.locator('#fullName').focus();
for (const [id, val] of shipping) {
  const active = await p.evaluate(() => document.activeElement?.id);
  if (active !== id) {
    console.log(`  ⚠️ expected #${id} focused, got #${active}`);
    problems.push(`Checkout shipping: tab order off at #${id} (was #${active})`);
    await p.locator(`#${id}`).focus();
  }
  await p.keyboard.type(val);
  await p.keyboard.press('Tab');
}
// After the last field, tabbing should reach the submit button.
let submitReached = false;
for (let i = 0; i < 4; i++) {
  const d = await desc();
  if (d.tag === 'button' && /continue to payment/i.test(d.text || '')) { submitReached = true; break; }
  await p.keyboard.press('Tab');
}
console.log(`Reached "Continue to payment" by Tab: ${submitReached ? '✓' : '✗'}`);
if (!submitReached) problems.push('Checkout shipping: submit not reachable by Tab after fields');
await p.keyboard.press('Enter');
await p.waitForURL('**/checkout/payment').catch(() => {});
console.log(`Advanced to payment: ${/payment/.test(p.url()) ? '✓' : '✗ (' + p.url() + ')'}`);
if (!/payment/.test(p.url())) problems.push('Checkout: Enter on shipping submit did not advance to payment');

if (/payment/.test(p.url())) {
  console.log(`\n## Checkout — payment (keyboard entry)`);
  const pay = [
    ['cardName', 'Daniel Kamau'],
    ['cardNumber', '4242424242424242'],
    ['expiry', '0830'],
    ['cvc', '123'],
  ];
  await p.locator('#cardName').focus();
  for (const [id, val] of pay) {
    const active = await p.evaluate(() => document.activeElement?.id);
    if (active !== id) { await p.locator(`#${id}`).focus(); }
    await p.keyboard.type(val);
    await p.keyboard.press('Tab');
  }
  let payReached = false;
  for (let i = 0; i < 5; i++) {
    const d = await desc();
    if (d.tag === 'button' && /pay ksh/i.test(d.text || '')) { payReached = true; break; }
    await p.keyboard.press('Tab');
  }
  console.log(`Reached "Pay" button by Tab: ${payReached ? '✓' : '✗'}`);
  if (!payReached) problems.push('Checkout payment: pay button not reachable by Tab');
  await p.keyboard.press('Enter');
  await p.waitForURL('**/checkout/confirmation').catch(() => {});
  console.log(`Advanced to confirmation: ${/confirmation/.test(p.url()) ? '✓' : '✗'}`);
  if (!/confirmation/.test(p.url())) problems.push('Checkout: could not reach confirmation by keyboard');
  else {
    const h1 = await p.getByRole('heading', { name: /order confirmed/i }).isVisible().catch(() => false);
    console.log(`Confirmation heading visible: ${h1 ? '✓' : '✗'}`);
  }
}

console.log('\n================ SUMMARY ================');
if (problems.length === 0) console.log('✅ No keyboard issues found across the full flow.');
else { console.log(`❌ ${problems.length} issue(s):`); problems.forEach((x) => console.log('  - ' + x)); }

await b.close();
