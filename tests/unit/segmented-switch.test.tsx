import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SegmentedSwitch } from '@/components/shared/SegmentedSwitch';

const items = [
  { id: 'a', label: 'Alpha' },
  { id: 'b', label: 'Beta' },
] as const;

afterEach(cleanup);

describe('SegmentedSwitch', () => {
  it('marks the active tab and slides the thumb under it', () => {
    const { container, rerender } = render(<SegmentedSwitch items={items} value="a" onChange={() => {}} label="Pick" idPrefix="t" />);
    const thumb = container.querySelector('[data-switch-thumb]') as HTMLElement;
    expect(screen.getByRole('tab', { name: 'Alpha' })).toHaveAttribute('aria-selected', 'true');
    expect(thumb.style.transform).toBe('translateX(0%)');
    rerender(<SegmentedSwitch items={items} value="b" onChange={() => {}} label="Pick" idPrefix="t" />);
    expect(screen.getByRole('tab', { name: 'Beta' })).toHaveAttribute('aria-selected', 'true');
    expect(thumb.style.transform).toBe('translateX(100%)');
  });

  it('calls onChange on click and with the arrow keys', () => {
    const onChange = vi.fn();
    render(<SegmentedSwitch items={items} value="a" onChange={onChange} label="Pick" idPrefix="t" />);
    fireEvent.click(screen.getByRole('tab', { name: 'Beta' }));
    expect(onChange).toHaveBeenLastCalledWith('b');
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Alpha' }), { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenLastCalledWith('b');
  });
});
