import { describe, expect, it } from 'vitest';
import { pricingContent as c, pricingFaq } from '@/components/pages/pricing/content';
import { pricingJsonLd } from '@/components/pages/pricing/seo';
import { faq as therapyFaq } from '@/components/pages/therapy-centres/content';

describe('pricingContent', () => {
  it('has the Basic and Custom plans with the spec CTAs', () => {
    const [basic, custom] = c.plans;
    expect(basic).toMatchObject({ id: 'basic', price: '₹2,000', unit: '/user/month', note: 'Up to 5 users', total: '5 users: ₹10,000 per month', taxes: 'Excluding taxes' });
    expect(basic.cta).toEqual({ label: 'Book a demo', href: '/try-demo?plan=basic' });
    expect(custom).toMatchObject({ id: 'custom', price: 'Custom pricing', audience: 'For 6 or more users' });
    expect(custom.cta).toEqual({ label: 'Talk to sales', href: '/try-demo?plan=custom' });
  });
  it('lists 7 Basic and 3 Custom feature rows, each at most 8 words', () => {
    expect(c.plans[0].features).toHaveLength(7);
    expect(c.plans[1].features).toHaveLength(3);
    for (const p of c.plans) for (const f of p.features) expect(f.split(' ').length, f).toBeLessThanOrEqual(8);
  });
  it('uses no em dashes or exclamation marks in any copy', () => {
    const all = JSON.stringify(c) + JSON.stringify(pricingFaq);
    expect(all).not.toMatch(/[—–!]/);
  });
});

describe('pricingFaq', () => {
  it('has four questions and reuses the Therapy Centres answers verbatim', () => {
    expect(pricingFaq).toHaveLength(4);
    for (const q of ['Is there published research behind this?', 'Is CognitiveBotics suitable for NGOs, not just private therapy centres?']) {
      const mine = pricingFaq.find((f) => f.q === q);
      const theirs = therapyFaq.find((f) => f.q === q);
      expect(mine?.a).toBe(theirs?.a);
    }
  });
  it('answers the user-count question as pending and the demo question with the 2 to 3 day promise', () => {
    expect(pricingFaq[0]).toEqual({ q: 'Who counts as a user?', a: 'We’ll confirm the exact count in your demo.' });
    expect(pricingFaq[1].a).toContain('2 to 3 business days');
  });
});

describe('pricingJsonLd', () => {
  it('describes the Basic price in INR', () => {
    const data = pricingJsonLd() as { offers: { price: string; priceCurrency: string } };
    expect(data.offers.price).toBe('2000');
    expect(data.offers.priceCurrency).toBe('INR');
  });
});
