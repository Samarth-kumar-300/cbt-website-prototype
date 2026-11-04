// tests/e2e/nav.spec.ts
import { expect, test } from '@playwright/test';
import { noConsentBanner } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

test('desktop nav fits on one line between the logo and the sign-in button', async ({ page }) => {
  for (const width of [1280, 1366, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Primary' });
    const logo = await page.getByRole('link', { name: /cognitivebotics home/i }).boundingBox();
    const box = await nav.boundingBox();
    const signIn = await page.getByRole('button', { name: /^sign in/i }).first().boundingBox();
    expect(box!.x, `${width}px: nav starts after the logo`).toBeGreaterThanOrEqual(logo!.x + logo!.width);
    expect(box!.x + box!.width, `${width}px: nav ends before Sign in`).toBeLessThanOrEqual(signIn!.x);
    // Compare vertical centres: the Learn button and the links differ in height by a pixel or two.
    const spread = await nav.locator('a:visible, button:visible').evaluateAll((els) => {
      const centres = els.map((e) => {
        const r = e.getBoundingClientRect();
        return r.top + r.height / 2;
      });
      return Math.max(...centres) - Math.min(...centres);
    });
    expect(spread, `${width}px: one row`).toBeLessThan(4);
  }
});

test('Pricing is in the nav and opens the pricing page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Pricing' }).click();
  await expect(page).toHaveURL(/\/pricing$/);
  await expect(page.getByRole('link', { name: 'Pricing', exact: true }).first()).toHaveAttribute('aria-current', 'page');
});

test.describe('mobile drawer closes once you navigate', () => {
  test.use({ viewport: { width: 375, height: 800 } });
  const drawer = (page: import('@playwright/test').Page) => page.getByRole('navigation', { name: 'Mobile' });
  const open = async (page: import('@playwright/test').Page) => {
    await page.goto('/');
    await page.getByRole('button', { name: /open menu/i }).click();
    await expect(drawer(page)).toBeVisible();
  };

  test('after tapping a drawer link', async ({ page }) => {
    await open(page);
    await drawer(page).getByRole('link', { name: 'Pricing' }).click();
    await expect(page).toHaveURL(/\/pricing$/);
    await expect(drawer(page)).toHaveCount(0);
    await expect(page.getByRole('button', { name: /open menu/i })).toHaveAttribute('aria-expanded', 'false');
  });

  test('after tapping a Learn page', async ({ page }) => {
    await open(page);
    await drawer(page).getByRole('button', { name: 'Learn' }).click();
    await drawer(page).getByRole('link', { name: 'Blog' }).click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(drawer(page)).toHaveCount(0);
  });

  test('after tapping Try demo in the drawer', async ({ page }) => {
    await open(page);
    await drawer(page).getByRole('link', { name: /try demo/i }).click();
    await expect(page).toHaveURL(/\/try-demo$/);
    await expect(drawer(page)).toHaveCount(0);
  });

  test('after tapping the logo', async ({ page }) => {
    await page.goto('/pricing');
    await page.getByRole('button', { name: /open menu/i }).click();
    await page.getByRole('link', { name: /cognitivebotics home/i }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(drawer(page)).toHaveCount(0);
  });

  test('and can be opened again on the new page', async ({ page }) => {
    await open(page);
    await drawer(page).getByRole('link', { name: 'Schools' }).click();
    await expect(drawer(page)).toHaveCount(0);
    await page.getByRole('button', { name: /open menu/i }).click();
    await expect(drawer(page)).toBeVisible();
  });
});

test.describe('Learn menu opens on hover on desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 }, hasTouch: false });
  const button = (page: import('@playwright/test').Page) => page.getByRole('navigation', { name: 'Primary' }).getByRole('button', { name: 'Learn' });

  test('hovering opens it, moving onto the panel keeps it open, leaving closes it', async ({ page }) => {
    await page.goto('/');
    await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
    await button(page).hover();
    await expect(button(page)).toHaveAttribute('aria-expanded', 'true');
    // Travel to a link in the panel in a few steps, through the gap under the button.
    const link = page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: /^Blog/ });
    const box = (await link.boundingBox())!;
    await page.mouse.move(box.x + 20, box.y + box.height / 2, { steps: 12 });
    await expect(button(page)).toHaveAttribute('aria-expanded', 'true');
    await page.mouse.move(700, 800, { steps: 6 });
    await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
  });

  test('a click while hovering keeps it open; keyboard Enter still toggles', async ({ page }) => {
    await page.goto('/');
    await button(page).hover();
    await expect(button(page)).toHaveAttribute('aria-expanded', 'true');
    await button(page).click();
    await expect(button(page)).toHaveAttribute('aria-expanded', 'true');
    await page.mouse.move(700, 800);
    await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
    await button(page).focus();
    await page.keyboard.press('Enter');
    await expect(button(page)).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await expect(button(page)).toHaveAttribute('aria-expanded', 'false');
  });
});
