'use client';

import { useEffect, useState, type RefObject } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/shared/Button';
import { tryDemoContent as c } from './content';
import { SuccessIcon } from './SuccessIcon';

type Props = { headingRef: RefObject<HTMLHeadingElement | null> };

const REDIRECT_SECONDS = 3;

export function DemoDone({ headingRef }: Props) {
  const copy = c.done;
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (secondsLeft === 0) {
      router.push('/');
      return;
    }
    const tick = setTimeout(() => setSecondsLeft((n) => n - 1), 1000);
    return () => clearTimeout(tick);
  }, [secondsLeft, router]);

  return (
    <div className="flex flex-col items-center gap-6 text-center lg:gap-8">
      <div role="status" className="flex flex-col items-center gap-6 lg:gap-8">
        <SuccessIcon />
        <div className="flex flex-col gap-3 lg:gap-4">
          <h2 ref={headingRef} tabIndex={-1} className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal outline-none lg:text-[32px] lg:leading-[40px]">
            {copy.title}
          </h2>
          <p className="text-[16px] leading-[24px] text-text-default lg:text-[18px] lg:leading-[27px]">{copy.line}</p>
        </div>
      </div>
      {/* Outside the status region so screen readers don't announce every tick. */}
      <p className="text-[14px] leading-[20px] text-text-default lg:text-[16px] lg:leading-[24px]">
        {copy.redirect} <span className="font-semibold tabular-nums">{secondsLeft}s</span>
      </p>
      <Button href="/" variant="outline" className="w-full">
        Back to homepage
      </Button>
    </div>
  );
}
