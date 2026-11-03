import { expect, test } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

test('faqs: chips switch the visible set and sync the hash', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/faqs');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Frequently asked questions');
  await expect(page.getByRole('tab')).toHaveCount(5);
  await expect(page.getByRole('tab', { name: 'General' })).toHaveAttribute('aria-selected', 'true');
  await page.getByRole('tab', { name: 'Schools' }).click();
  await expect(page).toHaveURL(/#schools$/);
  await expect(page.getByRole('button', { name: /What is CognitiveBotics Bloom\?/ })).toBeVisible();
  await expect(page.getByText('Last updated:')).toBeVisible();
});

test('faqs: a deep link opens its set and the page carries FAQPage data', async ({ page }) => {
  await page.goto('/faqs#parents');
  await expect(page.getByRole('tab', { name: 'Parents' })).toHaveAttribute('aria-selected', 'true');
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.join('')).toContain('FAQPage');
});

test('faqs: no horizontal overflow at any width', async ({ page }) => {
  for (const w of [375, 768, 1024, 1440]) {
    expect(await overflowAt(page, '/faqs', w), `${w}px`).toBeLessThanOrEqual(0);
  }
});
