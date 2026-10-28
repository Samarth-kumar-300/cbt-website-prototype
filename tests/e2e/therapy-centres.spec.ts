import { expect, test } from '@playwright/test';
import { faq } from '../../components/pages/therapy-centres/content';
import { expectPageMatchesReference, noConsentBanner } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

test('therapy centres matches the reference structure at all widths', async ({ page }) => {
  await expectPageMatchesReference(page, '/therapy-centres', {
    removedSections: 1,
    changedHeadings: [
      'Intervention works best when it doesn’t stop at the clinic door.',
      'Extending developmental care beyond location and means',
      '12 months. 43 children. Measurable developmental progress.',
    ],
  });
});

test('faq toggles', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/therapy-centres');
  const q = page.getByRole('button', { name: faq[0].q });
  await q.click();
  await expect(q).toHaveAttribute('aria-expanded', 'true');
});

test('faq behaves as a single-open accordion with working aria and keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/therapy-centres');
  // Only the first three FAQs show until "View All" is pressed (site-wide FAQ rule).
  await expect(page.getByRole('button', { name: faq[3].q })).toHaveCount(0);
  await page.getByRole('button', { name: 'View All' }).click();
  const btn = (i: number) => page.getByRole('button', { name: faq[i].q });
  // aria-controls ids contain ':' (React useId), so select by attribute rather than '#id'.
  const panel = async (i: number) => {
    const id = await btn(i).getAttribute('aria-controls');
    expect(id, `question ${i} has aria-controls`).toBeTruthy();
    return page.locator(`[id="${id}"]`);
  };

  // (a) every question starts collapsed; its controlled region exists and is hidden
  for (let i = 0; i < faq.length; i++) {
    await expect(btn(i)).toHaveAttribute('aria-expanded', 'false');
    await expect(await panel(i)).toBeHidden();
  }

  // open question 1: region becomes visible and shows the answer
  await btn(0).click();
  await expect(btn(0)).toHaveAttribute('aria-expanded', 'true');
  await expect(await panel(0)).toBeVisible();
  await expect(await panel(0)).toContainText(faq[0].a);

  // (b) single-open: opening question 2 collapses question 1
  await btn(1).click();
  await expect(btn(1)).toHaveAttribute('aria-expanded', 'true');
  await expect(await panel(1)).toBeVisible();
  await expect(await panel(1)).toContainText(faq[1].a);
  await expect(btn(0)).toHaveAttribute('aria-expanded', 'false');
  await expect(await panel(0)).toBeHidden();

  // (c) re-click collapses
  await btn(1).click();
  await expect(btn(1)).toHaveAttribute('aria-expanded', 'false');
  await expect(await panel(1)).toBeHidden();

  // (d) keyboard: Enter opens, Space closes
  await btn(2).focus();
  await page.keyboard.press('Enter');
  await expect(btn(2)).toHaveAttribute('aria-expanded', 'true');
  await expect(await panel(2)).toBeVisible();
  await page.keyboard.press('Space');
  await expect(btn(2)).toHaveAttribute('aria-expanded', 'false');
  await expect(await panel(2)).toBeHidden();
});

test('the conversation CTA points at /contact-us and the checklist CTA at the checklist', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/therapy-centres');
  await expect(page.getByRole('link', { name: 'Your Workflow, Made Simpler' }).first()).toHaveAttribute('href', '/contact-us');
  await expect(page.getByRole('link', { name: 'Start The Development Checklist' })).toHaveAttribute('href', '/developmental-checklist');
});
