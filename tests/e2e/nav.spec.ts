// tests/e2e/nav.spec.ts
import { expect, test } from '@playwright/test';
import { noConsentBanner } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

test('desktop nav fits on one line between the logo and the sign-in button', async ({ page }) => {
  for (const width of [1280, 1366, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    const logo = await page.getByRole('link', { name: /cognitivebotics home/i }).boundingBox();
    const box = await nav.boundingBox();
    const signIn = await page.getByRole('button', { name: /^sign in/i }).first().boundingBox();
    expect(box!.x, `${width}px: nav starts after the logo`).toBeGreaterThanOrEqual(logo!.x + logo!.width);
    expect(box!.x + box!.width, `${width}px: nav ends before Sign in`).toBeLessThanOrEqual(signIn!.x);
    const rows = await nav.locator('a').evaluateAll((els) => new Set(els.map((e) => Math.round(e.getBoundingClientRect().top))).size);
    expect(rows, `${width}px: one row`).toBe(1);
  }
});

test('Pricing is in the nav and opens the pricing page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Pricing' }).click();
  await expect(page).toHaveURL(/\/pricing$/);
  await expect(page.getByRole('link', { name: 'Pricing', exact: true }).first()).toHaveAttribute('aria-current', 'page');
});
