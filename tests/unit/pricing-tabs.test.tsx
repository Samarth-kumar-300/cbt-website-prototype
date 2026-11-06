import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const refresh = vi.hoisted(() => vi.fn());
vi.mock('gsap', () => ({ default: { registerPlugin: vi.fn() } }));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: { refresh } }));

import { AudienceTabs } from '@/components/pages/pricing/AudienceTabs';

const tabs = [
  { id: 'therapy-centres', label: 'Therapy Centres' },
  { id: 'schools', label: 'Schools' },
] as const;
const panels = { 'therapy-centres': <p>centres body</p>, schools: <p>schools body</p> };

beforeEach(() => {
  window.history.replaceState(null, '', '/pricing');
  refresh.mockClear();
});

describe('AudienceTabs', () => {
  it('shows the initial panel and hides the other from everyone', () => {
    render(<AudienceTabs initial="schools" tabs={tabs} panels={panels} />);
    expect(screen.getByRole('tab', { name: 'Schools' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Schools' })).toHaveTextContent('schools body');
    expect(screen.getByText('centres body').closest('[role="tabpanel"]')).toHaveAttribute('hidden');
    expect(refresh).not.toHaveBeenCalled();
  });
  it('switches panels and writes ?for= without adding history', async () => {
    const before = window.history.length;
    render(<AudienceTabs initial="therapy-centres" tabs={tabs} panels={panels} />);
    expect(window.location.search).toBe('');
    fireEvent.click(screen.getByRole('tab', { name: 'Schools' }));
    expect(screen.getByText('schools body').closest('[role="tabpanel"]')).not.toHaveAttribute('hidden');
    expect(window.location.search).toBe('?for=schools');
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    expect(refresh).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('tab', { name: 'Therapy Centres' }));
    expect(window.location.search).toBe('');
    expect(window.history.length).toBe(before);
  });
  it('moves with the arrow keys', () => {
    render(<AudienceTabs initial="therapy-centres" tabs={tabs} panels={panels} />);
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Therapy Centres' }), { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Schools' })).toHaveAttribute('aria-selected', 'true');
  });
  it('keeps other query parameters', () => {
    window.history.replaceState(null, '', '/pricing?utm_source=x');
    render(<AudienceTabs initial="therapy-centres" tabs={tabs} panels={panels} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Schools' }));
    expect(window.location.search).toBe('?utm_source=x&for=schools');
  });
});
