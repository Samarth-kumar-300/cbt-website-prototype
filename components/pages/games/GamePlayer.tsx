'use client';

import { useState } from 'react';
import Image from 'next/image';
import { gamesContent as c, isEmbeddable, type Game } from './content';

type Phase = 'poster' | 'playing' | 'unavailable';

// The player shows the game's thumbnail with a Start the game button. The iframe loads only after Start,
// so the page never asks for the camera or microphone on load. A game with no playable URL answers Start
// with a clear message and a way to another game, never a dead click.
export function GamePlayer({ game }: { game: Game }) {
  const [phase, setPhase] = useState<Phase>('poster');
  const playable = isEmbeddable(game.embedUrl);
  const start = () => setPhase(playable ? 'playing' : 'unavailable');
  // The frame is the grid item itself: 16:9 on its own, and from 1400px it stretches to the height of the facts card beside it.
  return (
    <div data-testid="player-frame" className="relative aspect-video overflow-hidden rounded-[20px] bg-[#222c2f] min-[1400px]:w-full min-[1400px]:self-stretch">
      {phase === 'playing' && playable ? (
        <iframe src={game.embedUrl} title={game.name} allow="camera; microphone; fullscreen" referrerPolicy="no-referrer" className="absolute inset-0 h-full w-full border-0" />
      ) : (
        <>
          {/* alt is empty because the game name is the page heading, and the image repeats it. */}
          <Image src={game.thumbnail} alt="" fill priority sizes="(min-width: 1400px) 816px, (min-width: 1024px) 864px, calc(100vw - 40px)" className="object-cover object-[68%_center]" />
          {phase === 'poster' ? (
            <div data-testid="player-overlay" className="absolute inset-0 flex items-center justify-center bg-black/15">
              {/* A soft dark glow behind the button only, so the button stands out while the rest of the thumbnail stays bright. */}
              <span aria-hidden="true" className="pointer-events-none absolute h-20 w-56 rounded-full bg-black/25 blur-2xl lg:h-24 lg:w-72" />
              <button
                type="button"
                onClick={start}
                className="inline-flex min-h-[48px] items-center gap-2 relative rounded-full bg-white px-6 py-3 text-[16px] font-bold text-brand-teal shadow-[0px_8px_24px_0px_rgba(0,0,0,0.35)] ring-4 ring-white/40 transition-colors hover:bg-brand-teal-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:px-8 lg:py-4 lg:text-[18px]"
              >
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                  <path d="M8 5.5v13l11-6.5-11-6.5Z" />
                </svg>
                {c.detail.start}
              </button>
            </div>
          ) : (
            <div role="status" data-testid="player-unavailable" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#222c2f]/92 px-6 text-center text-white">
              <p className="font-heading text-[18px] font-semibold sm:text-[22px]">{c.detail.unavailable}</p>
              <p className="text-[14px] leading-[22px] text-white/80 sm:text-[16px]">{c.detail.unavailableBody}</p>
              <a href="#try-another" className="inline-flex min-h-[48px] items-center rounded-full bg-white px-6 py-3 text-[16px] font-bold text-brand-teal hover:bg-brand-teal-100">
                {c.detail.unavailableCta}
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
