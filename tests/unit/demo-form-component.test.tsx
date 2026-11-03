import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fillDemoForm, pick } from './demo-helpers';

vi.mock('@/lib/demo-submit', () => ({ submitDemoRequest: vi.fn() }));

import { DemoForm } from '@/components/pages/try-demo/DemoForm';
import { submitDemoRequest } from '@/lib/demo-submit';

const submit = vi.mocked(submitDemoRequest);
const onSubmitted = vi.fn();
const sendButton = () => screen.getByRole('button', { name: 'Submit & Book' });

beforeEach(() => {
  submit.mockReset();
  submit.mockResolvedValue(undefined);
  onSubmitted.mockReset();
});
afterEach(cleanup);

describe('DemoForm', () => {
  it('shows what is missing and sends nothing when the form is empty', async () => {
    const user = userEvent.setup();
    render(<DemoForm plan={null} onSubmitted={onSubmitted} />);
    await user.click(sendButton());
    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Number of users is required')).toBeInTheDocument();
    expect(submit).not.toHaveBeenCalled();
    expect(onSubmitted).not.toHaveBeenCalled();
  });

  it('sends the request with the dial code and plan', async () => {
    const user = userEvent.setup();
    render(<DemoForm plan="basic" onSubmitted={onSubmitted} />);
    await fillDemoForm(user);
    await user.click(sendButton());
    await waitFor(() => expect(onSubmitted).toHaveBeenCalledTimes(1));
    expect(submit).toHaveBeenCalledWith({ name: 'Asha Rao', email: 'asha@example.com', phone: '+91 9876543210', role: 'Parent', organisation: '', users: '3', plan: 'basic' });
  });

  it('shows the school name field only for school and centre roles, and drops it when the role changes', async () => {
    const user = userEvent.setup();
    render(<DemoForm plan={null} onSubmitted={onSubmitted} />);
    expect(screen.queryByLabelText(/^Centre or school name/)).toBeNull();
    await fillDemoForm(user, { role: 'School' });
    await user.type(screen.getByLabelText(/^Centre or school name/), 'Sunrise School');
    await pick(user, /^I am a:/, 'Parent');
    expect(screen.queryByLabelText(/^Centre or school name/)).toBeNull();
    await user.click(sendButton());
    await waitFor(() => expect(onSubmitted).toHaveBeenCalledTimes(1));
    expect(onSubmitted.mock.calls[0][0]).toMatchObject({ role: 'Parent', organisation: '' });
  });

  it('sends one request and fires one event on a double click', async () => {
    const user = userEvent.setup();
    let release!: () => void;
    submit.mockReturnValue(new Promise<void>((resolve) => (release = resolve)));
    render(<DemoForm plan={null} onSubmitted={onSubmitted} />);
    await fillDemoForm(user);
    // Submit the form twice, bypassing the disabled button, so only the busy guard can stop the second call.
    const form = sendButton().closest('form')!;
    act(() => {
      fireEvent.submit(form);
      fireEvent.submit(form);
    });
    release();
    await waitFor(() => expect(onSubmitted).toHaveBeenCalledTimes(1));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('treats a filled honeypot as success without sending anything', async () => {
    const user = userEvent.setup();
    const { container } = render(<DemoForm plan={null} onSubmitted={onSubmitted} />);
    await fillDemoForm(user);
    fireEvent.change(container.querySelector('input[name="website"]')!, { target: { value: 'spam' } });
    await user.click(sendButton());
    await waitFor(() => expect(onSubmitted).toHaveBeenCalledTimes(1));
    expect(submit).not.toHaveBeenCalled();
  });

  it('preselects "6 or more" and says custom pricing applies for the custom plan', () => {
    render(<DemoForm plan="custom" onSubmitted={onSubmitted} />);
    expect(screen.getByRole('button', { name: /^How many users: 6 or more/ })).toBeInTheDocument();
    expect(screen.getByText(/Custom pricing applies/)).toBeInTheDocument();
  });

  it('shows the Basic price line for the Basic plan', () => {
    render(<DemoForm plan="basic" onSubmitted={onSubmitted} />);
    expect(screen.getByText(/Basic: up to 5 users, ₹2,000 each/)).toBeInTheDocument();
  });
});
