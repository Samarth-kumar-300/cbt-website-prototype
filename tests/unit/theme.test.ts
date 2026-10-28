import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync('app/globals.css', 'utf8');

const TOKENS: Record<string, string> = {
  '--color-brand-teal': '#175f63',
  '--color-brand-teal-100': '#ddf3f4',
  '--color-brand-dark': '#10494c',
  '--color-content-brand': '#207d82',
  '--color-content-brand-alt': '#20797d',
  '--color-content-brand-secondary': '#a14da5',
  '--color-content-secondary': '#6b7280',
  '--color-content-knockout': '#ffffff',
  '--color-brand-subtle-bg': '#f1f8f8',
  '--color-background-brand-subtle': '#eef9f9',
  '--color-text-default': '#101319',
  '--color-text-secondary': '#374151',
  '--color-text-muted': '#5b5563',
  '--color-border-subtle': '#e4edea',
  '--color-bullet-marker': '#93c4bc',
  '--color-carousel-dot-inactive': '#c6c6c6',
  '--color-error': '#cd423a',
};

describe('theme tokens', () => {
  for (const [name, value] of Object.entries(TOKENS)) {
    it(`defines ${name}`, () => {
      expect(css).toMatch(new RegExp(`${name}:\\s*${value}`, 'i'));
    });
  }
  it('defines the hero gradient', () => {
    expect(css).toContain('--gradient-hero:');
    expect(css).toContain('rgba(147, 229, 125, 0.15)');
    expect(css).toContain('rgba(93, 198, 243, 0.15)');
    expect(css).toContain('rgba(181, 90, 186, 0.15)');
  });
  it('maps heading and body fonts', () => {
    expect(css).toMatch(/--font-heading:[^;]*--font-nunito/);
    expect(css).toMatch(/--font-sans:[^;]*--font-open-sans/);
  });
  it('sets the body font from the next/font variable, not the unemitted --font-sans', () => {
    // --font-sans lives in `@theme inline`, so Tailwind inlines it into utilities and
    // never emits it as a :root variable. var(--font-sans) on body resolves to nothing.
    const body = css.match(/(?:^|\n)body\s*\{([^}]*)\}/)?.[1] ?? '';
    const family = body.match(/font-family:\s*([^;]+);/)?.[1] ?? '';
    expect(family).not.toBe('');
    expect(family).not.toContain('var(--font-sans)');
    expect(family).toContain('--font-open-sans');
  });
});
