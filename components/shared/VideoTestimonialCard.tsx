'use client';

import Image from 'next/image';
import { useCallback, useRef, useState, type ButtonHTMLAttributes } from 'react';
import type { VideoTestimonial } from '@/lib/testimonials';
import { VideoDialog } from './VideoDialog';

type Variant = 'rail' | 'slide' | 'grid';

const SHELL =
  'group flex flex-col overflow-hidden rounded-[20px] border-[1.5px] border-[#e4ded4] bg-white text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal';
const VARIANT: Record<Variant, string> = {
  // Home, wide screens: a fixed-width card in the drifting row.
  rail: 'tcard w-[628px] shrink-0 shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)]',
  // Home, phones: one slide of the swipeable row.
  slide: 'w-full shadow-[0px_6px_20px_0px_rgba(15,74,77,0.05)]',
  // Testimonials page: fills its grid cell. From lg it lays out sideways to suit two columns.
  grid: 'h-full w-full shadow-[0px_6px_20px_0px_rgba(15,74,77,0.05)] lg:flex-row',
};

function PlayBadge() {
  return (
    <span aria-hidden="true" className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f8f2f9] shadow-[0px_6px_20px_rgba(10,13,18,0.18)] transition-transform duration-200 group-hover:scale-105 lg:size-16">
      <svg viewBox="0 0 24 24" width="26" height="26" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-content-brand-secondary">
        <path d="M5 4.99c0-.972 0-1.457.202-1.725a1 1 0 0 1 .738-.395c.335-.02.74.25 1.548.788l10.515 7.01c.668.446 1.002.668 1.118.949a1 1 0 0 1 0 .766c-.116.28-.45.503-1.118.948l-10.515 7.01c-.809.54-1.213.809-1.548.789a1 1 0 0 1-.738-.395C5 20.467 5 19.98 5 19.01V4.99Z" />
      </svg>
    </span>
  );
}

function WatchNow({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[14px] font-semibold leading-[22px] text-content-brand">
      {label}
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
        <path d="M4 12h16m0 0-6-6m6 6-6 6" />
      </svg>
    </span>
  );
}

/** The video testimonial card. Pressing it opens the video in a dialog; nothing downloads before that. */
export function VideoTestimonialCard({
  video,
  variant,
  buttonProps,
  linkLabel = 'Watch now',
  byline = false,
}: {
  video: VideoTestimonial;
  variant: Variant;
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement> & { 'data-card'?: boolean };
  /** Text of the call to action. Defaults to "Watch now". */
  linkLabel?: string;
  /** Show name and role under the title (already shown in the `grid` variant). */
  byline?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => {
    setOpen(false);
    button.current?.focus();
  }, []);
  const grid = variant === 'grid';

  return (
    <>
      <button ref={button} type="button" aria-haspopup="dialog" onClick={() => setOpen(true)} className={`${SHELL} ${VARIANT[variant]}`} {...buttonProps}>
        <span className={`relative block ${grid ? 'lg:w-[62%] lg:shrink-0' : ''}`}>
          <Image
            src={video.poster}
            alt={video.alt}
            width={1250}
            height={716}
            sizes={variant === 'rail' ? '628px' : grid ? '(min-width: 1024px) 520px, 100vw' : '(max-width: 1023px) 100vw, 628px'}
            className={`tthumb h-auto w-full ${grid ? 'lg:h-full lg:object-cover' : ''}`}
          />
          <PlayBadge />
        </span>
        <span className={`flex flex-col items-start gap-3 ${variant === 'slide' ? 'px-5 pb-[22px] pt-4' : 'px-6 pb-6 pt-5'} ${grid ? 'lg:justify-center lg:gap-4 lg:px-8' : ''}`}>
          <span className={`font-heading font-semibold text-content-brand ${variant === 'rail' ? 'text-[20px] leading-[28px]' : grid ? 'text-[18px] leading-[26px] lg:text-[22px] lg:leading-[30px]' : 'text-[16px] leading-[24px]'}`}>{video.title}</span>
          {grid || byline ? (
            <span className="flex flex-col">
              <span className="font-heading text-[14px] font-bold text-brand-teal">{video.name}</span>
              <span className="text-[14px] leading-[21px] text-[#646871]">{video.role}</span>
            </span>
          ) : null}
          <WatchNow label={linkLabel} />
        </span>
      </button>
      {open ? <VideoDialog src={video.src} poster={video.poster} title={video.title} onClose={close} /> : null}
    </>
  );
}
