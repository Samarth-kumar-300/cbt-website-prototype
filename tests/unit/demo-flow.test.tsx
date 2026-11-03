import { act, cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fillDemoForm } from './demo-helpers';

const h = vi.hoisted(() => ({ onBooked: () => {}, onFailed: () => {} }));
const gates = vi.hoisted(() => ({ LIVE_PAGES: { caseStudies: false } }));

vi.mock('@/lib/demo-config', () => ({ CALENDLY_URL: 'https://calendly.com/test/demo' }));
vi.mock('@/lib/demo-submit', () => ({ submitDemoRequest: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/lib/analytics', () => ({ track: vi.fn() }));
vi.mock('@/lib/launch-gates', () => gates);
vi.mock('@/components/pages/try-demo/Calendly', () => ({
  Calendly: ({ onBooked, onFailed }: { onBooked: () => void; onFailed: () => void }) => {
    h.onBooked = onBooked;
    h.onFailed = onFailed;
    return <p>calendar</p>;
  },
}));

import { DemoFlow } from '@/components/pages/try-demo/DemoFlow';
import { track } from '@/lib/analytics';

const tracked = (name: string) => vi.mocked(track).mock.calls.filter(([e]) => e === name);

async function reachSchedule(plan: 'basic' | 'custom' | null = null) {
  const user = userEvent.setup();
  render(<DemoFlow plan={plan} />);
  await fillDemoForm(user);
  await user.click(screen.getByRole('button', { name: 'Submit & Book' }));
  await screen.findByRole('heading', { name: 'Demo request received' });
  return user;
}

beforeEach(() => {
  vi.mocked(track).mockClear();
  gates.LIVE_PAGES.caseStudies = false;
});
afterEach(cleanup);

describe('DemoFlow', () => {
  it('moves from the form to the booking step, focuses its heading and tracks the submit', async () => {
    await reachSchedule('basic');
    expect(screen.getByRole('heading', { name: 'Demo request received' })).toHaveFocus();
    expect(screen.getByText('Pick a time that suits you.')).toBeInTheDocument();
    expect(screen.getByText('calendar')).toBeInTheDocument();
    expect(track).toHaveBeenCalledWith('demo_submitted', { plan: 'basic' });
    const steps = within(screen.getByRole('list', { name: 'Progress' })).getAllByRole('listitem');
    expect(steps).toHaveLength(3);
    expect(steps[1]).toHaveAttribute('aria-current', 'step');
  });

  it('shows "Demo booked" once when the booking message arrives twice', async () => {
    await reachSchedule();
    act(() => {
      h.onBooked();
      h.onBooked();
    });
    expect(await screen.findByRole('heading', { name: 'Demo booked' })).toBeInTheDocument();
    expect(screen.getByText('Our team will get back to you in 2 to 3 business days.')).toBeInTheDocument();
    expect(tracked('demo_booked')).toHaveLength(1);
    expect(tracked('demo_skipped')).toHaveLength(0);
  });

  it('ends on "Request received" when the visitor chooses Book later', async () => {
    const user = await reachSchedule();
    await user.click(screen.getByRole('button', { name: 'Book later' }));
    expect(await screen.findByRole('heading', { name: 'Request received' })).toBeInTheDocument();
    expect(tracked('demo_skipped')).toHaveLength(1);
  });

  it('treats a failed Calendly load like Book later', async () => {
    await reachSchedule();
    act(() => h.onFailed());
    expect(await screen.findByRole('heading', { name: 'Request received' })).toBeInTheDocument();
  });

  it('sends the visitor home while case studies are not live, and to them once they are', async () => {
    await reachSchedule();
    act(() => h.onBooked());
    expect(await screen.findByRole('link', { name: 'Back to homepage' })).toHaveAttribute('href', '/');
    cleanup();
    gates.LIVE_PAGES.caseStudies = true;
    await reachSchedule();
    act(() => h.onBooked());
    expect(await screen.findByRole('link', { name: 'Read case studies' })).toHaveAttribute('href', '/case-studies');
  });
});
