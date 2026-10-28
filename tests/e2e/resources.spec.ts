import { expect, test } from '@playwright/test';
import { expectPageMatchesReference, noConsentBanner } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

test('resources matches the reference structure at all widths', async ({ page }) => {
  await expectPageMatchesReference(page, '/resources');
});

for (const anchor of ['research', 'blog']) {
  test(`/resources#${anchor} lands on its section below the fixed header`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/resources#${anchor}`);
    // globals.css sets `scroll-behavior: smooth`, so the jump to the hash is animated;
    // poll until the scroll settles instead of measuring mid-flight.
    await expect
      .poll(async () => (await page.locator(`#${anchor}`).boundingBox())?.y ?? -1, { timeout: 10_000 })
      .toBeGreaterThanOrEqual(0);
    await expect
      .poll(async () => (await page.locator(`#${anchor}`).boundingBox())?.y ?? -1, { timeout: 10_000 })
      .toBeLessThan(200);
  });
}

test('blog cards resolve to the coming-soon stub instead of 404', async ({ page, request }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/resources');
  const hrefs = await page.locator('#blog a[href^="/blog"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  for (const href of hrefs) {
    const res = await request.get(href!);
    expect(res.status()).toBe(200);
  }
});
