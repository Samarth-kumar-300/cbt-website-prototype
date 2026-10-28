"use client";

import { useState } from "react";
import { FaqCards, type FaqCardIcon, type FaqCardItem } from "./FaqCards";

const VISIBLE_COUNT = 3;

/** Shows the first three FAQs; "View All" reveals the rest. */
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

  return (
    <div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-1">
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
