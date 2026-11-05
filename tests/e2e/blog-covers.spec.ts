import { expect, test } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

const IMAGE = 'main a[href^="/blog/"] [data-cover="image"]';
const PLACEHOLDER = 'main a[href^="/blog/"] [data-cover="placeholder"]';

test.describe('blog cards with supplied thumbnails', () => {
  test.beforeEach(async ({ page }) => {
    await noConsentBanner(page);
  });

  test('all six cards show a thumbnail, and none falls back to the placeholder', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/blog');
    await expect(page.locator(IMAGE)).toHaveCount(6);
    await expect(page.locator(PLACEHOLDER)).toHaveCount(0);
  });

  test('each card shows its own banner, in order', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/blog');
    const files = await page.locator(IMAGE).evaluateAll((els) => els.map((el) => new URL((el as HTMLImageElement).src).searchParams.get('url')));
    expect(files).toEqual([1, 2, 3, 4, 6, 5].map((n) => `/images/blog/banner-0${n}.webp`));
  });

  // Card widths from the grid: 1 column on phones, 2 on tablets, 3 on desktop (max container 1248px).
  for (const [width, expected] of [[375, 335], [768, 352], [1440, 400]] as const) {
    test(`at ${width}px the first thumbnail is ${expected}px wide, 16:9, and zooms 1.1x on hover`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/blog');
      const img = page.locator(IMAGE).first();
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth)).toBeGreaterThan(0);
      await expect.poll(async () => Math.round((await img.boundingBox())!.width)).toBe(expected);
      const box = (await img.boundingBox())!;
      expect(box.width / box.height).toBeCloseTo(16 / 9, 1);
      await img.hover();
      // The zoom runs for 500ms; wait until it settles at scale 1.1 (Tailwind v4 sets the `scale` property, not `transform`).
      await expect.poll(() => img.evaluate((el) => parseFloat(getComputedStyle(el).scale))).toBeCloseTo(1.1, 2);
    });
  }

  test('every thumbnail URL answers 200 with an image', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/blog');
    const srcs = await page.locator(IMAGE).evaluateAll((els) => els.map((el) => (el as HTMLImageElement).getAttribute('src')));
    expect(srcs).toHaveLength(6);
    for (const src of srcs) {
      const res = await page.request.get(src!);
      expect(res.status(), src!).toBe(200);
      expect(res.headers()['content-type'], src!).toMatch(/^image\//);
    }
  });

  test('the blog and a post page do not overflow horizontally at any width', async ({ page }) => {
    for (const route of ['/blog', '/blog/the-transformative-power-of-physical-activities-for-children-with-autism']) {
      for (const w of [375, 768, 1024, 1440]) {
        expect(await overflowAt(page, route, w), `${route} at ${w}px`).toBeLessThanOrEqual(0);
      }
    }
  });
});
