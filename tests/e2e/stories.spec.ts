import { expect, test } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

const SLUGS = [
  'the-transformative-power-of-physical-activities-for-children-with-autism',
  'fun-ways-to-boost-motor-skills-of-children-with-autism',
  'understanding-the-underlying-causes-of-autism-a-comprehensive-guide',
  'the-startling-truth-about-screen-time-and-autism',
  'early-intervention-is-the-key-to-managing-autism',
  'how-to-travel-with-children-who-have-autism',
];

test('blog: index lists the posts and the chips filter them', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/blog');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Blog');
  await expect(page.locator('main a[href^="/blog/"]')).toHaveCount(SLUGS.length);
  await page.getByRole('tab', { name: 'Schools' }).click();
  await expect(page.locator('main [role="tabpanel"] a[href^="/blog/"]')).toHaveCount(2);
  await page.getByRole('tab', { name: 'Therapy centres' }).click();
  await expect(page.locator('main [role="tabpanel"] a[href^="/blog/"]')).toHaveCount(2);
});

for (const slug of SLUGS) {
  test(`blog: /blog/${slug.slice(0, 30)}… renders the article, not the stub`, async ({ page }) => {
    const res = await page.goto(`/blog/${slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Coming soon');
    await expect(page.getByRole('heading', { name: 'Keep reading' })).toBeVisible();
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ld.join('')).toContain('Article');
  });
}

test('blog: an unknown slug is a 404', async ({ page }) => {
  expect((await page.goto('/blog/not-a-post'))?.status()).toBe(404);
});

test('case studies: the index lists only case studies, filters them and opens a detail page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/case-studies');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Case studies');
  await expect(page.getByRole('link', { name: /Read more/ })).toHaveCount(2);
  // Nothing but the case studies: no research, achievements or closing panel.
  for (const name of ['Research', 'Achievements', 'Knowledge Base', 'Want results like these?']) {
    await expect(page.getByRole('heading', { name, exact: true })).toHaveCount(0);
  }
  await page.getByRole('tab', { name: 'Schools' }).click();
  await expect(page.getByRole('link', { name: /Read more/ })).toHaveCount(1);
  await page.getByRole('tab', { name: 'All' }).click();
  await page.getByRole('link', { name: /Read more/ }).first().click();
  await expect(page).toHaveURL(/\/case-studies\/sample-therapy-centre$/);
  await expect(page.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/case-studies');
  await expect(page.getByRole('heading', { name: 'Challenge' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Next case study/ })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});

test('case studies: the tile corners grow on hover', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/case-studies');
  const card = page.locator('.cs-card').first();
  const cover = card.locator('.cs-cover');
  const cut = () => cover.evaluate((el) => getComputedStyle(el).getPropertyValue('--cut'));
  expect(await cut()).toBe('12px');
  await card.hover();
  await page.waitForTimeout(600);
  expect(await cut()).toBe('22px');
});

test('testimonials: chips filter the quotes', async ({ page }) => {
  await page.goto('/testimonials');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('What families and professionals say');
  await expect(page.getByRole('figure')).toHaveCount(4);
  await page.getByRole('tab', { name: 'Therapists' }).click();
  await expect(page.getByRole('figure')).toHaveCount(1);
});

test('learn nav: every menu link opens a real page, not the stub', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const [label, path] of [['Case studies', '/case-studies'], ['FAQs', '/faqs'], ['Blog', '/blog'], ['Testimonials', '/testimonials']]) {
    await page.goto('/');
    await page.getByRole('button', { name: 'Learn' }).click();
    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: new RegExp(`^${label}`) }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Coming soon');
  }
  await page.goto('/');
  await page.getByRole('button', { name: 'Learn' }).click();
  const kb = page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: /^Knowledge base/ });
  await expect(kb).toHaveAttribute('href', 'https://support.cognitivebotics.com/support/solutions');
  await expect(kb).toHaveAttribute('target', '_blank');
});

test('stories pages: no horizontal overflow at any width', async ({ page }) => {
  for (const route of ['/blog', `/blog/${SLUGS[0]}`, '/case-studies', '/case-studies/sample-school', '/testimonials']) {
    for (const w of [375, 768, 1024, 1440]) {
      expect(await overflowAt(page, route, w), `${route} at ${w}px`).toBeLessThanOrEqual(0);
    }
  }
});

test('resources: the old page redirects to case studies', async ({ page }) => {
  await page.goto('/resources');
  await expect(page).toHaveURL(/\/case-studies$/);
});

test('blog: the old Resources blog cards and links now live on /blog', async ({ page }) => {
  await page.goto('/schools');
  await expect(page.locator('a[href="/blog"]').first()).toBeAttached();
  await expect(page.locator('a[href^="/resources"]:not([href^="/resources/research"])')).toHaveCount(0);
});

const VIDEO_URL = 'https://cbt-website-media-prod.s3.ap-south-1.amazonaws.com/**';

test('testimonials: the video card leads row 1 across two columns, with written quotes after it', async ({ page }) => {
  await page.route(VIDEO_URL, (route) => route.fulfill({ status: 200, contentType: 'video/mp4', body: '' }));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/testimonials');
  const video = page.getByRole('button', { name: /Watch now/ });
  const quotes = page.getByRole('figure');
  await expect(video).toBeVisible();
  const v = (await video.boundingBox())!;
  const q = await quotes.evaluateAll((els) => els.map((e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width }; }));
  // Row 1: the video spans two columns and the first quote sits beside it, level with the top.
  expect(v.width).toBeGreaterThan(q[0].w * 1.8);
  expect(Math.abs(v.y - q[0].y)).toBeLessThan(4);
  expect(q[0].x).toBeGreaterThan(v.x + v.width);
  // The remaining quotes follow below, none before the video.
  expect(q.slice(1).every((c) => c.y > v.y + 10)).toBe(true);
  // No video is fetched until the card is pressed.
  await expect(page.locator('video')).toHaveCount(0);
  await video.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('video')).toHaveAttribute('src', /Final_Ram_kamal_testimonial_video/);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(video).toBeFocused();
});

test('testimonials: the video card stacks full width on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/testimonials');
  const v = (await page.getByRole('button', { name: /Watch now/ }).boundingBox())!;
  expect(v.width).toBeGreaterThan(320);
});

test('home: the video testimonial card is back in the testimonials, on wide and narrow screens', async ({ page }) => {
  await page.route(VIDEO_URL, (route) => route.fulfill({ status: 200, contentType: 'video/mp4', body: '' }));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const card = page.getByRole('button', { name: /Watch now/ }).first();
  await card.scrollIntoViewIfNeeded();
  // The home row drifts on its own; hovering pauses it so the click lands on a still card.
  await card.hover();
  await card.click();
  await expect(page.getByRole('dialog').locator('video')).toHaveAttribute('src', /Final_Ram_kamal_testimonial_video/);
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  await expect(page.getByRole('button', { name: /Watch now/ }).first()).toBeAttached();
});
