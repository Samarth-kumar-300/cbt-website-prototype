'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { isActivePath, menuPages, type NavMenuItem, type NavPage } from './nav-links';
import { PromoMascot } from './PromoMascot';

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Props = { item: NavMenuItem; pathname: string };

function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PageLink({ page, pathname, onNavigate, className, children }: { page: NavPage; pathname: string; onNavigate: () => void; className: string; children: React.ReactNode }) {
  if (page.external) {
    return (
      <a href={page.href} target="_blank" rel="noopener noreferrer" onClick={onNavigate} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={page.href} aria-current={isActivePath(pathname, page.href) ? 'page' : undefined} onClick={onNavigate} className={className}>
      {children}
    </Link>
  );
}

// Disclosure, not an ARIA menu: a button that shows a panel of links. The links stay in the page HTML
// while it is closed (the `hidden` attribute only hides them), so crawlers see every page.
// The panel hangs off the bottom of the header pill (which is `relative`) and spans its full width, with the
// same side padding as the header, so the two read as one white surface. The pill turns white while `data-menu-open` is true.
// A mouse opens it on hover (after a short delay, so a passing pointer does not trigger it) and closes it shortly after
// the pointer leaves. Touch and keyboard still use the button: tap or Enter toggles it.
const HOVER_OPEN_MS = 100;
const HOVER_CLOSE_MS = 180;

export function NavMenu({ item, pathname }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // True while the menu was opened by hover, so the click that follows keeps it open instead of closing it.
  const openedByHover = useRef(false);
  const panelId = useId();
  const active = menuPages(item).some((p) => isActivePath(pathname, p.href));

  const cancelTimer = () => clearTimeout(timer.current);
  useEffect(() => cancelTimer, []);

  const onPointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    cancelTimer();
    if (open) return;
    timer.current = setTimeout(() => {
      openedByHover.current = true;
      setOpen(true);
    }, HOVER_OPEN_MS);
  };
  const onPointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') return;
    cancelTimer();
    timer.current = setTimeout(() => {
      openedByHover.current = false;
      setOpen(false);
    }, HOVER_CLOSE_MS);
  };
  const onClick = () => {
    cancelTimer();
    if (openedByHover.current) {
      openedByHover.current = false;
      return;
    }
    setOpen((o) => !o);
  };

  useEffect(() => {
    if (!open) openedByHover.current = false;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      cancelTimer();
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

  const close = () => {
    cancelTimer();
    setOpen(false);
  };

  // The vertical padding (cancelled by the negative margin) stretches the hover area down to the header's bottom
  // edge, so the pointer can travel from the button to the panel without leaving it.
  return (
    <div ref={ref} data-menu-open={open} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave} className="-my-7 flex items-center py-7">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onClick}
        className={`nav-link inline-flex items-center gap-1 whitespace-nowrap text-[12px] uppercase tracking-[0.5px] transition-colors min-[1440px]:text-[13px] min-[1440px]:tracking-[0.6px] ${
          active ? 'font-bold text-content-brand-secondary' : 'font-semibold text-content-brand hover:text-brand-dark'
        }`}
      >
        {item.label}
        <Chevron />
      </button>
      <div
        id={panelId}
        hidden={!open}
        className={`absolute -inset-x-[1.5px] top-full z-10 rounded-b-3xl border-t border-brand-teal-100 bg-white px-16 pb-10 pt-8 shadow-[0px_24px_32px_-16px_rgba(10,13,18,0.18)] ${open ? 'menu-in' : ''}`}
      >
        <div className="grid grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.3fr)] gap-x-10">
          {item.columns.map((col) => {
            const headingId = `${panelId}-${col.heading.replace(/\W+/g, '-').toLowerCase()}`;
            return (
              <div key={col.heading} className="flex flex-col gap-4">
                <p id={headingId} className="text-[12px] font-semibold uppercase tracking-[0.5px] text-content-secondary">
                  {col.heading}
                </p>
                <ul aria-labelledby={headingId} className="flex flex-col gap-1">
                  {col.pages.map((p) => (
                    <li key={p.href}>
                      <PageLink page={p} pathname={pathname} onNavigate={close} className="block rounded-xl px-3 py-2.5 -mx-3 hover:bg-brand-subtle-bg">
                        <span className="block text-[16px] font-semibold normal-case tracking-normal text-content-brand">{p.label}</span>
                        <span className="block text-[14px] font-normal normal-case leading-[20px] tracking-normal text-content-secondary">{p.helper}</span>
                      </PageLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          <Link
            href={item.promo.href}
            onClick={close}
            className="group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-2xl bg-brand-teal p-6 text-content-knockout focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
          >
            <PromoMascot />
            <span className="relative block max-w-[62%] font-heading text-[22px] font-semibold normal-case leading-[30px] tracking-normal">{item.promo.heading}</span>
            <span className="relative flex items-center gap-3 text-[16px] font-semibold normal-case tracking-normal">
              <span className="flex size-10 items-center justify-center rounded-full bg-white text-brand-teal transition-transform group-hover:translate-x-1">
                <Arrow />
              </span>
              {item.promo.label}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

type MobileProps = { item: NavMenuItem; pathname: string; onNavigate: () => void };

export function MobileNavMenu({ item, pathname, onNavigate }: MobileProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const active = menuPages(item).some((p) => isActivePath(pathname, p.href));
  // Children read as lower rank than the parent: smaller, regular weight, sentence case, hung off a rail.
  const linkClass = 'block rounded-lg px-3 py-2.5 text-[15px] font-medium text-content-brand hover:bg-brand-subtle-bg active:bg-brand-subtle-bg';

  return (
    <div className="flex flex-col">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-[16px] uppercase tracking-[0.6px] transition-colors hover:bg-brand-subtle-bg active:bg-brand-subtle-bg ${
          open ? 'bg-brand-subtle-bg' : ''
        } ${active ? 'font-bold text-content-brand-secondary' : 'font-semibold text-content-brand'}`}
      >
        {item.label}
        <span className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <Chevron />
        </span>
      </button>
      {open ? (
        <div id={panelId} className="mb-2 ml-6 mt-1 flex flex-col gap-3 border-l-2 border-brand-teal-100 pl-3">
          {item.columns.map((col) => (
            <div key={col.heading} className="flex flex-col">
              <p className="px-3 pt-1 text-[11px] font-semibold uppercase tracking-[0.5px] text-content-secondary">{col.heading}</p>
              <ul className="flex flex-col">
                {col.pages.map((p) => (
                  <li key={p.href}>
                    <PageLink page={p} pathname={pathname} onNavigate={onNavigate} className={linkClass}>
                      {p.label}
                    </PageLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
