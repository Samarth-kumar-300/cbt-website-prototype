'use client';

import { useEffect, type RefObject } from 'react';
import { Button } from '@/components/shared/Button';
import type { DemoMeeting } from '@/lib/demo-meeting';
import { tryDemoContent as c } from './content';
import { SuccessIcon } from './SuccessIcon';

type Props = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  /** The slot the visitor picked. Absent when the booking source can't tell us (the email still has it). */
  meeting?: DemoMeeting | null;
};

// Light teal card (brand-subtle-bg), the same tint as the icon ring above it.
function MeetingCard({ meeting }: { meeting: DemoMeeting }) {
  const rows = [
    [c.done.dateLabel, meeting.date],
    [c.done.timeLabel, meeting.time],
  ] as const;
  return (
    <dl className="m-0 flex w-full flex-col gap-2 rounded-[16px] border border-brand-subtle-bg bg-brand-subtle-bg p-5 text-left">
      {rows.map(([label, value]) => (
        <div key={label} className="flex gap-4">
          <dt className="w-14 shrink-0 text-[16px] leading-[26px] text-[#4b5563]">{label}</dt>
          <dd className="m-0 font-heading text-[17px] font-bold leading-[26px] text-text-default">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

// The visitor leaves when they choose to, so there is time to read and check the slot.
export function DemoDone({ headingRef, meeting }: Props) {
  // The tab says what happened. Next streams the page's own title in late, which on a reload lands after
  // this effect and would put "Book a demo" back, so the title is set again whenever the head changes.
  useEffect(() => {
    const apply = () => {
      if (document.title !== c.done.pageTitle) document.title = c.done.pageTitle;
    };
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 text-center lg:gap-8">
      <div role="status" className="flex w-full flex-col items-center gap-6 lg:gap-8">
        <SuccessIcon />
        <div className="flex flex-col gap-3 lg:gap-4">
          <h2 ref={headingRef} tabIndex={-1} className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal outline-none lg:text-[32px] lg:leading-[40px]">
            {c.done.title}
          </h2>
          <p className="text-[16px] leading-[24px] text-text-default lg:text-[18px] lg:leading-[27px]">{c.done.line}</p>
        </div>
        {meeting ? <MeetingCard meeting={meeting} /> : null}
      </div>
      <Button href="/" variant="outline" className="w-full">
        {c.done.home}
      </Button>
    </div>
  );
}
