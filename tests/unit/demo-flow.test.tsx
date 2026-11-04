import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fillDemoForm } from './demo-helpers';

const URL = 'https://calendly.com/test/demo';

vi.mock('@/lib/demo-config', () => ({ CALENDLY_URL: 'https://calendly.com/test/demo' }));
vi.mock('@/lib/demo-submit', () => ({ submitDemoRequest: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/lib/analytics', () => ({ track: vi.fn() }));
const push = vi.fn();
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
vi.mock('@/lib/calendly', async (importOriginal) => {
  const real = await importOriginal<typeof import('@/lib/calendly')>();
  return { ...real, loadCalendly: vi.fn() };
});

import { DemoFlow } from '@/components/pages/try-demo/DemoFlow';
import { track } from '@/lib/analytics';
import { loadCalendly } from '@/lib/calendly';

const load = vi.mocked(loadCalendly);
const popup = vi.fn();
const close = vi.fn();
const tracked = (name: string) => vi.mocked(track).mock.calls.filter(([e]) => e === name);
const fromCalendly = (data: unknown, origin = 'https://calendly.com') =>
  act(() => {
    window.dispatchEvent(new MessageEvent('message', { origin, data }));
  });

async function reachSchedule(plan: 'basic' | 'custom' | null = null) {
  const user = userEvent.setup();
  render(<DemoFlow plan={plan} />);
  await fillDemoForm(user);
  await user.click(screen.getByRole('button', { name: 'Submit & Book' }));
  await screen.findByRole('button', { name: 'Book a time' });
  return user;
}

beforeEach(() => {
  vi.mocked(track).mockClear();
  popup.mockReset();
  close.mockReset();
  push.mockReset();
  load.mockReset();
  load.mockResolvedValue(undefined);
  (window as unknown as { Calendly: unknown }).Calendly = { initPopupWidget: popup, closePopupWidget: close };
});
afterEach(() => {
  vi.useRealTimers();
  cleanup();
  Reflect.deleteProperty(window, 'Calendly');
});

describe('DemoFlow', () => {
  it('confirms the request, prompts for a time and tracks the submit', async () => {
    await reachSchedule('basic');
    expect(screen.getByRole('heading', { name: 'Request received' })).toHaveFocus();
    expect(screen.getByText('Choose a time and we’ll set up your demo.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /book later/i })).toBeNull();
    expect(track).toHaveBeenCalledWith('demo_submitted', { plan: 'basic' });
    expect(screen.queryByRole('list', { name: 'Progress' })).toBeNull();
    // Calendly is not loaded until the visitor asks for it.
    expect(load).not.toHaveBeenCalled();
  });

  it('opens Calendly as a popup with the visitor details when they click Book a time', async () => {
    const user = await reachSchedule();
    await user.click(screen.getByRole('button', { name: 'Book a time' }));
    await waitFor(() => expect(popup).toHaveBeenCalledTimes(1));
    expect(popup.mock.calls[0][0]).toMatchObject({ url: URL, prefill: { name: 'Asha Rao', email: 'asha@example.com' } });
  });

  it('closes the popup and says "Demo booked" once, even when the booking message arrives twice', async () => {
    await reachSchedule();
    fromCalendly({ event: 'calendly.event_scheduled' });
    fromCalendly({ event: 'calendly.event_scheduled' });
    expect(await screen.findByRole('heading', { name: 'Demo booked' })).toBeInTheDocument();
    expect(screen.getByText('We’re excited to give you a demo. Check your email for the invite.')).toBeInTheDocument();
    expect(close).toHaveBeenCalledTimes(1);
    expect(tracked('demo_booked')).toHaveLength(1);
  });

  it('ignores a booking message from another origin or another Calendly event', async () => {
    await reachSchedule();
    fromCalendly({ event: 'calendly.event_scheduled' }, 'https://evil.example');
    fromCalendly({ event: 'calendly.page_height' });
    expect(screen.queryByRole('heading', { name: 'Demo booked' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Book a time' })).toBeInTheDocument();
  });

  it('keeps the visitor on the booking step with a clear message when Calendly fails to load, and lets them retry', async () => {
    load.mockRejectedValueOnce(new Error('blocked'));
    const user = await reachSchedule();
    await user.click(screen.getByRole('button', { name: 'Book a time' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('The calendar didn’t load. Try again, or we’ll email you.');
    await user.click(screen.getByRole('button', { name: 'Book a time' }));
    await waitFor(() => expect(popup).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
  });

  it('treats a script that loads without defining Calendly as a failed load', async () => {
    Reflect.deleteProperty(window, 'Calendly');
    const user = await reachSchedule();
    await user.click(screen.getByRole('button', { name: 'Book a time' }));
    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(popup).not.toHaveBeenCalled();
  });

  it('never sends the visitor to case studies after a booking', async () => {
    await reachSchedule();
    fromCalendly({ event: 'calendly.event_scheduled' });
    expect(await screen.findByRole('link', { name: 'Back to homepage' })).toHaveAttribute('href', '/');
    expect(screen.queryByRole('link', { name: /case stud/i })).toBeNull();
  });

  it('counts down from 3 and sends the visitor to the homepage', async () => {
    await reachSchedule();
    vi.useFakeTimers();
    fromCalendly({ event: 'calendly.event_scheduled' });
    expect(screen.getByText(/Taking you to the homepage in/)).toHaveTextContent('3s');
    // Each tick is scheduled after the previous render, so step one second at a time.
    for (let i = 0; i < 2; i++) act(() => void vi.advanceTimersByTime(1000));
    expect(screen.getByText(/Taking you to the homepage in/)).toHaveTextContent('1s');
    expect(push).not.toHaveBeenCalled();
    act(() => void vi.advanceTimersByTime(1000));
    expect(push).toHaveBeenCalledExactlyOnceWith('/');
  });
});
