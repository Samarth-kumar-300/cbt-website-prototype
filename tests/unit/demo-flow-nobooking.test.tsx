import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fillDemoForm } from './demo-helpers';

vi.mock('@/lib/demo-config', () => ({ CALENDLY_URL: '' }));
vi.mock('@/lib/demo-submit', () => ({ submitDemoRequest: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/lib/analytics', () => ({ track: vi.fn() }));
vi.mock('@/lib/calendly', async (importOriginal) => ({ ...(await importOriginal<typeof import('@/lib/calendly')>()), loadCalendly: vi.fn() }));

import { DemoFlow } from '@/components/pages/try-demo/DemoFlow';
import { track } from '@/lib/analytics';
import { loadCalendly } from '@/lib/calendly';

afterEach(cleanup);

async function reachBooking() {
  const user = userEvent.setup();
  render(<DemoFlow plan={null} />);
  await fillDemoForm(user);
  await user.click(screen.getByRole('button', { name: 'Submit & Book' }));
  await screen.findByRole('button', { name: 'Book a time' });
  return user;
}

describe('DemoFlow without a Calendly link (prototype)', () => {
  it('still offers the booking step and opens the sample calendar, never Calendly', async () => {
    const user = await reachBooking();
    await user.click(screen.getByRole('button', { name: 'Book a time' }));
    const dialog = await screen.findByRole('dialog', { name: 'Pick a time' });
    expect(within(dialog).getByText(/Sample times for the prototype/)).toBeInTheDocument();
    expect(loadCalendly).not.toHaveBeenCalled();
  });

  it('books once a date and a time are chosen, then shows "Demo booked"', async () => {
    const user = await reachBooking();
    await user.click(screen.getByRole('button', { name: 'Book a time' }));
    const dialog = await screen.findByRole('dialog', { name: 'Pick a time' });
    const confirm = within(dialog).getByRole('button', { name: 'Confirm time' });
    expect(confirm).toBeDisabled();
    await user.click(within(dialog).getAllByRole('button', { pressed: false })[0]);
    expect(confirm).toBeDisabled();
    await user.click(within(dialog).getByRole('button', { name: '11:30 am' }));
    expect(confirm).toBeEnabled();
    await user.click(confirm);
    expect(await screen.findByRole('heading', { name: 'Demo booked' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(track).toHaveBeenCalledWith('demo_booked');
  });

  it('closes on Close or Escape and returns to the booking card', async () => {
    const user = await reachBooking();
    await user.click(screen.getByRole('button', { name: 'Book a time' }));
    await screen.findByRole('dialog');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByRole('button', { name: 'Book a time' })).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Book a time' }));
    await user.click(within(await screen.findByRole('dialog')).getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('has no way to skip booking: there is no Book later', async () => {
    await reachBooking();
    expect(screen.queryByRole('button', { name: /book later/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /case stud/i })).toBeNull();
  });
});
