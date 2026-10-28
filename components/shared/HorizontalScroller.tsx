"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Reveal } from "./Reveal";

type Props = {
  label: string;
  children: ReactNode;
  className?: string;
  /** Rendered above the row and pinned together with it (a section heading). */
  header?: ReactNode;
  /** Classes for the block that holds the row and its controls, e.g. the gap under the header. */
  bodyClassName?: string;
};

const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
// Space the fixed site header takes at the top of the screen.
const HEADER_CLEARANCE = 112;

const ARROW_BTN =
  "transition-transform motion-safe:enabled:hover:scale-105 motion-safe:enabled:active:scale-95 flex size-12 items-center justify-center rounded-full border-[1.5px] border-brand-teal-100 bg-white shadow-[0px_4px_10px_0px_rgba(23,94,99,0.1)] disabled:cursor-not-allowed disabled:opacity-40";

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-content-brand">
      <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

const matches = (q: string) => typeof matchMedia === "function" && matchMedia(q).matches;

// A row of cards the visitor scrolls sideways. The row is plain overflow with CSS scroll-snap
// (.hscroll in globals.css), so it works without JavaScript and by swipe on touch devices.
//
// With a mouse or trackpad (fine pointer) and motion allowed, the row is "pinned": the wrapper is
// made as tall as the row's sideways travel, the content sticks to the top of the screen, and the
// page's own downward scroll moves the cards one pixel for one pixel. The page is never blocked:
// when the last card shows, the wrapper ends and the page carries on. Sideways trackpad swipes
// and the arrows are routed through the page scroll so the two never disagree.
export function HorizontalScroller({ label, children, className = "", header, bodyClassName = "" }: Props) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef(false);
  const anchorFixed = useRef(false);
  const [pinned, setPinned] = useState(false);
  const [m, setM] = useState({ overflow: false, canPrev: false, canNext: false, pct: 0, current: 0, total: 0 });

  const measure = useCallback(() => {
    const el = regionRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const overflow = max > 1;
    const first = el.children[0] as HTMLElement | undefined;
    const second = el.children[1] as HTMLElement | undefined;
    const step = first && second ? second.offsetLeft - first.offsetLeft : 0;
    const total = el.children.length;
    // "Cards reached": the last fully visible card, counted from the left edge.
    const atEnd = el.scrollLeft >= max - 1;
    const current = step > 0 ? (atEnd ? total : Math.min(total, Math.floor(el.scrollLeft / step + 0.001) + Math.round(el.clientWidth / step))) : 0;
    setM({
      overflow,
      canPrev: overflow && el.scrollLeft > 1,
      canNext: overflow && !atEnd,
      pct: overflow ? Math.min(100, Math.max(0, (el.scrollLeft / max) * 100)) : 0,
      current,
      total,
    });
  }, []);

  // Pinned mode is a pure function of the device, motion preference and whether there is travel.
  // The pinned class is applied before measuring because it changes the card width (whole cards,
  // no half card at the edge), and with it the row's travel.
  const layout = useCallback(() => {
    const region = regionRef.current;
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!region || !outer || !inner) return;
    const want = matches(FINE_POINTER) && !matches(REDUCED_MOTION);
    outer.classList.toggle("hscroll-pinned", want);
    const max = region.scrollWidth - region.clientWidth;
    const on = want && max > 1;
    if (!on) outer.classList.remove("hscroll-pinned");
    pinnedRef.current = on;
    setPinned(on);
    if (on) {
      // Keep the whole block on screen: centred when there is room, otherwise slid up under the
      // header so the bottom (the progress indicator) is never cut off.
      const free = window.innerHeight - inner.offsetHeight;
      const top = free >= 2 * HEADER_CLEARANCE ? free / 2 : Math.max(8, Math.min(HEADER_CLEARANCE, free - 16));
      inner.style.top = `${top}px`;
      outer.style.height = `${inner.offsetHeight + max}px`;
    } else {
      inner.style.top = "";
      outer.style.height = "";
    }
    // The wrapper only grows now, after the browser already jumped to a #link in the URL, so the jump
    // landed short. Aim at the target again, once.
    if (on && !anchorFixed.current) {
      anchorFixed.current = true;
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id) document.getElementById(id)?.scrollIntoView({ behavior: "instant" as ScrollBehavior, block: "start" });
    }
    measure();
  }, [measure]);

  // Page scroll position to row position, 1:1, clamped to the row's travel.
  const sync = useCallback(() => {
    const region = regionRef.current;
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!pinnedRef.current || !region || !outer || !inner) return;
    const max = region.scrollWidth - region.clientWidth;
    const stickyTop = parseFloat(getComputedStyle(inner).top) || 0;
    const travelled = stickyTop - outer.getBoundingClientRect().top;
    region.scrollLeft = Math.min(Math.max(travelled, 0), max);
  }, []);

  useEffect(() => {
    layout();
    const region = regionRef.current;
    const onScroll = () => sync();
    const onResize = () => {
      layout();
      sync();
    };
    // A sideways swipe becomes page scroll. Needs a non-passive listener to cancel the native one.
    const onWheel = (e: WheelEvent) => {
      if (!pinnedRef.current || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      window.scrollBy({ top: e.deltaX });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    region?.addEventListener("wheel", onWheel, { passive: false });
    let ro: ResizeObserver | undefined;
    if (region && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(onResize);
      ro.observe(region);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      region?.removeEventListener("wheel", onWheel);
      ro?.disconnect();
    };
  }, [layout, sync]);

  // Touch only: once, as the row first scrolls into view, nudge it sideways and back so the
  // peeking card reads as "swipe me". Skipped for reduced motion and when the row is pinned.
  useEffect(() => {
    const region = regionRef.current;
    if (!region || typeof IntersectionObserver === "undefined") return;
    if (matches(REDUCED_MOTION) || !matches("(hover: none) and (pointer: coarse)")) return;
    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        if (pinnedRef.current || region.scrollWidth - region.clientWidth <= 1 || region.scrollLeft > 1) return;
        region.style.scrollSnapType = "none";
        region.scrollTo({ left: 28 });
        timer = window.setTimeout(() => {
          region.scrollTo({ left: 0 });
          timer = window.setTimeout(() => (region.style.scrollSnapType = ""), 500);
        }, 600);
      },
      { threshold: 0.6 },
    );
    io.observe(region);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  const step = (dir: 1 | -1) => {
    const el = regionRef.current;
    if (!el) return;
    const first = el.children[0] as HTMLElement | undefined;
    const second = el.children[1] as HTMLElement | undefined;
    const card = first && second ? second.offsetLeft - first.offsetLeft : el.clientWidth * 0.8;
    const behavior = matches(REDUCED_MOTION) ? "auto" : "smooth";
    if (pinnedRef.current) window.scrollBy({ top: dir * card, behavior });
    else el.scrollBy({ left: dir * card, behavior });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!pinnedRef.current || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
    e.preventDefault();
    step(e.key === "ArrowRight" ? 1 : -1);
  };

  return (
    <div ref={outerRef} data-testid="hscroll-pin" className={`${className} ${pinned ? "hscroll-pinned" : ""}`}>
      <div ref={innerRef} className="hscroll-sticky">
        {header}
        <Reveal className={bodyClassName}>
          <div
            ref={regionRef}
            role="region"
            aria-label={label}
            tabIndex={m.overflow ? 0 : undefined}
            onScroll={measure}
            onKeyDown={onKeyDown}
            className="hscroll"
          >
            {children}
          </div>
          {m.overflow && (
            <div className="mt-5 flex items-center gap-5 lg:mt-8">
              <div className="hscroll-arrows flex items-center gap-5">
                <button type="button" aria-label={`Previous ${label}`} disabled={!m.canPrev} onClick={() => step(-1)} className={ARROW_BTN}>
                  <Chevron dir="left" />
                </button>
                <button type="button" aria-label={`Next ${label}`} disabled={!m.canNext} onClick={() => step(1)} className={ARROW_BTN}>
                  <Chevron dir="right" />
                </button>
              </div>
              <div
                role="progressbar"
                aria-label={`${label} progress`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(m.pct)}
                className="relative h-1 min-w-0 flex-1 overflow-hidden rounded-full bg-brand-teal-100"
              >
                <div className="h-full rounded-full bg-brand-teal" style={{ width: `${m.pct}%` }} />
              </div>
              {m.current > 0 && (
                <span aria-hidden="true" className="shrink-0 text-[14px] font-semibold tabular-nums text-content-brand lg:text-[16px]">
                  {m.current} / {m.total}
                </span>
              )}
            </div>
          )}
        </Reveal>
      </div>
    </div>
  );
}
