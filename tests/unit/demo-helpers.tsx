import { screen } from '@testing-library/react';
import type { UserEvent } from '@testing-library/user-event';

export async function pick(user: UserEvent, button: RegExp, option: string) {
  await user.click(screen.getByRole('button', { name: button }));
  await user.click(screen.getByRole('option', { name: option }));
}

/** Fills the always-visible fields, including the code. Pass `users: ''` to leave "How many users" empty. */
export async function fillDemoForm(user: UserEvent, opts: { role?: string; users?: string } = {}) {
  await user.type(screen.getByLabelText(/^Name/), 'Asha Rao');
  await user.type(screen.getByLabelText(/^Email/), 'asha@example.com');
  await user.type(screen.getByLabelText(/^Phone number/), '9876543210');
  await pick(user, /^I am a:/, opts.role ?? 'Parent');
  if (opts.users !== '') await pick(user, /^How many users:/, opts.users ?? '3');
  await user.type(screen.getByLabelText(/^Enter code shown/), 'VKNB62');
}
