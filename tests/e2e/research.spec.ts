import { expect, test } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';
import { researchCards } from '../../components/pages/research/content';
import { STUDIES } from '../../components/pages/research/studies';

test.beforeEach(async ({ page }) => noConsentBanner(page));

// The grid is hidden until ResearchGrid has put each paper in its folder, then each paper is pulled
// out and the folder drops away. Measure only once that is over: the grid is ready (or motion is
// reduced), every folder is hidden again and no wrapper is still clipping its paper.
async function paperOpened(page: import('@playwright/test').Page) {
  await page.waitForFunction(
    () => {
      const grid = document.querySelector('.paper-grid');
      const ready = grid?.hasAttribute('data-paper-ready') || matchMedia('(prefers-reduced-motion: reduce)').matches;
      const wraps = [...document.querySelectorAll('.folder-wrap')];
      return (
        !!ready &&
        wraps.length > 0 &&
        wraps.every((w) => getComputedStyle(w).clipPath === 'none' && getComputedStyle(w.querySelector('.folder-pocket')!).visibility === 'hidden')
      );
    },
    null,
    { timeout: 8000 },
  );
}
test('research: header and two paper cards, each one link with a short title and a takeaway', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/research');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Research');
  const cards = page.locator('main a[href^="/research/"]');
  await expect(cards).toHaveCount(2);
  for (const [i, card] of researchCards.entries()) {
    await expect(cards.nth(i)).toHaveAttribute('href', card.href);
    await expect(cards.nth(i).locator('p')).toHaveText([card.title, card.description]);
    await expect(cards.nth(i)).toHaveAccessibleName(`${card.title} ${card.description} ${card.minutes} min read`);
    await expect(cards.nth(i).locator('img')).toHaveAttribute('alt', '');
  }
});

// Badge fill is the card's folder colour, ink is the deeper shade of the same hue.
const BADGE_RGB = [
  { bg: 'rgb(207, 233, 236)', ink: 'rgb(15, 74, 78)' },
  { bg: 'rgb(246, 232, 187)', ink: 'rgb(92, 72, 18)' },
];

test('research: each card ends with a "1 min read" badge in its own colour, below the description', async ({ page }) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/research');
    await paperOpened(page);
    const cards = page.locator('main a[href^="/research/"]');
    for (let i = 0; i < 2; i++) {
      const card = cards.nth(i);
      const badge = card.getByText('1 min read', { exact: true });
      await expect(badge).toBeVisible();
      await expect(badge).toHaveCSS('background-color', BADGE_RGB[i].bg);
      await expect(badge).toHaveCSS('color', BADGE_RGB[i].ink);
      const [desc, b, c] = [await card.locator('p').nth(1).boundingBox(), await badge.boundingBox(), await card.boundingBox()];
      expect(b!.y).toBeGreaterThanOrEqual(desc!.y + desc!.height);
      expect(b!.y + b!.height).toBeLessThanOrEqual(c!.y + c!.height);
    }
  }
});

test('research: Book a demo goes to /try-demo', async ({ page }) => {
  await page.goto('/research');
  await expect(page.getByRole('link', { name: 'Book a demo' }).first()).toHaveAttribute('href', '/try-demo');
});

test('research: a card opens its detail page', async ({ page }) => {
  await page.goto('/research');
  await page.locator('main a[href^="/research/"]').first().click();
  await expect(page).toHaveURL(new RegExp(`${researchCards[0].href}$`));
  await expect(page.getByRole('heading', { level: 1 })).toContainText('12-Month Observational Study');
});

test('research: no horizontal overflow at any width', async ({ page }) => {
  for (const w of [375, 768, 1024, 1440]) {
    expect(await overflowAt(page, '/research', w), `${w}px`).toBeLessThanOrEqual(0);
  }
});

