import { describe, expect, it } from 'vitest';
import { AUDIENCE_IDS, PENDING_ANSWER, audiences, hero, parentsPanel, parseAudience, pricingFaq } from '@/components/pages/pricing/content';
import { pricingJsonLd } from '@/components/pages/pricing/seo';
import { faq as therapyFaq } from '@/components/pages/therapy-centres/content';
import { TESTIMONIALS } from '@/lib/testimonials';

describe('parseAudience', () => {
  it('reads schools and falls back to therapy centres for anything else', () => {
    expect(parseAudience('schools')).toBe('schools');
    expect(parseAudience(['schools', 'x'])).toBe('schools');
    for (const v of [undefined, '', 'SCHOOLS', 'parents', ['x', 'schools']]) expect(parseAudience(v as never)).toBe('therapy-centres');
  });
});

describe('audiences', () => {
  const tc = audiences['therapy-centres'];
  const sc = audiences.schools;
  it('has both audiences in tab order', () => {
    expect(AUDIENCE_IDS).toEqual(['therapy-centres', 'schools']);
    expect(AUDIENCE_IDS.map((id) => audiences[id].tabLabel)).toEqual(['Therapy Centres', 'Schools']);
  });
  it('gives each audience 6 platform cards and 3 "gets" items', () => {
    for (const a of [tc, sc]) {
      expect(a.features).toHaveLength(6);
      expect(a.gets.items).toHaveLength(3);
    }
  });
  it('has two plans for centres and three for schools, Bloom last', () => {
    expect(tc.plans.map((p) => p.id)).toEqual(['basic', 'custom']);
    expect(sc.plans.map((p) => p.id)).toEqual(['basic', 'custom', 'bloom']);
  });
  it('links the plan buttons to the forms that understand them', () => {
    for (const a of [tc, sc]) {
      expect(a.plans[0].cta).toEqual({ label: 'Book a demo', href: '/try-demo?plan=basic', variant: 'solid' });
      expect(a.plans[1].cta).toEqual({ label: 'Contact us', href: '/try-demo?plan=custom', variant: 'outline' });
      expect(a.cta.href).toBe('/contact-us');
    }
    expect(sc.plans[2].cta).toEqual({ label: 'Contact us', href: '/contact-us', variant: 'solid' });
  });
  it('prices Basic at 2,000 per user per month, up to 5 users, excluding taxes', () => {
    for (const a of [tc, sc]) expect(a.plans[0]).toMatchObject({ price: '₹2,000', unit: '/user/month', meta: 'Up to 5 users', metaNote: 'Excluding taxes' });
  });
  it('has 7 centre and 9 school questions; only "Who counts as a user?" is pending', () => {
    expect(tc.faq).toHaveLength(7);
    expect(sc.faq).toHaveLength(9);
    for (const a of [tc, sc]) {
      expect(a.faq.filter((f) => f.a === PENDING_ANSWER).map((f) => f.q)).toEqual(['Who counts as a user?']);
    }
    expect(tc.faq[1].a).toContain('Each branch needs its own licence per access.');
    expect(tc.faq[2].a).toBe('Therapy centres go live within a week.');
    expect(sc.faq[2].a).toContain('BLOOM places a CognitiveBotics-trained resource person in your school');
    expect(sc.faq[4].a).toBe('Schools go live within 6 weeks.');
  });
  it('shows the two quotes the content names for each audience, each once', () => {
    const known = new Set(TESTIMONIALS.map((t) => t.id));
    expect(tc.testimonials.order).toEqual(['chandrashekhar', 'mounila']);
    expect(sc.testimonials.order).toEqual(['pavani', 'tejaswi']);
    for (const a of [tc, sc]) {
      for (const id of a.testimonials.order) expect(known.has(id), id).toBe(true);
      expect(new Set(a.testimonials.order).size).toBe(a.testimonials.order.length);
    }
  });
  it('gives the two closing panels different headings', () => {
    expect(tc.cta.heading).not.toBe(sc.cta.heading);
  });
  it('uses en dashes for ranges and no em dashes or exclamation marks', () => {
    const all = JSON.stringify({ hero, audiences, parentsPanel, pricingFaq });
    expect(all).not.toMatch(/[—!]/);
    expect(all).not.toMatch(/\d-\d/);
    expect(all).toContain('10–15%');
    expect(all).toContain('UK–India');
  });
});

describe('pricingFaq (feeds /faqs, must not change)', () => {
  it('still has the four answered questions', () => {
    expect(pricingFaq).toHaveLength(4);
    for (const f of pricingFaq) expect(f.a).not.toBe(PENDING_ANSWER);
    for (const q of ['Is there published research behind this?', 'Is CognitiveBotics suitable for NGOs, not just private therapy centres?']) {
      expect(pricingFaq.find((f) => f.q === q)).toEqual(therapyFaq.find((f) => f.q === q));
    }
  });
});

describe('pricingJsonLd', () => {
  it('still describes the Basic offer in INR', () => {
    expect(JSON.stringify(pricingJsonLd())).toContain('"priceCurrency":"INR"');
    expect(pricingJsonLd().offers.price).toBe('2000');
  });
});
