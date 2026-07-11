import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright drives a real production build (next start) so the flows exercise
 * the same output users get. Three critical journeys are covered in tests/e2e.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
    // Collapse transform-based overlay animations to stable opacity fades (our
    // components honour prefers-reduced-motion), so clicks don't race a moving
    // element. Also exercises the reduced-motion a11y path.
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 5'] } },
  ],
  webServer: {
    command: 'npm run build && npm run start -- -p 3100',
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
