"use client";

import { useEffect, useRef, useState } from "react";

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
          className="shrink-0"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute left-0 right-0 top-full z-10 mt-1 rounded-[8px] border border-brand-teal-100 bg-white py-1 shadow-[0px_0px_20px_rgba(10,13,18,0.14)]"
        >
          {options.map((o, i) => (
            <li
              key={o}
              role="option"
              aria-selected={o === value}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(o)}
              className={`flex min-h-[48px] cursor-pointer items-center px-3 py-2 text-[16px] lg:min-h-0 lg:text-[14px] text-text-default ${i === active ? "bg-brand-subtle-bg" : ""}`}
            >
              {o}
            </li>
          ))}
        </ul>
      ) : null}
      {error ? (
        <p role="alert" className="mt-1 text-[14px] text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
