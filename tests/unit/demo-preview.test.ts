import { describe, expect, it } from 'vitest';
import { parsePreview } from '@/lib/demo-preview';

describe('parsePreview (temporary design-review switch)', () => {
  it('is off when the parameter is absent', () => {
    expect(parsePreview(undefined)).toBeNull();
  });
  it('turns on at the form for a bare or unknown value', () => {
    expect(parsePreview('')).toBe('form');
    expect(parsePreview('nope')).toBe('form');
  });
  it('starts on a named state, using the first value when repeated', () => {
    expect(parsePreview('booked')).toBe('booked');
    expect(parsePreview(['error', 'booked'])).toBe('error');
  });
});
