import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CookieBanner } from '@/components/shared/CookieBanner';
import { COOKIE_KEY } from '@/components/shared/cookie-key';

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
