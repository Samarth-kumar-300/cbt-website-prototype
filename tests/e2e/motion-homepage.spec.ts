import { test, expect } from '@playwright/test';

const scrollThrough = async (page: import('@playwright/test').Page) => {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(70);
  }
  await page.waitForTimeout(1500);
};

test('every animated group reaches its final state after a scroll', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/', { waitUntil: 'networkidle' });
  await scrollThrough(page);
  // Groups hidden by a breakpoint (display: none, e.g. the mobile copy at 1440px) never intersect and
  // stay pending, which is harmless; only rendered groups must have reached their final state.
  const stuck = await page
    .locator('[data-reveal-group="pending"], [data-reveal="pending"]')
    .evaluateAll((els) => els.filter((e) => (e as HTMLElement).offsetParent !== null).length);
  expect(stuck).toBe(0);
  expect(errors).toEqual([]);
});

test('Journey is forward only: scrolling back up leaves every piece visible', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await scrollThrough(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);
  const hidden = await page
    .locator('[data-journey-card], [data-journey-node], [data-journey-image]')
    .evaluateAll((els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length);
  expect(hidden).toBe(0);
  const connectors = await page
    .locator('[data-journey-connector]')
    .evaluateAll((els) => els.map((e) => getComputedStyle(e).transform));
  for (const t of connectors) expect(t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)').toBe(true);
});

test('Journey path is fully drawn at the end and the marker is gone', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await scrollThrough(page);
  const drawn = await page.locator('[data-journey-path]').evaluate((p) => {
    const len = (p as SVGPathElement).getTotalLength();
    const dash = getComputedStyle(p).strokeDasharray;
    const off = parseFloat(getComputedStyle(p).strokeDashoffset);
    return { len, dash, off };
  });
  expect(drawn.off).toBeLessThanOrEqual(1);
  const markerOpacity = await page.locator('[data-journey-marker]').evaluate((m) => getComputedStyle(m).opacity);
  expect(parseFloat(markerOpacity)).toBe(0);
});

test('reduced motion: groups are final, path is drawn, marker hidden, cookie banner leaves at once', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/', { waitUntil: 'networkidle' });
  const notFinal = await page
    .locator('[data-reveal-group] > *')
    .evaluateAll((els) => els.filter((e) => getComputedStyle(e).opacity !== '1').length);
  expect(notFinal).toBe(0);
  const dash = await page.locator('[data-journey-path]').evaluate((p) => getComputedStyle(p).strokeDasharray);
  expect(dash === 'none' || dash === '0px' || dash === '').toBe(true);
  expect(parseFloat(await page.locator('[data-journey-marker]').evaluate((m) => getComputedStyle(m).opacity))).toBe(0);
  await page.getByRole('button', { name: 'Accept all' }).click();
  await expect(page.getByRole('dialog', { name: 'Cookie preferences' })).toHaveCount(0, { timeout: 200 });
  await ctx.close();
});

test('no JavaScript: server HTML keeps headings and the full path', async ({ request }) => {
  const html = await (await request.get('/')).text();
  for (const text of [
    "Helping autistic children grow, with AI and care.",
    'What is CognitiveBotics?',
    'Growth looks different for every child',
    'Find your path',
    'Real experiences from the families we support',
    'Frequently Asked Questions',
    'Better outcomes begin with shared understanding',
  ]) {
    expect(html, text).toContain(text);
  }
  expect(html).toContain('data-journey-path');
});

test('only the visible copy of a duplicated heading is split', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await scrollThrough(page);
  const labelled = await page
    .locator('h2:has-text("Growth looks different")')
    .evaluateAll((els) => els.map((e) => ({ visible: (e as HTMLElement).offsetParent !== null, aria: e.getAttribute('aria-label') })));
  for (const h of labelled) {
    if (h.visible) expect(h.aria).toBe('Growth looks different for every child');
    else expect(h.aria).toBeNull();
  }
});

test('keyboard focus shows the same cue as hover on nav links and CTAs', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  const link = page.locator('.nav-link').first();
  await link.focus();
  await page.waitForTimeout(300);
  const scale = await link.evaluate((el) => getComputedStyle(el, '::after').transform);
  expect(scale).not.toBe('matrix(0, 0, 0, 1, 0, 0)');
  const cta = page.locator('a.btn:has(svg)').first();
  await cta.scrollIntoViewIfNeeded();
  await cta.focus();
  await page.waitForTimeout(300);
  const nudge = await cta.locator('svg').first().evaluate((el) => getComputedStyle(el).transform);
  expect(nudge).toBe('matrix(1, 0, 0, 1, 4, 0)');
});

