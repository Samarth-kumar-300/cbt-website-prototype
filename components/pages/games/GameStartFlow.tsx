'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gamesContent as c } from './content';

export type FlowStep = 'permission' | 'started';

const MAC_FONT = "font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Text','Helvetica_Neue',system-ui,sans-serif]";

// Stand-in for the real game. A game with no playable URL yet still answers Play now:
// first a dialog that looks like the macOS microphone prompt, then a 30% black overlay on the whole screen.
// It renders in a portal because the cards carry transforms, which would pin a fixed layer to the card.
export function GameStartFlow({ gameName, step, onAllow, onDeny, onClose }: { gameName: string; step: FlowStep; onAllow: () => void; onDeny: () => void; onClose: () => void }) {
  const allowRef = useRef<HTMLButtonElement>(null);
  const denyRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // The page behind stays put while either layer is open.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // macOS puts the focus ring on OK, the default button. Escape answers Don't allow, and Tab stays inside the layer.
  useEffect(() => {
    (step === 'permission' ? allowRef : closeRef).current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        (step === 'permission' ? onDeny : onClose)();
      } else if (e.key === 'Tab') {
        const order = step === 'permission' ? [denyRef.current, allowRef.current] : [closeRef.current];
        const at = order.indexOf(document.activeElement as HTMLButtonElement);
        const next = e.shiftKey ? (at <= 0 ? order.length - 1 : at - 1) : at === order.length - 1 ? 0 : at + 1;
        e.preventDefault();
        order[next]?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [step, onDeny, onClose]);

  return createPortal(
    step === 'permission' ? (
      // No dimming here: the macOS prompt floats over the page. The transparent layer only blocks clicks behind it.
      <div data-testid="mic-permission-layer" className="fixed inset-0 z-[100] flex items-center justify-center p-5">
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="mic-permission-title"
          aria-describedby="mic-permission-body"
          data-testid="mic-permission"
          className={`dialog-panel-in ${MAC_FONT} flex w-[260px] flex-col items-center rounded-[14px] border border-black/10 bg-[#ececec]/85 px-5 pb-4 pt-5 text-center shadow-[0px_22px_70px_4px_rgba(0,0,0,0.3),0px_0px_0px_0.5px_rgba(0,0,0,0.25)] backdrop-blur-[40px] backdrop-saturate-150`}
        >
          <span aria-hidden="true" className="flex size-[56px] items-center justify-center rounded-[13px] bg-gradient-to-b from-[#8e8e93] to-[#636366] shadow-[0px_1px_3px_rgba(0,0,0,0.25)]">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="2.5" width="6" height="12" rx="3" fill="#fff" />
              <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3.5" />
            </svg>
          </span>
          <h2 id="mic-permission-title" className="mt-3 text-[13px] font-bold leading-[16px] text-black/85">
            {c.startFlow.permissionTitle}
          </h2>
          <p id="mic-permission-body" className="mt-[6px] text-[11px] leading-[14px] text-black/60">
            {c.startFlow.permissionBody}
          </p>
          <div className="mt-4 flex w-full gap-2">
            <button
              ref={denyRef}
              type="button"
              onClick={onDeny}
              className="h-[22px] flex-1 rounded-[6px] border border-black/10 bg-white text-[13px] text-black/85 shadow-[0px_0.5px_1px_rgba(0,0,0,0.2)] active:bg-[#f0f0f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff]"
            >
              {c.startFlow.deny}
            </button>
            <button
              ref={allowRef}
              type="button"
              onClick={onAllow}
              className="h-[22px] flex-1 rounded-[6px] bg-gradient-to-b from-[#3b9cff] to-[#0a7aff] text-[13px] font-medium text-white shadow-[0px_0.5px_1px_rgba(0,0,0,0.3)] active:from-[#2b8cf0] active:to-[#0068e0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a84ff]"
            >
              {c.startFlow.allow}
            </button>
          </div>
        </div>
      </div>
    ) : (
      <div role="dialog" aria-modal="true" aria-label={`${gameName}: ${c.startFlow.started}`} data-testid="game-started" className="dialog-backdrop-in fixed inset-0 z-[100] flex flex-col items-center justify-center gap-5 bg-black/30 px-5 text-center">
        <p className="font-heading text-[28px] font-semibold leading-[36px] text-white sm:text-[40px] sm:leading-[48px]">{c.startFlow.started}</p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="inline-flex min-h-[44px] items-center rounded-full bg-white px-6 py-2 text-[16px] font-bold text-brand-teal hover:bg-brand-teal-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {c.startFlow.close}
        </button>
      </div>
    ),
    document.body,
  );
}
