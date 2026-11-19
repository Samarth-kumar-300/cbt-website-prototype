import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fillDemoForm } from './demo-helpers';

vi.mock('@/lib/demo-config', () => ({ CALENDLY_URL: 'https://calendly.com/test/demo' }));
vi.mock('@/lib/demo-submit', () => ({ submitDemoRequest: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/lib/analytics', () => ({ track: vi.fn() }));

import { CaptchaField } from '@/components/shared/CaptchaField';
import { ContactForm } from '@/components/pages/contact-us/ContactForm';
import { DemoFlow } from '@/components/pages/try-demo/DemoFlow';
import { clearBooking } from '@/lib/demo-booking';
import './freeze-gsap';

// jsdom has no matchMedia. `reduce` answers the reduced-motion query; `coarse` answers the pointer query.
function mockMedia({ reduce = false, coarse = false } = {}) {
  window.matchMedia = vi.fn().mockImplementation((q: string) => ({
    matches: (reduce && q.includes('reduce')) || (coarse && q.includes('coarse')),
    media: q,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

beforeEach(() => {
  sessionStorage.clear();
  clearBooking();
  mockMedia();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

async function reachSchedule() {
  const user = userEvent.setup();
  const view = render(<DemoFlow plan={null} />);
  const card = view.container.firstElementChild as HTMLElement;
  const before = card.getAttribute('style');
  await fillDemoForm(user);
  await user.click(screen.getByRole('button', { name: 'Submit & Book' }));
  await screen.findByRole('button', { name: 'Book a time' });
  return { card, before };
}

describe('Try-demo step change motion', () => {
  it('leaves the first render untouched, then eases the card and rises the new step when the step changes', async () => {
    const { card, before } = await reachSchedule();
    expect(before).toBeNull();
    // The height tween has started from the old height and the card clips while it runs.
    expect(card.style.overflow).toBe('hidden');
    expect(card.style.height).not.toBe('');
    // The icon plays its own pop; the text and button rise.
    const icon = card.querySelector<HTMLElement>('[data-success-icon]')!;
    expect(icon.style.opacity).toBe('0');
    expect(screen.getByRole('heading', { name: 'Request received' }).parentElement!.style.opacity).toBe('0');
    // Focus and the heading are available immediately, not after the animation.
    expect(screen.getByRole('heading', { name: 'Request received' })).toHaveFocus();
  });

  it('snaps with no inline styles under reduced motion', async () => {
    mockMedia({ reduce: true });
    const { card } = await reachSchedule();
    expect(card.getAttribute('style')).toBeNull();
    expect(card.querySelector('[data-success-icon]')!.getAttribute('style')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Request received' })).toHaveFocus();
  });
});

describe('Contact form motion', () => {
  it('gives error text the error-in class and keeps role alert and the exact text', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole('button', { name: /submit|send/i }));
    const alert = (await screen.findAllByRole('alert')).find((a) => a.textContent === 'First Name is required')!;
    expect(alert).toHaveClass('error-in');
    expect(alert).toHaveAttribute('id', 'firstName-error');
    // The wrapper is easing open (height 0 to auto) while the text sits inside it.
    expect(alert.parentElement!.style.overflow).toBe('hidden');
  });

  it('adds no inline styles to error text or the Please specify field under reduced motion', async () => {
    mockMedia({ reduce: true });
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole('button', { name: /submit|send/i }));
    const alert = (await screen.findAllByRole('alert'))[0];
    expect(alert.parentElement!.getAttribute('style')).toBeNull();
    await user.click(screen.getByRole('button', { name: /^Professional\/Parent:/ }));
    await user.click(screen.getByRole('option', { name: 'Others' }));
    expect(screen.getByLabelText(/^Please specify/).parentElement!.getAttribute('style')).toBeNull();
  });

  it('eases the Please specify field open when motion is allowed', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole('button', { name: /^Professional\/Parent:/ }));
    await user.click(screen.getByRole('option', { name: 'Others' }));
    expect(screen.getByLabelText(/^Please specify/).parentElement!.style.overflow).toBe('hidden');
  });

  it('scrolls a focused field smoothly on touch, and instantly under reduced motion', () => {
    vi.useFakeTimers();
    const scroll = vi.fn();
    Element.prototype.scrollIntoView = scroll;
    mockMedia({ coarse: true });
    const first = render(<ContactForm />);
    fireEvent.focus(screen.getByLabelText(/^First Name/));
    act(() => void vi.advanceTimersByTime(350));
    expect(scroll).toHaveBeenLastCalledWith({ block: 'center', behavior: 'smooth' });
    first.unmount();
    mockMedia({ coarse: true, reduce: true });
    render(<ContactForm />);
    fireEvent.focus(screen.getByLabelText(/^First Name/));
    act(() => void vi.advanceTimersByTime(350));
    expect(scroll).toHaveBeenLastCalledWith({ block: 'center', behavior: 'auto' });
  });
});

describe('CaptchaField refresh spin', () => {
  const props = { labelClass: '', inputProps: { id: 'captcha-input' } };

  it('still calls onRefresh, keeps the code, and spins the icon a full turn more on each press', async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();
    render(<CaptchaField {...props} onRefresh={onRefresh} />);
    const button = screen.getByRole('button', { name: 'Refresh code' });
    const icon = button.querySelector('svg')!;
    await user.click(button);
    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText('Code: V K N B 6 2')).toHaveTextContent('VKNB62');
    await waitFor(() => expect(icon.style.transform).toContain('rotate'));
    await user.click(button);
    await user.click(button);
    expect(onRefresh).toHaveBeenCalledTimes(3);
  });

  it('does not spin under reduced motion', async () => {
    mockMedia({ reduce: true });
    const user = userEvent.setup();
    const onRefresh = vi.fn();
    render(<CaptchaField {...props} onRefresh={onRefresh} />);
    const button = screen.getByRole('button', { name: 'Refresh code' });
    await user.click(button);
    expect(onRefresh).toHaveBeenCalledTimes(1);
    expect(button.querySelector('svg')!.getAttribute('style')).toBeNull();
  });

  it('gives its inline error the error-in class and keeps role alert', () => {
    render(<CaptchaField {...props} error="Enter code shown is required" onRefresh={() => {}} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveClass('error-in');
    expect(alert).toHaveTextContent('Enter code shown is required');
  });
});
