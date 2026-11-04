import { expect, test } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

const COVER = '.cs-card .cs-cover';

test.beforeEach(async ({ page }) => {
  await noConsentBanner(page);
});

test('both case study cards show thumbnail 03 as a loaded 16:9 image', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/case-studies');
  const covers = page.locator(COVER);
  await expect(covers).toHaveCount(2);
  for (let i = 0; i < 2; i++) {
    const img = covers.nth(i);
    expect(await img.evaluate((el) => el.tagName)).toBe('IMG');
    expect(decodeURIComponent((await img.getAttribute('src'))!)).toContain('/images/blog/thumbnail-03.webp');
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth)).toBeGreaterThan(0);
    const box = (await img.boundingBox())!;
    expect(box.width / box.height).toBeCloseTo(16 / 9, 1);
  }
});

test('the image URLs answer 200 with an image', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/case-studies');
  const srcs = await page.locator(COVER).evaluateAll((els) => els.map((el) => (el as HTMLImageElement).getAttribute('src')));
  expect(srcs).toHaveLength(2);
  for (const src of srcs) {
    const res = await page.request.get(src!);
    expect(res.status(), src!).toBe(200);
    expect(res.headers()['content-type'], src!).toMatch(/^image\//);
  }
});

test('a case study still opens from its card, and the page does not overflow at any width', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/case-studies');
  await page.locator('.cs-card').first().click();
  await expect(page).toHaveURL(/\/case-studies\/sample-therapy-centre$/);
  for (const w of [375, 768, 1024, 1440]) {
    expect(await overflowAt(page, '/case-studies', w), `/case-studies at ${w}px`).toBeLessThanOrEqual(0);
  }
});
