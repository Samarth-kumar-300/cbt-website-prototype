import type { RefObject } from 'react';
import { Button } from '@/components/shared/Button';
import { tryDemoContent as c } from './content';
import { SuccessIcon } from './SuccessIcon';

type Props = { headingRef: RefObject<HTMLHeadingElement | null> };

export function DemoDone({ headingRef }: Props) {
  const copy = c.done;
  return (
    <div role="status" className="flex flex-col items-center gap-6 text-center lg:gap-8">
      <SuccessIcon />
      <div className="flex flex-col gap-3 lg:gap-4">
        <h2 ref={headingRef} tabIndex={-1} className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal outline-none lg:text-[32px] lg:leading-[40px]">
          {copy.title}
        </h2>
        <p className="text-[16px] leading-[24px] text-text-default lg:text-[18px] lg:leading-[27px]">{copy.line}</p>
      </div>
      <Button href="/" variant="outline" className="w-full">
        Back to homepage
      </Button>
    </div>
  );
}
