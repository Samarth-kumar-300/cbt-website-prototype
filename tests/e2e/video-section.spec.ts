import { expect, test, type Page } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

const ROUTE = '/kit/video-section';
const PLAY = { name: 'Play film: Progress is Priceless' };
const EMBED = 'https://www.youtube-nocookie.com/embed/c7LKzn9LWSo?autoplay=1&rel=0&playsinline=1';
const WIDTHS = [320, 375, 768, 1024, 1280, 1440];

test.beforeEach(async ({ page }) => noConsentBanner(page));

// Answers the player request with an empty page, so these tests need no network and still see the frame load.
async function stubPlayer(page: Page) {
  await page.route('https://www.youtube-nocookie.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>stub</title>' }),
  );
}

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    expect(await overflowAt(page, ROUTE, width)).toBeLessThanOrEqual(0);
  });
}

for (const width of [375, 1440]) {
  test(`the card is 16:9 at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(ROUTE);
    const box = await page.getByRole('button', PLAY).first().boundingBox();
    expect(box).not.toBeNull();
    expect(Math.abs(box!.width / box!.height - 16 / 9)).toBeLessThan(0.02);
  });
}

test('nothing from Google or YouTube loads before the film is played', async ({ page }) => {
  const hits: string[] = [];
  page.on('request', (request) => {
    if (/youtube|ytimg|google/i.test(new URL(request.url()).hostname)) hits.push(request.url());
  });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(ROUTE);
  await page.waitForLoadState('networkidle');
  expect(hits).toEqual([]);
});

test('keyboard users can Tab to the play button', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(ROUTE);
  const play = page.getByRole('button', PLAY).first();
  for (let i = 0; i < 60; i++) {
    await page.keyboard.press('Tab');
    if (await play.evaluate((el) => el === document.activeElement)) break;
  }
  await expect(play).toBeFocused();
});

for (const key of ['Enter', 'Space']) {
  test(`${key} plays the film in place`, async ({ page }) => {
    await stubPlayer(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(ROUTE);
    const section = page.locator('main section').first();
    await section.getByRole('button', PLAY).focus();
    await page.keyboard.press(key);
    const frame = section.locator('iframe[title="Progress is Priceless"]');
    await expect(frame).toHaveAttribute('src', EMBED);
    await expect(frame).toHaveCSS('opacity', '1');
    await expect(section.getByRole('button', PLAY)).toHaveCount(0);
  });
}

test('with reduced motion requested, nothing in the section animates while the film starts', async ({ page }) => {
  await stubPlayer(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(ROUTE);
  const section = page.locator('main section').first();
  await section.getByRole('button', PLAY).click();
  await expect(section.locator('iframe')).toHaveCSS('opacity', '1');
  const running = await section.evaluate((el) => el.getAnimations({ subtree: true }).length);
  expect(running).toBe(0);
});
