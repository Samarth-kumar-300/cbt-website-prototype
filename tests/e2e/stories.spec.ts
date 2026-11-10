import { expect, test } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

const SLUGS = [
  'the-transformative-power-of-physical-activities-for-children-with-autism',
  'fun-ways-to-boost-motor-skills-of-children-with-autism',
  'understanding-the-underlying-causes-of-autism-a-comprehensive-guide',
  'the-startling-truth-about-screen-time-and-autism',
  'how-to-travel-with-children-who-have-autism',
  'early-intervention-is-the-key-to-managing-autism',
];

test('blog: index lists the posts and the chips filter them', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/blog');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Blog');
  await expect(page.locator('main a[href^="/blog/"]')).toHaveCount(SLUGS.length);
  await expect(page.getByText('What’s changing in early intervention, and how centres, schools and parents put it to work.')).toBeVisible();
  expect(await page.getByRole('tab').allTextContents()).toEqual(['All', 'Therapy centres', 'Schools', 'Parents']);
  const cards = page.locator('main [role="tabpanel"] a[href^="/blog/"]');
  // Each chip lists exactly the posts tagged with it, in post order, and every card shows that tag.
  for (const [chip, slugs] of [
    ['Therapy centres', [SLUGS[0], SLUGS[5]]],
    ['Schools', [SLUGS[1]]],
    ['Parents', [SLUGS[2], SLUGS[3], SLUGS[4]]],
    ['All', SLUGS],
  ] as const) {
    await page.getByRole('tab', { name: chip, exact: true }).click();
    await expect(page.getByRole('tab', { name: chip, exact: true })).toHaveAttribute('aria-selected', 'true');
    await expect(cards).toHaveCount(slugs.length);
    expect(await cards.evaluateAll((els) => els.map((el) => el.getAttribute('href')))).toEqual(slugs.map((s) => `/blog/${s}`));
    if (chip !== 'All') await expect(page.locator('main [role="tabpanel"] a[href^="/blog/"]', { hasText: chip })).toHaveCount(slugs.length);
  }
});

test('blog: a card shows no description under its title', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/blog');
  await expect(page.locator('main a[href^="/blog/"] p')).toHaveCount(0);
});

test('blog: a post page shows only its own tags', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const [slug, tags] of [[SLUGS[0], ['Therapy centres']], [SLUGS[1], ['Schools']], [SLUGS[2], ['Parents']]] as const) {
    await page.goto(`/blog/${slug}`);
    const shown = await page.locator('main section').first().locator('span.rounded-full').allTextContents();
    expect(shown, slug).toEqual(tags);
  }
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
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Results from real centres and schools');
  await expect(page.getByText('See what changed after they started with CognitiveBotics.')).toBeVisible();
  await expect(page.locator('main header')).toHaveCSS('border-bottom-width', '1px');
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

test('inside cognitivebotics nav: every menu link opens a real page, not the stub', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  // Column Company: Case studies, Testimonials, Awards. Column Library: Blog, Webinars. Column Product: Research, Knowledge base.
  const nav = page.getByRole('navigation', { name: 'Primary' });
  for (const [label, path] of [['Case studies', '/case-studies'], ['Testimonials', '/testimonials'], ['Blog', '/blog']]) {
    await page.goto('/');
    await page.getByRole('button', { name: 'Inside CognitiveBotics' }).click();
    await nav.getByRole('link', { name: new RegExp(`^${label}`) }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Coming soon');
  }
  await page.goto('/');
  await page.getByRole('button', { name: 'Inside CognitiveBotics' }).click();
  for (const label of ['Case studies', 'Testimonials', 'Awards', 'Blog', 'Webinars', 'Research', 'Knowledge base']) {
    await expect(nav.getByRole('link', { name: new RegExp(`^${label}`) })).toBeVisible();
  }
  // FAQs left the dropdown; it stays reachable from the footer.
  await expect(nav.getByRole('link', { name: /^FAQs/ })).toHaveCount(0);
  const kb = nav.getByRole('link', { name: /^Knowledge base/ });
  await expect(kb).toHaveAttribute('href', /^https:\/\/support\.cognitivebotics\.com/);
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
