"use client";

import { useId, useState, type CSSProperties } from "react";
import { RevealStagger } from "./RevealStagger";
import { FAQ_MODE } from "./faq-config";

export type FaqCardLink = { readonly text: string; readonly href: string };

export type FaqCardItem = {
  readonly q: string;
  readonly a: string;
  /** Extra lines under the answer (study title, journal, ...). A line equal to a link label renders as that link. */
  readonly source?: readonly string[];
  readonly links?: readonly FaqCardLink[];
};

/** Per-question icon: tinted circle (`bg`), stroke colour (`fg`) and the stroked SVG path data (24x24 viewBox). */
export type FaqCardIcon = {
  readonly bg: string;
  readonly fg: string;
  readonly paths: readonly string[];
};

/** Used when `icons[i]` is missing: a neutral help-circle. */
export const DEFAULT_FAQ_ICON: FaqCardIcon = {
  bg: "#eef9f9",
  fg: "#207d82",
  paths: [
    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z",
    "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
    "M12 17h.01",
  ],
};

type CitationRow =
  | { kind: "text"; key: string; text: string }
  | { kind: "link"; key: string; text: string; href: string; hint?: string };

// Rows under an answer: the CTA label is the link text (a source line equal to a link label is
// the link itself, not repeated as plain text); the other source lines stay plain text. Links
// sharing a label get a visually hidden suffix (after the label) so their accessible names stay distinct.
function citationRows(it: FaqCardItem): CitationRow[] {
  const links = [...(it.links ?? [])];
  const labelCount = (text: string) =>
    links.filter((l) => l.text === text).length;
  const used = new Set<number>();
  const linkRow = (i: number): CitationRow => {
    const l = links[i];
    used.add(i);
    const same = labelCount(l.text);
    const nth = links.slice(0, i + 1).filter((x) => x.text === l.text).length;
    return {
      kind: "link",
      key: l.href,
      text: l.text,
      href: l.href,
      hint: same > 1 ? ` (${nth} of ${same})` : undefined,
    };
  };
  const rows: CitationRow[] = [];
  for (const line of it.source ?? []) {
    const i = links.findIndex((l, idx) => l.text === line && !used.has(idx));
    rows.push(i >= 0 ? linkRow(i) : { kind: "text", key: line, text: line });
  }
  links.forEach((_, i) => {
    if (!used.has(i)) rows.push(linkRow(i));
  });
  return rows;
}

/**
 * Card-style FAQ list (rounded icon cards with a +/- toggle), as on the original site.
 * Renders only the card stack; the page's own section owns the wrapper and the heading.
 */
export function FaqCards({
  items,
  icons = [],
  questionColor = "var(--color-brand-dark)",
}: {
  items: readonly FaqCardItem[];
  /** Parallel to `items`; a missing entry falls back to `DEFAULT_FAQ_ICON`. */
  icons?: readonly FaqCardIcon[];
  /** Desktop question text and +/- colour (CSS colour or var()). */
  questionColor?: string;
}) {
  const [open, setOpen] = useState<number[]>([]);
  const base = useId();
  const toggle = (i: number) =>
    setOpen((o) =>
      o.includes(i)
        ? o.filter((x) => x !== i)
        : FAQ_MODE === "single"
          ? [i]
          : [...o, i],
    );
  const colorVars = {
    "--faq-question-color": questionColor,
  } as CSSProperties;

  return (
    <RevealStagger className="flex flex-1 flex-col items-start gap-3 lg:gap-[14px]">
      {items.map((it, i) => {
        const isOpen = open.includes(i);
        const panelId = `${base}-${i}`;
        const buttonId = `${base}-${i}-btn`;
        const icon = icons[i] ?? DEFAULT_FAQ_ICON;
        const rows = it.source || it.links ? citationRows(it) : [];
        return (
          <div
            key={panelId}
            className={`faq-card w-full rounded-[14px] border p-4 lg:rounded-2xl lg:border-[1.5px] lg:px-[26px] lg:py-[22px] lg:border-[#f3f4f6] ${
              isOpen
                ? "border-[#d6e8e6] bg-brand-subtle-bg"
                : "border-[#eae7ee] bg-white"
            }`}
          >
            <button
              type="button"
              id={buttonId}
              className="flex w-full cursor-pointer items-center gap-3 text-left lg:gap-[14px]"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(i)}
            >
              <span
                data-icon
                className="faq-icon flex size-7 shrink-0 items-center justify-center rounded-full lg:size-[38px]"
                style={{ backgroundColor: icon.bg }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ color: icon.fg }}
                >
                  {icon.paths.map((d) => (
                    <path key={d} d={d}></path>
                  ))}
                </svg>
              </span>
              <span
                className="flex-1 font-heading text-[16px] font-bold leading-[27px] text-[color:var(--faq-question-mobile)] lg:text-[20px] lg:text-[color:var(--faq-question-color)]"
                style={
                  {
                    ...colorVars,
                    "--faq-question-mobile": "var(--color-text-default)",
                  } as CSSProperties
                }
              >
                {it.q}
              </span>
              {/* Plus becomes minus: the vertical stroke collapses rather than the glyph swapping. */}
              <svg
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="flex size-6 shrink-0 text-text-default lg:text-[color:var(--faq-question-color)]"
                style={colorVars}
              >
                <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path
                  d="M12 5v14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className={`faq-plus-bar origin-center transition-transform duration-300 ease-out ${isOpen ? "scale-y-0" : ""}`}
                />
              </svg>
            </button>
            {/* Closed answers stay in the DOM for crawlers; inert keeps their links out of tab order. */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <div className="mt-3 flex flex-col gap-3 pl-10 lg:mt-4 lg:pl-[52px]">
                  <p className="text-[14px] leading-[22px] text-text-secondary lg:text-[18px] lg:leading-[27px] lg:text-text-default">
                    {it.a}
                  </p>
                  {rows.length > 0 ? (
                    <p className="text-[14px] leading-[20px] text-[#646871] lg:text-[14px] lg:leading-[21px]">
                      {rows.map((row) =>
                        row.kind === "text" ? (
                          <span key={row.key} className="block">
                            {row.text}
                          </span>
                        ) : (
                          <span key={row.key} className="block">
                            <a
                              href={row.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="break-words underline"
                            >
                              {row.text}
                              {row.hint ? (
                                <span className="sr-only">{row.hint}</span>
                              ) : null}
                            </a>
                          </span>
                        ),
                      )}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </RevealStagger>
  );
}
