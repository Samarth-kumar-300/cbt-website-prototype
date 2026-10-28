import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { stepTrigger, STEP_TRIGGER, STEP_TRIGGER_TOUCH } from '@/components/shared/scroll-steps';
import { PinnedStages } from '@/components/shared/ScrollStages';
import { EarlyDifferenceCards } from '@/components/pages/parents/EarlyDifferenceCards';

function mockMedia(matching: (q: string) => boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: matching(q),
    media: q,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }));
  window.matchMedia = globalThis.matchMedia;
}

afterEach(() => vi.unstubAllGlobals());

describe('stepTrigger', () => {
  it('uses the earlier/later window on narrow screens and the desktop one otherwise', () => {
    mockMedia((q) => q.includes('max-width: 1023px'));
    expect(stepTrigger()).toBe(STEP_TRIGGER_TOUCH);
    mockMedia(() => false);
    expect(stepTrigger()).toBe(STEP_TRIGGER);
  });
});

describe('PinnedStages', () => {
  it('falls back to flow (no pin, every stage open) under reduced motion', () => {
    mockMedia((q) => q.includes('prefers-reduced-motion: reduce'));
    let seen: { active: number; flow: boolean } | null = null;
    render(
      <PinnedStages count={3}>
        {(active, flow) => {
          seen = { active, flow };
          return <p>stages</p>;
        }}
      </PinnedStages>,
    );
    expect(seen).toEqual({ active: 0, flow: true });
    expect(document.querySelector('.sticky')).toBeNull();
  });
});

describe('EarlyDifferenceCards (phones)', () => {
  it('opens exactly one card at a time when tapped', () => {
    render(<EarlyDifferenceCards />);
    const buttons = screen.getAllByRole('button');
    const expanded = () => buttons.filter((b) => b.getAttribute('aria-expanded') === 'true');
    expect(expanded()).toHaveLength(1); // first card starts open
    fireEvent.click(buttons[2]);
    expect(expanded()).toEqual([buttons[2]]);
    fireEvent.click(buttons[2]);
    expect(expanded()).toHaveLength(0); // tapping the open card closes it
  });
});
