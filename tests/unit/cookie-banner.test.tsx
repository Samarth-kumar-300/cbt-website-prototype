import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CookieBanner } from '@/components/shared/CookieBanner';
import { COOKIE_KEY } from '@/components/shared/cookie-key';
import './freeze-gsap';

beforeEach(() => localStorage.clear());
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('CookieBanner', () => {
  it('shows when no choice is stored', async () => {
    render(<CookieBanner />);
    expect(await screen.findByText('We value your privacy')).toBeInTheDocument();
  });
  it('stores accept and hides', async () => {
    render(<CookieBanner />);
    await userEvent.click(await screen.findByRole('button', { name: 'Accept all' }));
    expect(localStorage.getItem(COOKIE_KEY)).toBe('accepted');
    await waitFor(() => expect(screen.queryByText('We value your privacy')).toBeNull());
  });
  it('stores reject, and the close button counts as reject', async () => {
    const { unmount } = render(<CookieBanner />);
    await userEvent.click(await screen.findByRole('button', { name: 'Reject all' }));
    expect(localStorage.getItem(COOKIE_KEY)).toBe('rejected');
    unmount();
    localStorage.clear();
    render(<CookieBanner />);
    await userEvent.click(await screen.findByRole('button', { name: /close/i }));
    expect(localStorage.getItem(COOKIE_KEY)).toBe('rejected');
  });
  it('stays hidden when a choice already exists', () => {
    localStorage.setItem(COOKIE_KEY, 'accepted');
    render(<CookieBanner />);
    expect(screen.queryByText('We value your privacy')).toBeNull();
  });
  it('still renders and does not crash when localStorage throws', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<CookieBanner />);
    await userEvent.click(await screen.findByRole('button', { name: 'Accept all' }));
    await waitFor(() => expect(screen.queryByText('We value your privacy')).toBeNull());
  });
});

describe('CookieBanner exit', () => {
  it('keeps the banner mounted with the leaving class for 250ms, then removes it', async () => {
    vi.useFakeTimers();
    try {
      localStorage.clear();
      render(<CookieBanner />);
      await act(async () => {});
      const dialog = screen.getByRole('dialog', { name: 'Cookie preferences' });
      await act(async () => {
        screen.getByRole('button', { name: 'Accept all' }).click();
      });
      expect(screen.getByRole('dialog', { name: 'Cookie preferences' }).className).toContain('cookie-out');
      expect(dialog.isConnected).toBe(true);
      await act(async () => {
        vi.advanceTimersByTime(260);
      });
      expect(screen.queryByRole('dialog', { name: 'Cookie preferences' })).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });

  it('removes the banner at once when the visitor prefers reduced motion', async () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} }));
    localStorage.clear();
    render(<CookieBanner />);
    await act(async () => {});
    await act(async () => {
      screen.getByRole('button', { name: 'Accept all' }).click();
    });
    expect(screen.queryByRole('dialog', { name: 'Cookie preferences' })).toBeNull();
    vi.unstubAllGlobals();
  });
});

describe('CookieBanner details toggle', () => {
  function mockMotion(reduce: boolean) {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: reduce && q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
  }
  const copy = () => screen.getByRole('dialog', { name: 'Cookie preferences' }).querySelector('p.relative') as HTMLElement;
  afterEach(() => vi.unstubAllGlobals());

  it('clamps the copy to two lines on phones until Details is pressed, and the words never change', async () => {
    mockMotion(true);
    render(<CookieBanner />);
    await screen.findByText('We value your privacy');
    const text = copy().textContent;
    expect(copy().className).toContain('line-clamp-2');
    const details = screen.getByRole('button', { name: 'Details' });
    expect(details).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(details);
    expect(screen.getByRole('button', { name: 'Less' })).toHaveAttribute('aria-expanded', 'true');
    expect(copy().className).not.toContain('line-clamp-2');
    await userEvent.click(screen.getByRole('button', { name: 'Less' }));
    expect(copy().className).toContain('line-clamp-2');
    expect(copy().textContent).toBe(text);
  });

  it('lifts the clamp at once and clips the copy while it eases open', async () => {
    mockMotion(false);
    render(<CookieBanner />);
    await screen.findByText('We value your privacy');
    await userEvent.click(screen.getByRole('button', { name: 'Details' }));
    expect(copy().className).not.toContain('line-clamp-2');
    expect(copy().style.overflow).toBe('hidden');
    expect(screen.getByRole('button', { name: 'Less' })).toHaveAttribute('aria-expanded', 'true');
  });
});
