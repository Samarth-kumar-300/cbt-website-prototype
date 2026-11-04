import { describe, expect, it } from 'vitest';
import { blogAudiences, getPost, postJsonLd, relatedPosts } from '@/components/pages/blog/content';
import { CARD_STYLES } from '@/components/pages/blog/card-styles';
import { POSTS } from '@/components/pages/blog/posts';
import { CASE_STUDIES, caseStudyGroups, getCaseStudy, hasPlaceholders, nextCaseStudy, readMinutes } from '@/components/pages/case-studies/content';
import { testimonialGroups } from '@/components/pages/testimonials/content';
import { TESTIMONIALS, VIDEO_TESTIMONIAL } from '@/lib/testimonials';

describe('blog posts', () => {
  it('keeps the six existing slugs', () => {
    expect(POSTS.map((p) => p.slug)).toEqual([
      'the-transformative-power-of-physical-activities-for-children-with-autism',
      'fun-ways-to-boost-motor-skills-of-children-with-autism',
      'understanding-the-underlying-causes-of-autism-a-comprehensive-guide',
      'the-startling-truth-about-screen-time-and-autism',
      'early-intervention-is-the-key-to-managing-autism',
      'how-to-travel-with-children-who-have-autism',
    ]);
  });
  it('gives every post body text, a card style and a read time', () => {
    for (const p of POSTS) {
      expect(p.body.length, p.slug).toBeGreaterThan(4);
      expect(p.body[0].type, p.slug).toBe('lead');
      expect(CARD_STYLES[p.slug], p.slug).toBeDefined();
      expect(p.minutes, p.slug).toBeGreaterThan(0);
    }
  });
  it('lists audience chips in order, skipping empty ones', () => {
    expect(blogAudiences()).toEqual(['Parents', 'Therapy centres', 'Schools']);
    expect(blogAudiences(POSTS.filter((p) => !p.audiences.includes('Schools')))).toEqual(['Parents', 'Therapy centres']);
    expect(blogAudiences(POSTS.filter((p) => p.audiences.length === 1))).toEqual(['Parents']);
  });
  it('tags every post with at least one audience, in sentence case', () => {
    for (const p of POSTS) {
      expect(p.audiences.length, p.slug).toBeGreaterThan(0);
      for (const a of p.audiences) expect(a, p.slug).toBe(a.charAt(0) + a.slice(1).toLowerCase());
    }
  });
  it('picks three related posts, ones sharing an audience first, never the post itself', () => {
    const slug = POSTS[0].slug;
    const related = relatedPosts(slug);
    expect(related).toHaveLength(3);
    expect(related.map((p) => p.slug)).not.toContain(slug);
    expect(related[0].audiences.some((a) => POSTS[0].audiences.includes(a))).toBe(true);
  });
  it('finds a post by slug and returns undefined for an unknown one', () => {
    expect(getPost(POSTS[3].slug)?.title).toBe('The Startling Truth About Screen Time and Autism');
    expect(getPost('nope')).toBeUndefined();
  });
  it('emits Article and breadcrumb JSON-LD', () => {
    const ld = postJsonLd(POSTS[0]) as { '@graph': { '@type': string }[] };
    expect(ld['@graph'].map((g) => g['@type'])).toEqual(['Article', 'BreadcrumbList']);
  });
});

describe('case studies', () => {
  it('flags sample entries so the pages can warn and stay out of search', () => {
    expect(CASE_STUDIES.length).toBeGreaterThanOrEqual(2);
    expect(hasPlaceholders()).toBe(CASE_STUDIES.some((c) => c.placeholder));
  });
  it('links each study to the next, wrapping round', () => {
    const [a, b] = CASE_STUDIES;
    expect(nextCaseStudy(a.slug)?.slug).toBe(b.slug);
    expect(nextCaseStudy(CASE_STUDIES[CASE_STUDIES.length - 1].slug)?.slug).toBe(a.slug);
  });
  it('offers a filter row for each group that has a case study', () => {
    expect(caseStudyGroups()).toEqual(['Therapy centres', 'Schools']);
    expect(caseStudyGroups(CASE_STUDIES.filter((c) => c.group === 'Schools'))).toEqual(['Schools']);
  });
  it('shows a read time of at least one minute, rounded from 200 words a minute', () => {
    for (const c of CASE_STUDIES) expect(readMinutes(c), c.slug).toBeGreaterThanOrEqual(1);
    const words = (n: number) => Array(n).fill('word').join(' ');
    const base = CASE_STUDIES[0];
    expect(readMinutes({ ...base, summary: words(10), challenge: '', solution: '', features: [], quote: { ...base.quote, text: '' } })).toBe(1);
    expect(readMinutes({ ...base, summary: words(600), challenge: '', solution: '', features: [], quote: { ...base.quote, text: '' } })).toBe(3);
  });
  it('gives every study three metrics and finds it by slug', () => {
    for (const c of CASE_STUDIES) {
      expect(c.metrics).toHaveLength(3);
      expect(getCaseStudy(c.slug)).toBe(c);
    }
    expect(getCaseStudy('nope')).toBeUndefined();
  });
});

describe('testimonial groups', () => {
  it('shows All plus a chip for each audience that has a quote', () => {
    expect(testimonialGroups(TESTIMONIALS).map((g) => g.label)).toEqual(['All', 'Parents', 'Therapists']);
    expect(testimonialGroups([...TESTIMONIALS, VIDEO_TESTIMONIAL]).map((g) => g.label)).toEqual(['All', 'Parents', 'Therapists', 'Schools']);
    expect(testimonialGroups(TESTIMONIALS.filter((t) => t.audience === 'parent')).map((g) => g.label)).toEqual(['All', 'Parents']);
  });
});
