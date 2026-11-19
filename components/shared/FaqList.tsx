"use client";

import { useRef, useState } from "react";
import { FaqCards, type FaqCardIcon, type FaqCardItem } from "./FaqCards";
import { reducedMotion, staggerIn, useIsoLayoutEffect } from "./motion";

const VISIBLE_COUNT = 3;

/** Shows the first three FAQs; "View All" reveals the rest, and the new cards rise in one after the other. */
export function FaqList({
  items,
  icons,
  questionColor,
}: {
  items: readonly FaqCardItem[];
  icons: readonly FaqCardIcon[];
  questionColor?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const canExpand = items.length > VISIBLE_COUNT;
  const shown = expanded ? items : items.slice(0, VISIBLE_COUNT);
  const box = useRef<HTMLDivElement>(null);

  // Enter only: the extra cards are already in the DOM when this runs (before paint), and rise in from
  // their own spot. The card group's CSS transition on opacity and transform would lag the tween, so it is
  // switched off for the length of the entrance.
  useIsoLayoutEffect(() => {
    if (!expanded || reducedMotion()) return;
    const extra = Array.from(box.current?.querySelectorAll<HTMLElement>(".faq-card") ?? []).slice(VISIBLE_COUNT);
    if (!extra.length) return;
    extra.forEach((el) => el.style.setProperty("transition", "none"));
    staggerIn(extra);
    const done = window.setTimeout(() => extra.forEach((el) => el.style.removeProperty("transition")), 400 + extra.length * 60 + 200);
    return () => window.clearTimeout(done);
  }, [expanded]);

  return (
    <div ref={box} className="flex w-full flex-col gap-4 lg:w-auto lg:flex-1">
      <FaqCards items={shown} icons={icons} questionColor={questionColor} />
      {canExpand && !expanded && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="-mr-3 inline-flex min-h-[44px] items-center px-3 text-[16px] font-semibold text-brand-teal transition-colors hover:text-[#0f4548]"
          >
            View all
          </button>
        </div>
      )}
    </div>
  );
}
