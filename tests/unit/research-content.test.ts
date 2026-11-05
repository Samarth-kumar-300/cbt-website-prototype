import { describe, expect, it } from 'vitest';
import { STUDIES } from '@/components/pages/research/studies';
import { RESEARCH_HREF_PREFIX, researchCards, researchContent } from '@/components/pages/research/content';

describe('research content', () => {
  it('has the two research cards with a short title, a takeaway and the live hrefs', () => {
    expect(researchCards).toHaveLength(2);
    expect(researchCards.map((c) => c.title)).toEqual([
      'AI therapy platform: 12-month study',
      'AI learning platform: 90-day study',
    ]);
    expect(researchCards.map((c) => c.description)).toEqual([
      '43 children, ages 2-18. Social age rose 56.84% with the platform.',
      '60 children, run at NIEPID. Developmental age rose 18.93%.',
    ]);
    expect(researchCards.map((c) => c.href)).toEqual([
      '/research/effectiveness-of-artificial-intelligence-based-platform-in-administering-therapies-for-children-with-autism-spectrum-disorder-12-month-observational-study',
      '/research/application-of-ai-based-learning-platform-for-children-with-asd-developmental-delay-and-intellectual-disability-a-prospective-cohort-study',
    ]);
  });

  it('keeps every href under /research/', () => {
    for (const c of researchCards) expect(c.href.startsWith(RESEARCH_HREF_PREFIX)).toBe(true);
    expect(RESEARCH_HREF_PREFIX).toBe('/research/');
  });

  it('gives every card only an href, a short title, a short description, a read time and a paper tone', () => {
    for (const c of researchCards) {
      expect(Object.keys(c).sort()).toEqual(['description', 'href', 'minutes', 'title', 'tone']);
      expect(c.title.trim()).not.toBe('');
      expect(c.title.length).toBeLessThanOrEqual(40);
      expect(c.description.trim()).not.toBe('');
      expect(c.description.length).toBeLessThanOrEqual(80);
    }
    expect(researchCards.map((c) => c.tone)).toEqual(['teal', 'amber']);
  });

  it('shows a read time that matches the length of each study (words / 200, at least 1 min)', () => {
    for (const c of researchCards) {
      const study = STUDIES.find((s) => s.slug === c.href.slice(RESEARCH_HREF_PREFIX.length))!;
      const words = study.blocks.flatMap((b) => (b.type === 'list' ? b.items : [b.text])).join(' ').split(/\s+/).length;
      expect(c.minutes).toBe(Math.max(1, Math.round(words / 200)));
    }
    expect(researchCards.map((c) => c.minutes)).toEqual([1, 1]);
  });

  it('keeps the formal paper title on each detail page, not on the card', () => {
    for (const c of researchCards) {
      const study = STUDIES.find((s) => s.slug === c.href.slice(RESEARCH_HREF_PREFIX.length));
      expect(study).toBeDefined();
      expect(study!.title.length).toBeGreaterThan(c.title.length);
    }
  });

  it('has unique hrefs that each match a study slug', () => {
    const hrefs = researchCards.map((c) => c.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    const slugs = STUDIES.map((s) => s.slug);
    for (const c of researchCards) expect(slugs).toContain(c.href.slice(RESEARCH_HREF_PREFIX.length));
  });

  it('carries the page header and CTA copy', () => {
    expect(researchContent.title).toBe('Research');
    expect(researchContent.subtitle).toBe('Explore peer-reviewed research and validation studies showcasing how we deliver measurable outcomes');
    expect(researchContent.cta).toEqual({
      heading: 'See the platform behind the research',
      body: 'Pick a time and we’ll show you how it works in a centre or school.',
      label: 'Book a demo',
      href: '/try-demo',
    });
  });
});
