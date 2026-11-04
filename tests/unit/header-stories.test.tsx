import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/launch-gates', () => ({
  LIVE_PAGES: { caseStudies: true, faqs: true, blog: true, testimonials: true, research: true, achievements: true },
}));
vi.mock('@/components/shared/nav-config.generated', () => ({
  SIGN_IN_ITEMS: [],
  DRAWER_LINKS: [],
  HEADER_SCROLLED_BG: 'rgba(255, 255, 255, 0.8)',
  HEADER_BG_IMAGE: 'none',
}));
const pathnameMock = vi.hoisted(() => ({ value: '/' as string | null }));
vi.mock('next/navigation', () => ({ usePathname: () => pathnameMock.value }));

import { Header } from '@/components/shared/Header';

beforeEach(() => {
  pathnameMock.value = '/';
  document.body.style.overflow = '';
});
afterEach(cleanup);

const primary = () => screen.getByRole('navigation', { name: 'Primary' });

describe('Header with the Learn menu', () => {
  it('shows Learn as a button after Pricing and no Resources link', () => {
    render(<Header />);
    const labels = Array.from(primary().querySelectorAll('a, button')).map((el) => el.textContent?.trim());
    expect(labels.slice(0, 5)).toEqual(['Therapy Centres', 'Schools', 'Parents', 'Pricing', 'Learn']);
    expect(within(primary()).queryByRole('link', { name: 'Resources' })).toBeNull();
  });

  it('keeps every menu link in the page even while the menu is closed', () => {
    render(<Header />);
    const hrefs = Array.from(primary().querySelectorAll('[hidden] a')).map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['/research', '/case-studies', '/achievements', '/testimonials', '/faqs', '/blog', 'https://support.cognitivebotics.com/support/solutions', '/contact-us', '/try-demo']);
    expect(within(primary()).queryByRole('link', { name: /FAQs/ })).toBeNull(); // hidden, so out of the accessibility tree
  });

  it('opens on click, closes on Escape and on an outside click', async () => {
    render(<Header />);
    const button = within(primary()).getByRole('button', { name: /^learn/i });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(within(primary()).getByRole('link', { name: /FAQs/ })).toHaveAttribute('href', '/faqs');
    await userEvent.keyboard('{Escape}');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    await userEvent.click(document.body);
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens the knowledge base in a new tab from the menu and the drawer', async () => {
    render(<Header />);
    await userEvent.click(within(primary()).getByRole('button', { name: /^learn/i }));
    const kb = within(primary()).getByRole('link', { name: /Knowledge base/ });
    expect(kb).toHaveAttribute('target', '_blank');
    expect(kb).toHaveAttribute('rel', 'noopener noreferrer');
    await userEvent.click(screen.getByRole('button', { name: /open menu/i }));
    const drawer = screen.getByRole('navigation', { name: 'Mobile' });
    await userEvent.click(within(drawer).getByRole('button', { name: /^learn/i }));
    expect(within(drawer).getByRole('link', { name: 'Knowledge base' })).toHaveAttribute('target', '_blank');
  });

  it('groups the links under three headings', async () => {
    render(<Header />);
    await userEvent.click(within(primary()).getByRole('button', { name: /^learn/i }));
    for (const heading of ['Evidence', 'Questions and stories', 'Get support']) expect(within(primary()).getByText(heading)).toBeInTheDocument();
    const quick = within(primary()).getByRole('list', { name: 'Questions and stories' });
    expect(within(quick).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(['/testimonials', '/faqs', '/blog']);
  });

  it('shows the helper line under each label', async () => {
    render(<Header />);
    await userEvent.click(within(primary()).getByRole('button', { name: /^learn/i }));
    expect(within(primary()).getByText('Quick answers before you book')).toBeInTheDocument();
  });

  it('marks Learn and the current page active on a child route', async () => {
    pathnameMock.value = '/faqs';
    render(<Header />);
    const button = within(primary()).getByRole('button', { name: /^learn/i });
    expect(button.className).toContain('text-content-brand-secondary');
    await userEvent.click(button);
    expect(within(primary()).getByRole('link', { name: /FAQs/ })).toHaveAttribute('aria-current', 'page');
  });

  it('returns focus to the Learn button when Escape closes the menu from a link inside it', async () => {
    render(<Header />);
    const button = within(primary()).getByRole('button', { name: /^learn/i });
    await userEvent.click(button);
    within(primary()).getByRole('link', { name: /FAQs/ }).focus();
    await userEvent.keyboard('{Escape}');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveFocus();
  });

  it('does not move focus to the Learn button on an outside click', async () => {
    render(<Header />);
    const button = within(primary()).getByRole('button', { name: /^learn/i });
    await userEvent.click(button);
    within(primary()).getByRole('link', { name: /FAQs/ }).focus();
    await userEvent.click(document.body);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).not.toHaveFocus();
  });

  it('shows Learn as an accordion in the mobile drawer and closes the drawer on a link', async () => {
    render(<Header />);
    await userEvent.click(screen.getByRole('button', { name: /open menu/i }));
    const drawer = screen.getByRole('navigation', { name: 'Mobile' });
    const learn = within(drawer).getByRole('button', { name: /^learn/i });
    expect(learn).toHaveAttribute('aria-expanded', 'false');
    expect(within(drawer).queryByRole('link', { name: 'Blog' })).toBeNull();
    await userEvent.click(learn);
    expect(learn).toHaveAttribute('aria-expanded', 'true');
    expect(within(drawer).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(
      expect.arrayContaining(['/pricing', '/case-studies', '/faqs', '/blog', '/testimonials']),
    );
    await userEvent.click(within(drawer).getByRole('link', { name: 'Blog' }));
    expect(screen.queryByRole('navigation', { name: 'Mobile' })).toBeNull();
  });
});
