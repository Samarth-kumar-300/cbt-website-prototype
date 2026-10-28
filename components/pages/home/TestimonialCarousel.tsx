"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

// A swipeable row of testimonials: native horizontal scroll with snap, so a finger follows the card
// and the next one peeks in. A mouse can drag it too (touch scrolls natively). The dots mirror the
// scroll position and jump to a slide on tap.
export function TestimonialCarousel({ slides }: { slides: ReactNode[] }) {
  const [i, setI] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el || el.clientWidth === 0) return;
    const n = Math.round(el.scrollLeft / el.clientWidth);
    setI(Math.min(slides.length - 1, Math.max(0, n)));
  }, [slides.length]);

  const goTo = (n: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: n * el.clientWidth, behavior: "smooth" });
  };

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

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
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
        className="-my-4 flex cursor-grab snap-x snap-mandatory select-none overflow-x-auto overscroll-x-contain py-4 [scrollbar-width:none] active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, n) => (
          <div key={n} className="flex w-full shrink-0 snap-center snap-always" aria-hidden={n !== i}>
            {slide}
          </div>
        ))}
      </div>
      <div role="tablist" aria-label="Testimonials" className="flex w-full items-center justify-center gap-4">
        {slides.map((_, n) => (
          <button
            key={n}
            type="button"
            role="tab"
            aria-selected={n === i}
            aria-label={`Go to testimonial ${n + 1}`}
            onClick={() => goTo(n)}
            className={`hit-sm relative size-2 rounded-full ${n === i ? "bg-brand-teal" : "bg-carousel-dot-inactive"}`}
          />
        ))}
      </div>
    </div>
  );
}
