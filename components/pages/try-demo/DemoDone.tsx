import type { RefObject } from 'react';
import { Button } from '@/components/shared/Button';
import { LIVE_PAGES } from '@/lib/launch-gates';
import { tryDemoContent as c } from './content';

type Props = { headingRef: RefObject<HTMLHeadingElement | null>; booked: boolean };

export function DemoDone({ headingRef, booked }: Props) {
  // Case studies are linked only once that page is live; until then the visitor goes home.
  const next = LIVE_PAGES.caseStudies ? { label: 'Read case studies', href: '/case-studies' } : { label: 'Back to homepage', href: '/' };
  return (
    <div role="status" className="flex flex-col gap-6 lg:gap-8">
      <div className="flex flex-col gap-3 lg:gap-4">
        <h2 ref={headingRef} tabIndex={-1} className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal outline-none lg:text-[32px] lg:leading-[40px]">
          {booked ? c.done.booked : c.done.received}
        </h2>
        <p className="text-[16px] leading-[24px] text-text-default lg:text-[18px] lg:leading-[27px]">{c.done.line}</p>
      </div>
      <Button href={next.href} className="w-full">
        {next.label}
      </Button>
    </div>
  );
}
