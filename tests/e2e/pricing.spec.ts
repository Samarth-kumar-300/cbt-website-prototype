import { expect, test } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

const panel = (page: import('@playwright/test').Page, id: string) => page.locator(`#pricing-panel-${id}`);

test('pricing: hero, centres by default, structured data in INR', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pricing');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('One platform for each neurodivergent child’s plan, practice and progress.');
  await expect(page.getByRole('tab', { name: 'Therapy Centres' })).toHaveAttribute('aria-selected', 'true');
  await expect(panel(page, 'therapy-centres').getByRole('article')).toHaveCount(2);
  await expect(panel(page, 'schools')).toBeHidden();
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.join('')).toContain('INR');
});

test('pricing: switching to schools shows BLOOM and updates the URL', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pricing');
  await page.getByRole('tab', { name: 'Schools' }).click();
  await expect(page).toHaveURL(/\/pricing\?for=schools$/);
  await expect(panel(page, 'schools').getByRole('article')).toHaveCount(3);
  await expect(panel(page, 'schools').getByRole('article', { name: 'BLOOM' })).toBeVisible();
  await page.getByRole('tab', { name: 'Schools' }).press('ArrowLeft');
  await expect(page.getByRole('tab', { name: 'Therapy Centres' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/\/pricing$/);
});

test('pricing: ?for=schools opens on schools, a bad value falls back', async ({ page }) => {
  await page.goto('/pricing?for=schools');
  await expect(page.getByRole('tab', { name: 'Schools' })).toHaveAttribute('aria-selected', 'true');
  await expect(panel(page, 'therapy-centres')).toBeHidden();
  await page.goto('/pricing?for=nope');
  await expect(page.getByRole('tab', { name: 'Therapy Centres' })).toHaveAttribute('aria-selected', 'true');
});

test('pricing: switching keeps the reader where they are', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pricing');
  const tab = page.getByRole('tab', { name: 'Schools' });
  await tab.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  await tab.click();
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThan(4);
  await expect(panel(page, 'schools').getByRole('heading', { name: 'Skills empowering every child’s journey' })).toBeVisible();
});

test('pricing: plan buttons open the right forms', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pricing');
  await panel(page, 'therapy-centres').getByRole('link', { name: /book a demo/i }).click();
  await expect(page).toHaveURL(/\/try-demo\?plan=basic$/);
  await page.goto('/pricing');
  await panel(page, 'therapy-centres').getByRole('article', { name: 'Custom' }).getByRole('link', { name: 'Contact us' }).click();
  await expect(page).toHaveURL(/\/try-demo\?plan=custom$/);
});

test('pricing: no horizontal overflow at any width, either audience', async ({ page }) => {
  for (const route of ['/pricing', '/pricing?for=schools']) {
    for (const w of [375, 768, 1024, 1440]) {
      expect(await overflowAt(page, route, w), `${route} ${w}px`).toBeLessThanOrEqual(0);
    }
  }
});
