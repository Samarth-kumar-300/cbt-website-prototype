import { describe, expect, it } from 'vitest';
import { FAQ_SETS, faqPageJsonLd } from '@/lib/faq-sets';

describe('FAQ_SETS', () => {
  it('has the five chips in order with the expected sizes', () => {
    expect(FAQ_SETS.map((s) => [s.id, s.label, s.items.length])).toEqual([
      ['general', 'General', 8],
      ['therapy-centres', 'Therapy centres', 5],
      ['schools', 'Schools', 9],
      ['parents', 'Parents', 5],
      ['pricing', 'Pricing', 4],
    ]);
  });
  it('gives every question a non-empty answer', () => {
    for (const s of FAQ_SETS) for (const i of s.items) expect(i.a.trim().length, i.q).toBeGreaterThan(0);
  });
});

describe('faqPageJsonLd', () => {
  it('is an FAQPage with one entry per unique question', () => {
    const data = faqPageJsonLd() as { '@type': string; mainEntity: { '@type': string; name: string; acceptedAnswer: { text: string } }[] };
    const unique = new Set(FAQ_SETS.flatMap((s) => s.items.map((i) => i.q)));
    expect(data['@type']).toBe('FAQPage');
    expect(data.mainEntity).toHaveLength(unique.size);
    expect(new Set(data.mainEntity.map((q) => q.name)).size).toBe(unique.size);
    expect(data.mainEntity[0]['@type']).toBe('Question');
  });
});
