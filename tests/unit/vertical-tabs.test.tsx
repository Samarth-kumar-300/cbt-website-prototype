import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { VerticalTabs } from '@/components/shared/VerticalTabs';

afterEach(cleanup);

const items = [
  { id: 'attending', label: 'Attending skill', meta: '27 objectives' },
  { id: 'imitation', label: 'Imitation skill', meta: '27 objectives' },
  { id: 'receptive', label: 'Receptive skill' },
];

describe('VerticalTabs as tabs', () => {
  it('is a vertical tablist with the current tab selected and the rest out of the tab order', () => {
    render(<VerticalTabs items={items} value="imitation" onChange={() => {}} label="Skills" idPrefix="skills" />);
    const list = screen.getByRole('tablist', { name: 'Skills' });
    expect(list.getAttribute('aria-orientation')).toBe('vertical');
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((t) => t.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false']);
    expect(tabs.map((t) => t.getAttribute('tabindex'))).toEqual(['-1', '0', '-1']);
    expect(tabs[0].id).toBe('skills-tab-attending');
    expect(tabs[0].getAttribute('aria-controls')).toBe('skills-panel-attending');
  });

  it('shows the meta line under the label when there is one', () => {
    render(<VerticalTabs items={items} value="attending" onChange={() => {}} label="Skills" />);
    expect(screen.getAllByText('27 objectives')).toHaveLength(2);
  });

  it('gives the current row the muted brand fill and the others none', () => {
    render(<VerticalTabs items={items} value="attending" onChange={() => {}} label="Skills" />);
    const [a, b] = screen.getAllByRole('tab');
    expect(a.className).toContain('bg-brand-teal-100');
    expect(b.className).not.toContain('bg-brand-teal-100');
  });

  it('moves with the arrow keys, wraps, and supports Home and End', () => {
    const onChange = vi.fn();
    render(<VerticalTabs items={items} value="attending" onChange={onChange} label="Skills" />);
    const [first, , last] = screen.getAllByRole('tab');
    fireEvent.keyDown(first, { key: 'ArrowDown' });
    expect(onChange).toHaveBeenLastCalledWith('imitation');
    fireEvent.keyDown(first, { key: 'ArrowUp' });
    expect(onChange).toHaveBeenLastCalledWith('receptive');
    fireEvent.keyDown(first, { key: 'End' });
    expect(onChange).toHaveBeenLastCalledWith('receptive');
    fireEvent.keyDown(last, { key: 'Home' });
    expect(onChange).toHaveBeenLastCalledWith('attending');
  });

  it('selects a tab on click', () => {
    const onChange = vi.fn();
    render(<VerticalTabs items={items} value="attending" onChange={onChange} label="Skills" />);
    fireEvent.click(screen.getByRole('tab', { name: /Receptive skill/ }));
    expect(onChange).toHaveBeenCalledWith('receptive');
  });
});

describe('VerticalTabs as page links', () => {
  it('renders a nav of links, with aria-current on the current one and no tab roles', () => {
    render(<VerticalTabs items={items} value="imitation" onChange={() => {}} label="Sections" getHref={(id) => `#${id}`} />);
    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeTruthy();
    expect(screen.queryByRole('tab')).toBeNull();
    expect(screen.getByRole('link', { name: /Imitation skill/ }).getAttribute('aria-current')).toBe('true');
    expect(screen.getByRole('link', { name: /Attending skill/ }).getAttribute('href')).toBe('#attending');
  });

  it('lets the caller handle the click, and falls back to onChange without a handler', () => {
    const onLinkClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    const onChange = vi.fn();
    const { rerender } = render(<VerticalTabs items={items} value="attending" onChange={onChange} label="Sections" getHref={(id) => `#${id}`} onLinkClick={onLinkClick} />);
    fireEvent.click(screen.getByRole('link', { name: /Receptive skill/ }));
    expect(onLinkClick).toHaveBeenCalledWith(expect.anything(), 'receptive');
    expect(onChange).not.toHaveBeenCalled();
    rerender(<VerticalTabs items={items} value="attending" onChange={onChange} label="Sections" getHref={(id) => `#${id}`} />);
    fireEvent.click(screen.getByRole('link', { name: /Receptive skill/ }));
    expect(onChange).toHaveBeenCalledWith('receptive');
  });
});

describe('VerticalTabs as a dropdown', () => {
  it('is one select showing the current item, and reports a new choice', () => {
    const onChange = vi.fn();
    render(<VerticalTabs items={items} value="imitation" onChange={onChange} label="Sections" layout="dropdown" />);
    const select = screen.getByRole('combobox', { name: 'Sections' }) as HTMLSelectElement;
    expect(select.value).toBe('imitation');
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual(['Attending skill', 'Imitation skill', 'Receptive skill']);
    fireEvent.change(select, { target: { value: 'receptive' } });
    expect(onChange).toHaveBeenCalledWith('receptive');
    expect(screen.queryByRole('tab')).toBeNull();
  });
});
