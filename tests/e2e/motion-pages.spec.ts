import { test, expect } from '@playwright/test';
import { noConsentBanner } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

test('a linked card inside a stagger group lifts on hover without the stagger delay', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/resources', { waitUntil: 'networkidle' });
  const card = page.locator('.card-lift').nth(4); // a later child: the old stagger delay would be 320ms
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500); // entry finished
  await card.hover();
  await page.waitForTimeout(260); // hover is 200ms; a 320ms delay would not have started
  const ty = await card.evaluate((el) => getComputedStyle(el).translate);
  expect(ty).toMatch(/-4px/);
});

const SKILLS_LAST = 'Expressive Skill';

test('therapy skills: one row, every card reachable, no page overflow (desktop and mobile)', async ({ page }) => {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
    const region = page.getByRole('region', { name: 'Skills' });
    await region.scrollIntoViewIfNeeded();
    const tops = await region.locator('> *').evaluateAll((els) => new Set(els.map((e) => Math.round(e.getBoundingClientRect().top))).size);
    expect(tops, `cards sit on one row at ${width}px`).toBe(1);
    const pinned = await page.getByTestId('hscroll-pin').evaluate((el) => el.classList.contains('hscroll-pinned'));
    if (pinned) {
      // pinned (any width with a mouse): reach the end of the row by scrolling the page to the end of the pinned block
      await page.evaluate(() => {
        const o = document.querySelector('[data-testid="hscroll-pin"]') as HTMLElement;
        const inner = o.firstElementChild as HTMLElement;
        const st = parseFloat(getComputedStyle(inner).top);
        window.scrollTo({ top: o.getBoundingClientRect().top + window.scrollY + o.offsetHeight - inner.offsetHeight - st + 2, behavior: 'instant' });
      });
      await page.waitForTimeout(300);
    } else {
      await region.evaluate((el) => { el.scrollLeft = el.scrollWidth; });
    }
    await expect(region.getByText(SKILLS_LAST)).toBeInViewport();
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(over).toBeLessThanOrEqual(0);
  }
});

test('therapy skills: arrows move the row on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
  const region = page.getByRole('region', { name: 'Skills' });
  await region.scrollIntoViewIfNeeded();
  await expect(page.getByRole('button', { name: 'Previous Skills' })).toBeDisabled();
  await page.getByRole('button', { name: 'Next Skills' }).click();
  await expect.poll(() => region.evaluate((el) => el.scrollLeft)).toBeGreaterThan(50);
  await expect(page.getByRole('button', { name: 'Previous Skills' })).toBeEnabled();
});

const ROUTES = ['/', '/about', '/contact-us', '/parents', '/resources', '/schools', '/therapy-centres'];

const scrollThrough = async (page: import('@playwright/test').Page) => {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(1500);
};

for (const route of ROUTES) {
  test(`${route}: every rendered group reaches its final state, no console errors, no overflow at 390px`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route, { waitUntil: 'networkidle' });
    await scrollThrough(page);
    const stuck = await page
      .locator('[data-reveal-group="pending"], [data-reveal="pending"]')
      .evaluateAll((els) => els.filter((e) => (e as HTMLElement).offsetParent !== null).length);
    expect(stuck).toBe(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });

  test(`${route}: with JavaScript off every heading is in the HTML and nothing is hidden`, async ({ browser }) => {
    const ctx = await browser.newContext({ javaScriptEnabled: false });
    const page = await ctx.newPage();
    await page.goto(route);
    expect(await page.locator('h1').count()).toBeGreaterThan(0);
    expect(await page.locator('[data-reveal="pending"], [data-reveal-group="pending"]').count()).toBe(0);
    await ctx.close();
  });

  test(`${route}: reduced motion shows final state immediately`, async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto(route, { waitUntil: 'networkidle' });
    const faded = await page
      .locator('.reveal, .reveal-group > *')
      .evaluateAll((els) => els.filter((e) => (e as HTMLElement).offsetParent !== null && getComputedStyle(e).opacity !== '1').length);
    expect(faded).toBe(0);
    await ctx.close();
  });
}

test('an anchor jump lands on visible content', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/therapy-centres#get-in-touch', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  // The page has two #get-in-touch sections (pre-existing); the browser jumps to the first.
  const target = page.locator('#get-in-touch').first();
  await expect(target.locator('h2')).toBeInViewport();
  const op = await target.evaluate((el) => getComputedStyle(el.closest('.reveal') ?? el).opacity);
  expect(op).toBe('1');
});

test('stagger groups start hidden and are revealed once scrolled to', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/resources', { waitUntil: 'networkidle' });
  const pendingChild = page.locator('[data-reveal-group="pending"] > *').first();
  await expect(pendingChild).toHaveCSS('opacity', '0');
  const group = page.locator('[data-reveal-group]').last();
  await group.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await expect(group).toHaveAttribute('data-reveal-group', 'shown');
  await expect(group.locator('> *').first()).toHaveCSS('opacity', '1');
});

