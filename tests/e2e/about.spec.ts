import { expect, test } from '@playwright/test';
import { expectPageMatchesReference, noConsentBanner } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

test('about matches the reference structure at all widths', async ({ page }) => {
  await expectPageMatchesReference(page, '/about');
});

test('team photos that have no local file render labeled placeholders, not broken images', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/about');
  const broken = await page.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length);
  expect(broken).toBe(0);
});

test('closing CTA links to contact', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/about');
  await expect(page.getByRole('link', { name: 'Get in touch' }).first()).toHaveAttribute('href', '/contact-us');
});
