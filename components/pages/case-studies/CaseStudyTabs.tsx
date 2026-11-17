'use client';

import { useEffect, useState } from 'react';
import { VerticalTabs, type VerticalTabItem } from '@/components/shared/VerticalTabs';

export type SectionTab = VerticalTabItem;

/** Pixels from the top of the viewport at which a section counts as the one being read. */
const READING_LINE = 160;

// In-page section tabs for a case study, built on the shared VerticalTabs. Each one jumps to its section,
// and the tab for the section being read stays current. 'vertical' is the desktop rail; 'dropdown' is the
// phone and tablet version. The page renders one of each and shows the right one per breakpoint.
export function CaseStudyTabs({ sections, layout = 'vertical' }: { sections: readonly SectionTab[]; layout?: 'vertical' | 'dropdown' }) {
  const [active, setActive] = useState(sections[0]?.id ?? '');

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = sections[0]?.id ?? '';
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= READING_LINE) current = s.id;
      }
      // At the very bottom the last section may never reach the reading line.
      const page = document.documentElement.scrollHeight;
      if (page > window.innerHeight && window.innerHeight + window.scrollY >= page - 2) {
        current = sections[sections.length - 1]?.id ?? current;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return false;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
    setActive(id);
    return true;
  };

  return (
    <VerticalTabs
      items={sections}
      value={active}
      onChange={scrollTo}
      label="Sections"
      layout={layout}
      getHref={(id) => `#${id}`}
      onLinkClick={(e, id) => {
        if (scrollTo(id)) e.preventDefault();
      }}
    />
  );
}
