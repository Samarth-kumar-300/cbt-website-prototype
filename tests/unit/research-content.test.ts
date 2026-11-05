import { describe, expect, it } from 'vitest';
import { RESEARCH_HREF_PREFIX, researchCards, researchContent } from '@/components/pages/research/content';

describe('research content', () => {
  it('has the three research cards with the live titles and hrefs', () => {
    expect(researchCards).toHaveLength(3);
    expect(researchCards.map((c) => c.title)).toEqual([
      'Effectiveness of Artificial Intelligence–Based Platform in Administering Therapies for Children With Autism Spectrum Disorder: 12-Month Observational Study',
      'Application of AI-Based Learning Platform for Children with ASD, Developmental Delay and Intellectual Disability – A Prospective Cohort Study',
      'Methods for Aiding Persons with Autism to Acquire Skills',
    ]);
    expect(researchCards.map((c) => c.pill)).toEqual(['12-Month Observational Study', 'A Prospective Cohort Study', 'Granted Indian Patent • No. 586929']);
    expect(researchCards.map((c) => c.href)).toEqual([
      '/research/effectiveness-of-artificial-intelligence-based-platform-in-administering-therapies-for-children-with-autism-spectrum-disorder-12-month-observational-study',
      '/research/application-of-ai-based-learning-platform-for-children-with-asd-developmental-delay-and-intellectual-disability-a-prospective-cohort-study',
      '/research/methods-for-aiding-persons-with-autism-to-acquire-skills',
    ]);
  });

  it('keeps every href under /research/', () => {
    for (const c of researchCards) expect(c.href.startsWith(RESEARCH_HREF_PREFIX)).toBe(true);
    expect(RESEARCH_HREF_PREFIX).toBe('/research/');
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