for (const study of STUDIES) {
  test.describe(`research detail: ${study.pill}`, () => {
    test('shows the title, copy, status line and a back link', async ({ page }) => {
      await page.goto(`/research/${study.slug}`);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(study.title.slice(0, 40));
      await expect(page.getByText(study.pill).first()).toBeVisible();
      for (const b of study.blocks) {
        if (b.type === 'heading') await expect(page.getByRole('heading', { level: 2, name: b.text })).toBeVisible();
      }
      await expect(page.getByText(study.status)).toBeVisible();
      await expect(page.getByRole('link', { name: '← Back to research' })).toHaveAttribute('href', '/research');
    });

    test('the hero button opens the source in a new tab', async ({ page }) => {
      await page.goto(`/research/${study.slug}`);
      const button = page.getByRole('link', { name: study.button.label });
      await expect(button).toHaveAttribute('href', study.button.href);
      await expect(button).toHaveAttribute('target', '_blank');
      await expect(button).toHaveAttribute('rel', 'noopener noreferrer');
    });

    test('Book a demo goes to /try-demo and the share buttons are there', async ({ page }) => {
      await page.goto(`/research/${study.slug}`);
      await expect(page.getByRole('link', { name: 'Book a demo' }).first()).toHaveAttribute('href', '/try-demo');
      for (const label of ['Open Instagram', 'Share on LinkedIn', 'Share on X']) await expect(page.getByRole('button', { name: label })).toBeVisible();
    });

    test('no horizontal overflow at any width', async ({ page }) => {
      for (const w of [375, 768, 1024, 1440]) {
        expect(await overflowAt(page, `/research/${study.slug}`, w), `${w}px`).toBeLessThanOrEqual(0);
      }
    });
  });
}

test('research detail: Share on X opens a share link for this page', async ({ page }) => {
  const study = STUDIES[0];
  // Keep the test off the real network: twitter.com would redirect to x.com.
  await page.context().route(/^https:\/\/(twitter|x)\.com\//, (route) => route.fulfill({ status: 200, contentType: 'text/html', body: 'ok' }));
  await page.goto(`/research/${study.slug}`);
  const [popup] = await Promise.all([page.waitForEvent('popup'), page.getByRole('button', { name: 'Share on X' }).click()]);
  expect(popup.url()).toContain('twitter.com/intent/tweet');
  expect(decodeURIComponent(popup.url())).toContain(`/research/${study.slug}`);
});

test('research detail: the old live URL redirects to the new one', async ({ page }) => {
  const study = STUDIES[0];
  await page.goto(`/resources/research/${study.slug}`);
  await expect(page).toHaveURL(new RegExp(`/research/${study.slug}$`));
  await expect(page.getByRole('heading', { level: 1 })).toContainText('12-Month Observational Study');
});

test('research detail: an unknown study is a 404', async ({ page }) => {
  const res = await page.goto('/research/not-a-study');
  expect(res?.status()).toBe(404);
});

// Light tints of the old badge colours: teal, amber.
const PAPER_RGB = ['rgb(238, 249, 250)', 'rgb(255, 251, 239)'];

test('research: paper is a light tint per card, descriptions stay within two lines and the logo clears the text', async ({ page }) => {
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/research');
    await paperOpened(page);
    const cards = page.locator('main a[href^="/research/"]');
    for (let i = 0; i < 2; i++) {
      const card = cards.nth(i);
      await expect(card).toHaveCSS('background-color', PAPER_RGB[i]);
      const [title, desc] = await card.locator('p').all();
      const lineHeight = parseFloat(await desc.evaluate((el) => getComputedStyle(el).lineHeight));
      expect((await desc.boundingBox())!.height).toBeLessThanOrEqual(lineHeight * 2 + 1);
      const box = (await card.boundingBox())!;
      const logo = (await card.locator('img').boundingBox())!;
      const text = (await title.boundingBox())!;
      expect(box.x + box.width - (logo.x + logo.width)).toBeGreaterThanOrEqual(12);
      expect(logo.y - box.y).toBeGreaterThanOrEqual(12);
      expect(logo.y + logo.height).toBeLessThanOrEqual(text.y);
    }
  }
});

test('research: each paper is pulled out of a folder in under 3s, then sits still and fully visible', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/research');
  const foldersShown = () => page.evaluate(() => [...document.querySelectorAll('.folder-pocket')].some((p) => getComputedStyle(p).visibility === 'visible'));
  await expect.poll(foldersShown, { timeout: 3000, intervals: [30] }).toBe(true);
  const started = Date.now();
  await paperOpened(page);
  expect(Date.now() - started).toBeLessThan(2800);
  expect(await foldersShown()).toBe(false);
  const wraps = page.locator('.folder-wrap');
  for (let i = 0; i < 2; i++) {
    const card = wraps.nth(i).locator('.paper-card');
    await expect(card).toBeVisible();
    const [w, c] = [await wraps.nth(i).boundingBox(), await card.boundingBox()];
    expect(Math.abs(w!.y - c!.y)).toBeLessThan(1);
  }
});

test('research: reduced motion shows the papers at once with no folder', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/research');
  await paperOpened(page);
  await expect(page.locator('.paper-grid')).toHaveCSS('opacity', '1');
  expect(await page.evaluate(() => [...document.querySelectorAll('.folder-pocket')].some((p) => getComputedStyle(p).visibility === 'visible'))).toBe(false);
});
