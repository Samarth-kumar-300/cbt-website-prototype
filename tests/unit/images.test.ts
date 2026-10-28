import { describe, expect, it } from 'vitest';
import { makeResolver, matchLocal, normalizeKey, srcKey } from '../../tools/lib/images.mjs';

const locals = [
  { file: 'herosection-01', path: '/images/homepage/herosection-01.webp' },
  { file: 'whatiscbt', path: '/images/homepage/whatiscbt.webp' },
  { file: 'steps01', path: '/images/homepage/steps01.webp' },
  { file: 'steps02', path: '/images/homepage/steps02.webp' },
];

describe('srcKey', () => {
  it('takes the file basename without extension, lower-cased', () => {
    expect(srcKey('https://bucket.s3.amazonaws.com/path/Hero_Section.webp')).toBe('hero_section');
  });
  it('unwraps next/image optimizer URLs', () => {
    expect(srcKey('/_next/image?url=https%3A%2F%2Fb.s3.amazonaws.com%2Fa%2FWhat_Is_CBT.webp&w=1200&q=75')).toBe('what_is_cbt');
  });
});

describe('srcKey robustness', () => {
  it('does not throw on malformed percent-encoding', () => {
    expect(srcKey('https://x/y/100%_Done.webp')).toBe('100%_done');
  });
});

describe('matchLocal', () => {
  it('matches ignoring punctuation and a trailing numeric suffix when unique', () => {
    expect(matchLocal({ key: 'hero_section', alt: '' }, locals)).toBe('/images/homepage/herosection-01.webp');
    expect(matchLocal({ key: 'x', alt: 'What_Is_CBT' }, locals)).toBe('/images/homepage/whatiscbt.webp');
  });
  it('prefers an exact match', () => {
    expect(matchLocal({ key: 'steps02', alt: '' }, locals)).toBe('/images/homepage/steps02.webp');
  });
  it('returns null when ambiguous or unknown', () => {
    expect(matchLocal({ key: 'steps', alt: '' }, locals)).toBeNull();
    expect(matchLocal({ key: 'nothing', alt: 'zzz' }, locals)).toBeNull();
  });
});

describe('makeResolver', () => {
  it('resolves through the manifest by src key and alt', () => {
    const r = makeResolver([{ key: 'a', alt: 'A', local: '/images/a.webp' }, { key: 'b', alt: 'B', local: null }]);
    expect(r({ src: 'https://x/y/a.webp', alt: 'A' })).toBe('/images/a.webp');
    expect(r({ src: 'https://x/y/b.webp', alt: 'B' })).toBeNull();
    expect(r({ src: 'https://x/y/c.webp', alt: '' })).toBeNull();
  });
});

describe('size-variant prefixes', () => {
  const U = 'https://b.s3.amazonaws.com/uploads/';
  it('normalizeKey strips one leading size-variant prefix', () => {
    for (const p of ['small_', 'medium_', 'large_', 'thumb_', 'thumbnail_']) {
      expect(normalizeKey(`${p}hero_final_abc123`)).toBe('hero_final_abc123');
    }
    expect(normalizeKey('Medium_Hero')).toBe('hero');
    expect(normalizeKey('hero_final_abc123')).toBe('hero_final_abc123');
    expect(normalizeKey('smallish_thing')).toBe('smallish_thing');
  });
  it('srcKey drops the prefix so prefixed and unprefixed URLs give the same key', () => {
    expect(srcKey(`${U}medium_Hero_Section_final_658d.webp`)).toBe('hero_section_final_658d');
    expect(srcKey(`${U}Hero_Section_final_658d.webp`)).toBe('hero_section_final_658d');
    expect(srcKey(`/_next/image?url=${encodeURIComponent(`${U}small_What_Is_CBT.webp`)}&w=640&q=75`)).toBe('what_is_cbt');
  });
  it('makeResolver matches an unprefixed section src against a prefixed manifest key and vice versa', () => {
    const prefixed = makeResolver([{ key: 'medium_hero_final_abc', alt: 'Hero', local: '/images/hero.webp' }]);
    expect(prefixed({ src: `${U}Hero_final_abc.webp`, alt: 'Hero' })).toBe('/images/hero.webp');
    expect(prefixed({ src: `${U}large_Hero_final_abc.webp`, alt: 'Hero' })).toBe('/images/hero.webp');
    const plain = makeResolver([{ key: 'hero_final_abc', alt: 'Hero', local: '/images/hero.webp' }]);
    expect(plain({ src: `${U}small_Hero_final_abc.webp`, alt: 'Hero' })).toBe('/images/hero.webp');
  });
});
