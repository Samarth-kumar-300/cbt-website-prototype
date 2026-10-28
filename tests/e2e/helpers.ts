import { expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { routeToSlug } from '../../tools/lib/slug.mjs';

export const WIDTHS = [375, 768, 1024, 1440];
const COOKIE_KEY = 'cb-cookie-consent';

export async function noConsentBanner(page: Page) {
  await page.addInitScript((k) => localStorage.setItem(k, 'rejected'), COOKIE_KEY);
}

export async function overflowAt(page: Page, route: string, width: number) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(route);
  return page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
}

export async function expectPageMatchesReference(page: Page, route: string, opts: { extraSections?: number; removedSections?: number; changedHeadings?: string[] } = {}) {
  const slug = routeToSlug(route);
  const ref = JSON.parse(readFileSync(`reference/${slug}/copy.json`, 'utf8')) as { h1: string[]; h2: string[]; h3: string[] }[];
  await noConsentBanner(page);
  for (const w of WIDTHS) {
    expect(await overflowAt(page, route, w), `horizontal overflow at ${w}px`).toBeLessThanOrEqual(0);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(route);
  const sectionCount = await page.evaluate(() => {
    const main = document.querySelector('main')!;
    return [...main.querySelectorAll('section')].filter((s) => !s.parentElement!.closest('section')).length;
  });
  expect(sectionCount, 'top-level section count').toBe(ref.length + (opts.extraSections ?? 0) - (opts.removedSections ?? 0));
  const headings = await page.evaluate(() =>
    [...document.querySelectorAll('main h1, main h2, main h3')]
      .filter((e) => (e as HTMLElement).offsetWidth || (e as HTMLElement).offsetHeight)
      .map((e) => (e.textContent ?? '').replace(/\s+/g, ' ').trim()),
  );
  // `changedHeadings` lists original headings the content revision replaced on purpose.
  const expected = ref.flatMap((s) => [...s.h1, ...s.h2, ...s.h3]).filter((t) => !(opts.changedHeadings ?? []).includes(t));
  const missing = expected.filter((t) => !headings.includes(t));
  expect(missing, 'headings present in the original but not rendered').toEqual([]);
}
