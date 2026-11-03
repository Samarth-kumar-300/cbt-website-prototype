import { describe, expect, it } from 'vitest';
import { buildPrimaryNav, isActivePath, livePages, STORIES_PAGES } from '@/components/shared/nav-links';
import { LIVE_PAGES } from '@/lib/launch-gates';

const none = { caseStudies: false, faqs: false, blog: false, testimonials: false };
const all = { caseStudies: true, faqs: true, blog: true, testimonials: true };

describe('buildPrimaryNav', () => {
  it('puts Pricing after Parents and keeps About Us and Get in Touch last', () => {
    const labels = buildPrimaryNav(none).map((i) => i.label);
    expect(labels).toEqual(['Therapy Centres', 'Schools', 'Parents', 'Pricing', 'Resources', 'About Us', 'Get in Touch']);
  });

  it('falls back to the Resources link while fewer than two Stories pages are live', () => {
    for (const live of [none, { ...none, faqs: true }, { ...none, blog: true }]) {
      expect(buildPrimaryNav(live)[4]).toEqual({ kind: 'link', label: 'Resources', href: '/resources' });
    }
  });

  it('switches to the Stories menu once two pages are live', () => {
    const item = buildPrimaryNav({ ...none, faqs: true, blog: true })[4];
    expect(item.kind).toBe('menu');
    expect(item.label).toBe('Stories');
    if (item.kind === 'menu') expect(item.pages.map((p) => p.href)).toEqual(['/faqs', '/blog']);
  });

  it('keeps the menu order case studies, FAQs, blog, testimonials', () => {
    const item = buildPrimaryNav(all)[4];
    if (item.kind !== 'menu') throw new Error('expected a menu');
    expect(item.pages.map((p) => p.label)).toEqual(['Case studies', 'FAQs', 'Blog', 'Testimonials']);
  });

  it('ships with only FAQs live', () => {
    expect(LIVE_PAGES).toEqual({ caseStudies: false, faqs: true, blog: false, testimonials: false });
    expect(livePages().map((p) => p.href)).toEqual(['/faqs']);
  });

  it('gives every Stories page a helper line of at most 10 words', () => {
    for (const p of Object.values(STORIES_PAGES)) expect(p.helper.split(' ').length).toBeLessThanOrEqual(10);
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
