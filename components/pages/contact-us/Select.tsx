"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import gsap from "gsap";
import {
  isMouse,
  reducedMotion,
  useIsoLayoutEffect,
  useRowHighlight,
} from "@/components/shared/motion";

type Props = {
  id: string;
  label: string;
  placeholder: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
};

export function Select({
  id,
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
}: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const root = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const thumbRef = useRef<HTMLLIElement>(null);
  const { show, hide } = useRowHighlight(listRef, thumbRef);

  // The list drops in when it mounts (enter only: closing stays an instant unmount). Reduced motion skips it.
  useIsoLayoutEffect(() => {
    const list = listRef.current;
    if (!open || !list || reducedMotion()) return;
    gsap.fromTo(
      list,
      { opacity: 0, y: -8, scaleY: 0.96, transformOrigin: "top" },
      {
        opacity: 1,
        y: 0,
        scaleY: 1,
        duration: 0.3,
        ease: "power4.out",
        clearProps: "opacity,transform,transformOrigin",
      },
    );
    return () => {
      gsap.killTweensOf(list);
    };
  }, [open]);

  // One highlight follows the keyboard's active option. The mouse drives it from the rows (below). The
  // row's own active fill stays in the markup, and turns itself off once the list has its highlight.
  useEffect(() => {
    const list = listRef.current;
    if (!open || !list || active < 0) return;
    show(list.querySelectorAll<HTMLElement>('[role="option"]')[active]);
  }, [open, active, show]);

  useEffect(() => {
    if (!open) hide();
  }, [open, hide]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (root.current && !root.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (
      !open &&
      (e.key === "Enter" || e.key === " " || e.key === "ArrowDown")
    ) {
      e.preventDefault();
      setActive(options.indexOf(value));
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(options.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0) pick(options[active]);
    }
  };

  return (
    <div ref={root} className="relative">
      {/* aria-invalid on the button is part of the Select contract asserted by tests/unit/contact-select.test.tsx */}
      {/* eslint-disable-next-line jsx-a11y/role-supports-aria-props */}
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={error ? true : undefined}
        aria-label={`${label}: ${value || placeholder}`}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKey}
        className={`flex min-h-[48px] w-full items-center justify-between rounded-[8px] border bg-brand-subtle-bg px-3 py-2 text-left text-[16px] shadow-[0px_1px_1px_0px_rgba(10,13,18,0.05)] focus:border-brand-teal focus:outline-none ${
          error ? "border-error" : "border-brand-teal-100"
        } ${value ? "text-text-secondary" : "text-[#646871]"}`}
      >
        <span>{value || placeholder}</span>
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
          className={`shrink-0 transition-transform duration-300 ease-[var(--ease-out)] motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <ul
          ref={listRef}
          role="listbox"
          aria-label={label}
          data-liquid="ready"
          onPointerLeave={(e: PointerEvent) => {
            if (isMouse(e)) hide();
          }}
          className="absolute left-0 right-0 top-full z-10 mt-1 rounded-[8px] border border-brand-teal-100 bg-white py-1 shadow-[0px_0px_20px_rgba(10,13,18,0.14)]"
        >
          <li
            ref={thumbRef}
            role="presentation"
            aria-hidden="true"
            className="pointer-events-none absolute bg-brand-subtle-bg opacity-0"
          />
          {options.map((o, i) => (
            <li
              key={o}
              role="option"
              aria-selected={o === value}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(o)}
              onPointerEnter={(e) => {
                if (isMouse(e)) show(e.currentTarget);
              }}
              className={`relative z-10 flex min-h-[48px] cursor-pointer items-center px-3 py-2 text-[16px] lg:min-h-0 lg:text-[14px] text-text-default ${i === active ? "bg-brand-subtle-bg in-data-[liquid=ready]:bg-transparent" : ""}`}
            >
              {o}
            </li>
          ))}
        </ul>
      ) : null}
      {error ? (
        <p role="alert" className="error-in mt-1 text-[14px] text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
