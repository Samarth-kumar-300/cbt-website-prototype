import { expect, test, type Page } from '@playwright/test';
import { JOURNEY_STEPS } from '../../components/pages/home/journey/steps';
import { noConsentBanner, overflowAt } from './helpers';

const RAIL = 'section[data-journey="rail"]';
const inRail = (sel: string) => sel.split(', ').map((s) => `${RAIL} ${s}`).join(', ');

async function open(page: Page, width: number, height: number) {
  await noConsentBanner(page);
  await page.setViewportSize({ width, height });
  await page.goto('/', { waitUntil: 'networkidle' });
}

const railHeight = (page: Page) => page.locator(RAIL).evaluate((el) => el.getBoundingClientRect().height);
// The current section is the sibling directly above the rail on the home page.
const currentHeight = (page: Page) =>
  page.locator(RAIL).evaluate((el) => el.previousElementSibling!.getBoundingClientRect().height);

test.describe('journey rail: placement and size', () => {
  test('sits directly below the current growth path section', async ({ page }) => {
    await open(page, 1440, 900);
    expect(await page.locator(RAIL).count()).toBe(1);
    const currentCards = await page.locator(RAIL).evaluate((el) => el.previousElementSibling!.querySelectorAll('[data-journey-card]').length);
    expect(currentCards, 'the section above is the current growth path').toBe(5);
  });

  test('desktop 1440: the rail section is short', async ({ page }) => {
    await open(page, 1440, 900);
    const rail = await railHeight(page);
    expect(rail, 'rail section height').toBeLessThanOrEqual(760);
    expect(rail / (await currentHeight(page)), 'rail as a share of the current section').toBeLessThan(0.4);
  });

  test('desktop 1440: all five steps are inside the viewport when the section sits under the header', async ({ page }) => {
    await open(page, 1440, 900);
    await page.locator(RAIL).evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 80));
    const boxes = await page.locator(inRail('[data-jr-card]')).evaluateAll((els) =>
      els.map((e) => {
        const r = e.getBoundingClientRect();
        return { top: r.top, bottom: r.bottom };
      }),
    );
    expect(boxes).toHaveLength(5);
    for (const b of boxes) {
      expect(b.top).toBeGreaterThanOrEqual(0);
      expect(b.bottom).toBeLessThanOrEqual(900);
    }
  });

  test('mobile 390: the step list is compact', async ({ page }) => {
    await open(page, 390, 844);
    const list = await page.locator(`${RAIL} ol`).evaluate((el) => el.getBoundingClientRect().height);
    expect(list, 'rail list height').toBeLessThanOrEqual(720);
    expect(list / (await currentHeight(page))).toBeLessThan(0.4);
  });
});

test.describe('journey rail: layout', () => {
  for (const w of [320, 375, 768, 1023, 1279, 1280, 1440]) {
    test(`no horizontal overflow at ${w}px`, async ({ page }) => {
      await noConsentBanner(page);
      expect(await overflowAt(page, '/', w)).toBeLessThanOrEqual(0);
    });
  }

  for (const w of [320, 1280]) {
    test(`titles and bodies stay inside their step at ${w}px`, async ({ page }) => {
      await open(page, w, 900);
      const overflowing = await page.locator(inRail('[data-jr-title], [data-jr-body]')).evaluateAll((els) =>
        els.filter((e) => e.scrollWidth > e.clientWidth + 1).map((e) => e.textContent),
      );
      expect(overflowing).toEqual([]);
    });
  }

  test('1280 shows five columns; 1279 shows the stacked list', async ({ page }) => {
    await open(page, 1280, 900);
    const tops = (p: Page) => p.locator(inRail('[data-jr-step]')).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top)));
    expect(new Set(await tops(page)).size, 'one row of columns').toBe(1);
    await page.setViewportSize({ width: 1279, height: 900 });
    expect(new Set(await tops(page)).size, 'five stacked rows').toBe(5);
  });

  test('desktop: step columns have equal width and nodes share one horizontal line', async ({ page }) => {
    await open(page, 1440, 900);
    const widths = await page.locator(inRail('[data-jr-step]')).evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().width)));
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThanOrEqual(1);
    const centres = await page.locator(inRail('[data-jr-node]')).evaluateAll((els) => els.map((e) => {
      const r = e.getBoundingClientRect();
      return Math.round(r.top + r.height / 2);
    }));
    expect(Math.max(...centres) - Math.min(...centres)).toBeLessThanOrEqual(1);
  });

  test('mobile: node badges share one vertical line', async ({ page }) => {
    await open(page, 390, 844);
    const centres = await page.locator(inRail('[data-jr-node]')).evaluateAll((els) => els.map((e) => {
      const r = e.getBoundingClientRect();
      return Math.round(r.left + r.width / 2);
    }));
    expect(Math.max(...centres) - Math.min(...centres)).toBeLessThanOrEqual(1);
  });
});

test.describe('journey rail: content and semantics', () => {
  test('five steps, in order, with the original copy', async ({ page }) => {
    await open(page, 1440, 900);
    expect(await page.locator(`${RAIL} ol > li`).count()).toBe(5);
    expect(await page.locator(inRail('[data-jr-title]')).allTextContents()).toEqual(JOURNEY_STEPS.map((s) => s.title));
    expect(await page.locator(inRail('[data-jr-body]')).allTextContents()).toEqual(JOURNEY_STEPS.map((s) => s.body));
  });

  test('is an ordered list with one heading and five described images', async ({ page }) => {
    await open(page, 1440, 900);
    await expect(page.locator(`${RAIL} ol`)).toHaveAttribute('role', 'list');
    expect(await page.locator(`${RAIL} h2`).count()).toBe(1);
    const alts = await page.locator(inRail('[data-jr-image] img')).evaluateAll((els) => els.map((e) => e.getAttribute('alt')));
    expect(alts).toEqual(JOURNEY_STEPS.map((s) => s.alt));
  });

  test('the server HTML contains every title and body (no JavaScript needed)', async ({ request }) => {
    const html = await (await request.get('/')).text();
    expect(html).toContain('data-journey="rail"');
    for (const s of JOURNEY_STEPS) {
      expect(html, s.title).toContain(s.title);
      expect(html, s.id).toContain(s.body.slice(0, 20));
    }
  });
});

