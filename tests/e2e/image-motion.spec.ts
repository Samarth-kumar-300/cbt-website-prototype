import { test, expect, type Page } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

// Reads the 2D/3D transform of an element as a DOMMatrix.
async function matrixOf(page: Page, selector: string) {
  return page.locator(selector).first().evaluate((el) => {
    const t = getComputedStyle(el).transform;
    const m = new DOMMatrix(t === 'none' ? undefined : t);
    return { a: m.a, d: m.d, ty: m.m42, m13: m.m13, opacity: getComputedStyle(el).opacity };
  });
}

test.describe('motion allowed', () => {
  test('a curtain photo opens fully after it scrolls in', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
    const frame = page.locator('[data-mi-enter="curtain"]').first();
    await frame.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1800);
    const clip = await frame.evaluate((el) => getComputedStyle(el).clipPath);
    expect(clip === 'none' || /^inset\(0(%|px)?( 0(%|px)?){0,3}\)$/.test(clip), `clip-path was ${clip}`).toBe(true);
  });

  test('the device hero tilts toward the pointer and settles flat when it leaves', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
    const frame = page.locator('[data-mi-layer="tilt"]').first();
    await frame.scrollIntoViewIfNeeded();
    const box = (await frame.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.92, box.y + box.height * 0.5, { steps: 6 });
    await page.waitForTimeout(900);
    const tilted = await matrixOf(page, '[data-mi-layer="tilt"] [data-mi-part="layer"]');
    expect(Math.abs(tilted.m13), 'rotated around Y while hovered').toBeGreaterThan(0.01);
    await page.mouse.move(5, 5, { steps: 4 });
    await page.waitForTimeout(900);
    const flat = await matrixOf(page, '[data-mi-layer="tilt"] [data-mi-part="layer"]');
    expect(Math.abs(flat.m13), 'back to flat after the pointer leaves').toBeLessThan(0.002);
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('every image part is visible and untransformed with no scrolling at all', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
    const parts = await page.locator('[data-mi-part]').evaluateAll((els) =>
      els.map((el) => ({ opacity: getComputedStyle(el).opacity, transform: getComputedStyle(el).transform })),
    );
    expect(parts.length).toBeGreaterThan(0);
    for (const p of parts) {
      expect(p.opacity).toBe('1');
      expect(p.transform).toBe('none');
    }
  });

  test('the curtain photo is not clipped', async ({ page }) => {
    await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
    const clip = await page.locator('[data-mi-enter="curtain"]').first().evaluate((el) => getComputedStyle(el).clipPath);
    expect(clip).toBe('none');
  });
});

test('server HTML carries no hiding styles on wrapped images (works without JavaScript)', async ({ request }) => {
  const html = await (await request.get('/therapy-centres')).text();
  expect(html).toContain('data-mi-enter=');
  const parts = html.match(/<div[^>]*data-mi-part[^>]*>/g) ?? [];
  expect(parts.length).toBeGreaterThan(0);
  for (const tag of parts) expect(tag, tag).not.toMatch(/style="[^"]*(opacity|transform)/);
});

test('no horizontal overflow on a migrated page at phone and desktop widths', async ({ page }) => {
  for (const w of [375, 1440]) {
    expect(await overflowAt(page, '/therapy-centres', w), `overflow at ${w}px`).toBeLessThanOrEqual(0);
  }
});

test('home: the growth illustration rises in, ends untransformed, then drifts with scroll on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  const frame = page.locator('[data-mi-layer="drift"]').first();
  await frame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const enter = await matrixOf(page, '[data-mi-layer="drift"] [data-mi-part="enter"]');
  expect(enter.opacity).toBe('1');
  expect(Math.abs(enter.ty)).toBeLessThan(0.5);
  expect(enter.a).toBeCloseTo(1, 2);
  const y1 = (await matrixOf(page, '[data-mi-layer="drift"] [data-mi-part="layer"]')).ty;
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(600);
  const y2 = (await matrixOf(page, '[data-mi-layer="drift"] [data-mi-part="layer"]')).ty;
  expect(y2, 'the layer moves as the page scrolls').not.toBeCloseTo(y1, 1);
});

test('home: the growth illustration only rises on a phone, with no overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });
  const frames = page.locator('[data-mi-enter="rise"][data-mi-layer="none"]');
  expect(await frames.count()).toBeGreaterThan(0);
  expect(await overflowAt(page, '/', 390)).toBeLessThanOrEqual(0);
});

test('resources: a card image zooms slightly on hover', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/resources', { waitUntil: 'networkidle' });
  const frame = page.locator('.img-hover-zoom').first();
  await frame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await frame.hover();
  await page.waitForTimeout(700);
  const scale = await frame.locator('> *').first().evaluate((el) => {
    const t = getComputedStyle(el).transform;
    return new DOMMatrix(t === 'none' ? undefined : t).a;
  });
  expect(scale).toBeCloseTo(1.05, 2);
});

test('about: an avatar grows slightly and gains a ring on hover', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/about', { waitUntil: 'networkidle' });
  const avatar = page.locator('.avatar-hover').first();
  await avatar.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  await avatar.hover();
  await page.waitForTimeout(500);
  const s = await avatar.evaluate((el) => ({ scale: getComputedStyle(el).scale, shadow: getComputedStyle(el).boxShadow }));
  expect(parseFloat(s.scale)).toBeCloseTo(1.04, 2);
  expect(s.shadow).not.toBe('none');
});

