import { expect, test } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

test('games: listing shows 4 cards, Identify common objects third, and no coming-soon copy', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/games');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Play the games children practise with on CognitiveBotics');
  await expect(page.locator('[data-game]')).toHaveCount(4);
  await expect(page.locator('[data-game]').nth(2)).toHaveAttribute('data-game', 'identify-common-objects');
  await expect(page.getByText(/coming soon/i)).toHaveCount(0);
});

test('games: desktop shows 3 cards in a row, and the second row has the 1 left over', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/games');
  // offsetTop is layout, so the cards' slide-in animation does not change it.
  const tops = await page.locator('[data-game]').evaluateAll((els) => els.map((el) => (el as HTMLElement).offsetTop));
  const rows = [...new Set(tops)];
  expect(rows).toHaveLength(2);
  expect(tops.filter((t) => t === rows[0])).toHaveLength(3);
  expect(tops.filter((t) => t === rows[1])).toHaveLength(1);
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('/games');
  const t = await page.locator('[data-game]').evaluateAll((els) => els.map((el) => (el as HTMLElement).offsetTop));
  expect(t[0]).toBe(t[2]);
  expect(t[3]).toBeGreaterThan(t[2]);
});

test('games: Play now stays on the listing, asks for the microphone, then covers the screen with Game started', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/games');
  const card = page.locator('[data-game="learn-to-look"]');
  await card.click();
  await expect(page).toHaveURL(/\/games$/);
  const prompt = page.getByRole('alertdialog');
  await expect(prompt).toContainText('would like to access the microphone');
  await prompt.getByRole('button', { name: 'Don’t allow' }).click();
  await expect(prompt).toHaveCount(0);
  await expect(page.getByTestId('game-started')).toHaveCount(0);
  await card.click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'OK' }).click();
  const overlay = page.getByTestId('game-started');
  await expect(overlay).toContainText('Game started');
  expect(await overlay.evaluate((el) => getComputedStyle(el).backgroundColor)).toMatch(/^(rgba\(0, 0, 0|oklab\(0 0 0 \/) ?,? ?0\.3/);
  const box = (await overlay.boundingBox())!;
  expect(box).toMatchObject({ x: 0, y: 0, width: 1440, height: 900 });
  await page.keyboard.press('Escape');
  await expect(overlay).toHaveCount(0);
  await expect(page).toHaveURL(/\/games$/);
});

test('games: a game page shows the facts, related games and a way back', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/games/learn-to-look');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Learn to look');
  await expect(page.getByText('Attending · Gaze detection')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'What gets recorded' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Try another game' })).toBeVisible();
  const player = page.locator('main').getByRole('button', { name: 'Start the game' });
  await expect(player).toBeVisible();
  await expect(page.getByRole('link', { name: 'Book a demo' }).first()).toBeVisible(); // the page CTA at the bottom, not the player
  await player.click();
  await expect(page.getByTestId('player-unavailable')).toBeVisible();
  await expect(page.getByTestId('player-unavailable').getByRole('link', { name: 'Try another game' })).toHaveAttribute('href', '#try-another');
  await page.getByRole('link', { name: 'All games' }).click();
  await expect(page).toHaveURL(/\/games$/);
});

