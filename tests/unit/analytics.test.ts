import { afterEach, describe, expect, it } from 'vitest';
import { track } from '@/lib/analytics';

afterEach(() => Reflect.deleteProperty(window, 'dataLayer'));

describe('track', () => {
  it('pushes the event and params to dataLayer when it exists', () => {
    const layer: unknown[] = [];
    (window as unknown as { dataLayer: unknown[] }).dataLayer = layer;
    track('demo_submitted', { plan: 'basic' });
    expect(layer).toEqual([{ event: 'demo_submitted', plan: 'basic' }]);
  });
  it('does nothing, and does not throw, when there is no dataLayer', () => {
    expect(() => track('demo_booked')).not.toThrow();
  });
});
