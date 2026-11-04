import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { ContactForm } from '@/components/pages/contact-us/ContactForm';

afterEach(cleanup);

async function pickTopic(user: ReturnType<typeof userEvent.setup>, option: string) {
  await user.click(screen.getByRole('button', { name: /^Professional\/Parent:/ }));
  await user.click(screen.getByRole('option', { name: option }));
}

describe('Contact form, Other', () => {
  it('shows a "Please specify" field only when Other is chosen', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    expect(screen.queryByLabelText(/^Please specify/)).toBeNull();
    await pickTopic(user, 'Other');
    expect(screen.getByLabelText(/^Please specify/)).toBeInTheDocument();
    await pickTopic(user, 'Parent');
    expect(screen.queryByLabelText(/^Please specify/)).toBeNull();
  });

  it('asks for an answer when Other is chosen and the field is empty', async () => {
    const user = userEvent.setup();
    render(<ContactForm />);
    await pickTopic(user, 'Other');
    await user.click(screen.getByRole('button', { name: /submit|send/i }));
    expect(await screen.findByText('Tell us who you are')).toBeInTheDocument();
    await user.type(screen.getByLabelText(/^Please specify/), 'Speech therapist');
    await user.click(screen.getByRole('button', { name: /submit|send/i }));
    expect(screen.queryByText('Tell us who you are')).toBeNull();
  });
});
