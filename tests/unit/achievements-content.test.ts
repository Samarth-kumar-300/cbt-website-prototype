import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ACHIEVEMENTS, achievementsContent } from '@/components/pages/achievements/content';

describe('achievements content', () => {
  it('has the three cards, the first two with the original titles', () => {
    expect(ACHIEVEMENTS).toHaveLength(3);
    expect(ACHIEVEMENTS.map((a) => a.title)).toEqual([
      'Methods for Aiding Persons with Autism to Acquire Skills',
      'ISO Certification',
      'Certificate of Appreciation',
    ]);
  });

  it('links the patent and ISO cards to https PDFs', () => {
    for (const a of ACHIEVEMENTS.slice(0, 2)) {
      expect(a.href).toMatch(/^https:\/\/.+\.pdf$/);
    }
  });

  it('links the MedTech card to a certificate image that exists under public/', () => {
    const medtech = ACHIEVEMENTS[2];
    expect(medtech.href).toBe('/achievements/ap-govt-medtech-certificate.webp');
    expect(existsSync(join(process.cwd(), 'public', medtech.href))).toBe(true);
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
