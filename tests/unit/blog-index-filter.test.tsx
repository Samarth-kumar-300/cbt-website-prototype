import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/components/shared/TextReveal', () => ({
  TextReveal: ({ children }: { children: React.ReactNode }) => <h1>{children}</h1>,
}));
vi.mock('@/components/shared/CtaPanel', () => ({ CtaPanel: () => null }));

import { BlogPage } from '@/components/pages/blog/BlogPage';
import { BlogIndex } from '@/components/pages/blog/BlogIndex';
import { POSTS } from '@/components/pages/blog/posts';

afterEach(cleanup);

const titles = () => within(screen.getByRole('tabpanel')).getAllByRole('heading', { level: 3 }).map((h) => h.textContent);

describe('blog index filters', () => {
  it('starts on All with every post and a chip for each audience', () => {
    render(<BlogIndex posts={POSTS} />);
    expect(screen.getAllByRole('tab').map((t) => t.textContent)).toEqual(['All', 'Therapy centres', 'Schools', 'Parents']);
    expect(titles()).toEqual(POSTS.map((p) => p.title));
  });

  it.each(['Parents', 'Therapy centres', 'Schools'] as const)('%s lists exactly the posts tagged with it, and each card shows that tag', async (audience) => {
    render(<BlogIndex posts={POSTS} />);
    await userEvent.click(screen.getByRole('tab', { name: audience }));
    expect(screen.getByRole('tab', { name: audience })).toHaveAttribute('aria-selected', 'true');
    const expected = POSTS.filter((p) => p.audiences.includes(audience));
    expect(expected.length).toBeGreaterThan(0);
    expect(titles()).toEqual(expected.map((p) => p.title));
    for (const link of within(screen.getByRole('tabpanel')).getAllByRole('link')) expect(within(link).getByText(audience)).toBeInTheDocument();
  });

  it('returns to every post on All', async () => {
    render(<BlogIndex posts={POSTS} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Schools' }));
    await userEvent.click(screen.getByRole('tab', { name: 'All' }));
    expect(titles()).toHaveLength(POSTS.length);
  });

  it('shows the new subheading beside the title', () => {
    render(<BlogPage />);
    expect(screen.getByText('What’s changing in early intervention, and how centres, schools and parents put it to work.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Blog');
  });

  it('shows no description under a card title', () => {
    render(<BlogIndex posts={POSTS} />);
    for (const p of POSTS) expect(screen.queryByText(p.excerpt)).toBeNull();
  });
});
