import { describe, expect, it } from 'vitest';
import { achievementsContent } from '@/components/pages/achievements/content';
import { blogContent } from '@/components/pages/blog/content';
import { caseStudiesContent } from '@/components/pages/case-studies/content';
import { faqsContent } from '@/components/pages/faqs/content';
import { pricingContent } from '@/components/pages/pricing/content';
import { researchContent } from '@/components/pages/research/content';
import { testimonialsContent } from '@/components/pages/testimonials/content';

describe('closing panels on the Learn and Pricing pages', () => {
  const panels = {
    research: researchContent.cta,
    achievements: achievementsContent.cta,
    caseStudies: caseStudiesContent.cta,
    testimonials: testimonialsContent.cta,
    blog: blogContent.cta,
    faqs: faqsContent.cta,
    pricingCentres: pricingContent.audiences['therapy-centres'].cta,
    pricingSchools: pricingContent.audiences.schools.cta,
  };
  it('each has a heading, a supporting line and a button', () => {
    for (const [page, cta] of Object.entries(panels)) {
      expect(cta.heading, page).toBeTruthy();
      expect(cta.body, page).toBeTruthy();
      expect(cta.label, page).toBeTruthy();
    }
  });
  it('no two pages share a heading, and the generic line is gone', () => {
    const headings = Object.values(panels).map((c) => c.heading);
    expect(new Set(headings).size).toBe(headings.length);
    expect(headings).not.toContain('Want results like these?');
  });
});
