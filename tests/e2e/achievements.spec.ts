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

test('achievements: each card is one link with image, badge, title, one-line description and CTA', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/achievements');
  const cards = [
    { href: PATENT, badge: 'Granted Indian Patent • No. 586929', title: 'Methods for Aiding Persons with Autism to Acquire Skills' },
    { href: ISO, badge: 'Certified', title: 'ISO Certification' },
  ];
  for (const c of cards) {
    const card = page.locator(`a[href="${c.href}"]`);
    await expect(card).toHaveCount(1);
    await expect(card.locator('a, button')).toHaveCount(0);
    await expect(card.getByRole('img')).toBeVisible();
    await expect(card.getByRole('img')).not.toHaveAttribute('alt', '');
    await expect(card.getByText(c.badge, { exact: true })).toBeVisible();
    await expect(card.getByText(c.title, { exact: true })).toBeVisible();
    await expect(card.getByText('View Certificate', { exact: true })).toBeVisible();
    // The description is the paragraph after the title; one line means its height is one line-height.
    const desc = card.locator('p').nth(1);
    const lines = await desc.evaluate((el) => Math.round(el.getBoundingClientRect().height / parseFloat(getComputedStyle(el).lineHeight)));
    expect(lines).toBe(1);
  }
  // The long patent description is cut off with an ellipsis.
  const truncated = await page.locator(`a[href="${PATENT}"] p`).nth(1).evaluate((el) => el.scrollWidth > el.clientWidth);
  expect(truncated).toBe(true);
});

test('achievements: cards are equal height with the CTA at the bottom', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/achievements');
  const [a, b] = await Promise.all([PATENT, ISO].map((h) => page.locator(`a[href="${h}"]`).boundingBox()));
  expect(Math.abs(a!.height - b!.height)).toBeLessThanOrEqual(1);
  const [ca, cb] = await Promise.all(
    [PATENT, ISO].map((h) => page.locator(`a[href="${h}"]`).getByText('View Certificate').boundingBox()),
  );
  expect(Math.abs(ca!.y - cb!.y)).toBeLessThanOrEqual(1);
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