const HOOKS = '[data-jr-image], [data-jr-card], [data-jr-node], [data-jr-title], [data-jr-body]';

async function bringIntoView(page: Page) {
  await page.locator(RAIL).evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 90));
}

// The path is scrubbed by scroll: 0 when the list's top reaches 75% of the viewport, 1 when its bottom reaches 50%
// (see MOTION.scroll in JourneyRailMotion). Scrolls to that fraction and lets the scrub settle.
async function scrollToProgress(page: Page, fraction: number) {
  await page.locator(RAIL).evaluate((el, f) => {
    const r = el.querySelector('.jr-list')!.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = r.top + window.scrollY - vh * 0.75;
    const end = r.top + window.scrollY + r.height - vh * 0.5;
    window.scrollTo(0, start + f * (end - start));
  }, fraction);
  await page.waitForTimeout(1500);
}

const opacities = (page: Page, selector: string) =>
  page.locator(inRail(selector)).evaluateAll((els) => els.map((e) => parseFloat(getComputedStyle(e).opacity)));

async function expectFinalState(page: Page) {
  const notShown = await page.locator(inRail(HOOKS)).evaluateAll((els) =>
    els.filter((e) => getComputedStyle(e).opacity !== '1').length,
  );
  expect(notShown, 'elements not fully visible').toBe(0);
  const unfilled = await page.locator(inRail('[data-jr-line]')).evaluateAll((els) =>
    els.filter((e) => { const t = getComputedStyle(e).transform; return t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)'; }).length,
  );
  expect(unfilled, 'lines not fully drawn').toBe(0);
  const orbs = await opacities(page, '[data-jr-orb]');
  expect(Math.max(...orbs), 'orb gone').toBe(0);
}

test.describe('journey rail: scroll-driven motion', () => {
  for (const [w, h] of [[1440, 900], [390, 844]] as const) {
    test(`ends in the full final state once scrolled through at ${w}px`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await open(page, w, h);
      await scrollToProgress(page, 1);
      await expectFinalState(page);
      expect(errors).toEqual([]);
    });
  }

  test('starts hidden and reveals step by step as the reader scrolls, first step first', async ({ page }) => {
    await open(page, 1440, 900);
    await scrollToProgress(page, 0);
    const start = await opacities(page, '[data-jr-image]');
    expect(Math.max(...start), 'nothing shown before the scroll starts').toBe(0);
    let previous = 0;
    for (const f of [0.25, 0.5, 0.75]) {
      await scrollToProgress(page, f);
      const o = await opacities(page, '[data-jr-image]');
      for (let i = 1; i < o.length; i++) expect(o[i], `step ${i + 1} ahead of step ${i} at ${f}`).toBeLessThanOrEqual(o[i - 1] + 0.05);
      const total = o.reduce((a, b) => a + b, 0);
      expect(total, `more of the path is shown at ${f}`).toBeGreaterThan(previous);
      previous = total;
    }
  });

  test('does not advance by itself: the state holds still while the reader is idle', async ({ page }) => {
    await open(page, 1440, 900);
    await scrollToProgress(page, 0.4);
    const before = await opacities(page, '[data-jr-image]');
    await page.waitForTimeout(3000);
    const after = await opacities(page, '[data-jr-image]');
    after.forEach((v, i) => expect(v, `step ${i + 1} moved while idle`).toBeCloseTo(before[i], 2));
    expect(Math.min(...before), 'part of the path is still to come').toBeLessThan(1);
  });

  test('scrolling back up rewinds the path', async ({ page }) => {
    await open(page, 1440, 900);
    await scrollToProgress(page, 1);
    await scrollToProgress(page, 0.3);
    const o = await opacities(page, '[data-jr-image]');
    expect(o[4], 'last step is hidden again').toBe(0);
    expect(o[0], 'first step stays shown').toBe(1);
  });

  test('arriving past the section (reload or anchor with restored scroll) still ends fully shown', async ({ page }) => {
    await open(page, 1440, 900);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await page.waitForTimeout(1500);
    await expectFinalState(page);
  });

  test('crossing the 1280px breakpoint never hides content once the path has been scrolled through', async ({ page }) => {
    await open(page, 1440, 900);
    await scrollToProgress(page, 1);
    await page.setViewportSize({ width: 1100, height: 900 });
    await page.waitForTimeout(1500);
    await scrollToProgress(page, 1);
    await expectFinalState(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await scrollToProgress(page, 1);
    await expectFinalState(page);
  });

  test('reduced motion: final state at once, no orb, no sparks', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await noConsentBanner(page);
    await page.goto('/', { waitUntil: 'networkidle' });
    await bringIntoView(page);
    await page.waitForTimeout(150);
    await expectFinalState(page);
    const hidden = await page.locator(inRail('[data-jr-orb], [data-jr-spark]')).evaluateAll((els) =>
      els.every((e) => getComputedStyle(e).display === 'none'),
    );
    expect(hidden).toBe(true);
    await ctx.close();
  });
});
