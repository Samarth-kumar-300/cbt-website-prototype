"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const QUOTES = [
  {
    color: "#a85923",
    name: "Tejaswi Kumar",
    avatar: "tejaswi",
    role: "Parent",
    text: "We haven’t seen such a variety of activities in other apps or cartoons. He enjoys them and has even started using the app independently. Over the past two months, he has begun saying his name, answering questions and responding to people.",
  },
  {
    color: "#4ca154",
    name: "Mounila Thustam",
    avatar: "mounila",
    role: "Parent",
    text: "Nyra’s attention span has improved. The app fits well with her ongoing therapies as it gives her extra practice at home, and it has helped us spend more structured and meaningful time together.",
  },
  {
    color: "#2d679c",
    name: "Dr Chandrashekhar",
    avatar: "chandrashekhar",
    role: "Therapist Director, Resplice Child Development Center",
    text: "In our therapy center, maintaining continuity was a challenge. CognitiveBotics has helped us address this with engaging, user-friendly activities that support parents, educators and therapists in building children’s independence.",
  },
  {
    color: "#a95fb5",
    name: "Pavani",
    avatar: "pavani",
    role: "Parent",
    text: "CognitiveBotics has been very helpful in continuing my child’s learning at home, especially with pointing and imitation skills. He has also started communicating his needs and I feel the app supports faster learning when used alongside therapy.",
  },
];

// Slow enough to read along with: a card (424px) takes about 13s to pass, and the drift holds still on hover or focus.
const DRIFT_PX_PER_SEC = 33.75;

// Width of one full set of cards, from the first card to the first card of the repeat. 0 until the repeat is rendered.
function loopWidth(el: HTMLElement) {
  const cards = el.querySelectorAll<HTMLElement>("[data-card]");
  const per = cards.length / 2;
  return Number.isInteger(per) && per > 0 ? cards[per].offsetLeft - cards[0].offsetLeft : 0;
}

const ARROW_BTN =
  "transition-transform motion-safe:enabled:hover:scale-105 motion-safe:enabled:active:scale-95 flex size-12 items-center justify-center rounded-full border-[1.5px] border-brand-teal-100 bg-white shadow-[0px_4px_10px_0px_rgba(23,94,99,0.1)] disabled:cursor-not-allowed disabled:opacity-40";

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-content-brand">
      <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}

