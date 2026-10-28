import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RevealStagger } from '@/components/shared/RevealStagger';

type Cb = (entries: { isIntersecting: boolean }[]) => void;
let trigger: Cb | null = null;

beforeEach(() => {
  trigger = null;
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: Cb) {
        trigger = cb;
      }
      observe() {}
      disconnect() {}
    },
  );
});

describe('RevealStagger', () => {
  it('renders every child in the markup and marks the group pending after mount', () => {
    render(
      <RevealStagger>
        <p>One</p>
        <p>Two</p>
      </RevealStagger>,
    );
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
    expect(screen.getByText('One').parentElement!.getAttribute('data-reveal-group')).toBe('pending');
  });

  it('moves to shown when the group intersects', () => {
    render(
      <RevealStagger>
        <p>One</p>
      </RevealStagger>,
    );
    act(() => trigger!([{ isIntersecting: true }]));
    expect(screen.getByText('One').parentElement!.getAttribute('data-reveal-group')).toBe('shown');
  });

  it('adds no attribute when IntersectionObserver is unavailable, so children stay visible', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(
      <RevealStagger>
        <p>One</p>
      </RevealStagger>,
    );
    expect(screen.getByText('One').parentElement!.getAttribute('data-reveal-group')).toBeNull();
  });

  it('keeps the className alongside reveal-group', () => {
    render(
      <RevealStagger className="grid gap-4">
        <p>One</p>
      </RevealStagger>,
    );
    const group = screen.getByText('One').parentElement!;
    expect(group.className).toContain('reveal-group');
    expect(group.className).toContain('grid gap-4');
  });
});
