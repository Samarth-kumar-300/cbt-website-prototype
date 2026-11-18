import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GameCard } from '@/components/pages/games/GameCard';
import { GAMES } from '@/components/pages/games/content';

const game = GAMES[0];

describe('GameCard', () => {
  it('is a button, not a link to the detail page', () => {
    render(<GameCard game={game} />);
    expect(screen.queryByRole('link')).toBeNull();
    expect(screen.getByRole('button', { name: new RegExp(game.name) })).toHaveTextContent('Play now');
  });

  it('opens the microphone prompt, and Don’t allow closes it without starting', () => {
    render(<GameCard game={game} />);
    fireEvent.click(screen.getByRole('button', { name: new RegExp(game.name) }));
    expect(screen.getByRole('alertdialog')).toHaveTextContent('would like to access the microphone');
    fireEvent.click(screen.getByRole('button', { name: 'Don’t allow' }));
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(screen.queryByTestId('game-started')).toBeNull();
  });

  it('shows the Game started overlay after OK, and Escape closes it', () => {
    render(<GameCard game={game} />);
    fireEvent.click(screen.getByRole('button', { name: new RegExp(game.name) }));
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(screen.queryByRole('alertdialog')).toBeNull();
    expect(screen.getByTestId('game-started')).toHaveTextContent('Game started');
    expect(screen.getByTestId('game-started').className).toContain('bg-black/30');
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('game-started')).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });
});
