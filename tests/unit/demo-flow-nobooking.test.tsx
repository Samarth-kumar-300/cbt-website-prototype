import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fillDemoForm } from './demo-helpers';

vi.mock('@/lib/demo-config', () => ({ CALENDLY_URL: '' }));
vi.mock('@/lib/demo-submit', () => ({ submitDemoRequest: vi.fn().mockResolvedValue(undefined) }));
vi.mock('@/lib/analytics', () => ({ track: vi.fn() }));

import { DemoFlow } from '@/components/pages/try-demo/DemoFlow';

afterEach(cleanup);

describe('DemoFlow without a Calendly link', () => {
  it('skips the booking step and ends on "Request received"', async () => {
    const user = userEvent.setup();
    render(<DemoFlow plan={null} />);
    expect(within(screen.getByRole('list', { name: 'Progress' })).getAllByRole('listitem')).toHaveLength(2);
    await fillDemoForm(user);
    await user.click(screen.getByRole('button', { name: 'Submit & Book' }));
    expect(await screen.findByRole('heading', { name: 'Request received' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Demo request received' })).toBeNull();
  });
});
