"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

/** Scroll distance spent on each stage, as a share of the viewport height. */
const STAGE_VH = 45;
const STAGE_VH_TOUCH = 28;
const MAX_PIN_VH_TOUCH = 110;
/** Header pill height plus the breathing room under it. */
const TOP_GUTTER = 72;
const BOTTOM_GUTTER = 24;
/** Below this viewport height (or in a landscape phone) there is no room to pin. */
const MIN_PIN_HEIGHT = 560;
const FLOW_QUERY = "(prefers-reduced-motion: reduce)";

function viewportTooShort() {
  const landscapePhone = window.matchMedia("(orientation: landscape) and (max-height: 500px)").matches;
  return window.innerHeight < MIN_PIN_HEIGHT || landscapePhone;
}

/**
 * Pins its content to the viewport and walks through `count` stages as the page scrolls, then lets
 * the page continue. `active` is the current stage; `--stage-p` (0 to 1) on the outer element is the
 * scroll progress through that stage, written straight to the DOM so scrolling never re-renders.
 *
 * Where pinning cannot work (short or landscape screens, reduced motion, or content taller than the
 * screen) it falls back to "flow": no pin, no extra height, every stage open (`flow === true`).
 * `goTo(i)` scrolls to a stage, so a tap and the scroll position always agree.
 */
export function PinnedStages({
  count,
  className = "",
  children,
}: {
  count: number;
  className?: string;
  children: (active: number, flow: boolean, goTo: (i: number) => void) => ReactNode;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [flow, setFlow] = useState(false);

  // Decide pinned vs flow. Pinned is tried first and measured, so only content that really fits stays pinned.
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const reduce = window.matchMedia(FLOW_QUERY);
    const decide = () => {
      if (reduce.matches || viewportTooShort()) return setFlow(true);
      setFlow(false);
      requestAnimationFrame(() => {
        const el = content.current;
        if (!el) return;
        const room = window.innerHeight - TOP_GUTTER - BOTTOM_GUTTER;
        if (el.scrollHeight > room) setFlow(true);
      });
    };
    decide();
    window.addEventListener("resize", decide);
    reduce.addEventListener("change", decide);
    return () => {
      window.removeEventListener("resize", decide);
      reduce.removeEventListener("change", decide);
    };
  }, []);

  useEffect(() => {
    const el = outer.current;
    if (!el || flow) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      const t = progress * count;
      const index = Math.min(count - 1, Math.floor(t));
      el.style.setProperty("--stage-p", Math.min(1, t - index).toFixed(4));
      setActive((prev) => (prev === index ? prev : index));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [count, flow]);

  const goTo = useCallback(
    (i: number) => {
      const el = outer.current;
      if (!el) return;
      if (flow) {
        setActive(i);
        return;
      }
      const travel = el.offsetHeight - window.innerHeight;
      const top = el.getBoundingClientRect().top + window.scrollY + ((i + 0.05) / count) * travel;
      const reduce = window.matchMedia(FLOW_QUERY).matches;
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    },
    [count, flow],
  );

  if (flow) {
    return (
      <div ref={outer} className={`py-10 lg:py-14 ${className}`}>
        {/* goTo only touches refs when called from an event handler, never during render. */}
        {/* eslint-disable-next-line react-hooks/refs */}
        <div ref={content}>{children(active, true, goTo)}</div>
      </div>
    );
  }

  return (
    <div
      ref={outer}
      className="-my-6 h-[calc(100svh+var(--pin))] [--pin:var(--pin-touch)] lg:-my-10 lg:[--pin:var(--pin-desktop)]"
      style={
        {
          "--pin-desktop": `${count * STAGE_VH}svh`,
          "--pin-touch": `${Math.min(count * STAGE_VH_TOUCH, MAX_PIN_VH_TOUCH)}svh`,
        } as CSSProperties
      }
    >
      <div className={`sticky top-0 flex h-svh items-center ${className}`}>
        <div ref={content} className="w-full">
          {/* eslint-disable-next-line react-hooks/refs */}
          {children(active, false, goTo)}
        </div>
      </div>
    </div>
  );
}

/** One row of a pinned list: the header always shows, the body and progress bar only while active. */
export function StageCard({
  active,
  showBar = true,
  lead,
  title,
  titleColor,
  strokeColor,
  fillColor,
  barColor,
  onSelect,
  children,
}: {
  active: boolean;
  /** The progress bar only means something while pinned. */
  showBar?: boolean;
  lead?: ReactNode;
  title: string;
  titleColor: string;
  /** Optional: while active, the card's border (0.75px, half the usual) takes this colour. */
  strokeColor?: string;
  /** Optional: while active, the card's background (and its border) take this colour. */
  fillColor?: string;
  /** Optional: the progress bar colour (defaults to the stroke colour, then the teal tint). */
  barColor?: string;
  onSelect?: () => void;
  children: ReactNode;
}) {
  const header = (
    <>
      {lead}
      <span className="flex-1 font-heading text-[16px] font-bold leading-[24px] lg:text-[20px] lg:leading-[26px]" style={{ color: titleColor }}>
        {title}
      </span>
    </>
  );
  return (
    <div
      className={`relative w-full overflow-hidden rounded-[18px] border-[1.5px] border-brand-teal-100 bg-white shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] transition-[background-color,border-color] duration-500 ${active && strokeColor ? "stage-stroke" : ""}`}
      style={
        active && (strokeColor || fillColor)
          ? { borderColor: strokeColor ?? fillColor, ...(fillColor ? { backgroundColor: fillColor } : null) }
          : undefined
      }
    >
      {onSelect ? (
        <button
          type="button"
          aria-expanded={active}
          onClick={onSelect}
          className="flex min-h-[44px] w-full items-start gap-3 px-4 pt-4 text-left lg:px-6 lg:pt-5"
        >
          {header}
        </button>
      ) : (
        <div className="flex w-full items-start gap-3 px-4 pt-4 lg:px-6 lg:pt-5">{header}</div>
      )}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-[350ms] ease-in-out ${active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        inert={!active}
      >
        <div className="overflow-hidden">
          <div className={`px-4 pt-2 text-[14px] leading-[22px] text-text-default lg:px-6 lg:text-[18px] lg:leading-[27px] ${lead ? "pl-[56px] lg:pl-[68px]" : ""}`}>
            {children}
          </div>
        </div>
      </div>
      <div className="h-4 lg:h-5" aria-hidden="true" />
      {showBar ? (
        <span
          aria-hidden="true"
          className={`absolute inset-x-0 bottom-0 h-[3px] transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}
        >
          <span
            className="block h-full origin-left"
            style={{ background: barColor ?? strokeColor ?? "var(--color-brand-teal-100)", transform: "scaleX(var(--stage-p, 0))" }}
          />
        </span>
      ) : null}
    </div>
  );
}
