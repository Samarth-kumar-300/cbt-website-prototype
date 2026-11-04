import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { TESTIMONIALS } from '@/lib/testimonials';

describe('TESTIMONIALS', () => {
  it('holds the four quotes shown on the home page, in order', () => {
    expect(TESTIMONIALS.map((t) => t.id)).toEqual(['tejaswi', 'mounila', 'chandrashekhar', 'pavani']);
  });
  it('has unique ids, non-empty text and an avatar file for each', () => {
    expect(new Set(TESTIMONIALS.map((t) => t.id)).size).toBe(TESTIMONIALS.length);
    for (const t of TESTIMONIALS) {
      expect(t.text.length).toBeGreaterThan(40);
      expect(existsSync(`public/images/homepage/avatars/${t.avatar}.webp`), t.avatar).toBe(true);
    }
  });
  it('marks the therapist director as a therapist', () => {
    expect(TESTIMONIALS.find((t) => t.id === 'chandrashekhar')?.audience).toBe('therapist');
  });
});
