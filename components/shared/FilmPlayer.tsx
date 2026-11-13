'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { embedUrl, type Film } from '@/lib/films';

type Status = 'idle' | 'loading' | 'playing';

/** How long to wait for the frame to report it has loaded. After that it is shown anyway, so a blocked or slow network ends in the player's own message, not a spinner that never stops. */
export const SHOW_FRAME_AFTER_MS = 6000;

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="size-8 text-content-brand-secondary lg:size-10">
      <path d="M5 4.99c0-.972 0-1.457.202-1.725a1 1 0 0 1 .738-.395c.335-.02.74.25 1.548.788l10.515 7.01c.668.446 1.002.668 1.118.949a1 1 0 0 1 0 .766c-.116.28-.45.503-1.118.948l-10.515 7.01c-.809.54-1.213.809-1.548.789a1 1 0 0 1-.738-.395C5 20.467 5 19.98 5 19.01V4.99Z" />
    </svg>
  );
}

function Spinner() {
  return <span className="size-8 rounded-full border-[3px] border-content-brand-secondary/25 border-t-content-brand-secondary motion-safe:animate-spin lg:size-10" />;
}

function Badge({ loading }: { loading: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="absolute left-1/2 top-1/2 flex size-[72px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f8f2f9] shadow-[0px_6px_20px_rgba(10,13,18,0.18)] transition-transform duration-200 motion-safe:group-hover:scale-105 lg:size-24"
    >
      {loading ? <Spinner /> : <PlayIcon />}
    </span>
  );
}

/**
 * A film card. It shows a poster and a play button; nothing from YouTube loads until the
 * visitor presses it. Then the player replaces the poster in the same box.
 * The button is the card itself, outside any clipping box, so its focus ring is never cut off.
 */
export function FilmPlayer({ film }: { film: Film }) {
  const [status, setStatus] = useState<Status>('idle');
  const frame = useRef<HTMLIFrameElement>(null);

  // The play button goes away once the film starts, so hand focus to the player frame.
  useEffect(() => {
    if (status === 'loading') frame.current?.focus();
  }, [status]);

  // A frame that never reports loading is shown after a wait (see SHOW_FRAME_AFTER_MS).
  useEffect(() => {
    if (status !== 'loading') return;
    const timer = window.setTimeout(() => setStatus('playing'), SHOW_FRAME_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <div className="relative aspect-video rounded-[20px] shadow-[0px_6px_20px_0px_rgba(15,74,77,0.05)] lg:rounded-[24px]">
      {status !== 'playing' ? (
        <button
          type="button"
          onClick={() => setStatus('loading')}
          disabled={status === 'loading'}
          aria-label={`Play film: ${film.title}`}
          className="group absolute inset-0 cursor-pointer overflow-hidden rounded-[inherit] bg-brand-dark focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal disabled:cursor-default"
        >
          <span className="img-hover-zoom absolute inset-0 block">
            <Image src={film.poster} alt={film.posterAlt} fill sizes="(min-width: 1440px) 1248px, (min-width: 1024px) calc(100vw - 192px), 100vw" className="object-cover" />
          </span>
          <Badge loading={status === 'loading'} />
        </button>
      ) : null}
      {status !== 'idle' ? (
        <iframe
          ref={frame}
          src={embedUrl(film)}
          title={film.title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setStatus('playing')}
          className={`absolute inset-0 size-full rounded-[inherit] bg-black transition-opacity duration-300 motion-reduce:transition-none ${status === 'playing' ? 'opacity-100' : 'opacity-0'}`}
        />
      ) : null}
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] border-[1.5px] border-[#e4ded4]" />
    </div>
  );
}
