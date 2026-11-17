import { expect, test } from '@playwright/test';
import { noConsentBanner } from './helpers';

test.beforeEach(async ({ page }) => {
  await noConsentBanner(page);
});

test('the headline uses the page-title size, one step under the old 56px', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/case-studies/manasa-institute');
  const size = await page.getByRole('heading', { level: 1 }).evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(size).toBe(48);
});

test('each metric stays on one line and the three sit at the same height', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/case-studies/manasa-institute');
  const values = page.locator('article li > span.font-heading');
  await expect(values).toHaveCount(3);
  const boxes = await values.evaluateAll((els) => els.map((el) => el.getBoundingClientRect()));
  for (const b of boxes) expect(b.height).toBeLessThanOrEqual(60); // one 56px line, never two
  expect(new Set(boxes.map((b) => Math.round(b.top))).size).toBe(1);
});

test('the section tabs jump to their section and follow the scroll', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/case-studies/manasa-institute');
  const nav = page.getByRole('navigation', { name: 'Sections' });
  await expect(nav.getByRole('link')).toHaveCount(5);
  await expect(nav.getByRole('link', { name: 'Challenge' })).toHaveAttribute('aria-current', 'true');
  await nav.getByRole('link', { name: 'About' }).click();
  await expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'true');
  await expect(page).toHaveURL(/#about$/);
  await expect.poll(() => page.locator('#about').evaluate((el) => Math.round(el.getBoundingClientRect().top))).toBeLessThan(200);
  await expect(nav).toBeInViewport(); // the rail stays with the reader
});

test('below lg the section tabs become a dropdown that jumps to the section', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 900 });
  await page.goto('/case-studies/manasa-institute');
  await expect(page.getByRole('navigation', { name: 'Sections' })).toBeHidden();
  const select = page.getByRole('combobox', { name: 'Sections' });
  await expect(select).toBeVisible();
  await select.selectOption('about');
  await expect(page).toHaveURL(/#about$/);
  await expect.poll(() => page.locator('#about').evaluate((el) => Math.round(el.getBoundingClientRect().top))).toBeLessThan(200);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
});

test('on desktop the dropdown is hidden and the rows use the design-system tab look', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/case-studies/manasa-institute');
  await expect(page.getByRole('combobox', { name: 'Sections' })).toBeHidden();
  const current = page.getByRole('navigation', { name: 'Sections' }).getByRole('link', { name: 'Challenge' });
  const css = await current.evaluate((el) => {
    const s = getComputedStyle(el);
    return { bg: s.backgroundColor, radius: s.borderRadius, size: s.fontSize };
  });
  expect(css.bg).toBe('rgb(221, 243, 244)'); // #ddf3f4, color/background/brand-muted
  expect(css.radius).toBe('8px');
});
