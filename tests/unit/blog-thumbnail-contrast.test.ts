import { describe, expect, it } from 'vitest';
import { COLORS, SURFACE_STOPS } from '@/components/pages/blog/thumbnail/tokens';

const lin = (c: number) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const luminance = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
};
const ratio = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const PAIRS: [string, string, string][] = [
  ['headline on the card', COLORS.ink, COLORS.white],
  ['headline accent on the card', COLORS.accent, COLORS.white],
  ['eyebrow on the card', COLORS.purple, COLORS.white],
  ['descriptor on the card', COLORS.body, COLORS.white],
  ['highlight text on purple', COLORS.white, COLORS.purple],
  ['chip text on white', COLORS.deep, COLORS.white],
  ...SURFACE_STOPS.map((stop): [string, string, string] => [`white text on the surface at ${stop}`, COLORS.white, stop]),
];

describe('thumbnail colour contrast', () => {
  it.each(PAIRS)('%s is at least 4.5:1', (_name, fg, bg) => {
    expect(ratio(fg, bg)).toBeGreaterThanOrEqual(4.5);
  });
});
