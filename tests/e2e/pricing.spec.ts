import { expect, test } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

test('pricing: one H1, two plans, structured data in INR', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pricing');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('One plan for centres and schools');
  await expect(page.getByRole('article')).toHaveCount(2);
  await expect(page.getByText('₹2,000')).toBeVisible();
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.join('')).toContain('INR');
});

test('pricing: both CTAs open the demo form with the plan', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pricing');
  await page.getByRole('link', { name: /book a demo/i }).first().click();
  await expect(page).toHaveURL(/\/try-demo\?plan=basic$/);
  await page.goto('/pricing');
  await page.getByRole('link', { name: /talk to sales/i }).click();
  await expect(page).toHaveURL(/\/try-demo\?plan=custom$/);
});

test('pricing: no horizontal overflow at any width', async ({ page }) => {
  for (const w of [375, 768, 1024, 1440]) {
    expect(await overflowAt(page, '/pricing', w), `${w}px`).toBeLessThanOrEqual(0);
  }
});
