import { test, expect } from '@playwright/test';

/**
 * Flow 2 — search: the overlay finds products, routes to the results page, and
 * both surfaces handle the no-results case gracefully.
 */
test('search overlay finds products and routes to results', async ({ page }) => {
  await page.goto('/');

  // Open the search overlay from the header trigger.
  await page.getByRole('button', { name: /search products/i }).first().click();
  const searchbox = page.getByRole('textbox', { name: /search products/i });
  await expect(searchbox).toBeVisible();

  await searchbox.fill('iphone');
  // Debounced results appear as links.
  await expect(page.getByRole('link', { name: /iPhone 15 Pro Max/i })).toBeVisible();

  // "See all results" routes to the search page.
  await page.getByRole('button', { name: /see all results/i }).click();
  await expect(page).toHaveURL(/\/search\?q=iphone/i);
  // Scope to <main> so the (portaled, briefly-exiting) overlay doesn't match.
  const main = page.getByRole('main');
  await expect(main.getByText(/results? for/i)).toBeVisible();
  await expect(main.getByRole('link', { name: /iPhone 15 Pro Max/i }).first()).toBeVisible();
});

test('search results page handles no matches', async ({ page }) => {
  await page.goto('/search?q=zzznothing');
  await expect(page.getByRole('heading', { name: /no results/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /browse all products/i })).toBeVisible();
});

test('search is reachable and usable via keyboard shortcut', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('textbox', { name: /search products/i })).toBeVisible();
});
