import { vi } from 'vitest';

// jsdom has no matchMedia and GSAP's ScrollTrigger calls it when the module loads, so the stub
// must exist before the imports below run. It reports "no match" so no animation starts.
vi.hoisted(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }),
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextReveal } from '@/components/shared/TextReveal';

describe('TextReveal props', () => {
  it('renders the heading text unchanged when media is set', () => {
    render(
      <TextReveal as="h2" split="words" trigger="scroll" media="(min-width: 1024px)">
        Growth looks different for every child
      </TextReveal>,
    );
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('Growth looks different for every child');
  });

  it('passes className and style through to the heading', () => {
    render(
      <TextReveal as="h2" split="words" trigger="scroll" className="text-brand-teal" style={{ color: 'rgb(1, 2, 3)' }}>
        Frequently Asked Questions
      </TextReveal>,
    );
    const h = screen.getByRole('heading', { level: 2 });
    expect(h.className).toBe('text-brand-teal');
    expect(h.style.color).toBe('rgb(1, 2, 3)');
  });
});
