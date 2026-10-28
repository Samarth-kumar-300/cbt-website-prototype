'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Button } from './Button';
import { Logo } from './Logo';
import { DRAWER_LINKS, HEADER_BG_IMAGE, HEADER_SCROLLED_BG, SIGN_IN_ITEMS } from './nav-config.generated';
import { NAV_LINKS } from './nav-links';

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Header() {
  const [drawer, setDrawer] = useState(false);
  const [menu, setMenu] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDrawer(false);
        setMenu(false);
      }
    };
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(false);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, []);

  // The drawer is mobile-only (xl:hidden): close it when the viewport reaches xl so
  // body scroll is restored and the hidden burger does not keep aria-expanded=true.
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(min-width: 1280px)');
    const onChange = (e: { matches: boolean }) => {
      if (e.matches) setDrawer(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!drawer) setSignIn(false);
    document.body.style.overflow = drawer ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawer]);

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex flex-col items-center">
      <div
        data-testid="header-pill"
        style={
          {
            '--header-bg': HEADER_BG_IMAGE,
            ...(scrolled ? { backgroundColor: HEADER_SCROLLED_BG } : {}),
          } as CSSProperties
        }
        // Below xl the glass bar is inset 16px and flush with the top, open or closed.
        className={`mx-4 flex w-[calc(100%-2rem)] items-center justify-between rounded-b-[16px] rounded-t-none border-[1.5px] border-white/65 bg-[image:var(--header-bg)] px-4 py-3 backdrop-blur-[14px] transition-[background-color,box-shadow] duration-300 xl:mx-0 xl:w-full xl:px-16 min-[1440px]:px-[calc((100%-1392px)/2+40px)] ${
          scrolled
            ? 'shadow-[0px_12px_34px_-8px_rgba(16,73,76,0.22)]'
            : 'shadow-[0px_12px_34px_-8px_rgba(214,251,254,0.16)]'
        }`}
      >
        <Link href="/" aria-label="CognitiveBotics home" className="hit relative h-[21px] w-[145px] shrink-0 xl:h-[31px] xl:w-[213px]">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden items-center justify-center gap-3 xl:flex">
          {NAV_LINKS.map((l, i) => (
            <span key={l.href} className="flex items-center gap-3">
              {i > 0 ? <span aria-hidden="true" className="h-4 w-px bg-brand-teal/28" /> : null}
              <Link
                href={l.href}
                className="nav-link inline-block whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.6px] text-content-brand transition-colors hover:text-brand-dark"
              >
                {l.label}
              </Link>
            </span>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <div ref={menuRef} className="relative">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menu}
              onClick={() => setMenu((m) => !m)}
              className="flex items-center gap-[6px] whitespace-nowrap rounded-full border-[1.5px] border-brand-teal py-[11px] pl-5 pr-4 text-[14px] font-semibold tracking-[0.5px] text-content-brand"
            >
              Sign in
              <Chevron />
            </button>
            {menu && SIGN_IN_ITEMS.length > 0 ? (
              <div role="menu" className="menu-in absolute right-0 top-full mt-2 min-w-[220px] rounded-2xl bg-white p-2 shadow-[0px_0px_20px_rgba(10,13,18,0.14)]">
                {SIGN_IN_ITEMS.map((it) => (
                  <a key={it.href + it.label} role="menuitem" href={it.href} target="_blank" rel="noopener noreferrer" className="block rounded-xl px-4 py-3 text-[14px] font-semibold text-content-brand hover:bg-brand-subtle-bg">
                    {it.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
          <Button href="/try-demo" size="nav">
            Try demo
          </Button>
        </div>

        <button
          type="button"
          aria-label={drawer ? 'Close menu' : 'Open menu'}
          aria-expanded={drawer}
          aria-controls="mobile-nav"
          onClick={() => setDrawer((d) => !d)}
          className="-mr-2 -my-2 flex size-11 shrink-0 flex-col items-center justify-center gap-[5px] text-content-brand xl:hidden"
        >
          {drawer ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          ) : (
            <>
              <span className="h-[2px] w-[18px] shrink-0 rounded-[2px] bg-current" />
              <span className="h-[2px] w-[18px] shrink-0 rounded-[2px] bg-current" />
              <span className="h-[2px] w-[18px] shrink-0 rounded-[2px] bg-current" />
            </>
          )}
        </button>
      </div>

      {drawer ? (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="mx-4 mt-2 flex max-h-[calc(100dvh-110px)] w-[calc(100%-2rem)] max-w-[1392px] flex-col gap-1 overflow-y-auto rounded-3xl bg-white p-4 shadow-[0px_0px_20px_rgba(10,13,18,0.14)] xl:hidden"
        >
          {[...NAV_LINKS, ...DRAWER_LINKS].map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + '/');
            return (
              <Link
                key={l.href + l.label}
                href={l.href}
                onClick={() => setDrawer(false)}
                aria-current={active ? 'page' : undefined}
                className={`rounded-xl px-4 py-3 text-[16px] uppercase tracking-[0.6px] transition-colors hover:bg-brand-subtle-bg active:bg-brand-subtle-bg ${
                  active ? 'font-bold text-content-brand-secondary' : 'font-semibold text-content-brand'
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <div className="mx-4 my-2 h-px bg-brand-teal-100" aria-hidden="true" />
          {SIGN_IN_ITEMS.length > 0 ? (
            <div className="flex flex-col gap-1 px-2">
              <button
                type="button"
                aria-expanded={signIn}
                onClick={() => setSignIn((v) => !v)}
                className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-brand-teal px-6 text-[16px] font-semibold uppercase tracking-[0.6px] text-content-brand"
              >
                Sign in
                <span className={`transition-transform duration-200 ${signIn ? 'rotate-180' : ''}`}>
                  <Chevron />
                </span>
              </button>
              {signIn
                ? SIGN_IN_ITEMS.map((it) => (
                    <a
                      key={it.href + it.label}
                      href={it.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl px-4 py-3 text-center text-[15px] font-semibold text-content-brand hover:bg-brand-subtle-bg"
                    >
                      {it.label}
                    </a>
                  ))
                : null}
            </div>
          ) : null}
          <div className="px-2 pb-2 pt-1">
            <Button href="/try-demo" size="md" className="w-full uppercase tracking-[0.6px]">
              Try demo
            </Button>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
