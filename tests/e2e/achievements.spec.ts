import { expect, test } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

const PATENT = 'https://d2gq2a16cq5v8g.cloudfront.net/documents/CognitiveBotics_India_Patent.pdf';
const MEDTECH = '/achievements/ap-govt-medtech-certificate.webp';
const ISO = 'https://d2gq2a16cq5v8g.cloudfront.net/documents/Final-ISO-27001-Certificate-2026.pdf';

test('achievements: header and three certificate cards open in a new tab', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/achievements');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Achievements');
  const cards = page.locator('main a[target="_blank"]');
  await expect(cards).toHaveCount(3);
  await expect(page.locator(`a[href="${PATENT}"]`)).toHaveAttribute('target', '_blank');
  await expect(page.locator(`a[href="${ISO}"]`)).toHaveAttribute('target', '_blank');
  await expect(page.locator(`a[href="${MEDTECH}"]`)).toHaveAttribute('target', '_blank');
  await expect(page.getByText('Granted Indian Patent • No. 586929')).toBeVisible();
  await expect(page.getByText('ISO 27001 certified')).toBeVisible();
});

test('achievements: each card is one link with image, badge, title, description and CTA', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/achievements');
  const cards = [
    { href: PATENT, badge: 'Granted Indian Patent • No. 586929', title: 'Methods for Aiding Persons with Autism to Acquire Skills' },
    { href: ISO, badge: 'Certified', title: 'ISO Certification' },
    { href: MEDTECH, badge: 'Finalist • MedTech Innovation Challenge 2026', title: 'Certificate of Appreciation' },
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
  }
  // The long patent description wraps and shows in full, with no ellipsis cut-off.
  const desc = page.locator(`a[href="${PATENT}"] p`).nth(1);
  await expect(desc).toContainText('through 2039.');
  const clipped = await desc.evaluate((el) => el.scrollWidth > el.clientWidth || getComputedStyle(el).textOverflow === 'ellipsis');
  expect(clipped).toBe(false);
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

test('achievements: three cards share a row on desktop and two sit side by side on a phone', async ({ page }) => {
  const hrefs = [PATENT, ISO, MEDTECH];
  const tops = async () => Promise.all(hrefs.map(async (h) => Math.round((await page.locator(`a[href="${h}"]`).boundingBox())!.y)));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/achievements');
  expect(new Set(await tops()).size).toBe(1);
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/achievements');
  const [a, b, c] = await tops();
  expect(a).toBe(b);
  expect(c).toBeGreaterThan(a);
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
