'use client';

import { useEffect, useRef, type InputHTMLAttributes, type Ref } from 'react';
import gsap from 'gsap';
import { expandIn, reducedMotion } from './motion';

/* Static stand-in for the original site's rotating code. This is not a real captcha: nothing checks the code. */
export const CAPTCHA_CODE = 'VKNB62';

// Stable identity, so the ref only fires when the message mounts: its wrapper eases open instead of jumping.
const openIn = (el: HTMLElement | null) => expandIn(el);

type Props = {
  code?: string;
  labelClass: string;
  /** What the form already binds to its inputs: id, name, value, onChange, aria and className. */
  inputProps: InputHTMLAttributes<HTMLInputElement> & { id: string };
  inputRef?: Ref<HTMLInputElement>;
  error?: string;
  onRefresh: () => void;
};

/** "Enter code shown": the input, the code box and the refresh button, as on the Contact form. */
export function CaptchaField({ code = CAPTCHA_CODE, labelClass, inputProps, inputRef, error, onRefresh }: Props) {
  const { id } = inputProps;
  const iconRef = useRef<SVGSVGElement>(null);
  const turns = useRef(0);
  // The code is a static stand-in, so the spin is the only sign the press registered. It adds a full turn per
  // press and retargets from wherever the icon is, so rapid presses keep spinning. No spin under reduced motion.
  const refresh = () => {
    onRefresh();
    if (!iconRef.current || reducedMotion()) return;
    turns.current += 360;
    gsap.to(iconRef.current, { rotation: turns.current, duration: 0.6, ease: 'power3.inOut', overwrite: 'auto' });
  };
  useEffect(() => {
    const icon = iconRef.current;
    return () => {
      if (icon) gsap.killTweensOf(icon);
    };
  }, []);
  // Container query: side by side only when the field's own width fits the input (200px) next to the code box and button.
  return (
    <div className="@container">
      <div className="flex flex-col gap-[10px] @[460px]:flex-row @[460px]:items-start @[460px]:gap-[22px]">
        <div className="flex min-w-0 flex-1 flex-col">
          <label htmlFor={id} className={labelClass}>
            Enter code shown
            <span className="text-[14px] font-medium text-[#207d82]">*</span>
          </label>
          <input type="text" placeholder="Enter code" autoComplete="off" maxLength={12} {...inputProps} ref={inputRef} />
          {error ? (
            <div ref={openIn}>
              <p id={`${id}-error`} role="alert" className="error-in mt-1 text-[14px] text-error">
                {error}
              </p>
            </div>
          ) : null}
        </div>
        <div className="flex items-center gap-[6px] @[460px]:mt-[16px]">
          <div className="flex w-[178px] items-center justify-center rounded-[12px] border-[1.5px] border-brand-teal-100 bg-white px-5 py-[15px]">
            <p className="select-none font-heading text-[19px] font-bold tracking-[3px] text-brand-dark" aria-label={`Code: ${code.split('').join(' ')}`}>
              {code}
            </p>
          </div>
          <button
            type="button"
            aria-label="Refresh code"
            onClick={refresh}
            className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#edf3f1] text-brand-teal"
          >
            <svg ref={iconRef} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 4v6h6M20 20v-6h-6M4.5 15a8 8 0 0014.5 3.5M19.5 9A8 8 0 005 5.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
