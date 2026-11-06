import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SKILLS } from '@/lib/skills';

describe('SKILLS', () => {
  it('lists the ten skill cards in the Therapy Centres order', () => {
    expect(SKILLS.map((s) => s.title)).toEqual([
      'Reading & Writing', 'Arithmetic Skill', 'Visual Skill', 'Social Skill', 'Play Skill',
      'Self-Help Skill', 'Attending Skill', 'Imitation Skill', 'Receptive Skill', 'Expressive Skill',
    ]);
  });
  it('points every card at an image that exists, with alt text and a description', () => {
    for (const s of SKILLS) {
      expect(existsSync(`public${s.image}`), s.image).toBe(true);
      expect(s.alt).toBe(`${s.title} illustration`);
      expect(s.body.length).toBeGreaterThan(10);
    }
  });
});
