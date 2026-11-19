'use client';

import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { SECONDARY_HOVER } from './Button';
import { COOKIE_KEY } from './cookie-key';
import { clampToggle } from './motion';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  // details drives the button (aria-expanded and its text) at once. clamped drives the line-clamp classes,
  // which clampToggle flips itself and which React only catches up with when the height ease has finished.
  const [details, setDetails] = useState(false);
  const [clamped, setClamped] = useState(true);
  const ref = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLParagraphElement>(null);

  // Consent lives in localStorage, which only exists on the client. Reading it after mount keeps
  // server and first client render identical (banner hidden), avoiding a hydration mismatch.
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(!localStorage.getItem(COOKIE_KEY));
    } catch {
      setVisible(true);
    }
  }, []);

  // On touch layouts the bar sits over the page, so tell the body how tall it is. The body pads
  // itself by that much and the last section is never hidden behind it.
  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    if (!visible || !el || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => root.style.setProperty('--cookie-h', `${el.offsetHeight + 16}px`));
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.setProperty('--cookie-h', '0px');
    };
  }, [visible]);

  // Phone-only Details / Less: the copy eases to its new height instead of snapping.
  const toggleDetails = () => {
    const next = !details;
    setDetails(next);
    const el = copy.current;
    if (!el) {
      setClamped(!next);
      return;
    }
    // A second tap mid-ease starts from the natural height, not from the half-eased inline one. The copy
    // is clipped while it eases open so the lines still to come do not spill over what sits below.
    gsap.killTweensOf(el);
    el.style.removeProperty('height');
    el.style.overflow = 'hidden';
    clampToggle(el, ['line-clamp-2', 'sm:line-clamp-none'], next, () => {
      el.style.removeProperty('overflow');
      setClamped(!next);
    });
  };

  const choose = (value: 'accepted' | 'rejected') => {
    try {
      localStorage.setItem(COOKIE_KEY, value);
    } catch {
      /* storage blocked: still dismiss for this visit */
    }
    const reduce = typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setVisible(false);
      return;
    }
    setLeaving(true);
    window.setTimeout(() => setVisible(false), 250);
  };

  if (!visible) return null;
  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Cookie preferences"
      className={`${leaving ? 'cookie-out' : 'cookie-in'} fixed bottom-[max(8px,env(safe-area-inset-bottom))] left-2 right-2 z-50 flex flex-col gap-1.5 rounded-2xl bg-white px-3 pb-3 pt-2 sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-[390px] sm:gap-5 sm:p-6 shadow-[0px_0px_20px_rgba(10,13,18,0.14),0px_0px_2.5px_rgba(10,13,18,0.04)] sm:right-auto`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="font-heading text-[16px] font-bold leading-[24px] text-brand-dark sm:text-[18px] sm:leading-[26px]">We value your privacy</p>
        <button type="button" aria-label="Close" onClick={() => choose('rejected')} className="-m-3 flex size-11 items-center justify-center text-brand-dark transition-transform motion-safe:active:scale-95 lg:m-0 lg:size-auto">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {/* On phones the copy is clamped to two lines; "Details" shows the rest. Same words either way. The clamp
          sits on the paragraph so its height can ease; that clips to the box, so the focus ring is drawn inside it. */}
      <p ref={copy} className={`relative text-[13px] leading-[18px] text-text-default sm:text-[12px] ${clamped ? 'line-clamp-2 sm:line-clamp-none' : ''}`}>
        <span>
          We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our use of cookies.
        </span>
        <button
          type="button"
          aria-expanded={details}
          onClick={toggleDetails}
          className={`font-semibold text-brand-teal underline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-teal sm:hidden ${details ? 'ml-1' : 'absolute bottom-0 right-0 bg-white pl-2'}`}
        >
          {details ? 'Less' : 'Details'}
        </button>
      </p>
      <div className="flex gap-3">
        <button type="button" onClick={() => choose('rejected')} className={`flex-1 rounded-full border-[1.5px] transition-[transform,color,background-color] motion-safe:active:scale-[0.98] border-brand-teal min-h-[44px] py-[10px] text-[14px] font-semibold text-brand-teal ${SECONDARY_HOVER}`}>
          Reject all
        </button>
        <button type="button" onClick={() => choose('accepted')} className="flex-1 rounded-full transition-transform motion-safe:active:scale-[0.98] bg-brand-teal min-h-[44px] py-[10px] text-[14px] font-semibold text-content-knockout hover:bg-[#0f4548]">
          Accept all
        </button>
      </div>
    </div>
  );
}