test.describe('reduced motion hover', () => {
  test.use({ reducedMotion: 'reduce' });
  test('about: an avatar does not scale on hover', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/about', { waitUntil: 'networkidle' });
    const avatar = page.locator('.avatar-hover').first();
    await avatar.scrollIntoViewIfNeeded();
    await avatar.hover();
    await page.waitForTimeout(400);
    expect(await avatar.evaluate((el) => getComputedStyle(el).scale)).toMatch(/^(none|1)$/);
  });
});

test('schools: the flower illustration rises in and ends untransformed', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/schools', { waitUntil: 'networkidle' });
  const sel = '[data-mi-enter="rise"]:has(img[src*="tailored-implementation"])';
  await page.locator(sel).first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const m = await matrixOf(page, `${sel} > [data-mi-part="layer"] > [data-mi-part="enter"]`);
  expect(m.opacity).toBe('1');
  expect(Math.abs(m.ty)).toBeLessThan(0.5);
});

test('schools: the future photo placeholder uses a curtain and keeps its size', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/schools', { waitUntil: 'networkidle' });
  const frame = page.locator('[data-mi-enter="curtain"]').first();
  await frame.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  const box = (await frame.boundingBox())!;
  expect(box.width).toBeGreaterThan(100);
  expect(box.height).toBeGreaterThan(100);
});

test('parents: the desktop illustration drifts, and no migrated page overflows', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/parents', { waitUntil: 'networkidle' });
  expect(await page.locator('[data-mi-layer="drift"]').count()).toBeGreaterThan(0);
  for (const route of ['/parents', '/schools', '/']) {
    for (const w of [375, 1440]) {
      expect(await overflowAt(page, route, w), `${route} overflow at ${w}px`).toBeLessThanOrEqual(0);
    }
  }
});

test('schools: the petals stay still while the section scrolls past', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/schools', { waitUntil: 'networkidle' });
  const petals = page.locator('[data-mi-enter="rise"] img[src*="petals"]').first().locator('..');
  const section = page.locator('section:has([data-mi-enter="rise"] img[src*="petals"])');
  const rotationAt = async (frac: number) => {
    await section.evaluate((el, f) => {
      const r = el.getBoundingClientRect();
      window.scrollTo(0, window.scrollY + r.top + r.height * f - window.innerHeight * 0.6);
    }, frac);
    await page.waitForTimeout(1200);
    return petals.evaluate((el) => {
      const t = getComputedStyle(el).transform;
      const m = new DOMMatrix(t === 'none' ? undefined : t);
      return Math.round((Math.atan2(m.b, m.a) * 180) / Math.PI);
    });
  };
  for (const frac of [0.05, 0.5, 0.95]) {
    expect(await rotationAt(frac), `petal rotation at ${frac} of the section`).toBe(0);
  }
});

// The end state of an animation that never ran equals the end state of one that did, so these tests
// check the hidden start state first (the element is below the trigger line at load), then the end.
test.describe('start state, then end state', () => {
  test.use({ viewport: { width: 1440, height: 500 } });

  test('curtain: the photo starts fully clipped below the fold, then opens as it scrolls in', async ({ page }) => {
    await page.goto('/therapy-centres', { waitUntil: 'networkidle' });
    const frame = page.locator('[data-mi-enter="curtain"]').first();
    expect(await frame.evaluate((el) => el.getBoundingClientRect().top), 'photo must start below the trigger line').toBeGreaterThan(500 * 0.88);
    expect(await frame.evaluate((el) => getComputedStyle(el).clipPath), 'clipped before it scrolls in').toMatch(/100%/);
    await frame.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1800);
    expect(await frame.evaluate((el) => getComputedStyle(el).clipPath)).toMatch(/^(none|inset\(0(%|px)?( 0(%|px)?){0,3}\))$/);
  });

  test('rise: the schools flower starts hidden and shifted below the fold, then settles', async ({ page }) => {
    await page.goto('/schools', { waitUntil: 'networkidle' });
    const frame = page.locator('[data-mi-enter="rise"]:has(img[src*="tailored-implementation"])').first();
    const part = frame.locator('> [data-mi-part="layer"] > [data-mi-part="enter"]');
    expect(await frame.evaluate((el) => el.getBoundingClientRect().top)).toBeGreaterThan(500 * 0.88);
    const before = await part.evaluate((el) => ({ opacity: getComputedStyle(el).opacity, ty: new DOMMatrix(getComputedStyle(el).transform === 'none' ? undefined : getComputedStyle(el).transform).m42 }));
    expect(before.opacity, 'hidden before it scrolls in').toBe('0');
    expect(before.ty, 'shifted down before it scrolls in').toBeGreaterThan(10);
    await frame.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    const after = await part.evaluate((el) => ({ opacity: getComputedStyle(el).opacity, ty: new DOMMatrix(getComputedStyle(el).transform === 'none' ? undefined : getComputedStyle(el).transform).m42 }));
    expect(after.opacity).toBe('1');
    expect(Math.abs(after.ty)).toBeLessThan(0.5);
  });
});
