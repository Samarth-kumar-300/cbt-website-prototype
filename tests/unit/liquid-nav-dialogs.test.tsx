import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/shared/nav-config.generated', () => ({
  SIGN_IN_ITEMS: [
    { label: 'Parent app', href: 'https://app.example.com/parent' },
    { label: 'Professional app', href: 'https://app.example.com/pro' },
  ],
  DRAWER_LINKS: [{ label: 'Careers', href: '/careers' }],
  HEADER_SCROLLED_BG: 'rgba(255, 255, 255, 0.8)',
  HEADER_BG_IMAGE: 'linear-gradient(rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.05) 100%)',
}));
vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

import { Header } from '@/components/shared/Header';
import { VideoDialog } from '@/components/shared/VideoDialog';
import { ApplyDialog } from '@/components/pages/job/ApplyDialog';
import { Select } from '@/components/pages/contact-us/Select';
import { JOBS } from '@/components/pages/job/content';
import './freeze-gsap';

function setReducedMotion(reduce: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: reduce && query.includes('prefers-reduced-motion'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
}

const original = window.matchMedia;
beforeEach(() => {
  document.body.style.overflow = '';
});
afterEach(() => {
  cleanup();
  window.matchMedia = original;
});

describe('header liquid motion', () => {
  const panel = () => document.querySelector('[data-menu-open] > div[id]') as HTMLElement;
  const menuChevron = () => document.querySelector('[data-menu-open] > button svg') as SVGElement;

  it('keeps the mega panel hidden (links stay in the HTML) until the menu opens, and the chevron turns with it', async () => {
    render(<Header />);
    expect(panel().hidden).toBe(true);
    expect(panel().querySelectorAll('a').length).toBeGreaterThan(0);
    expect(menuChevron().getAttribute('class')).not.toContain('rotate-180');
    await userEvent.click(screen.getByRole('button', { name: 'Inside CognitiveBotics' }));
    expect(panel().hidden).toBe(false);
    expect(menuChevron().getAttribute('class')).toContain('rotate-180');
    expect(menuChevron().getAttribute('class')).toContain('motion-reduce:transition-none');
    await userEvent.keyboard('{Escape}');
    expect(panel().hidden).toBe(true);
    expect(menuChevron().getAttribute('class')).not.toContain('rotate-180');
  });

  it('leaves no clip-path or stagger styles on the panel once it closes', async () => {
    render(<Header />);
    await userEvent.click(screen.getByRole('button', { name: 'Inside CognitiveBotics' }));
    await userEvent.keyboard('{Escape}');
    expect(panel().getAttribute('style') ?? '').toBe('');
    for (const el of panel().querySelectorAll(':scope > div > *')) expect(el.getAttribute('style') ?? '').toBe('');
  });

  it('reveals nothing under reduced motion: the panel opens with no inline styles', async () => {
    setReducedMotion(true);
    render(<Header />);
    await userEvent.click(screen.getByRole('button', { name: 'Inside CognitiveBotics' }));
    expect(panel().getAttribute('style') ?? '').toBe('');
  });

  it('gives the panel one aria-hidden highlight and puts every row above it', () => {
    render(<Header />);
    const thumb = panel().querySelector(':scope > span[aria-hidden="true"]') as HTMLElement;
    expect(thumb).not.toBeNull();
    expect(thumb.className).toContain('pointer-events-none');
    expect(panel().getAttribute('data-liquid')).toBe('ready');
    const rows = panel().querySelectorAll('ul a');
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.className).toContain('relative');
      expect(row.className).toContain('z-10');
      // the plain CSS hover stays as the fallback
      expect(row.className).toContain('hover:bg-brand-subtle-bg');
    }
  });

  it('turns the Sign in chevron with the menu and puts the same highlight under its rows', async () => {
    render(<Header />);
    const signIn = screen.getByRole('button', { name: /sign in/i });
    const chevron = signIn.querySelector('svg') as SVGElement;
    expect(chevron.getAttribute('class')).not.toContain('rotate-180');
    await userEvent.click(signIn);
    expect(chevron.getAttribute('class')).toContain('rotate-180');
    const menu = screen.getByRole('menu');
    expect(menu.querySelector(':scope > span[aria-hidden="true"]')).not.toBeNull();
    for (const item of within(menu).getAllByRole('menuitem')) expect(item.className).toContain('z-10');
    // touch and pen never drive the highlight
    const thumb = menu.querySelector(':scope > span[aria-hidden="true"]') as HTMLElement;
    const before = thumb.getAttribute('style');
    fireEvent.pointerEnter(within(menu).getAllByRole('menuitem')[0], { pointerType: 'touch' });
    expect(thumb.getAttribute('style')).toBe(before);
  });

  it('still unmounts the mobile drawer and its accordions at once, and leaves no inline height behind with reduced motion', async () => {
    setReducedMotion(true);
    render(<Header />);
    await userEvent.click(screen.getByRole('button', { name: /open menu/i }));
    const drawer = screen.getByRole('navigation', { name: 'Mobile' });
    expect(drawer.getAttribute('style') ?? '').toBe('');
    const accordion = within(drawer).getByRole('button', { name: 'Inside CognitiveBotics' });
    await userEvent.click(accordion);
    const accordionPanel = document.getElementById(accordion.getAttribute('aria-controls') as string) as HTMLElement;
    expect(accordionPanel.getAttribute('style') ?? '').toBe('');
    expect(accordion.querySelector('span')?.className).toContain('rotate-180');
    await userEvent.click(accordion);
    expect(document.getElementById(accordion.getAttribute('aria-controls') as string)).toBeNull();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  it('wraps the drawer Sign in items so they can ease open, with the chevron turning', async () => {
    setReducedMotion(true);
    render(<Header />);
    await userEvent.click(screen.getByRole('button', { name: /open menu/i }));
    const drawer = screen.getByRole('navigation', { name: 'Mobile' });
    const signIn = within(drawer).getByRole('button', { name: /sign in/i });
    await userEvent.click(signIn);
    expect(signIn.querySelector('span')?.className).toContain('rotate-180');
    expect(within(drawer).getByRole('link', { name: 'Parent app' })).toBeInTheDocument();
    await userEvent.click(signIn);
    expect(within(drawer).queryByRole('link', { name: 'Parent app' })).toBeNull();
  });
});

describe('dialog entrances', () => {
  it('the video dialog fades its backdrop and lifts its panel in', () => {
    render(<VideoDialog src="/a.mp4" poster="/a.jpg" title="A film" onClose={() => {}} />);
    const dialog = screen.getByRole('dialog', { name: 'A film' });
    expect(dialog.className).toContain('dialog-panel-in');
    expect(dialog.parentElement?.className).toContain('dialog-backdrop-in');
  });

  it('the apply dialog animates in, and its inline errors ease in', async () => {
    render(<ApplyDialog job={JOBS[0]} view="form" onDismiss={() => {}} onSubmitted={() => {}} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog.className).toContain('dialog-panel-in');
    expect(dialog.parentElement?.className).toContain('dialog-backdrop-in');
    await userEvent.click(screen.getByRole('button', { name: 'Submit application' }));
    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeGreaterThan(0);
    for (const a of alerts) expect(a.className).toContain('error-in');
  });
});

describe('Select liquid motion', () => {
  const OPTIONS = ['Parent', 'Therapist', 'School'];
  const setup = (error?: string) =>
    render(<Select id="topic" label="Topic" placeholder="Choose one" options={OPTIONS} value="" onChange={() => {}} error={error} />);

  it('turns its chevron when open and keeps options, aria-selected and the highlight out of the accessibility tree', async () => {
    setup();
    const button = screen.getByRole('button', { name: /choose one/i });
    const chevron = button.querySelector('svg') as SVGElement;
    expect(chevron.getAttribute('class')).not.toContain('rotate-180');
    expect(chevron.getAttribute('class')).toContain('motion-reduce:transition-none');
    await userEvent.click(button);
    expect(chevron.getAttribute('class')).toContain('rotate-180');
    expect(screen.getAllByRole('option')).toHaveLength(OPTIONS.length);
    const listbox = screen.getByRole('listbox');
    const thumb = listbox.querySelector(':scope > [aria-hidden="true"]') as HTMLElement;
    expect(thumb.className).toContain('pointer-events-none');
    for (const o of screen.getAllByRole('option')) {
      expect(o.className).toContain('z-10');
      expect(o).toHaveAttribute('aria-selected', 'false');
    }
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(chevron.getAttribute('class')).not.toContain('rotate-180');
  });

  it('keeps the active row class as the fallback fill while ArrowDown moves the active option', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: /choose one/i }));
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    const options = screen.getAllByRole('option');
    expect(options[1].className).toContain('bg-brand-subtle-bg');
    expect(options[0].className).not.toContain('bg-brand-subtle-bg');
  });

  it('leaves no inline styles on the list under reduced motion, and the error text eases in', async () => {
    setReducedMotion(true);
    setup('Topic is required');
    expect(screen.getByRole('alert').className).toContain('error-in');
    await userEvent.click(screen.getByRole('button', { name: /choose one/i }));
    expect(screen.getByRole('listbox').getAttribute('style') ?? '').toBe('');
  });
});
