import { expect, test } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';
import { researchCards } from '../../components/pages/research/content';
import { STUDIES } from '../../components/pages/research/studies';

test.beforeEach(async ({ page }) => noConsentBanner(page));

test('research: header and three cards link to their detail pages', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/research');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Research');
  const cards = page.locator('main a[href^="/research/"]');
  await expect(cards).toHaveCount(3);
  for (const [i, card] of researchCards.entries()) {
    await expect(cards.nth(i)).toHaveAttribute('href', card.href);
    await expect(cards.nth(i)).toContainText(card.pill);
    await expect(cards.nth(i)).toContainText('Read more');
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
