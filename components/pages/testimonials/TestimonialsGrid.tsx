'use client';

import { useState } from 'react';
import { Chips } from '@/components/shared/Chips';
import { QuoteCard } from '@/components/shared/QuoteCard';
import { RevealStagger } from '@/components/shared/RevealStagger';
import { VideoTestimonialCard } from '@/components/shared/VideoTestimonialCard';
import type { Testimonial, VideoTestimonial } from '@/lib/testimonials';
import { LONG_QUOTE, testimonialGroups, testimonialsContent as c } from './content';

function ExpandableQuote({ quote }: { quote: Testimonial }) {
  const [open, setOpen] = useState(false);
  const long = quote.text.length > LONG_QUOTE;
  return (
    <QuoteCard
      bordered
      quote={quote}
      clamp={long && !open ? 4 : false}
      after={
        long ? (
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
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
