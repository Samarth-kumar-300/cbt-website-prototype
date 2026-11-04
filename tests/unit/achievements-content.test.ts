import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS, achievementsContent } from '@/components/pages/achievements/content';

describe('achievements content', () => {
  it('has the two cards with the original titles', () => {
    expect(ACHIEVEMENTS).toHaveLength(2);
    expect(ACHIEVEMENTS.map((a) => a.title)).toEqual([
      'Methods for Aiding Persons with Autism to Acquire Skills',
      'ISO Certification',
    ]);
  });

  it('links both cards to https PDFs', () => {
    for (const a of ACHIEVEMENTS) {
      expect(a.href).toMatch(/^https:\/\/.+\.pdf$/);
    }
  });

  it('names the patent number', () => {
    expect(ACHIEVEMENTS[0].pill).toContain('586929');
  });

  it('has the page header and CTA copy', () => {
    expect(achievementsContent.title).toBe('Achievements');
    expect(achievementsContent.cta.href).toBe('/try-demo');
  });
});
