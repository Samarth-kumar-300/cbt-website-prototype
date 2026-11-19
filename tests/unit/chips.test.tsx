import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { Chips } from '@/components/shared/Chips';

afterEach(cleanup);

const ITEMS = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
  { id: 'c', label: 'Gamma' },
];

function Harness() {
  const [v, setV] = useState('a');
  return <Chips items={ITEMS} value={v} onChange={setV} label="Topics" idPrefix="t" />;
}

describe('Chips', () => {
  it('renders a tab list with the selected tab marked and wired to its panel', () => {
    render(<Harness />);
    expect(screen.getByRole('tablist', { name: 'Topics' })).toBeInTheDocument();
    const alpha = screen.getByRole('tab', { name: 'Alpha' });
    expect(alpha).toHaveAttribute('aria-selected', 'true');
    expect(alpha).toHaveAttribute('id', 't-tab-a');
    expect(alpha).toHaveAttribute('aria-controls', 't-panel-a');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'false');
  });
  it('selects a chip on click', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('tab', { name: 'Gamma' }));
    expect(screen.getByRole('tab', { name: 'Gamma' })).toHaveAttribute('aria-selected', 'true');
  });
  it('moves with the arrow keys, wraps, and supports Home and End', async () => {
    render(<Harness />);
    await userEvent.tab();
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Gamma' })).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveFocus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Gamma' })).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveFocus();
  });
  it('keeps only the selected tab in the tab order', () => {
    render(<Harness />);
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('tabindex', '-1');
  });
  it('moves with the up and down arrows too, for a stacked list', async () => {
    function Stacked() {
      const [v, setV] = useState('a');
      return <Chips items={ITEMS} value={v} onChange={setV} label="Topics" idPrefix="t" layout="stacked" />;
    }
    render(<Stacked />);
    screen.getByRole('tab', { name: 'Alpha' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true');
    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    expect(screen.getByRole('tab', { name: 'Gamma' })).toHaveAttribute('aria-selected', 'true');
  });

  it('has one hidden pill and one hidden white-label layer, and the chips stay the only tabs', () => {
    const { container } = render(<Harness />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
    const pill = container.querySelector('[data-chip-thumb]') as HTMLElement;
    const ink = container.querySelector('[data-chip-ink]') as HTMLElement;
    expect(pill).toHaveAttribute('aria-hidden', 'true');
    expect(ink).toHaveAttribute('aria-hidden', 'true');
    expect(Array.from(ink.children).map((c) => c.textContent)).toEqual(['Alpha', 'Beta', 'Gamma']);
    // The ink copies are not reachable by role or name.
    expect(screen.queryAllByRole('tab', { name: 'Alpha' })).toHaveLength(1);
  });
  it('is a positioned track, so the pill and the labels measure against it', () => {
    render(<Harness />);
    expect(screen.getByRole('tablist').className).toContain('relative');
  });
  it('keeps the selected chip filled until the track has been measured, then hands the fill to the pill', () => {
    render(<Harness />);
    const alpha = screen.getByRole('tab', { name: 'Alpha' });
    expect(alpha.className).toContain('bg-brand-teal');
    expect(alpha.className).toContain('text-content-knockout');
    // The hand-over is a CSS variant keyed on the data-liquid attribute the hook sets after measuring.
    expect(alpha.className).toContain('[[data-liquid=ready]_&]:bg-transparent');
    expect(screen.getByRole('tab', { name: 'Beta' }).className).not.toContain('bg-brand-teal');
    // jsdom has no layout, so nothing is measured and the track is never marked ready.
    expect(screen.getByRole('tablist')).not.toHaveAttribute('data-liquid');
  });
  it('does not crash when the selection changes with no layout, and the pill is never a tab stop', async () => {
    const { container } = render(<Harness />);
    await userEvent.click(screen.getByRole('tab', { name: 'Gamma' }));
    expect(screen.getByRole('tab', { name: 'Gamma' })).toHaveAttribute('aria-selected', 'true');
    expect(container.querySelector('[data-chip-thumb]')).not.toHaveAttribute('tabindex');
  });
});
