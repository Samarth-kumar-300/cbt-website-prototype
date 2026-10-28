import { expect, test } from '@playwright/test';
import { noConsentBanner } from './helpers';

const OUT_OF_SCOPE = ['/try-demo', '/developmental-checklist', '/privacy-policy', '/terms-of-use', '/medical-disclaimer', '/blog', '/blog/some-post', '/resources/research/some-study'];

test.beforeEach(async ({ page }) => noConsentBanner(page));

for (const route of OUT_OF_SCOPE) {
  test(`${route} serves the coming-soon stub, not a 404`, async ({ page }) => {
    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1, name: 'Coming soon' })).toBeVisible();
    expect(new URL(page.url()).pathname).toBe(route);
  });
}
