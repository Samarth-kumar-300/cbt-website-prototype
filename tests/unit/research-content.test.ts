import { describe, expect, it } from 'vitest';
import { STUDIES } from '@/components/pages/research/studies';
import { RESEARCH_HREF_PREFIX, researchCards, researchContent } from '@/components/pages/research/content';

describe('research content', () => {
  it('has the two cards with headline, output, button and the live hrefs', () => {
    expect(researchCards).toHaveLength(2);
    expect(researchCards.map((c) => c.headline)).toEqual([
      '12-month study, published in JMIR Neurotechnology',
      '90-day study at NIEPID, Govt of India',
    ]);
    expect(researchCards.map((c) => c.output)).toEqual([
      '+56.8% social age · +46.5% developmental age',
      '59.57% more tasks done independently · +18.93% developmental age',
    ]);
    expect(researchCards.map((c) => c.button)).toEqual(['Read the study', 'Read the summary']);
    expect(researchCards.map((c) => c.readTime)).toEqual(['2 min read', '2 min read']);
    expect(researchCards.map((c) => c.href)).toEqual([
      '/research/effectiveness-of-artificial-intelligence-based-platform-in-administering-therapies-for-children-with-autism-spectrum-disorder-12-month-observational-study',
      '/research/application-of-ai-based-learning-platform-for-children-with-asd-developmental-delay-and-intellectual-disability-a-prospective-cohort-study',
    ]);
  });

  it('names the third-party entity on each card', () => {
    expect(researchCards.map((c) => c.partner)).toEqual([{ name: 'JMIR Neurotechnology', nameColor: '#1c2b57' },{ name: 'NIEPID', subLabel: 'Govt of India' }]);
  });

  it('keeps every href under /research/ and matching a study slug, uniquely', () => {
    const slugs = STUDIES.map((s) => s.slug);
    for (const c of researchCards) {
      expect(c.href.startsWith(RESEARCH_HREF_PREFIX)).toBe(true);
      expect(slugs).toContain(c.href.slice(RESEARCH_HREF_PREFIX.length));
    }
    expect(new Set(researchCards.map((c) => c.href)).size).toBe(researchCards.length);
  });

  it('carries the page header and CTA copy', () => {
    expect(researchContent.title).toBe('Research');
    expect(researchContent.subtitle).toBe('Research with India’s clinical and government institutions, measuring real progress in children using CognitiveBotics.');
    expect(researchContent.subtitle).not.toMatch(/peer-reviewed/i);
    expect(researchContent.cta).toEqual({
      heading: 'See the platform behind the research',
      body: 'Pick a time and we’ll show you how it works in a centre or school.',
      label: 'Book a demo',
      href: '/try-demo',
    });
  });
});
