import type { RefObject } from 'react';
import { Calendly } from './Calendly';
import { tryDemoContent as c } from './content';

type Props = {
  headingRef: RefObject<HTMLHeadingElement | null>;
  url: string;
  name: string;
  email: string;
  onBooked: () => void;
  onSkipped: () => void;
};

export function DemoSchedule({ headingRef, url, name, email, onBooked, onSkipped }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <h2 ref={headingRef} tabIndex={-1} className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal outline-none lg:text-[32px] lg:leading-[40px]">
          {c.schedule.title}
        </h2>
        <p className="text-[16px] leading-[24px] text-text-default lg:text-[18px] lg:leading-[27px]">{c.schedule.helper}</p>
      </div>
      <Calendly url={url} name={name} email={email} onBooked={onBooked} onFailed={onSkipped} />
      <button
        type="button"
        onClick={onSkipped}
        className="min-h-[44px] self-start text-[16px] font-semibold text-content-brand underline-offset-4 hover:underline focus-visible:underline"
      >
        {c.schedule.later}
      </button>
    </div>
  );
}
