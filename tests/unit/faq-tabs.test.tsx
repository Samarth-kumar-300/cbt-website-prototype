import { act, cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FaqTabs } from '@/components/pages/faqs/FaqTabs';

const SETS = [
  { id: 'general', label: 'General', items: [{ q: 'G1?', a: 'Answer G1' }] },
  { id: 'schools', label: 'Schools', items: [{ q: 'S1?', a: 'Answer S1' }] },
  { id: 'parents', label: 'Parents', items: [{ q: 'P1?', a: 'Answer P1' }] },
];

beforeEach(() => window.history.replaceState(null, '', '/faqs'));
afterEach(cleanup);

const panel = (id: string) => document.getElementById(`faq-panel-${id}`)!;

describe('FaqTabs', () => {
  it('starts on the first set and keeps every panel in the page', () => {
    render(<FaqTabs sets={SETS} />);
    expect(screen.getByRole('tab', { name: 'General' })).toHaveAttribute('aria-selected', 'true');
    expect(panel('general')).not.toHaveAttribute('hidden');
    expect(panel('schools')).toHaveAttribute('hidden');
    expect(screen.getByText('Answer S1', { exact: false })).toBeInTheDocument();
  });
  it('switches set on click and writes the hash', async () => {
    render(<FaqTabs sets={SETS} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Schools' }));
    expect(panel('schools')).not.toHaveAttribute('hidden');
    expect(panel('general')).toHaveAttribute('hidden');
    expect(window.location.hash).toBe('#schools');
  });
  it('opens the set named in the URL hash', () => {
    window.history.replaceState(null, '', '/faqs#parents');
    render(<FaqTabs sets={SETS} />);
    expect(screen.getByRole('tab', { name: 'Parents' })).toHaveAttribute('aria-selected', 'true');
  });
  it('ignores a hash that names no set', () => {
    window.history.replaceState(null, '', '/faqs#nope');
    render(<FaqTabs sets={SETS} />);
    expect(screen.getByRole('tab', { name: 'General' })).toHaveAttribute('aria-selected', 'true');
  });
  it('follows a hash change after load', () => {
    render(<FaqTabs sets={SETS} />);
    act(() => {
      window.history.replaceState(null, '', '/faqs#schools');
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
    expect(screen.getByRole('tab', { name: 'Schools' })).toHaveAttribute('aria-selected', 'true');
  });
});
