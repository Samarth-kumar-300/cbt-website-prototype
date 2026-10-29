import { expect, test } from '@playwright/test';
import { noConsentBanner } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

test('try-demo shows heading and four game cards', async ({ page }) => {
  await page.setViewportSize({ width: 1270, height: 900 });
  await page.goto('/try-demo');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Try the learning games in our autism app');
  await expect(page.locator('main ul > li')).toHaveCount(4);
  await expect(page.getByRole('heading', { name: 'Ready to get started?' })).toBeVisible();
});
