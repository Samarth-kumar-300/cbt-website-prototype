import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { sections } from '@/components/pages/home/content';
import {
  JOURNEY_EYEBROW,
  JOURNEY_HEADING,
  JOURNEY_SPARK_COLORS,
  JOURNEY_STEPS,
} from '@/components/pages/home/journey/steps';

const growth = sections.find((s) =>
  (s.h2 as readonly string[]).includes('One Connected Journey, Every Step of the Way'),
)!;
const p = growth.p as readonly string[];

describe('journey steps', () => {
  it('match the home copy exactly, in order', () => {
    expect(JOURNEY_EYEBROW).toBe(p[0]);
    expect(JOURNEY_HEADING).toBe(growth.h2[0]);
    expect(JOURNEY_STEPS.map((s) => s.title)).toEqual([1, 3, 5, 7, 9].map((i) => p[i]));
    expect(JOURNEY_STEPS.map((s) => s.body)).toEqual([2, 4, 6, 8, 10].map((i) => p[i]));
  });

  it('use the alt text of the five step images', () => {
    expect(JOURNEY_STEPS.map((s) => s.alt)).toEqual(growth.imgs.slice(1).map((i) => i.alt));
  });

  it('point at image files that exist', () => {
    for (const s of JOURNEY_STEPS) expect(existsSync(`public${s.src}`), s.src).toBe(true);
  });

  it('have unique ids and hex colours', () => {
    expect(new Set(JOURNEY_STEPS.map((s) => s.id)).size).toBe(5);
    for (const s of JOURNEY_STEPS) {
      expect(s.bg).toMatch(/^#[0-9a-f]{6}$/i);
      expect(s.border).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('has ten spark colours', () => {
    expect(JOURNEY_SPARK_COLORS).toHaveLength(10);
  });
});
