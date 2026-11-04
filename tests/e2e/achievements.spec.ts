import { expect, test } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

const PATENT = 'https://d2gq2a16cq5v8g.cloudfront.net/documents/CognitiveBotics_India_Patent.pdf';
const ISO = 'https://d2gq2a16cq5v8g.cloudfront.net/documents/Final-ISO-27001-Certificate-2026.pdf';

test('achievements: header and two certificate cards open in a new tab', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/achievements');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Achievements');
  const cards = page.locator('main a[target="_blank"]');
  await expect(cards).toHaveCount(2);
  await expect(page.locator(`a[href="${PATENT}"]`)).toHaveAttribute('target', '_blank');
  await expect(page.locator(`a[href="${ISO}"]`)).toHaveAttribute('target', '_blank');
  await expect(page.getByText('Granted Indian Patent • No. 586929')).toBeVisible();
  await expect(page.getByText('ISO 27001 certified')).toBeVisible();
});

test('achievements: Book a demo goes to /try-demo', async ({ page }) => {
  await page.goto('/achievements');
  await expect(page.getByRole('link', { name: 'Book a demo' }).last()).toHaveAttribute('href', '/try-demo');
});

test('achievements: no horizontal overflow at any width', async ({ page }) => {
  for (const w of [375, 768, 1024, 1440]) {
    expect(await overflowAt(page, '/achievements', w), `${w}px`).toBeLessThanOrEqual(0);
  }
});
