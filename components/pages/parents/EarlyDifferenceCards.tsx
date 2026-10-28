"use client";

import { useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/shared/Reveal";

const cards = [
  {
    left: "69.66292134831461",
    top: "7.865937072503421",
    width: "30.337078651685395",
    accent: "#9a3fa0",
    bg: "#f4e4f5",
    path: "M20 21c0-1.396 0-2.093-.172-2.661a4 4 0 0 0-2.667-2.667c-.568-.172-1.265-.172-2.661-.172h-5c-1.396 0-2.093 0-2.661.172a4 4 0 0 0-2.667 2.667C4 18.907 4 19.604 4 21M16.5 7.5a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z",
    title: "Connecting with others feels different",
    body: "Children may respond differently to their name, make less eye contact or find social interaction more challenging.",
  },
  {
    left: "71.107544141252",
    top: "69.0560875512996",
    width: "28.009630818619584",
    accent: "#387792",
    bg: "#dff4fd",
    path: "M12 2v2m0 16v2M4 12H2m4.314-5.686L4.9 4.9m12.786 1.414L19.1 4.9M6.314 17.69 4.9 19.104m12.786-1.414 1.414 1.414M22 12h-2m-3 0a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z",
    title: "Sensitive to everyday sensations",
    body: "Autistic children may be more or less sensitive to sounds, lights, textures, touch or other sensory experiences.",
  },
  {
    left: "2.247191011235955",
    top: "68.39945280437757",
    width: "27.52808988764045",
    accent: "#c07158",
    bg: "#fce8e2",
    path: "M21 10s-2.005-2.732-3.634-4.362a9 9 0 1 0 2.282 8.862M21 10V4m0 6h-6",
    title: "Comfort in routine",
    body: "Many autistic children prefer familiar routines and may find unexpected changes or transitions difficult.",
  },
  {
    left: "0.40128410914927765",
    top: "0.4103967168262654",
    width: "25.76243980738363",
    accent: "#175f63",
    bg: "#f1f8f8",
    path: "M3 7.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C5.28 3 6.12 3 7.8 3h8.4c1.68 0 2.52 0 3.162.327a3 3 0 0 1 1.311 1.311C21 5.28 21 6.12 21 7.8v5.4c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C18.72 18 17.88 18 16.2 18H9.684c-.624 0-.936 0-1.235.061a2.997 2.997 0 0 0-.762.267c-.27.14-.514.334-1.002.724L4.3 20.96c-.416.333-.624.5-.8.5a.5.5 0 0 1-.39-.188C3 21.135 3 20.868 3 20.336V7.8Z",
    title: "Speech develops differently",
    body: "Speech may develop later than expected or a child may communicate using words, gestures, sounds or other forms of communication.",
  },
];

const MOBILE_ORDER = [3, 0, 2, 1]; // reading order on phones: speech, connecting, routine, sensations

/** Phones: the same four cards as a single-open list under the image. Tap a card to open it. */
function EarlyDifferenceList() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="mt-6 flex flex-col gap-6 lg:hidden">
      <Reveal className="relative aspect-[350/246] w-full">
        <Image
          src="/images/parents/parents-early-differences.webp"
          alt="A mother on a pink sofa watching a boy play with a rocket toy, with a teddy bear and building blocks"
          fill
          sizes="92vw"
          className="object-contain"
        />
      </Reveal>
      <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:items-start sm:gap-4">
        {MOBILE_ORDER.map((idx) => {
          const c = cards[idx];
          const isOpen = open === idx;
          return (
            <div
              key={c.title}
              data-active={isOpen}
              className="overflow-hidden rounded-[18px] border-[1.5px] border-brand-teal-100 bg-white shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] transition-[border-color,box-shadow] duration-300 ease-in-out data-[active=true]:border-[var(--card-accent)] data-[active=true]:shadow-[0px_12px_26px_-8px_rgba(23,94,99,0.16)]"
              style={{ "--card-accent": c.accent }}
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : idx)}
                className="flex min-h-[44px] w-full items-center gap-3 p-[18px] text-left"
              >
                <span
                  className="flex size-[44px] shrink-0 items-center justify-center rounded-[14px]"
                  style={{ backgroundColor: c.bg }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ color: c.accent }}
                  >
                    <path d={c.path} />
                  </svg>
                </span>
                <span className="flex-1 font-heading text-[16px] font-bold leading-[27px] text-content-brand-alt">
                  {c.title}
                </span>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  aria-hidden="true"
                  className={`shrink-0 text-content-brand-alt transition-transform duration-300 ease-in-out ${isOpen ? "rotate-90" : ""}`}
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-[350ms] ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
                inert={!isOpen}
              >
                <div className="overflow-hidden">
                  <p className="px-[18px] pb-[18px] text-[14px] leading-[22px] text-text-secondary">
                    {c.body}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Four cards around the hero image. Only the hovered (or focused / tapped) card shows its description. */
export function EarlyDifferenceCards() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <EarlyDifferenceList />
      <Reveal
        className="relative mt-10 hidden lg:block"
        style={{ aspectRatio: "1246 / 731" }}
      >
        <div
          data-motion-image
          className="absolute"
          style={{
            left: "19.26163723916533%",
            top: "11.49110807113543%",
            width: "61.47672552166934%",
            aspectRatio: "766 / 538",
          }}
        >
          <Image
            src="/images/parents/parents-early-differences.webp"
            alt="A mother on a pink sofa watching a boy play with a rocket toy, with a teddy bear and building blocks"
            fill
            sizes="(min-width: 1024px) 766px, 0px"
            className="object-contain"
          />
        </div>
        {cards.map((c, i) => {
          const isOpen = open === i;
          return (
            <div
              key={c.title}
              tabIndex={0}
              aria-expanded={isOpen}
              onMouseEnter={() => setOpen(i)}
              onMouseLeave={() => setOpen((o) => (o === i ? null : o))}
              onFocus={() => setOpen(i)}
              onBlur={() => setOpen((o) => (o === i ? null : o))}
              className={`absolute flex flex-col rounded-[18px] border-[1.5px] bg-white p-6 shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] outline-none transition-[border-color,box-shadow] duration-300 ease-in-out focus-visible:border-[var(--card-accent)] ${isOpen ? "z-10 border-[var(--card-accent)] shadow-[0px_16px_32px_-8px_rgba(23,94,99,0.18)]" : "border-brand-teal-100"}`}
              style={{
                left: `${c.left}%`,
                top: `${c.top}%`,
                width: `${c.width}%`,
                "--card-accent": c.accent,
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="flex size-[50px] shrink-0 items-center justify-center rounded-[14px]"
                  style={{ backgroundColor: c.bg }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ color: c.accent }}
                  >
                    <path d={c.path} />
                  </svg>
                </span>
                <p className="flex-1 font-heading text-[20px] font-bold leading-[26px] text-brand-dark">
                  {c.title}
                </p>
              </div>
              <div
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <p className="pt-3 text-[18px] leading-[27px] text-text-muted">
                    {c.body}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </Reveal>
    </>
  );
}
