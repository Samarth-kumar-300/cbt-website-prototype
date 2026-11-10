import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { researchCards } from '@/components/pages/research/content';
import { ResearchCard } from '@/components/pages/research/ResearchCard';

afterEach(cleanup);

describe('ResearchCard', () => {
  it.each(researchCards.map((c) => [c.headline, c] as const))('renders %s', (_n, card) => {
    const { container } = render(<ResearchCard card={card} />);
    expect(screen.getByAltText('CognitiveBotics')).toBeInTheDocument();
    expect(screen.getByText(card.partner.name)).toBeInTheDocument();
    if (card.partner.subLabel) expect(screen.getByText(card.partner.subLabel)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: card.headline })).toBeInTheDocument();
    expect(container.querySelector('p')?.textContent).toBe(card.output);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(1);
    expect(screen.getByRole('link', { name: new RegExp(card.button) })).toHaveAttribute('href', card.href);
  });

  it('shows the partner logo beside the name when src is given, and the name stays as text', () => {
    const { container } = render(<ResearchCard card={{ ...researchCards[0], partner: { name: 'Acme Journal', src: '/research/acme.svg' } }} />);
    const name = screen.getByText('Acme Journal');
    const logo = container.querySelector('img[src*="acme.svg"]');
    expect(logo).not.toBeNull();
    expect(logo).toHaveAttribute('alt', '');
    expect(name.closest('span.flex.items-center')).toContainElement(logo as HTMLElement);
  });

  it('shows the name alone when there is no logo file', () => {
    const { container } = render(<ResearchCard card={researchCards[0]} />);
    expect(container.querySelectorAll('img')).toHaveLength(1);
  });
});
