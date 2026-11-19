import { expect, test, type Page } from '@playwright/test';
import { CALENDLY_URL } from '../../lib/demo-config';
import { noConsentBanner, overflowAt } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

async function pick(page: Page, button: RegExp, option: string) {
  await page.getByRole('button', { name: button }).click();
  await page.getByRole('option', { name: option, exact: true }).click();
}

async function fill(page: Page) {
  await page.getByLabel(/^First Name/).fill('Asha');
  await page.getByLabel(/^Last Name/).fill('Rao');
  await page.getByLabel(/^Email/).fill('asha@example.com');
  await page.getByLabel(/^Phone number/).fill('9876543210');
  await pick(page, /^I am a:/, 'Therapy Centres');
  await pick(page, /^How many users:/, '3');
  await page.getByLabel(/^Enter code shown/).fill('VKNB62');
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
  await expect(page.getByText('First Name is required')).toBeVisible();
  await expect(page.getByRole('heading', { name: /request received/i })).toHaveCount(0);
});

test('try-demo: the school name field appears for Schools and Therapy Centres only', async ({ page }) => {
  await page.goto('/try-demo');
  await expect(page.getByLabel(/^Centre or school name/)).toHaveCount(0);
  await pick(page, /^I am a:/, 'Schools');
  await expect(page.getByLabel(/^Centre or school name/)).toBeVisible();
  await pick(page, /^I am a:/, 'Individual Therapists');
  await expect(page.getByLabel(/^Centre or school name/)).toHaveCount(0);
});

test('try-demo: submitting moves to the request-received step', async ({ page }) => {
  await page.goto('/try-demo');
  await fill(page);
  await page.getByRole('button', { name: 'Submit & Book' }).click();
  // The booking card follows the form. Booking is the only way forward.
  await expect(page.getByRole('button', { name: 'Book a time' })).toBeVisible();
  await expect(page.getByRole('button', { name: /book later/i })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: /request received/i })).toBeFocused();
});

// Calendly is a third-party script and popup, so the browser test stands in for it. The stand-in opens
// a frame on calendly.com (the only origin the page trusts) and posts the same booked message Calendly sends.
async function stubCalendly(page: Page) {
  await page.route('https://assets.calendly.com/assets/external/widget.css', (route) => route.fulfill({ contentType: 'text/css', body: '' }));
  await page.route('https://assets.calendly.com/assets/external/widget.js', (route) =>
    route.fulfill({
      contentType: 'text/javascript',
      body: `window.Calendly = {
        initPopupWidget(options) {
          window.__calendlyOptions = options;
          const frame = document.createElement('iframe');
          frame.id = 'calendly-stub';
          frame.title = 'Calendly stand-in';
          frame.src = 'https://calendly.com/stub-popup';
          document.body.appendChild(frame);
        },
        closePopupWidget() { document.getElementById('calendly-stub')?.remove(); },
      };`,
    }),
  );
  await page.route('https://calendly.com/stub-popup', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: `<button onclick="parent.postMessage({ event: 'calendly.event_scheduled' }, '*')">Schedule event</button>`,
    }),
  );
}

test('try-demo: the whole journey works with the Calendly link: form, Calendly popup, booked', async ({ page }) => {
  await stubCalendly(page);
  await page.goto('/try-demo');
  await fill(page);
  await page.getByRole('button', { name: 'Submit & Book' }).click();
  await expect(page.getByRole('button', { name: 'Book a time' })).toBeVisible();
  await page.getByRole('button', { name: 'Book a time' }).click();
  // The popup opens on the Calendly link, prefilled with the visitor's details. The sample calendar stays out of it.
  const popup = page.frameLocator('#calendly-stub');
  await expect(popup.getByRole('button', { name: 'Schedule event' })).toBeVisible();
  const options = await page.evaluate(() => (window as unknown as { __calendlyOptions: unknown }).__calendlyOptions);
  expect(options).toMatchObject({ url: CALENDLY_URL, prefill: { name: 'Asha Rao', email: 'asha@example.com' } });
  await expect(page.getByRole('dialog', { name: 'Pick a time' })).toHaveCount(0);
  await popup.getByRole('button', { name: 'Schedule event' }).click();
  await expect(page.getByRole('heading', { name: 'Demo booked' })).toBeFocused();
  await expect(page.getByText('We’re excited to give you a demo.')).toBeVisible();
  // The confirmation card itself never pushes case studies (they stay in the nav and footer).
  await expect(page.getByRole('status').getByRole('link', { name: /case stud/i })).toHaveCount(0);
  // The visitor stays until they choose to leave, so there is time to read the page.
  await expect(page.getByText(/Taking you to the homepage/)).toHaveCount(0);
  await expect(page).toHaveTitle('Demo booked | CognitiveBotics');
  // Reloading must not throw the confirmation away, or the visitor would submit the form again.
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Demo booked' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Submit & Book' })).toHaveCount(0);
  // The secondary button leaves, and coming back starts a fresh form.
  await page.getByRole('link', { name: 'Go to homepage' }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.getByRole('link', { name: /^demo$/i }).first().click();
  await expect(page).toHaveURL(/\/try-demo/);
  await expect(page.getByRole('button', { name: 'Submit & Book' })).toBeVisible();
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
