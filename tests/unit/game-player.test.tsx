import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GamePlayer } from '@/components/pages/games/GamePlayer';
import { GAMES, type Game } from '@/components/pages/games/content';

const game: Game = GAMES[0];

describe('GamePlayer', () => {
  it('shows the thumbnail and a Start the game button before anything loads', () => {
    const { container } = render(<GamePlayer game={game} />);
    expect(screen.getByRole('button', { name: 'Start the game' })).toBeInTheDocument();
    expect(container.querySelector('img')?.getAttribute('src')).toContain('learn-to-look');
    expect(container.querySelector('iframe')).toBeNull();
    expect(screen.queryByText(/book a demo/i)).toBeNull();
  });

  it('loads the game in an iframe only after Start, when the game has an https URL', () => {
    const { container } = render(<GamePlayer game={{ ...game, embedUrl: 'https://example.com/play' }} />);
    expect(container.querySelector('iframe')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Start the game' }));
    const frame = container.querySelector('iframe');
    expect(frame?.getAttribute('src')).toBe('https://example.com/play');
    expect(frame?.getAttribute('allow')).toContain('camera');
  });

  it('answers Start with a message and a link to another game when there is no URL, or the URL is not https', () => {
    for (const embedUrl of [undefined, 'http://example.com/play']) {
      const { container, unmount } = render(<GamePlayer game={{ ...game, embedUrl }} />);
      fireEvent.click(screen.getByRole('button', { name: 'Start the game' }));
      expect(container.querySelector('iframe')).toBeNull();
      expect(screen.getByRole('status')).toHaveTextContent('This game isn’t live on the site yet');
      expect(screen.getByRole('link', { name: 'Try another game' })).toHaveAttribute('href', '#try-another');
      unmount();
    }
  });
});