test('therapy skills: the mouse wheel drives the row while it is pinned, then the page carries on', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
  const region = page.getByRole('region', { name: 'Skills' });
  const pin = page.getByTestId('hscroll-pin');
  await expect(pin).toHaveClass(/hscroll-pinned/);
  const state = () =>
    region.evaluate((el) => ({
      left: el.scrollLeft,
      max: el.scrollWidth - el.clientWidth,
      top: Math.round(el.closest('.hscroll-sticky')!.getBoundingClientRect().top),
    }));
  // Bring the pinned block to its pin point, then wheel through it.
  await page.evaluate(() => {
    const o = document.querySelector('[data-testid="hscroll-pin"]') as HTMLElement;
    const st = parseFloat(getComputedStyle(o.firstElementChild as HTMLElement).top);
    window.scrollTo({ top: o.getBoundingClientRect().top + window.scrollY - st, behavior: 'instant' });
  });
  await page.waitForTimeout(300);
  const start = await state();
  expect(start.left).toBeLessThanOrEqual(1); // the pin point can land a sub-pixel past the top
  await page.mouse.move(700, 500);
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(300);
  const mid = await state();
  expect(mid.left).toBeGreaterThan(200); // the wheel moved the cards
  expect(Math.abs(mid.top - start.top)).toBeLessThanOrEqual(2); // while the block stayed pinned
  for (let i = 0; i < 8; i++) await page.mouse.wheel(0, 300);
  await page.waitForTimeout(400);
  const end = await state();
  expect(end.left).toBeGreaterThanOrEqual(end.max - 1); // last card reached
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(300);
  const after = await state();
  expect(after.top).toBeLessThan(end.top - 100); // pin released: the page moves on
  // and back up reverses the row
  await page.mouse.wheel(0, -4000);
  await page.waitForTimeout(400);
  expect((await state()).left).toBeLessThan(end.max);
});

test('therapy skills: touch keeps native swipe and is not pinned', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
  await expect(page.getByTestId('hscroll-pin')).not.toHaveClass(/hscroll-pinned/);
  const ox = await page.getByRole('region', { name: 'Skills' }).evaluate((el) => getComputedStyle(el).overflowX);
  expect(ox).toBe('auto');
  await ctx.close();
});

test('therapy skills: reduced motion is not pinned', async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
  await expect(page.getByTestId('hscroll-pin')).not.toHaveClass(/hscroll-pinned/);
  await ctx.close();
});

for (const [w, h] of [[1440, 900], [1280, 720], [1366, 600]]) {
  test(`therapy skills: while pinned the whole block and whole cards stay on screen at ${w}x${h}`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
    const region = page.getByRole('region', { name: 'Skills' });
    await page.evaluate(() => {
      const o = document.querySelector('[data-testid="hscroll-pin"]') as HTMLElement;
      const st = parseFloat(getComputedStyle(o.firstElementChild as HTMLElement).top);
      window.scrollTo({ top: o.getBoundingClientRect().top + window.scrollY - st, behavior: 'instant' });
    });
    await page.waitForTimeout(400);
    const geo = () =>
      region.evaluate((el) => {
        const inner = el.closest('.hscroll-sticky')!.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        const cards = [...el.children].map((c) => c.getBoundingClientRect());
        const shown = cards.filter((c) => c.right > r.left + 1 && c.left < r.right - 1);
        return { top: inner.top, bottom: inner.bottom, vh: innerHeight, cut: shown.filter((c) => c.left < r.left - 1 || c.right > r.right + 1).length, shown: shown.length };
      });
    for (let i = 0; i < 4; i++) {
      const g = await geo();
      expect(g.top, 'block top is on screen').toBeGreaterThanOrEqual(0);
      expect(g.bottom, 'block bottom is on screen').toBeLessThanOrEqual(g.vh);
      if (i === 0) expect(g.cut, 'whole cards, none cut off at the right edge, when the row starts').toBe(0);
      await page.mouse.wheel(0, 250);
      await page.waitForTimeout(200);
    }
    await page.mouse.wheel(0, 4000); // run the row to its end, still pinned or just released
    await page.waitForTimeout(400);
    await page.evaluate(() => {
      const o = document.querySelector('[data-testid="hscroll-pin"]') as HTMLElement;
      const inner = o.firstElementChild as HTMLElement;
      const st = parseFloat(getComputedStyle(inner).top);
      window.scrollTo({ top: o.getBoundingClientRect().top + window.scrollY + o.offsetHeight - inner.offsetHeight - st, behavior: 'instant' });
    });
    await page.waitForTimeout(300);
    const end = await geo();
    expect(end.top).toBeGreaterThanOrEqual(0);
    expect(end.bottom).toBeLessThanOrEqual(end.vh);
    expect(end.cut, 'whole cards when the row ends').toBe(0);
  });
}

test('therapy skills: the indicator fills like a progress bar and counts cards', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
  const bar = page.getByRole('progressbar', { name: 'Skills progress' });
  const fillWidth = () => bar.evaluate((el) => (el.firstElementChild as HTMLElement).getBoundingClientRect().width);
  await page.evaluate(() => {
    const o = document.querySelector('[data-testid="hscroll-pin"]') as HTMLElement;
    const st = parseFloat(getComputedStyle(o.firstElementChild as HTMLElement).top);
    window.scrollTo({ top: o.getBoundingClientRect().top + window.scrollY - st, behavior: 'instant' });
  });
  await page.waitForTimeout(300);
  await expect(bar).toHaveAttribute('aria-valuenow', '0');
  expect(await fillWidth()).toBeLessThan(2); // empty at the start, not a sliding thumb
  await expect(page.getByText('4 / 10')).toBeVisible();
  await page.mouse.move(700, 450);
  await page.mouse.wheel(0, 3000);
  await page.waitForTimeout(500);
  await expect(bar).toHaveAttribute('aria-valuenow', '100');
  await expect(page.getByText('10 / 10')).toBeVisible();
  const full = await bar.evaluate((el) => ({ fill: (el.firstElementChild as HTMLElement).getBoundingClientRect().width, track: el.getBoundingClientRect().width }));
  expect(full.fill).toBeGreaterThan(full.track - 2);
});