// Timing-sensitive: a late layout refresh can make the forward-only Journey catch up in one step, which
// fades several cards together. Rerun before treating a miss as real, as the plan says.
test.describe('calm', () => {
  test.describe.configure({ retries: 2 });
  test('calm: no more than four animation owners are mid-entry at once while scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    let max = 0;
    let worst: string[] = [];
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 200) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(120);
      const owners = await page.evaluate(() => {
        const set = new Set<Element>();
        const q = '[data-reveal-group] > *, .reveal, h1 *, h2 *, [data-motion-image], [data-journey-card]';
        for (const el of Array.from(document.querySelectorAll(q))) {
          const o = parseFloat(getComputedStyle(el).opacity);
          if (o > 0.02 && o < 0.98) {
            const owner = el.closest('h1, h2, [data-reveal-group], .reveal, [data-journey-card]');
            if (owner) set.add(owner);
          }
        }
        return Array.from(set).map((o) => `${o.tagName}.${o.className.toString().slice(0, 30)}`);
      });
      if (owners.length > max) {
        max = owners.length;
        worst = owners;
      }
    }
    console.log('max concurrent animation owners:', max);
    expect(max, `owners mid-entry at the worst sample: ${worst.join(' | ')}`).toBeLessThanOrEqual(4);
  });
});

test('no horizontal overflow at 390px', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await scrollThrough(page);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(over).toBe(0);
});

test('coverage: at least 60% of the inventory has a motion hook at 1440px', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await scrollThrough(page);
  const count = await page.evaluate(() => {
    const sel = [
      '.nav-link', '.btn', '[data-reveal-group] > *', '[data-icon]', '[data-motion-image]',
      '[data-journey-card]', '[data-journey-connector]', '[data-journey-node]', '[data-journey-image]',
      '[data-journey-path]', 'h1[aria-label]', 'h2[aria-label]', '.social-lift', '.faq-card',
      '.hero-settle', '[data-scroll-gradient]', '.reveal',
    ].join(',');
    const seen = new Set<Element>();
    for (const el of Array.from(document.querySelectorAll(sel))) {
      const r = (el as HTMLElement).getBoundingClientRect();
      const visible = r.width > 0 && r.height > 0 && getComputedStyle(el).display !== 'none';
      if (visible) seen.add(el);
    }
    return seen.size;
  });
  console.log('animated units with a motion hook (desktop, de-duplicated):', count, 'of 118 in the spec inventory');
  expect(count).toBeGreaterThanOrEqual(71);
});

test('hero devices stay still (arrival only) and What is CBT sits in a tilt frame', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('[data-mi-layer]:has(img[alt="Hero_Section"])')).toHaveCount(0);
  await expect(page.locator('[data-mi-layer="tilt"] img[alt="What_Is_CBT"]')).toHaveCount(1);
});

test('reduced motion: hero devices and What is CBT stay untransformed', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto('/', { waitUntil: 'networkidle' });
  await scrollThrough(page);
  const moved = await page
    .locator('[data-mi-layer="drift"] [data-mi-part="layer"], [data-mi-layer="tilt"] [data-mi-part="layer"]')
    .evaluateAll((els) => els.filter((e) => getComputedStyle(e).transform !== 'none').length);
  expect(moved).toBe(0);
  await ctx.close();
});

test('try demo cards look like previews: hover changes nothing', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/try-demo', { waitUntil: 'networkidle' });
  const card = page.locator('main ul > li > div').first();
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const before = await card.evaluate((el) => ({ t: getComputedStyle(el).transform, s: getComputedStyle(el).boxShadow }));
  await card.hover();
  await page.waitForTimeout(400);
  const after = await card.evaluate((el) => ({ t: getComputedStyle(el).transform, s: getComputedStyle(el).boxShadow }));
  expect(after).toEqual(before);
});

test.describe('phone fan', () => {
  test('side phones start hidden behind the centre one and settle upright after scroll', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    const left = page.locator('[data-phone-fan]:visible [data-phone="left"]').first();
    await left.evaluate((el) => el.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(2200);
    const m = await left.evaluate((el) => {
      const t = new DOMMatrix(getComputedStyle(el).transform === 'none' ? undefined : getComputedStyle(el).transform);
      return { rot: Math.atan2(t.b, t.a), op: getComputedStyle(el).opacity };
    });
    expect(Math.abs(m.rot)).toBeLessThan(0.01);
    expect(m.op).toBe('1');
  });
});
