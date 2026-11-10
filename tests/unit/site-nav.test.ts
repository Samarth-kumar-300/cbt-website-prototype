import { describe, expect, it } from 'vitest';
import { buildPrimaryNav, isActivePath, LEARN_PAGES, livePages, menuPages, WEBINARS } from '@/components/shared/nav-links';
import { LIVE_PAGES } from '@/lib/launch-gates';

describe('buildPrimaryNav', () => {
  it('puts Pricing after Parents, Inside CognitiveBotics after Pricing, and keeps About Us last, with no Get in Touch', () => {
    const labels = buildPrimaryNav().map((i) => i.label);
    expect(labels).toEqual(['Therapy Centres', 'Schools', 'Parents', 'Pricing', 'Inside CognitiveBotics', 'About Us']);
  });

  it('always shows Inside CognitiveBotics as a menu in place of the old Resources link', () => {
    const item = buildPrimaryNav()[4];
    expect(item.kind).toBe('menu');
    expect(item.label).toBe('Inside CognitiveBotics');
  });

  it('groups the menu into Company, Library and Product, with a contact card', () => {
    const item = buildPrimaryNav()[4];
    if (item.kind !== 'menu') throw new Error('expected a menu');
    expect(item.columns.map((c) => [c.heading, c.pages.map((p) => p.label)])).toEqual([
      ['Company', ['Case studies', 'Testimonials', 'Awards']],
      ['Library', ['Blog', 'Webinars']],
      ['Product', ['Research', 'Knowledge base']],
    ]);
    expect(item.promo).toEqual({
      heading: 'Questions about your centre or school?',
      body: 'Talk to our team in Hyderabad about plans and setup.',
      label: 'Contact us',
      href: '/contact-us',
    });
    expect(menuPages(item).map((p) => p.href)).not.toContain('/faqs');
    expect(WEBINARS.href).toBe('/webinars');
  });

  it('lists every page once, FAQs staying out of the menu', () => {
    const item = buildPrimaryNav()[4];
    if (item.kind !== 'menu') throw new Error('expected a menu');
    const hrefs = menuPages(item).map((p) => p.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const p of livePages().filter((p) => p.href !== '/faqs')) expect(hrefs).toContain(p.href);
  });

  it('ships with every Learn page live', () => {
    expect(LIVE_PAGES).toEqual({ caseStudies: true, faqs: true, blog: true, testimonials: true, research: true, achievements: true });
    expect(livePages().map((p) => p.href)).toEqual(['/research', '/case-studies', '/achievements', '/testimonials', '/faqs', '/blog']);
  });

  it('gives every page a helper line of at most 15 words', () => {
    for (const p of [...Object.values(LEARN_PAGES), WEBINARS]) expect(p.helper.split(' ').length).toBeLessThanOrEqual(15);
  });
});

describe('Research and achievements rows', () => {
  it('link to their own pages, not external', () => {
    expect(LEARN_PAGES.research).toMatchObject({ label: 'Research', href: '/research' });
    expect(LEARN_PAGES.achievements).toMatchObject({ label: 'Awards', href: '/achievements' });
    expect(LEARN_PAGES.research.external).toBeUndefined();
    expect(LEARN_PAGES.achievements.external).toBeUndefined();
  });

  it('Case studies is the first link in the first column', () => {
    const item = buildPrimaryNav()[4];
    if (item.kind !== 'menu') throw new Error('expected a menu');
    expect(menuPages(item)[0].href).toBe('/case-studies');
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