test('games: every game has a page, and an unknown slug is a 404', async ({ page }) => {
  for (const slug of ['label-common-objects', 'identify-common-objects', 'imitate-with-hands']) {
    const res = await page.goto(`/games/${slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
  expect((await page.goto('/games/nope'))?.status()).toBe(404);
  expect((await page.goto('/games/identify-numbers'))?.status()).toBe(404); // paused for launch
});

test('games: the mega menu links to the listing', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.getByRole('button', { name: /Inside CognitiveBotics/ }).first().click();
  await expect(page.getByRole('link', { name: /Free games/ }).first()).toHaveAttribute('href', '/games');
});

for (const route of ['/games', '/games/learn-to-look', '/games/imitate-with-hands', '/games/identify-common-objects']) {
  for (const w of [375, 768, 1024, 1440]) {
    test(`games: ${route} has no horizontal scroll at ${w}px`, async ({ page }) => {
      expect(await overflowAt(page, route, w)).toBeLessThanOrEqual(0);
    });
  }
}

test('games: on mobile the cards sit two to a row, the grid stays short and tap targets are at least 44px', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/games');
  // offsetTop and offsetLeft are layout, so the slide-in animation does not change them.
  const [a, b] = await page.locator('[data-game]').evaluateAll((els) => els.slice(0, 2).map((el) => ({ x: (el as HTMLElement).offsetLeft, y: (el as HTMLElement).offsetTop, width: (el as HTMLElement).offsetWidth, height: (el as HTMLElement).offsetHeight })));
  expect(a.y).toBe(b.y);
  expect(b.x).toBeGreaterThan(a.x + a.width - 2);
  const grid = await page.locator('[data-reveal-group]').first().boundingBox();
  expect(grid!.height).toBeLessThan(1700);
  for (const card of [a, b]) expect(card.height).toBeGreaterThanOrEqual(44);
  await page.goto('/games/learn-to-look');
  const back = await page.getByRole('link', { name: 'All games' }).boundingBox();
  expect(back!.height).toBeGreaterThanOrEqual(44);
});

test('games: the hero image sits to the right of the text on desktop and below it on mobile, with no chips', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/games');
  const img = page.getByRole('img', { name: /child plays a game on a tablet/ });
  await expect(img).toBeVisible();
  const [t, i] = [await page.getByRole('heading', { level: 1 }).boundingBox(), await img.boundingBox()];
  expect(i!.x).toBeGreaterThan(t!.x + t!.width);
  await expect(page.getByText('400+ learning objectives')).toHaveCount(0);
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/games');
  const [t2, i2] = [await page.getByRole('heading', { level: 1 }).boundingBox(), await img.boundingBox()];
  expect(i2!.y).toBeGreaterThan(t2!.y + t2!.height);
});

test('games: each card has one pill and cards use the shared bordered style', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/games');
  const card = page.locator('[data-game="learn-to-look"]');
  await expect(card.locator('span.rounded-full')).toHaveCount(1); // the skill pill only
  await expect(card).toContainText('Attending');
  await expect(card).toHaveClass(/border-brand-teal-100/);
});

test('games: therapy centres, parents and schools are three full-width cards, and the hero has no curve', async ({ page }) => {
  for (const w of [1440, 375]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto('/games');
    const links = ['/therapy-centres', '/parents', '/schools'].map((h) => page.locator(`main a[href="${h}"]`));
    const widths: number[] = [];
    for (const l of links) {
      await expect(l).toHaveCount(1);
      widths.push((await l.boundingBox())!.width);
    }
    expect(Math.max(...widths) - Math.min(...widths)).toBeLessThan(2);
    const radius = await page.locator('main section').first().evaluate((el) => getComputedStyle(el).borderBottomLeftRadius);
    expect(radius).toBe('0px');
  }
});

test('games: the detail page reuses the listing card style for related games', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/games/learn-to-look');
  await expect(page.locator('[data-game]')).toHaveCount(3);
  expect(await page.locator('main section').first().evaluate((el) => getComputedStyle(el).borderBottomLeftRadius)).toBe('0px');
});

test('games: the cards appear on a short phone even though the grid is much taller than the screen', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 600 });
  await page.goto('/games');
  const first = page.locator('[data-game="learn-to-look"]');
  await first.scrollIntoViewIfNeeded();
  await expect(first).toHaveCSS('opacity', '1');
  await page.locator('[data-game="imitate-with-hands"]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-game="imitate-with-hands"]')).toHaveCSS('opacity', '1');
});

test('games: every card shows its own thumbnail, loaded, in a 16:9 tile', async ({ page }) => {
  for (const w of [1440, 375]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto('/games');
    const cards = page.locator('[data-game]');
    await expect(cards).toHaveCount(4);
    for (let i = 0; i < 4; i++) {
      const card = cards.nth(i);
      await card.scrollIntoViewIfNeeded();
      const img = card.locator('img');
      await expect(img).toHaveCount(1);
      await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
      const box = (await img.evaluate((el) => el.parentElement!.getBoundingClientRect().toJSON())) as { width: number; height: number };
      expect(Math.abs(box.width / box.height - 16 / 9)).toBeLessThan(0.03);
    }
  }
});

test('games: the player shows the game thumbnail as its poster, in a 16:9 frame, with Start the game and no Book a demo', async ({ page }) => {
  for (const w of [1440, 375]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto('/games/learn-to-look');
    const img = page.locator('main img[src*="learn-to-look"]').first();
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    const frame = (await img.evaluate((el) => el.parentElement!.getBoundingClientRect().toJSON())) as { width: number; height: number };
    // 16:9 when stacked; from 1400px the frame stretches to the facts card, so allow a little more height.
    const ratio = frame.width / frame.height;
    if (w < 1400) expect(Math.abs(ratio - 16 / 9)).toBeLessThan(0.03);
    else expect(ratio).toBeGreaterThan(1.3);
    const start = page.getByRole('button', { name: 'Start the game' });
    await expect(start).toBeVisible();
    expect((await start.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    const playerBox = await img.evaluate((el) => el.parentElement!.innerText);
    expect(playerBox).not.toMatch(/book a demo/i);
  }
});

test('games: Imitate with hands lists its tasks in the facts card', async ({ page }) => {
  await page.goto('/games/imitate-with-hands');
  const aside = page.locator('aside');
  await expect(aside.getByRole('heading', { name: 'Tasks' })).toBeVisible();
  for (const t of ['Hands on head', 'Hands on shoulder', 'Touch nose', 'Wave hand', 'Clap hands']) await expect(aside.getByText(t, { exact: true })).toBeVisible();
  await expect(aside.getByText('Learns to imitate actions with hands modelled by an adult.')).toBeVisible();
  await page.goto('/games/learn-to-look');
  await expect(page.locator('aside').getByRole('heading', { name: 'Tasks' })).toBeVisible();
  await expect(page.locator('aside li', { hasText: /^Look at the object [1-5]$/ })).toHaveCount(5);
  await page.goto('/games/identify-common-objects');
  for (const t of ['Bubbles', 'Train', 'Cookies', 'Car', 'Banana']) await expect(page.locator('aside').getByText(t, { exact: true })).toBeVisible();
});

test('games: the player and the facts card are the same height side by side, and stack below 1400px', async ({ page }) => {
  const slugs = ['learn-to-look', 'label-common-objects', 'identify-common-objects', 'imitate-with-hands'];
  for (const w of [1400, 1440, 1920]) {
    await page.setViewportSize({ width: w, height: 1000 });
    for (const slug of slugs) {
      await page.goto(`/games/${slug}`);
      const frame = (await page.getByTestId('player-frame').boundingBox())!;
      const card = (await page.locator('aside').boundingBox())!;
      expect(Math.abs(frame.height - card.height), `${slug} at ${w}px`).toBeLessThan(2);
      expect(Math.abs(frame.y - card.y), `${slug} top at ${w}px`).toBeLessThan(2);
      expect(card.x).toBeGreaterThan(frame.x + frame.width);
    }
  }
  await page.setViewportSize({ width: 1300, height: 1000 });
  await page.goto('/games/imitate-with-hands');
  const f = (await page.getByTestId('player-frame').boundingBox())!;
  const c = (await page.locator('aside').boundingBox())!;
  expect(c.y).toBeGreaterThan(f.y + f.height);
  expect(Math.abs(f.width - c.width)).toBeLessThan(2);
});

test('games: cards say Play now, the player centres Start on a light black overlay, and the facts have clear headings', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/games');
  await expect(page.locator('[data-game]').getByText('Play now', { exact: true })).toHaveCount(4);
  await expect(page.getByText('Play the game', { exact: true })).toHaveCount(0);
  await expect(page.getByText('View game', { exact: true })).toHaveCount(0);
  for (const w of [1440, 375]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto('/games/learn-to-look');
    const frame = (await page.getByTestId('player-frame').boundingBox())!;
    const btn = (await page.getByRole('button', { name: 'Start the game' }).boundingBox())!;
    expect(Math.abs(btn.x + btn.width / 2 - (frame.x + frame.width / 2))).toBeLessThan(2);
    expect(Math.abs(btn.y + btn.height / 2 - (frame.y + frame.height / 2))).toBeLessThan(2);
    const bg = await page.getByTestId('player-overlay').evaluate((el) => getComputedStyle(el).backgroundColor);
    // Black at 10 to 20% opacity; browsers report it as rgba() or oklab().
    expect(bg).toMatch(/^(rgba\(0, 0, 0|oklab\(0 0 0 \/) ?,? ?0\.[1-2]/);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/games/learn-to-look');
  const h = page.locator('aside h2').first();
  expect(await h.evaluate((el) => parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(18);
  await expect(page.getByText(/part of the .* skill area/i)).toHaveCount(0);
});

test('games: the hero shows the updated illustration, taller than wide, at its own file name', async ({ page }) => {
  await page.goto('/games');
  const img = page.getByRole('img', { name: /child plays a game on a tablet/ });
  await expect(img).toHaveAttribute('src', /hero-child-and-mascot-v2\.webp/);
  await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  const frame = (await img.evaluate((el) => el.parentElement!.getBoundingClientRect().toJSON())) as { width: number; height: number };
  expect(Math.abs(frame.width / frame.height - 7086 / 7470)).toBeLessThan(0.02);
});

test('games: the closing panel keeps its description on one line on desktop and wraps evenly on a phone', async ({ page }) => {
  for (const route of ['/games', '/games/learn-to-look']) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(route);
    const body = page.getByText('Plans, home practice and progress tracking, for your centre or school.');
    const lineHeight = await body.evaluate((el) => parseFloat(getComputedStyle(el).lineHeight));
    expect((await body.boundingBox())!.height).toBeLessThan(lineHeight * 1.5);
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(route);
    const lines = Math.round((await body.boundingBox())!.height / (await body.evaluate((el) => parseFloat(getComputedStyle(el).lineHeight))));
    expect(lines).toBe(2);
  }
});
