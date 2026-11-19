'use client';

import gsap from 'gsap';
import { useRef, useState } from 'react';
import { Chips } from '@/components/shared/Chips';
import { clampToggle } from '@/components/shared/motion';
import { QuoteCard } from '@/components/shared/QuoteCard';
import { RevealStagger } from '@/components/shared/RevealStagger';
import { VideoTestimonialCard } from '@/components/shared/VideoTestimonialCard';
import type { Testimonial, VideoTestimonial } from '@/lib/testimonials';
import { LONG_QUOTE, testimonialGroups, testimonialsContent as c } from './content';

function ExpandableQuote({ quote }: { quote: Testimonial }) {
  // open drives the button (aria-expanded and its text) at once. clamped drives the line-clamp class, which
  // clampToggle flips itself and which React only catches up with when the height ease has finished, so
  // React never puts the clamp back while the block is still easing shut.
  const [open, setOpen] = useState(false);
  const [clamped, setClamped] = useState(true);
  const text = useRef<HTMLQuoteElement>(null);
  const long = quote.text.length > LONG_QUOTE;
  const toggle = () => {
    const next = !open;
    setOpen(next);
    const el = text.current;
    if (!el) {
      setClamped(!next);
      return;
    }
    // A second click mid-ease starts from the natural height, not from the half-eased inline one. The text
    // is clipped while it eases open so the lines still to come do not spill over the button below.
    gsap.killTweensOf(el);
    el.style.removeProperty('height');
    el.style.overflow = 'hidden';
    clampToggle(el, ['line-clamp-4'], next, () => {
      el.style.removeProperty('overflow');
      setClamped(!next);
    });
  };
  return (
    <QuoteCard
      bordered
      quote={quote}
      textRef={text}
      clamp={long && clamped ? 4 : false}
      after={
        long ? (
          <button
            type="button"
            aria-expanded={open}
            onClick={toggle}
            className="-mt-1 inline-flex min-h-[44px] w-fit items-center text-[14px] font-semibold text-brand-teal hover:underline"
          >
            {open ? 'Show less' : 'Read more'}
          </button>
        ) : null
      }
    />
  );
}

// The video leads the grid and takes the first two columns of row 1; the written quotes fill the rest.
export function TestimonialsGrid({ quotes, video }: { quotes: readonly Testimonial[]; video?: VideoTestimonial }) {
  const groups = testimonialGroups(video ? [...quotes, video] : quotes);
  const [active, setActive] = useState(groups[0].id);
  const audience = groups.find((g) => g.id === active)?.audience;
  const shown = audience ? quotes.filter((q) => q.audience === audience) : quotes;
  const showVideo = video && (!audience || video.audience === audience);

  return (
    <div className="mx-auto flex max-w-[1248px] flex-col gap-8 lg:gap-10">
      <Chips items={groups} value={active} onChange={setActive} label={c.chipsLabel} idPrefix="testimonials" />
      <div role="tabpanel" id={`testimonials-panel-${active}`} aria-labelledby={`testimonials-tab-${active}`}>
        <RevealStagger key={active} className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {showVideo ? (
            <div className="sm:col-span-2">
              <VideoTestimonialCard video={video} variant="grid" />
            </div>
          ) : null}
          {shown.map((q) => (
            <ExpandableQuote key={q.id} quote={q} />
          ))}
        </RevealStagger>
      </div>
    </div>
  );
}
