import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parsePlan } from '@/lib/demo-plan';

describe('parsePlan', () => {
  it('accepts exactly basic and custom', () => {
    expect(parsePlan('basic')).toBe('basic');
    expect(parsePlan('custom')).toBe('custom');
  });
  it('rejects anything else without throwing', () => {
    for (const v of [undefined, null, '', 'BASIC', ' basic', 'pro', 'basic ', [], ['nope']]) {
      expect(parsePlan(v as string | string[] | null | undefined), String(v)).toBeNull();
    }
  });
  it('uses the first value when the parameter is repeated', () => {
    expect(parsePlan(['custom', 'basic'])).toBe('custom');
  });
});

// lib/demo-plan.ts is imported by Server Components (app/try-demo/page.tsx). It must stay free of
// imports: any import here can pull a client-only module (React hooks) into the server bundle and
// break `next build`. This guard fails if an import is added.
describe('demo-plan.ts server safety', () => {
  it('has no import statements and no module specifiers', () => {
    const source = readFileSync(resolve(process.cwd(), 'lib/demo-plan.ts'), 'utf8');
    expect(source).not.toMatch(/\bimport\s/);
    expect(source).not.toContain("from '");
  });
});
