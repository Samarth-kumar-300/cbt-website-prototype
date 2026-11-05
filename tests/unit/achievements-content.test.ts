import { existsSync } from 'node:fs';
import { join } from 'node:path';
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

  it('gives each card a thumbnail that exists under public/ and has alt text', () => {
    for (const a of ACHIEVEMENTS) {
      expect(a.thumbnail.src).toMatch(/^\/achievements\/.+\.webp$/);
      expect(existsSync(join(process.cwd(), 'public', a.thumbnail.src)), a.thumbnail.src).toBe(true);
      expect(a.thumbnail.alt.trim().length).toBeGreaterThan(0);
    }
  });

  it('no longer carries icon fields', () => {
    for (const a of ACHIEVEMENTS) {
      expect(a).not.toHaveProperty('iconPath');
      expect(a).not.toHaveProperty('iconBg');
      expect(a).not.toHaveProperty('iconColor');
    }
  });

  it('has the page header and CTA copy', () => {
    expect(achievementsContent.title).toBe('Achievements');
    expect(achievementsContent.cta.href).toBe('/try-demo');
  });
});
