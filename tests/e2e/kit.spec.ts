import { expect, test } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

const EDGE_WIDTHS = [320, 375, 767, 768, 1023, 1024, 1279, 1280, 1440];

test.describe('kit gallery', () => {
  test.beforeEach(async ({ page }) => noConsentBanner(page));

  for (const w of EDGE_WIDTHS) {
    test(`no horizontal overflow at ${w}px (long strings, header swap)`, async ({ page }) => {
      expect(await overflowAt(page, '/kit', w)).toBeLessThanOrEqual(0);
    });
  }

  test('header shows hamburger below xl and full nav at xl', async ({ page }) => {
    await page.setViewportSize({ width: 1279, height: 800 });
    await page.goto('/kit');
    await expect(page.getByRole('button', { name: /open menu/i })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeHidden();
    await page.setViewportSize({ width: 1280, height: 800 });
    await expect(page.getByRole('button', { name: /open menu/i })).toBeHidden();
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  });

  test('footer renders on the kit page', async ({ page }) => {
    await page.goto('/kit');
    await expect(page.locator('footer')).toBeVisible();
  });
});
