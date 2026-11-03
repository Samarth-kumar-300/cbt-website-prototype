import { beforeEach, describe, expect, it, vi } from 'vitest';
import { isScheduledEvent } from '@/lib/calendly';

const SRC = 'https://assets.calendly.com/assets/external/widget.js';

describe('isScheduledEvent', () => {
  it('is true for the booking event from calendly.com', () => {
    expect(isScheduledEvent({ origin: 'https://calendly.com', data: { event: 'calendly.event_scheduled' } })).toBe(true);
  });
  it('ignores the same event from another origin', () => {
    expect(isScheduledEvent({ origin: 'https://evil.example', data: { event: 'calendly.event_scheduled' } })).toBe(false);
    expect(isScheduledEvent({ origin: 'https://calendly.com.evil.example', data: { event: 'calendly.event_scheduled' } })).toBe(false);
  });
  it('ignores other Calendly events and malformed data', () => {
    expect(isScheduledEvent({ origin: 'https://calendly.com', data: { event: 'calendly.date_and_time_selected' } })).toBe(false);
    for (const data of [null, undefined, 'calendly.event_scheduled', 42, {}]) {
      expect(isScheduledEvent({ origin: 'https://calendly.com', data }), String(data)).toBe(false);
    }
  });
});

describe('loadCalendly', () => {
  beforeEach(() => {
    vi.resetModules();
    document.head.innerHTML = '';
    Reflect.deleteProperty(window, 'Calendly');
  });
  it('adds the script once for concurrent calls and resolves on load', async () => {
    const { loadCalendly } = await import('@/lib/calendly');
    const a = loadCalendly();
    const b = loadCalendly();
    const scripts = document.querySelectorAll(`script[src="${SRC}"]`);
    expect(scripts).toHaveLength(1);
    scripts[0].dispatchEvent(new Event('load'));
    await expect(Promise.all([a, b])).resolves.toBeDefined();
  });
  it('rejects, removes the script and lets a later call try again after an error', async () => {
    const { loadCalendly } = await import('@/lib/calendly');
    const first = loadCalendly();
    document.querySelector(`script[src="${SRC}"]`)!.dispatchEvent(new Event('error'));
    await expect(first).rejects.toThrow();
    expect(document.querySelectorAll(`script[src="${SRC}"]`)).toHaveLength(0);
    void loadCalendly();
    expect(document.querySelectorAll(`script[src="${SRC}"]`)).toHaveLength(1);
  });
  it('resolves at once, without a script, when Calendly is already on the page', async () => {
    (window as unknown as { Calendly: unknown }).Calendly = { initInlineWidget() {} };
    const { loadCalendly } = await import('@/lib/calendly');
    await expect(loadCalendly()).resolves.toBeUndefined();
    expect(document.querySelectorAll('script')).toHaveLength(0);
  });
});
