import { describe, expect, it } from 'vitest';
import { buildPrimaryNav, isActivePath, LEARN_PAGES, livePages, menuPages } from '@/components/shared/nav-links';
import { LIVE_PAGES } from '@/lib/launch-gates';

describe('buildPrimaryNav', () => {
  it('puts Pricing after Parents, Learn after Pricing, and keeps About Us last, with no Get in Touch', () => {
    const labels = buildPrimaryNav().map((i) => i.label);
    expect(labels).toEqual(['Therapy Centres', 'Schools', 'Parents', 'Pricing', 'Learn', 'About Us']);
  });

  it('always shows Learn as a menu in place of the old Resources link', () => {
    const item = buildPrimaryNav()[4];
    expect(item.kind).toBe('menu');
    expect(item.label).toBe('Learn');
  });

  it('groups the menu by format: stories and guides, answers and quotes, support, with a demo card', () => {
    const item = buildPrimaryNav()[4];
    if (item.kind !== 'menu') throw new Error('expected a menu');
    expect(item.columns.map((c) => [c.heading, c.pages.map((p) => p.label)])).toEqual([
      ['Stories and guides', ['Case studies', 'Blog']],
      ['Answers and quotes', ['FAQs', 'Testimonials']],
      ['Get support', ['Knowledge base', 'Get in touch']],
    ]);
    expect(item.promo.href).toBe('/try-demo');
  });

  it('lists every Learn page exactly once', () => {
    const item = buildPrimaryNav()[4];
    if (item.kind !== 'menu') throw new Error('expected a menu');
    const hrefs = menuPages(item).map((p) => p.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const p of livePages()) expect(hrefs).toContain(p.href);
  });

  it('ships with every Learn page live', () => {
    expect(LIVE_PAGES).toEqual({ caseStudies: true, faqs: true, blog: true, testimonials: true });
    expect(livePages().map((p) => p.href)).toEqual(['/case-studies', '/faqs', '/blog', '/testimonials']);
  });

  it('gives every Learn page a helper line of at most 10 words', () => {
    for (const p of Object.values(LEARN_PAGES)) expect(p.helper.split(' ').length).toBeLessThanOrEqual(10);
  });
});

describe('Knowledge base row', () => {
  it('is external and not tied to a launch gate', () => {
    const item = buildPrimaryNav()[4];
    if (item.kind !== 'menu') throw new Error('expected a menu');
    const last = menuPages(item).find((p) => p.external);
    expect(last).toMatchObject({ label: 'Knowledge base', href: 'https://support.cognitivebotics.com/support/solutions', external: true });
    expect(livePages().some((p) => p.external)).toBe(false);
  });
});

describe('isActivePath', () => {
  it('matches the exact path and nested paths only', () => {
    expect(isActivePath('/faqs', '/faqs')).toBe(true);
    expect(isActivePath('/blog/some-post', '/blog')).toBe(true);
    expect(isActivePath('/blogger', '/blog')).toBe(false);
    expect(isActivePath('/', '/blog')).toBe(false);
  });
});
