import { expect, test } from '@playwright/test';
import { POSTS } from '../../components/pages/blog/posts';
import { THUMBNAILS } from '../../components/pages/blog/thumbnail/thumbnails';

const SLUGS = Object.keys(THUMBNAILS);
const WITHOUT = POSTS.find((p) => !Object.prototype.hasOwnProperty.call(THUMBNAILS, p.slug))!;

test.describe('thumbnail render route', () => {
  test.use({ viewport: { width: 1200, height: 675 } });

  for (const slug of SLUGS) {
    test.describe(slug.slice(0, 32), () => {
      test('is exactly 1200 x 675', async ({ page }) => {
        const res = await page.goto(`/kit/thumbnail/${slug}`);
        expect(res?.status()).toBe(200);
        expect(await page.getByTestId('thumbnail').boundingBox()).toMatchObject({ x: 0, y: 0, width: 1200, height: 675 });
      });

      test('uses the brand heading font and keeps each headline part on one line inside the text block', async ({ page }) => {
        await page.goto(`/kit/thumbnail/${slug}`);
        const m = await page.evaluate(() => {
          const rect = (id: string) => {
            const b = document.querySelector(`[data-testid="${id}"]`)!.getBoundingClientRect();
            return { left: b.left, right: b.right, top: b.top, bottom: b.bottom, height: b.height };
          };
          const lead = document.querySelector('[data-testid="headline-lead"]')!;
          return { text: rect('text'), lead: rect('headline-lead'), accent: rect('headline-accent'), font: getComputedStyle(lead).fontFamily };
        });
        expect(m.font).toMatch(/Nunito/);
        // 56px x 1.12 = 62.7px per line; a second line would double it.
        expect(m.lead.height).toBeLessThan(70);
        expect(m.accent.height).toBeLessThan(70);
        for (const part of [m.lead, m.accent]) {
          expect(part.left).toBeGreaterThanOrEqual(76 - 1);
          expect(part.right).toBeLessThanOrEqual(m.text.right + 0.5);
        }
      });

      test('text and illustration do not overlap, and the illustration stays inside the card', async ({ page }) => {
        await page.goto(`/kit/thumbnail/${slug}`);
        const g = await page.evaluate(() => {
          const rect = (id: string) => {
            const b = document.querySelector(`[data-testid="${id}"]`)!.getBoundingClientRect();
            return { left: b.left, right: b.right, top: b.top, bottom: b.bottom };
          };
          return { layout: (document.querySelector('[data-testid="thumbnail"]') as HTMLElement).dataset.layout, text: rect('text'), art: rect('art'), card: rect('card') };
        });
        if (g.layout === 'band') expect(g.text.bottom).toBeLessThanOrEqual(g.art.top);
        else expect(g.text.right).toBeLessThanOrEqual(g.art.left);
        expect(g.art.left).toBeGreaterThanOrEqual(g.card.left);
        expect(g.art.right).toBeLessThanOrEqual(g.card.right);
        expect(g.art.top).toBeGreaterThanOrEqual(g.card.top);
        expect(g.art.bottom).toBeLessThanOrEqual(g.card.bottom);
      });

      test('decoration never touches a chip or label', async ({ page }) => {
        await page.goto(`/kit/thumbnail/${slug}`);
        const r = await page.evaluate(() => {
          const layout = (document.querySelector('[data-testid="thumbnail"]') as HTMLElement).dataset.layout;
          const labelled = [...document.querySelectorAll('[data-fit]')].map((el) => el.getBoundingClientRect());
          const decor = [...document.querySelectorAll('[data-decor]')];
          const hits = decor.filter((d) => {
            const a = d.getBoundingClientRect();
            return labelled.some((c) => a.left < c.right && a.right > c.left && a.top < c.bottom && a.bottom > c.top);
          }).length;
          return { layout, decor: decor.length, hits };
        });
        if (r.layout === 'band') expect(r.decor).toBeGreaterThan(0); // otherwise this passes with nothing to check
        expect(r.hits).toBe(0);
      });

      test('every labelled element fits inside its box', async ({ page }) => {
        await page.goto(`/kit/thumbnail/${slug}`);
        const r = await page.evaluate(() => {
          // Measure the ticket untilted so its boxes are axis-aligned.
          document.querySelectorAll<HTMLElement>('[data-rotate]').forEach((el) => (el.style.transform = 'none'));
          const outside: string[] = [];
          const fits = document.querySelectorAll<HTMLElement>('[data-fit]');
          fits.forEach((el) => {
            const box = el.closest('[data-fit-box]');
            if (!box) return void outside.push(`${el.textContent}: no box`);
            const a = el.getBoundingClientRect();
            const b = box.getBoundingClientRect();
            if (a.left < b.left - 1 || a.right > b.right + 1 || a.top < b.top - 1 || a.bottom > b.bottom + 1) outside.push(`${el.textContent}: outside its box`);
          });
          return { count: fits.length, outside };
        });
        expect(r.count).toBeGreaterThanOrEqual(3);
        expect(r.outside).toEqual([]);
      });
    });
  }

  test('the header and cookie banner never sit over the thumbnail, even without cookie consent', async ({ page }) => {
    await page.goto(`/kit/thumbnail/${SLUGS[0]}`); // consent deliberately not set, so the banner shows
    const banner = page.getByRole('dialog', { name: 'Cookie preferences' });
    await expect(banner).toBeVisible(); // meaningless unless the banner is really there
    const box = (await banner.boundingBox())!;
    const covered = await page.evaluate(([bx, by, bw, bh]) => {
      const root = document.querySelector('[data-testid="thumbnail"]')!;
      // corners and top edge (the header), plus the middle and a corner of the banner's own box
      const points = [[5, 5], [1195, 5], [5, 670], [1195, 670], [600, 337], [600, 20], [bx + bw / 2, by + bh / 2], [bx + 10, by + 10]];
      return points.filter(([x, y]) => !root.contains(document.elementFromPoint(x, y))).length;
    }, [box.x, box.y, box.width, box.height]);
    expect(covered).toBe(0);
  });

  test('an unknown slug, a post with no thumbnail, and inherited object keys are all a 404', async ({ page }) => {
    for (const slug of ['not-a-post', WITHOUT.slug, 'constructor', '__proto__', 'toString']) {
      expect((await page.goto(`/kit/thumbnail/${slug}`))?.status(), slug).toBe(404);
    }
  });

  test('the index lists every thumbnail once, by slug', async ({ page }) => {
    await page.goto('/kit/thumbnail');
    const slugs = await page.locator('[data-slug]').evaluateAll((els) => els.map((el) => el.getAttribute('data-slug')));
    expect(slugs.sort()).toEqual([...SLUGS].sort());
  });
});
