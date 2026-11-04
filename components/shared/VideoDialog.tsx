'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

type Props = { src: string; poster: string; title: string; onClose: () => void };

// A modal player. It renders in a portal on <body> so a transformed or scrolling parent (the home
// testimonial row) cannot trap it. The video only starts loading when this opens.
export function VideoDialog({ src, poster, title, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-3 sm:p-6" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={title} className="relative w-full max-w-[1100px]">
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="absolute -top-12 right-0 flex size-11 items-center justify-center rounded-full bg-white text-content-brand hover:bg-brand-subtle-bg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
        {/* No captions file exists yet for this video. Add a <track kind="captions"> when one does. */}
        <video src={src} poster={poster} controls autoPlay playsInline preload="metadata" className="aspect-video w-full rounded-[16px] bg-black" />
      </div>
    </div>,
    document.body,
  );
}