// Desktop testimonial row: the expert video card first, then the family quotes. A plain
// overflow row (no JavaScript needed to scroll it) that bleeds off the right edge of the
// screen; the arrows and dots only read and drive its scroll position.
export function TestimonialRail() {
  const rowRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ pages: 1, page: 0, canPrev: false, canNext: false });
  // Autoplay: the row drifts slowly sideways, then back, holding still while hovered or focused. It keeps drifting off-screen so it is mid-way when scrolled back to.
  // Hover and keyboard focus pause it and it picks up again from where the row is. Never starts under reduced motion.
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const measure = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pages = max > 1 ? Math.ceil(el.scrollWidth / el.clientWidth) : 1;
    const page = max > 1 ? Math.round((el.scrollLeft / max) * (pages - 1)) : 0;
    const next = { pages, page, canPrev: el.scrollLeft > 1, canNext: el.scrollLeft < max - 1 };
    setState((prev) => (prev.pages === next.pages && prev.page === next.page && prev.canPrev === next.canPrev && prev.canNext === next.canNext ? prev : next));
    // A card cut off by either edge of the row is dimmed (CSS reads data-edge); fully visible cards stay at full strength.
    const bounds = el.getBoundingClientRect();
    el.querySelectorAll<HTMLElement>("[data-card]").forEach((card) => {
      const r = card.getBoundingClientRect();
      card.dataset.edge = r.left < bounds.left - 1 || r.right > bounds.right + 1 ? "true" : "false";
    });
  }, []);

  // One-time entrance as the row scrolls into view. The hidden starting pose is set here, never in CSS,
  // so the cards are plain visible HTML without JavaScript. Reduced motion skips it and the hover/transition rules.
  useGSAP(
    () => {
      const el = rowRef.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(el.querySelectorAll("[data-card]"), {
          opacity: 0,
          y: 14,
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onComplete: () => el.classList.add("tcard-ready"),
        });
      });
      return () => mm.revert();
    },
    { scope: rowRef },
  );

  useEffect(() => {
    measure();
    const el = rowRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setPlaying(!mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = rowRef.current;
    if (!el || !playing || hovered || focused) return;
    let pos = el.scrollLeft;
    let last = performance.now();
    let raf = requestAnimationFrame(function step(now) {
      const dt = Math.min(now - last, 50);
      last = now;
      const w = loopWidth(el);
      if (w > 0) {
        // Always forward. Past one full set of cards the row jumps back by exactly that set, which
        // looks identical, so the first card comes round again after the last.
        pos += (DRIFT_PX_PER_SEC * dt) / 1000;
        if (pos >= w) pos -= w;
        el.scrollLeft = pos;
      }
      raf = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(raf);
  }, [playing, hovered, focused]);

  const go = (dir: 1 | -1) => {
    const el = rowRef.current;
    setPlaying(false);
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  const goToPage = (n: number) => {
    const el = rowRef.current;
    setPlaying(false);
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: state.pages > 1 ? (max * n) / (state.pages - 1) : 0, behavior: "smooth" });
  };

  return (
    <div className="flex w-full flex-col gap-10">
      <div
        ref={rowRef}
        onScroll={(e) => {
          // A manual scroll past the end of the first set carries on into the repeat; wrap it back.
          const el = e.currentTarget;
          const w = loopWidth(el);
          if (w > 0 && el.scrollLeft >= w) el.scrollLeft -= w;
          measure();
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        // Only keyboard focus holds the drift. A mouse click also focuses the row and would otherwise
        // leave it paused after the pointer has gone.
        onFocus={(e) => setFocused(e.target.matches(":focus-visible"))}
        onBlur={() => setFocused(false)}
        role="region"
        aria-label="Testimonials"
        tabIndex={0}
        className="flex gap-8 overflow-x-auto py-4 -my-3 pr-24 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingLeft: "max(6rem, calc((100vw - 1440px) / 2 + 6rem))", scrollPaddingLeft: "max(6rem, calc((100vw - 1440px) / 2 + 6rem))" }}
      >
        {(playing ? [0, 1] : [0]).map((copy) => (
          <Fragment key={copy}>
        <Link
          {...(copy ? { "aria-hidden": true, tabIndex: -1 } : {})}
          href="/resources"
          data-card
          className="tcard group flex w-[628px] shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal flex-col overflow-hidden rounded-[20px] border-[1.5px] border-[#e4ded4] bg-white shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)]"
        >
          <Image
            src="/images/homepage/testimonial-ram-kamal.webp"
            alt="Ram Kamal, Inclusive Education Specialist and Founder Trustee of Chakshumathi, on early intervention"
            width={1250}
            height={716}
            sizes="628px"
            className="tthumb h-auto w-full"
          />
          <div className="flex flex-col items-start gap-3 px-6 pt-5 pb-6">
            <p className="font-heading text-[20px] font-semibold leading-[28px] text-content-brand">
              Importance of Early Intervention and preparing children for healthy digital engagement
            </p>
            <span className="inline-flex items-center gap-2 text-[14px] font-semibold leading-[22px] text-content-brand">
              Explore expert insights
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                <path d="M4 12h16m0 0-6-6m6 6-6 6" />
              </svg>
            </span>
          </div>
        </Link>
        {QUOTES.map((q) => (
          <figure
            key={q.name}
            aria-hidden={copy ? true : undefined}
            data-card
            className="tcard m-0 flex w-[392px] shrink-0 flex-col gap-5 rounded-[20px] border-[1.5px] border-[#e4ded4] bg-white p-10 shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)]"
          >
            <span
              aria-hidden="true"
              className="block h-[17px] w-[21px] font-heading text-[54px] font-extrabold leading-[17px] relative top-[8px] -left-[4px]"
              style={{ color: q.color }}
            >
              “
            </span>
            <blockquote className="m-0 text-[18px] leading-[27px] text-text-secondary">{q.text}</blockquote>
            <figcaption className="mt-auto flex items-center gap-4">
              <Image
                src={`/images/homepage/avatars/${q.avatar}.webp`}
                alt=""
                width={56}
                height={56}
                className="size-14 shrink-0 rounded-full ring-1 ring-[#e4ded4]"
              />
              <div>
                <p className="font-heading text-[20px] font-bold leading-[26px] text-content-brand">{q.name}</p>
                <p className="text-[18px] leading-[27px] text-[#6b7280]">{q.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
          </Fragment>
        ))}
      </div>
      {/* Controls (arrows + dots) are commented out; `hidden` removes the empty wrapper so it adds no gap. */}
      <div className="hidden items-center justify-center gap-5">
        {/* <button type="button" aria-label="Previous testimonials" disabled={!state.canPrev} onClick={() => go(-1)} className={ARROW_BTN}>
          <Chevron dir="left" />
        </button> */}
        {/*
        <div className="flex items-center gap-2">
          {Array.from({ length: state.pages }, (_, n) => (
            <button
              key={n}
              type="button"
              aria-label={`Go to testimonials page ${n + 1}`}
              aria-current={n === state.page}
              onClick={() => goToPage(n)}
              className={`h-2 rounded-full transition-all ${n === state.page ? "w-6 bg-[#a95fb5]" : "w-2 bg-carousel-dot-inactive"}`}
            />
          ))}
        </div>
        */}
        {/* <button type="button" aria-label="Next testimonials" disabled={!state.canNext} onClick={() => go(1)} className={ARROW_BTN}>
          <Chevron dir="right" />
        </button> */}
      </div>
    </div>
  );
}
