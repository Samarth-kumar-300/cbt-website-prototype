import { expect, test } from '@playwright/test';

// Mobile behaviour from docs/superpowers/specs/2026-10-17-mobile-experience-design.md.
test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

const PAGES = ['/', '/schools', '/parents', '/therapy-centres', '/about', '/resources', '/contact-us', '/careers'];

for (const path of PAGES) {
  test(`${path}: no horizontal overflow at 390px`, async ({ page }) => {
    await page.goto(path);
    const over = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(over).toBe(false);
  });
}

test('cookie bar stays compact and clears the page end on dismiss', async ({ page }) => {
  await page.goto('/');
  const bar = page.getByRole('dialog', { name: 'Cookie preferences' });
  await expect(bar).toBeVisible();
  const h = (await bar.boundingBox())!.height;
  expect(h).toBeLessThanOrEqual(844 * 0.2);
  await page.getByRole('button', { name: 'Accept all', exact: true }).click();
  await expect(bar).toHaveCount(0);
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--cookie-h').trim())).toBe('0px');
});

test('parents: tapping an early-difference card opens exactly one', async ({ page }) => {
  await page.goto('/parents');
  const card = page.getByRole('button', { name: /Comfort in routine/ });
  await card.scrollIntoViewIfNeeded();
  await card.tap();
  await expect(card).toHaveAttribute('aria-expanded', 'true');
  const open = page.locator('button[aria-expanded="true"]', { hasText: /develops differently|feels different|Comfort in routine|everyday sensations/ });
  await expect(open).toHaveCount(1);
});

test('schools: pinned list is short, and tapping a step opens it', async ({ page }) => {
  await page.goto('/schools');
  const sticky = page.locator('div.sticky.h-svh');
  await expect(sticky).toHaveCount(1);
  const outerH = await sticky.evaluate((el) => el.parentElement!.getBoundingClientRect().height);
  expect(outerH).toBeLessThanOrEqual(844 * 2.2); // 100svh + at most 110svh of pin
  const step = page.getByRole('button', { name: /Ongoing Specialist Support/ });
  await step.scrollIntoViewIfNeeded();
  await step.tap();
  await expect(step).toHaveAttribute('aria-expanded', 'true', { timeout: 4000 });
});

test('schools: short phones fall back to an unpinned list', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 640 });
  await page.goto('/schools');
  await expect(page.locator('div.sticky.h-svh')).toHaveCount(0);
});
