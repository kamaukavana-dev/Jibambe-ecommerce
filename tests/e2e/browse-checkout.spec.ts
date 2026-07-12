import { test, expect } from '@playwright/test';

/**
 * Flow 1 — the money path: browse -> product -> add to cart -> full checkout
 * to an order confirmation. This is the flow that must never break.
 */
test('browse to a product, add to cart, and complete checkout', async ({ page }) => {
  await page.goto('/');

  // Home renders the brand and a shop entry point.
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // Go to a known product with no variants (simplest add path).
  await page.goto('/product/playstation-5');
  await expect(page.getByRole('heading', { name: 'PlayStation 5 Console' })).toBeVisible();

  // Add to cart — the drawer opens with the item.
  await page.getByRole('button', { name: /add to cart/i }).click();
  const drawer = page.getByRole('dialog');
  await expect(drawer).toBeVisible();
  await expect(drawer.getByText('PlayStation 5 Console')).toBeVisible();

  // Proceed to checkout via the cart page (stable, animation-free path).
  await page.goto('/cart');
  await page.getByRole('link', { name: /proceed to checkout/i }).click();
  await expect(page).toHaveURL(/\/checkout\/shipping/);

  // Fill shipping details.
  await page.getByLabel('Full name').fill('Daniel Kamau');
  await page.getByLabel('Email').fill('daniel@example.com');
  await page.getByLabel('Phone').fill('0712345678');
  await page.getByLabel('Street address').fill('123 Kenyatta Avenue');
  await page.getByLabel('City / town').fill('Nairobi');
  await page.getByLabel('County').fill('Nairobi');
  await page.getByLabel('Postal code').fill('00100');
  await page.getByRole('button', { name: /continue to payment/i }).click();

  await expect(page).toHaveURL(/\/checkout\/payment/);

  // Fill payment with a Luhn-valid test card.
  await page.getByLabel('Name on card').fill('Daniel Kamau');
  await page.getByLabel('Card number').fill('4242 4242 4242 4242');
  await page.getByLabel('Expiry (MM/YY)').fill('08/30');
  await page.getByLabel('CVC').fill('123');
  // Accept the required Terms & Conditions / Privacy Policy before paying.
  await page.getByRole('checkbox', { name: /i agree to the terms/i }).check();
  await page.getByRole('button', { name: /pay ksh/i }).click();

  // Confirmation.
  await expect(page).toHaveURL(/\/checkout\/confirmation/);
  await expect(page.getByRole('heading', { name: /order confirmed/i })).toBeVisible();
  await expect(page.getByText(/JIB-\d{6}/)).toBeVisible();
});

test('checkout is guarded when the cart is empty', async ({ page }) => {
  await page.goto('/checkout/shipping');
  // The guard redirects an empty-cart visitor to the cart page.
  await expect(page).toHaveURL(/\/cart/);
});

test('shipping form blocks submission with invalid input', async ({ page }) => {
  await page.goto('/product/playstation-5');
  await page.getByRole('button', { name: /add to cart/i }).click();
  await page.goto('/cart');
  await page.getByRole('link', { name: /proceed to checkout/i }).click();

  // Submit empty — should stay on shipping and show errors.
  await page.getByRole('button', { name: /continue to payment/i }).click();
  await expect(page).toHaveURL(/\/checkout\/shipping/);
  await expect(page.getByText(/is required/i).first()).toBeVisible();

  // Invalid phone specifically.
  await page.getByLabel('Phone').fill('123');
  await page.getByLabel('Phone').blur();
  await expect(page.getByText(/valid Kenyan phone/i)).toBeVisible();
});
