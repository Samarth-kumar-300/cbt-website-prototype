import { expect, test, type Page } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

async function pick(page: Page, button: RegExp, option: string) {
  await page.getByRole('button', { name: button }).click();
  await page.getByRole('option', { name: option, exact: true }).click();
}

async function fill(page: Page) {
  await page.getByLabel(/^Name/).fill('Asha Rao');
  await page.getByLabel(/^Email/).fill('asha@example.com');
  await page.getByLabel(/^Phone number/).fill('9876543210');
  await pick(page, /^I am a:/, 'Parent');
  await pick(page, /^How many users:/, '3');
}

test('try-demo: headline, form and testimonials', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/try-demo');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('See CognitiveBotics in action');
  await expect(page.getByRole('button', { name: 'Submit & Book' })).toBeVisible();
  await expect(page.getByRole('region', { name: 'Testimonials' })).toBeVisible();
  await expect(page.getByText('ISO 27001 certified')).toBeVisible();
});

test('try-demo: ?plan=custom preselects 6 or more, a bad plan preselects nothing', async ({ page }) => {
  await page.goto('/try-demo?plan=custom');
  await expect(page.getByRole('button', { name: /^How many users: 6 or more/ })).toBeVisible();
  await page.goto('/try-demo?plan=%20bad');
  await expect(page.getByRole('button', { name: /^How many users: Choose one/ })).toBeVisible();
  await page.goto('/try-demo?plan=basic');
  await expect(page.getByText(/Basic: up to 5 users, ₹2,000 each/)).toBeVisible();
});

test('try-demo: required fields block the submit', async ({ page }) => {
  await page.goto('/try-demo');
  await page.getByRole('button', { name: 'Submit & Book' }).click();
  await expect(page.getByText('Name is required')).toBeVisible();
  await expect(page.getByRole('heading', { name: /request received/i })).toHaveCount(0);
});

test('try-demo: the school name field appears for School only', async ({ page }) => {
  await page.goto('/try-demo');
  await expect(page.getByLabel(/^Centre or school name/)).toHaveCount(0);
  await pick(page, /^I am a:/, 'School');
  await expect(page.getByLabel(/^Centre or school name/)).toBeVisible();
  await pick(page, /^I am a:/, 'Parent');
  await expect(page.getByLabel(/^Centre or school name/)).toHaveCount(0);
});

test('try-demo: submitting moves to the request-received step', async ({ page }) => {
  await page.goto('/try-demo');
  await fill(page);
  await page.getByRole('button', { name: 'Submit & Book' }).click();
  // "Demo request received" with a Calendly link configured, "Request received" without one.
  await expect(page.getByRole('heading', { name: /request received/i })).toBeFocused();
});

test('try-demo: no horizontal overflow at any width', async ({ page }) => {
  for (const w of [375, 768, 1024, 1440]) {
    expect(await overflowAt(page, '/try-demo', w), `${w}px`).toBeLessThanOrEqual(0);
  }
});

test('try-demo: the phone number input fits inside the form card at 375 and 1440', async ({ page }) => {
  for (const width of [375, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/try-demo');
    const phone = await page.getByLabel(/^Phone number/).boundingBox();
    const form = await page.locator('form').boundingBox();
    expect(phone, `${width}px phone input box`).not.toBeNull();
    expect(form, `${width}px form box`).not.toBeNull();
    expect(phone!.width, `${width}px phone input width`).toBeGreaterThanOrEqual(120);
    expect(phone!.x, `${width}px phone input left edge`).toBeGreaterThanOrEqual(form!.x);
    expect(phone!.x + phone!.width, `${width}px phone input right edge`).toBeLessThanOrEqual(form!.x + form!.width + 1);
  }
});
