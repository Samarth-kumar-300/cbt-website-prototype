import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/shared/nav-config.generated', () => ({
  SIGN_IN_ITEMS: [{ label: 'Parent app', href: 'https://app.example.com/parent' }],
  DRAWER_LINKS: [{ label: 'Careers', href: '/careers' }],
  HEADER_SCROLLED_BG: 'rgba(255, 255, 255, 0.8)',
  HEADER_BG_IMAGE: 'linear-gradient(rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.05) 100%), linear-gradient(90deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.55) 100%)',
}));

const pathnameMock = vi.hoisted(() => ({ value: null as string | null }));
vi.mock('next/navigation', () => ({ usePathname: () => pathnameMock.value }));

import { Header } from '@/components/shared/Header';

afterEach(() => cleanup());

beforeEach(() => {
  pathnameMock.value = null;
  document.body.style.overflow = '';
});

describe('Header', () => {
  it('renders the nav links in order with the right hrefs, the Learn pages sitting inside its menu', () => {
    render(<Header />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    const links = Array.from(nav.querySelectorAll('a')).map((a) => [a.textContent, a.getAttribute('href')]);
    expect(links).toEqual([
      ['Therapy Centres', '/therapy-centres'],
      ['Schools', '/schools'],
      ['Parents', '/parents'],
      ['Pricing', '/pricing'],
      ['ResearchPeer-reviewed studies on developmental outcomes', '/research'],
      ['Case studiesHow centres and schools use CognitiveBotics', '/case-studies'],
      ['Patent and certificationsOur granted patent and ISO 27001 certificate', '/achievements'],
      ['TestimonialsFamilies and professionals, in their words', '/testimonials'],
      ['FAQsQuick answers before you book', '/faqs'],
      ['BlogGuides on autism and early support', '/blog'],
      ['Knowledge baseGuides and troubleshooting for the platform', 'https://support.cognitivebotics.com/support/solutions'],
      ['Get in touchTalk to our team', '/contact-us'],
      ['See it in your centre or schoolBook a demo', '/try-demo'],
      ['About Us', '/about'],
    ]);
  });
  it('links the logo home and has a Try Demo button', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: /cognitivebotics home/i })).toHaveAttribute('href', '/');
    expect(screen.getAllByRole('link', { name: /try demo/i })[0]).toHaveAttribute('href', '/try-demo');
  });
  it('opens and closes the drawer with the hamburger and Escape, locking body scroll', async () => {
    render(<Header />);
    const burger = screen.getByRole('button', { name: /open menu/i });
    expect(burger).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(burger);
    expect(burger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('navigation', { name: 'Mobile' })).toBeInTheDocument();
    expect(document.body.style.overflow).toBe('hidden');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });
  describe('mobile drawer closes on navigation', () => {
    const mobile = () => screen.queryByRole('navigation', { name: 'Mobile' });
    const openDrawer = async () => {
      await userEvent.click(screen.getByRole('button', { name: /open menu/i }));
      expect(mobile()).toBeInTheDocument();
    };
    it('closes when a drawer link is clicked', async () => {
      render(<Header />);
      await openDrawer();
      await userEvent.click(within(mobile()!).getByRole('link', { name: 'Pricing' }));
      expect(mobile()).toBeNull();
      expect(document.body.style.overflow).toBe('');
    });
    it('closes when the Try demo button in the drawer is clicked', async () => {
      render(<Header />);
      await openDrawer();
      await userEvent.click(within(mobile()!).getByRole('link', { name: /try demo/i }));
      expect(mobile()).toBeNull();
    });
    it('closes when the logo is clicked', async () => {
      render(<Header />);
      await openDrawer();
      await userEvent.click(screen.getByRole('link', { name: /cognitivebotics home/i }));
      expect(mobile()).toBeNull();
    });
    it('closes when the route changes by any other means (back button, a link elsewhere)', async () => {
      const { rerender } = render(<Header />);
      await openDrawer();
      pathnameMock.value = '/about';
      rerender(<Header />);
      expect(mobile()).toBeNull();
      expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute('aria-expanded', 'false');
      expect(document.body.style.overflow).toBe('');
    });
    it('opens again on the new page', async () => {
      const { rerender } = render(<Header />);
      await openDrawer();
      pathnameMock.value = '/about';
      rerender(<Header />);
      await openDrawer();
    });
  });
  it('shows the Sign in menu, closes it on outside click and on Escape', async () => {
    render(<Header />);
    const signIn = screen.getByRole('button', { name: /sign in/i });
    await userEvent.click(signIn);
    expect(screen.getByRole('menuitem', { name: 'Parent app' })).toHaveAttribute('href', 'https://app.example.com/parent');
    await userEvent.click(document.body);
    expect(screen.queryByRole('menu')).toBeNull();
    await userEvent.click(signIn);
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
  });
  it('switches to the scrolled background after scrolling', () => {
    const { container } = render(<Header />);
    const pill = container.querySelector('[data-testid="header-pill"]') as HTMLElement;
    expect(pill.style.backgroundColor).toBe('');
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 200, configurable: true });
      fireEvent.scroll(window);
    });
    expect(pill.style.backgroundColor).toContain('rgba(255, 255, 255, 0.8)');
    // the scrolled state must not wipe the gradient layer
    expect(pill.style.getPropertyValue('--header-bg')).toContain('linear-gradient');
    expect(pill.className).toContain('bg-[image:var(--header-bg)]');
  });
  it('carries the captured two-layer gradient on the pill from the first render', () => {
    Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
    const { container } = render(<Header />);
    const pill = container.querySelector('[data-testid="header-pill"]') as HTMLElement;
    expect(pill.className).toContain('bg-[image:var(--header-bg)]');
    const value = pill.style.getPropertyValue('--header-bg');
    expect(value).toContain('linear-gradient(rgba(255, 255, 255, 0.45) 0%');
    expect(value).toContain('linear-gradient(90deg, rgba(255, 255, 255, 0.55)');
  });
  it('closes the drawer and restores body scroll when the viewport reaches xl', async () => {
    let listener: ((e: { matches: boolean }) => void) | undefined;
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      addEventListener: (_: string, cb: (e: { matches: boolean }) => void) => {
        listener = cb;
      },
      removeEventListener: () => {
        listener = undefined;
      },
    })) as unknown as typeof window.matchMedia;
    try {
      render(<Header />);
      const burger = screen.getByRole('button', { name: /open menu/i });
      await userEvent.click(burger);
      expect(document.body.style.overflow).toBe('hidden');
      expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1280px)');
      act(() => listener?.({ matches: true }));
      expect(screen.queryByRole('navigation', { name: 'Mobile' })).toBeNull();
      expect(burger).toHaveAttribute('aria-expanded', 'false');
      expect(document.body.style.overflow).toBe('');
    } finally {
      window.matchMedia = original;
    }
  });

  it('marks only the current page link as active in the desktop nav', () => {
    pathnameMock.value = '/schools';
    render(<Header />);
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    const current = nav.querySelectorAll('[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent('Schools');
    expect(current[0].className).toContain('text-content-brand-secondary');
  });

  it('keeps the parent link active on nested routes and none active elsewhere', () => {
    pathnameMock.value = '/about/team';
    const { unmount } = render(<Header />);
    expect(screen.getByRole('link', { name: 'About Us' })).toHaveAttribute('aria-current', 'page');
    unmount();
    pathnameMock.value = '/';
    render(<Header />);
    expect(document.querySelectorAll('nav[aria-label="Primary"] [aria-current]')).toHaveLength(0);
  });
});
