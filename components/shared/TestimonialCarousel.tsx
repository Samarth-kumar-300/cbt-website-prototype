"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { reducedMotion } from "./motion";
import { useLiquidThumb } from "./useLiquidThumb";

// A swipeable row of testimonials: native horizontal scroll with snap, so a finger follows the card
// and the next one peeks in. A mouse can drag it too (touch scrolls natively). The dots mirror the
// scroll position and jump to a slide on tap. A teal pill stretches from dot to dot as the slide changes
// (the liquid slide in useLiquidThumb). The index comes from the scroll position, so a quick run of swipes
// retargets the pill each time the nearest slide changes. A tap on a dot aims the pill at that dot at once
// instead of waiting for the scroll to cross the halfway mark.
export function TestimonialCarousel({ slides }: { slides: ReactNode[] }) {
  const [i, setI] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // The dot a tap is scrolling towards, until the scroll arrives or the visitor takes over.
  const [aim, setAim] = useState<number | null>(null);
  const aimTimer = useRef<number | undefined>(undefined);
  const clearAim = useCallback(() => {
    window.clearTimeout(aimTimer.current);
    setAim(null);
  }, []);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el || el.clientWidth === 0) return;
    const n = Math.min(slides.length - 1, Math.max(0, Math.round(el.scrollLeft / el.clientWidth)));
    setI(n);
    setAim((a) => (a === n ? null : a));
  }, [slides.length]);

  const goTo = (n: number) => {
    const el = track.current;
    if (!el) return;
    window.clearTimeout(aimTimer.current);
    if (n !== i) {
      setAim(n);
      aimTimer.current = window.setTimeout(() => setAim(null), 1500);
    }
    el.scrollTo({ left: n * el.clientWidth, behavior: reducedMotion() ? "auto" : "smooth" });
  };

  useLiquidThumb(dotsRef, pillRef, dotRefs, aim ?? i, { axis: "x", squash: false });

  // Keep the current slide in place when the width changes (rotation, resize). Reads the index from a
  // ref and only reacts to a real width change, so it never fights a scroll that is in progress.
  const index = useRef(0);
  useEffect(() => {
    index.current = i;
  }, [i]);
  useEffect(() => {
    const el = track.current;
    if (!el || typeof ResizeObserver === "undefined") return;
    let width = el.clientWidth;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth === width) return;
      width = el.clientWidth;
      el.scrollLeft = index.current * width;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(aimTimer.current), []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    clearAim();
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = track.current;
    if (!el) return;
    drag.current = { x: e.clientX, left: el.scrollLeft };
    el.style.scrollSnapType = "none";
    el.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = track.current;
    if (!drag.current || !el) return;
    el.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = track.current;
    if (!drag.current || !el) return;
    const moved = e.clientX - drag.current.x;
    drag.current = null;
    el.style.scrollSnapType = "";
    const n = Math.round(el.scrollLeft / el.clientWidth + (Math.abs(moved) > 40 ? (moved < 0 ? 0.3 : -0.3) : 0));
    goTo(Math.min(slides.length - 1, Math.max(0, n)));
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div
        ref={track}
        onScroll={sync}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="region"
        aria-roledescription="carousel"
        aria-label="Testimonials"
        className="-mx-2 -my-4 flex cursor-grab snap-x snap-mandatory select-none overflow-x-auto overscroll-x-contain py-4 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, n) => (
          <div key={n} className="flex w-full shrink-0 snap-center snap-always px-2" aria-hidden={n !== i}>
            {slide}
          </div>
        ))}
      </div>
      <div ref={dotsRef} role="tablist" aria-label="Testimonials" className="relative flex w-full items-center justify-center gap-4">
        {slides.map((_, n) => (
          <button
            key={n}
            ref={(el) => {
              dotRefs.current[n] = el;
            }}
            type="button"
            role="tab"
            aria-selected={n === i}
            aria-label={`Go to testimonial ${n + 1}`}
            onClick={() => goTo(n)}
            className={`hit-sm relative size-2 rounded-full ${n === i ? "bg-brand-teal [[data-liquid=ready]_&]:bg-carousel-dot-inactive" : "bg-carousel-dot-inactive"}`}
          />
        ))}
        {/* Sits over the dots, so the active dot's own colour is handed to it once it is measured. */}
        <span
          ref={pillRef}
          aria-hidden="true"
          data-dot-thumb=""
          className="pointer-events-none absolute inset-y-0 z-10 rounded-full bg-brand-teal opacity-0 [[data-liquid=ready]_&]:opacity-100"
        />
      </div>
    </div>
  );
}
