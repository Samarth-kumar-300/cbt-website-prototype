import { describe, expect, it } from 'vitest';
import { POSTS } from '@/components/pages/blog/posts';
import { THUMBNAILS, copyProblems, hasThumbnail, type ThumbnailSpec } from '@/components/pages/blog/thumbnail/thumbnails';

const EARLY = 'early-intervention-is-the-key-to-managing-autism';
const SCREEN = 'the-startling-truth-about-screen-time-and-autism';
const PHYSICAL = 'the-transformative-power-of-physical-activities-for-children-with-autism';

/** The spec for `slug`, narrowed to one layout. */
function only<L extends ThumbnailSpec['layout']>(slug: string, layout: L) {
  const s = THUMBNAILS[slug];
  if (s.layout !== layout) throw new Error(`${slug} is ${s.layout}, expected ${layout}`);
  return s as Extract<ThumbnailSpec, { layout: L }>;
}

describe('thumbnail copy', () => {
  it('covers exactly the three campaign posts, and each is a real post', () => {
    expect(Object.keys(THUMBNAILS).sort()).toEqual([EARLY, PHYSICAL, SCREEN].sort());
    for (const slug of Object.keys(THUMBNAILS)) expect(POSTS.map((p) => p.slug)).toContain(slug);
  });

  it('uses three different layouts', () => {
    expect(new Set(Object.values(THUMBNAILS).map((s) => s.layout))).toEqual(new Set(['ticket', 'split', 'band']));
    expect(THUMBNAILS[EARLY].layout).toBe('ticket');
    expect(THUMBNAILS[SCREEN].layout).toBe('split');
    expect(THUMBNAILS[PHYSICAL].layout).toBe('band');
  });

  it.each(Object.entries(THUMBNAILS))('%s has copy that fits its layout', (_slug, s) => {
    expect(copyProblems(s)).toEqual([]);
  });

  it('finds only its own slugs, never inherited object keys', () => {
    expect(hasThumbnail(EARLY)).toBe(true);
    for (const key of ['constructor', '__proto__', 'toString', 'hasOwnProperty', 'not-a-post']) expect(hasThumbnail(key), key).toBe(false);
  });
});

describe('copyProblems', () => {
  const ticket = only(EARLY, 'ticket');
  const split = only(SCREEN, 'split');
  const band = only(PHYSICAL, 'band');

  it('accepts a headline part of exactly the limit and rejects one more character', () => {
    expect(copyProblems({ ...ticket, accent: 'a'.repeat(17) })).toEqual([]);
    expect(copyProblems({ ...ticket, accent: 'a'.repeat(18) }).join(' ')).toMatch(/accent/);
  });

  it.each<[string, ThumbnailSpec, RegExp]>([
    ['a split headline part over 18 characters', { ...split, lead: 'a'.repeat(19) }, /lead/],
    ['an empty headline part', { ...band, accent: '' }, /accent.*empty/],
    ['a ticket check over 17 characters', { ...ticket, checks: ['a'.repeat(18)] }, /check/],
    ['a ticket with three checks', { ...ticket, checks: ['a', 'b', 'c'] }, /one or two checks/],
    ['a ticket label over 22 characters', { ...ticket, label: 'a'.repeat(23) }, /label/],
    ['a split panel with two rows', { ...split, rows: ['a', 'b'] }, /three rows/],
    ['three chips that make a row wider than the band', { ...band, chips: ['a'.repeat(20), 'a'.repeat(20), 'a'.repeat(20), 'x'] }, /chip row/],
    ['seven chips', { ...band, chips: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] }, /chips/],
    ['a highlight that points at no row', { ...split, highlight: 3 }, /highlight/],
    ['a highlight that points at no chip', { ...band, highlight: 6 }, /highlight/],
    ['an eyebrow over 26 characters', { ...ticket, eyebrow: 'a'.repeat(27) }, /eyebrow/],
    ['a descriptor over 44 characters', { ...band, subtitle: 'a'.repeat(45) }, /descriptor/],
  ])('rejects %s', (_name, spec, pattern) => {
    expect(copyProblems(spec).join(' ')).toMatch(pattern);
  });
});
