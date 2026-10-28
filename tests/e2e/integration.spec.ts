import { expect, test } from '@playwright/test';
import { noConsentBanner } from './helpers';

const ROUTES = ['/', '/therapy-centres', '/schools', '/parents', '/resources', '/about', '/contact-us'];

test.beforeEach(async ({ page }) => noConsentBanner(page));

test('every internal link on every Phase 1 page resolves (real route or stub)', async ({ page, request }) => {
  const seen = new Set<string>();
  for (const route of ROUTES) {
    await page.goto(route);
    const hrefs = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') as string));
    for (const h of hrefs) {
      if (!h.startsWith('/') || h.startsWith('//')) continue;
      seen.add(h.split('#')[0].split('?')[0] || '/');
    }
  }
  for (const path of seen) {
    const res = await request.get(path);
    expect(res.status(), `${path} should not 404`).toBe(200);
  }
});

test('header and footer are byte-identical on every page', async ({ page }) => {
  const snap = async (route: string) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);
    return page.evaluate(() => ({
      header: document.querySelector('div.fixed.inset-x-0.top-0')!.outerHTML,
      footer: document.querySelector('footer')!.outerHTML.replace(/©\s*\d{4}/, '©'),
    }));
  };
  const base = await snap('/');
  for (const route of ROUTES.slice(1)) {
    const s = await snap(route);
    expect(s.header, `header differs on ${route}`).toBe(base.header);
    expect(s.footer, `footer differs on ${route}`).toBe(base.footer);
  }
});

test('hamburger drawer opens at 375px on every page and lists the six primary links', async ({ page }) => {
  for (const route of ROUTES) {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(route);
    await page.getByRole('button', { name: /open menu/i }).click();
    const nav = page.getByRole('navigation', { name: 'Mobile' });
    await expect(nav).toBeVisible();
    for (const label of ['Therapy Centres', 'Schools', 'Parents', 'Resources', 'About Us', 'Get in Touch']) {
      await expect(nav.getByRole('link', { name: label })).toBeVisible();
    }
  }
});

test('no page logs console errors or scrolls horizontally at 375 and 1440', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(`${page.url()} ${m.text()}`));
  page.on('pageerror', (e) => errors.push(`${page.url()} ${e}`));
  for (const route of ROUTES) {
    for (const w of [375, 1440]) {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow, `${route} at ${w}`).toBeLessThanOrEqual(0);
    }
  }
  expect(errors).toEqual([]);
});

test('cookie banner appears once and stays dismissed after reload', async ({ browser }) => {
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.getByText('We value your privacy')).toBeVisible();
  await page.getByRole('button', { name: 'Accept all' }).click();
  await page.reload();
  await expect(page.getByText('We value your privacy')).toHaveCount(0);
  await ctx.close();
});
