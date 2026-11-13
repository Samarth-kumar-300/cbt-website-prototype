import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FilmPlayer, SHOW_FRAME_AFTER_MS } from '@/components/shared/FilmPlayer';
import { PROGRESS_IS_PRICELESS as film, embedUrl } from '@/lib/films';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const playButton = () => screen.getByRole('button', { name: 'Play film: Progress is Priceless' });
const frame = () => document.querySelector('iframe');

describe('FilmPlayer before the film is played', () => {
  it('shows the poster and a labelled play button, and no player frame', () => {
    render(<FilmPlayer film={film} />);
    expect(playButton()).toBeInTheDocument();
    expect(screen.getByAltText(film.posterAlt)).toBeInTheDocument();
    expect(frame()).toBeNull();
  });

  it('references nothing from YouTube or Google in the markup', () => {
    const { container } = render(<FilmPlayer film={film} />);
    expect(container.innerHTML).not.toMatch(/youtube|ytimg|google/i);
  });
});

describe('FilmPlayer when played', () => {
  it('mounts the privacy-friendly player in place, with the right attributes', async () => {
    const user = userEvent.setup();
    render(<FilmPlayer film={film} />);
    await user.click(playButton());
    const f = frame()!;
    expect(f).toHaveAttribute('src', embedUrl(film));
    expect(f).toHaveAttribute('title', 'Progress is Priceless');
    expect(f.getAttribute('allow')).toMatch(/autoplay/);
    expect(f.getAttribute('allow')).toMatch(/fullscreen/);
    expect(f).toHaveAttribute('allowfullscreen');
    expect(f).toHaveAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
  });

  it('moves focus to the player frame, because the button that held it goes away', async () => {
    const user = userEvent.setup();
    render(<FilmPlayer film={film} />);
    await user.click(playButton());
    expect(frame()).toHaveFocus();
  });

  it('keeps the poster until the frame has loaded, then hides the button from assistive technology and shows the frame', async () => {
    const user = userEvent.setup();
    render(<FilmPlayer film={film} />);
    await user.click(playButton());
    expect(playButton()).toBeDisabled();
    expect(frame()).toHaveClass('opacity-0');
    fireEvent.load(frame()!);
    expect(screen.queryByRole('button', { name: /Play film/ })).toBeNull();
    expect(frame()).toHaveClass('opacity-100');
  });

  it('keeps the poster under the player once playing, so the fade is a crossfade and no page background shows through', async () => {
    const user = userEvent.setup();
    const { container } = render(<FilmPlayer film={film} />);
    await user.click(playButton());
    fireEvent.load(frame()!);
    expect(screen.getByAltText(film.posterAlt)).toBeInTheDocument();
    const button = container.querySelector('button')!;
    expect(button).toHaveAttribute('inert');
    expect(button).toBeDisabled();
    expect(button.querySelector('svg')).toBeNull(); // the play triangle is gone
  });

  it('shows the frame after the wait if it never reports loading (blocked or slow network)', () => {
    vi.useFakeTimers();
    render(<FilmPlayer film={film} />);
    fireEvent.click(playButton());
    expect(frame()).toHaveClass('opacity-0');
    act(() => {
      vi.advanceTimersByTime(SHOW_FRAME_AFTER_MS - 1);
    });
    expect(frame()).toHaveClass('opacity-0');
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(frame()).toHaveClass('opacity-100');
    expect(screen.queryByRole('button', { name: /Play film/ })).toBeNull();
  });

  it('leaves one frame when the button is pressed twice', async () => {
    const user = userEvent.setup();
    render(<FilmPlayer film={film} />);
    await user.dblClick(playButton());
    expect(document.querySelectorAll('iframe')).toHaveLength(1);
  });
});
