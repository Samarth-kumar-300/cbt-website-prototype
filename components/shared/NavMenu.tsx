'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { isActivePath, type NavMenuItem } from './nav-links';

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Props = { item: NavMenuItem; pathname: string };

// Disclosure, not an ARIA menu: a button that shows a list of links. The links stay in the page HTML
// while it is closed (the `hidden` attribute only hides them), so crawlers see every page.
export function NavMenu({ item, pathname }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const active = item.pages.some((p) => isActivePath(pathname, p.href));

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // Move focus to the trigger before the panel hides, or focus falls back to <body>.
      if (ref.current?.contains(document.activeElement)) buttonRef.current?.focus();
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`nav-link inline-flex items-center gap-1 whitespace-nowrap text-[12px] uppercase tracking-[0.5px] transition-colors min-[1440px]:text-[13px] min-[1440px]:tracking-[0.6px] ${
          active ? 'font-bold text-content-brand-secondary' : 'font-semibold text-content-brand hover:text-brand-dark'
        }`}
      >
        {item.label}
        <Chevron />
      </button>
      <ul
        id={panelId}
        hidden={!open}
        className={`absolute left-1/2 top-full z-10 mt-4 w-[300px] -translate-x-1/2 rounded-2xl bg-white p-2 shadow-[0px_0px_20px_rgba(10,13,18,0.14)] ${open ? 'menu-in' : ''}`}
      >
        {item.pages.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              aria-current={isActivePath(pathname, p.href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 hover:bg-brand-subtle-bg"
            >
              <span className="block text-[14px] font-semibold normal-case tracking-normal text-content-brand">{p.label}</span>
              <span className="block text-[13px] font-normal normal-case leading-[20px] tracking-normal text-content-secondary">{p.helper}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

type MobileProps = { item: NavMenuItem; pathname: string; onNavigate: () => void };

export function MobileNavMenu({ item, pathname, onNavigate }: MobileProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const active = item.pages.some((p) => isActivePath(pathname, p.href));

  return (
    <div className="flex flex-col">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-[16px] uppercase tracking-[0.6px] transition-colors hover:bg-brand-subtle-bg active:bg-brand-subtle-bg ${
          active ? 'font-bold text-content-brand-secondary' : 'font-semibold text-content-brand'
        }`}
      >
        {item.label}
        <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <Chevron />
        </span>
      </button>
      {open ? (
        <ul id={panelId} className="flex flex-col gap-1 pb-1 pl-4">
          {item.pages.map((p) => (
            <li key={p.href}>
              <Link
                href={p.href}
                onClick={onNavigate}
                aria-current={isActivePath(pathname, p.href) ? 'page' : undefined}
                className="block rounded-xl px-4 py-3 text-[16px] font-semibold text-content-brand hover:bg-brand-subtle-bg active:bg-brand-subtle-bg"
              >
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
