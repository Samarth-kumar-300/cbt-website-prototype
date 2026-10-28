import { describe, expect, it } from 'vitest';
import { toTsModule } from '../../tools/lib/content.mjs';

const sections = [
  { index: 0, id: '', h1: ['Hello'], h2: [], h3: [], p: ['Intro'], links: [{ text: 'Go', href: '/x' }], buttons: [], imgs: [{ src: 'a', alt: 'A', w: 10, h: 5, ratio: 2 }], className: 'x' },
];

describe('toTsModule', () => {
  it('emits a typed sections export without layout noise', () => {
    const out = toTsModule(sections, []);
    expect(out).toContain('export const sections =');
    expect(out).toContain('as const;');
    expect(out).toContain('"Hello"');
    expect(out).not.toContain('className');
    expect(out).toContain('"ratio": 2');
  });
  it('emits the faq export', () => {
    const out = toTsModule(sections, [{ q: 'Q1?', a: 'A1.' }]);
    expect(out).toContain('export const faq =');
    expect(out).toContain('"Q1?"');
  });
});
