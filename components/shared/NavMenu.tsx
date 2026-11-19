'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState, type PointerEvent, type RefObject } from 'react';
import gsap from 'gsap';
import { isMouse, reducedMotion, expandIn, staggerIn, useIsoLayoutEffect, useRowHighlight } from './motion';
import { isActivePath, menuPages, type NavMenuItem, type NavPage } from './nav-links';
import { PromoMascot } from './PromoMascot';

function Chevron({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
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

type RowProps = { onPointerEnter?: (e: PointerEvent<HTMLElement>) => void; onFocus?: (e: React.FocusEvent<HTMLElement>) => void };

function PageLink({ page, pathname, onNavigate, className, rowProps, children }: { page: NavPage; pathname: string; onNavigate: () => void; className: string; rowProps?: RowProps; children: React.ReactNode }) {
  if (page.external) {
    return (
      <a href={page.href} target="_blank" rel="noopener noreferrer" onClick={onNavigate} className={className} {...rowProps}>
        {children}
      </a>
    );
  }
  return (
    <Link href={page.href} aria-current={isActivePath(pathname, page.href) ? 'page' : undefined} onClick={onNavigate} className={className} {...rowProps}>
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

// Chevron turn shared by every disclosure in the header: same length and curve as the pill that goes white.
export const CHEVRON_TURN = 'transition-transform duration-300 ease-[var(--ease-out)] motion-reduce:transition-none';

/**
 * Reveal a freshly opened menu panel from the top down with a clip-path inset (the bottom edge travels up from
 * 100%), then rise its columns in one after the other. The end clip is a little larger than the box so the
 * panel's own shadow is not cut off; clearProps hands the panel back to plain CSS when it lands.
 * `radius` is the CSS corner-radius list the panel already has, so the clip follows its corners.
 */
export function revealPanel(panel: HTMLElement | null, items: Element[], radius: string) {
  if (!panel || reducedMotion()) return;
  gsap.killTweensOf(panel);
  gsap.fromTo(
    panel,
    { clipPath: `inset(0% 0% 100% 0% round ${radius})` },
    { clipPath: `inset(0% -3% -25% -3% round ${radius})`, duration: 0.45, ease: 'power4.out', clearProps: 'clipPath' },
  );
  staggerIn(items, { y: -10, delay: 0.06 });
}

/**
 * Kill every tween on these elements. gsap.killTweensOf(array) misses the per-target tweens a stagger creates
 * (they keep running on a closed panel), so look the tweens up first and kill each one.
 */
export function killTweens(els: Element[]) {
  gsap.getTweensOf(els).forEach((t) => t.kill());
}

/** Stop a reveal that is still running and drop every inline style it left behind. */
export function resetPanel(panel: HTMLElement | null, items: Element[]) {
  if (!panel) return;
  killTweens([panel, ...items]);
  gsap.set(panel, { clearProps: 'clipPath' });
  if (items.length) gsap.set(items, { clearProps: 'transform,opacity' });
}

/**
 * One highlight that slides between the rows of a menu panel. Attach `boxRef` to the (positioned) panel and
 * render <RowHighlight thumbRef={thumbRef} /> as its first child. Give each row `relative z-10` and spread
 * rowProps(). The mouse drives it with onPointerEnter (never touch or pen); keyboard focus-visible drives it too.
 * The panel gets data-liquid="ready" once this runs, which turns the rows' own hover fill off so the two do not
 * stack; without it the rows keep their plain CSS hover.
 */
export function useMenuRows() {
  const boxRef = useRef<HTMLElement | null>(null);
  const thumbRef = useRef<HTMLSpanElement | null>(null);
  const { show, hide } = useRowHighlight(boxRef, thumbRef);
  const setBox = useCallback((el: HTMLElement | null) => {
    boxRef.current = el;
    el?.setAttribute('data-liquid', 'ready');
  }, []);
  const rowProps = {
    onPointerEnter: (e: PointerEvent<HTMLElement>) => {
      if (isMouse(e)) show(e.currentTarget);
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      let visible = false;
      try {
        visible = e.currentTarget.matches(':focus-visible');
      } catch {
        // an engine without :focus-visible: no keyboard highlight, the CSS focus ring still shows
      }
      if (visible) show(e.currentTarget);
    },
  };
  const boxProps = {
    onPointerLeave: (e: PointerEvent<HTMLElement>) => {
      if (isMouse(e)) hide();
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) hide();
    },
  };
  return { boxRef, thumbRef, setBox, rowProps, boxProps, hide };
}

export function RowHighlight({ thumbRef }: { thumbRef: RefObject<HTMLSpanElement | null> }) {
  return <span ref={thumbRef} aria-hidden="true" className="pointer-events-none absolute rounded-xl bg-brand-subtle-bg opacity-0" />;
}

// The row's own hover fill, switched off once the sliding highlight has taken over (see useMenuRows).
export const ROW_HOVER = 'hover:bg-brand-subtle-bg in-data-[liquid=ready]:hover:bg-transparent!';

export function NavMenu({ item, pathname }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // True while the menu was opened by hover, so the click that follows keeps it open instead of closing it.
  const openedByHover = useRef(false);
  const panelId = useId();
  const active = menuPages(item).some((p) => isActivePath(pathname, p.href));
  const { thumbRef, setBox, rowProps, boxProps, hide } = useMenuRows();
  const panelEl = useRef<HTMLDivElement | null>(null);
  const setPanel = useCallback(
    (el: HTMLDivElement | null) => {
      panelEl.current = el;
      setBox(el);
    },
    [setBox],
  );

  // Opening reveals the panel with a clip-path and a stagger; closing stays instant but first clears any reveal
  // still in flight, so the panel is never left half clipped. Reduced motion skips the reveal.
  useIsoLayoutEffect(() => {
    const panel = panelEl.current;
    if (!panel) return;
    const cols = Array.from(panel.querySelectorAll(':scope > div > *'));
    if (open) revealPanel(panel, cols, '0 0 24px 24px');
    else {
      resetPanel(panel, cols);
      hide();
    }
    return () => resetPanel(panel, cols);
  }, [open, hide]);

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
        className={`nav-link inline-flex items-center gap-1 whitespace-nowrap text-[12px] uppercase tracking-[0.3px] transition-colors min-[1440px]:text-[13px] min-[1440px]:tracking-[0.6px] ${
          active ? 'font-bold text-content-brand-secondary' : 'font-semibold text-content-brand hover:text-brand-dark'
        }`}
      >
        {item.label}
        <Chevron className={`${CHEVRON_TURN} ${open ? 'rotate-180' : ''}`} />
      </button>
      <div
        ref={setPanel}
        id={panelId}
        hidden={!open}
        {...boxProps}
        className="absolute -inset-x-[1.5px] top-full z-10 rounded-b-3xl border-t border-brand-teal-100 bg-white px-16 pb-10 pt-8 shadow-[0px_24px_32px_-16px_rgba(10,13,18,0.18)]"
      >
        <RowHighlight thumbRef={thumbRef} />
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
                      <PageLink page={p} pathname={pathname} onNavigate={close} rowProps={rowProps} className={`relative z-10 block rounded-xl px-3 py-2.5 -mx-3 ${ROW_HOVER}`}>
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
            <span className="relative flex flex-col gap-2">
              <span className="block text-balance font-heading text-[22px] font-semibold normal-case leading-[30px] tracking-normal">{item.promo.heading}</span>
              {item.promo.body ? <span className="block max-w-[90%] text-[14px] font-normal normal-case leading-[20px] tracking-normal">{item.promo.body}</span> : null}
            </span>
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
  const panelRef = useRef<HTMLDivElement>(null);
  const active = menuPages(item).some((p) => isActivePath(pathname, p.href));

  // Enter only: the panel eases open and its groups rise in. Closing stays an instant unmount.
  useIsoLayoutEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;
    expandIn(panel);
    staggerIn(panel.querySelectorAll('p, li'), { y: 0, x: -8, stagger: 0.035, delay: 0.08, duration: 0.35 });
    return () => killTweens([panel, ...Array.from(panel.querySelectorAll('p, li'))]);
  }, [open]);
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
        <span className={`${CHEVRON_TURN} ${open ? 'rotate-180' : ''}`}>
          <Chevron />
        </span>
      </button>
      {open ? (
        <div ref={panelRef} id={panelId} className="mb-2 ml-6 mt-1 flex flex-col gap-3 border-l-2 border-brand-teal-100 pl-3">
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
