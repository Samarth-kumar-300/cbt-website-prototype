'use client';

import { useEffect, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AudienceSwitch } from './AudienceSwitch';
import { DEFAULT_AUDIENCE, type AudienceId } from './content';

gsap.registerPlugin(ScrollTrigger);

type Tab = { readonly id: AudienceId; readonly label: string };

// The Therapy Centres / Schools switch. Both panels come from the server; the inactive one is `hidden`
// so it is out of the tab order and the accessibility tree. The choice is mirrored into ?for= with
// replaceState, so it is shareable without adding back-button steps or moving the scroll position.
export function AudienceTabs({ initial, tabs, panels }: { initial: AudienceId; tabs: readonly Tab[]; panels: Record<AudienceId, ReactNode> }) {
  const [active, setActive] = useState<AudienceId>(initial);
  // True once the visitor has switched at least once; the first paint never fades.
  const [switched, setSwitched] = useState(false);

  const choose = (id: string) => {
    const next = id as AudienceId;
    if (next === active) return;
    setSwitched(true);
    setActive(next);
    const url = new URL(window.location.href);
    if (next === DEFAULT_AUDIENCE) url.searchParams.delete('for');
    else url.searchParams.set('for', next);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  };

  // The newly shown panel had no layout while hidden; let scroll-driven pieces measure it again.
  useEffect(() => {
    if (!switched) return;
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [active, switched]);

  return (
    <>
      <div className="flex justify-center px-5 pt-10 lg:pt-14">
        <AudienceSwitch items={tabs} value={active} onChange={choose} label="Choose who the pricing is for" idPrefix="pricing" className="max-w-[360px] lg:max-w-[420px]" />
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`pricing-panel-${t.id}`}
          aria-labelledby={`pricing-tab-${t.id}`}
          hidden={t.id !== active}
          data-switched={switched && t.id === active ? '' : undefined}
          className="pricing-panel"
        >
          {panels[t.id]}
        </div>
      ))}
    </>
  );
}
