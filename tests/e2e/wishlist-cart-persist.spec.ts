import { test, expect } from '@playwright/test';

/**
 * Flow 3 — wishlist + persistence: save a product, see it on the wishlist page,
 * and verify both wishlist and cart survive a full page reload (localStorage).
 */
test('add to wishlist from the PDP and see it persist across reload', async ({ page }) => {
  await page.goto('/product/macbook-air-m2');

  // Toggle the wishlist from the buy box.
  await page.getByRole('button', { name: /add MacBook Air M2 to wishlist/i }).click();

  // Visit the wishlist page — the product is there.
  await page.goto('/wishlist');
  await expect(page.getByRole('link', { name: /MacBook Air M2/i }).first()).toBeVisible();

  // Reload — still there (persisted).
  await page.reload();
  await expect(page.getByRole('link', { name: /MacBook Air M2/i }).first()).toBeVisible();
});

test('cart persists across a page reload', async ({ page }) => {
  await page.goto('/product/playstation-5');
  await page.getByRole('button', { name: /add to cart/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();

  // Reload the cart page and confirm the item is still there.
  await page.goto('/cart');
  await expect(page.getByRole('link', { name: 'PlayStation 5 Console' }).first()).toBeVisible();
  await page.reload();
  await expect(page.getByRole('link', { name: 'PlayStation 5 Console' }).first()).toBeVisible();
});

test('empty wishlist shows a designed empty state', async ({ page }) => {
  await page.goto('/wishlist');
  await expect(page.getByRole('heading', { name: /wishlist is empty/i })).toBeVisible();
});
