'use client';

import { useEffect, useState } from 'react';
import { Chips } from '@/components/shared/Chips';
import { FAQ } from '@/components/shared/FAQ';
import type { FaqSet } from '@/lib/faq-sets';

export function FaqTabs({ sets }: { sets: readonly FaqSet[] }) {
  const [active, setActive] = useState(sets[0].id);

  // The server renders the first set; the hash is applied after mount so the HTML never mismatches.
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.slice(1);
      if (sets.some((s) => s.id === id)) setActive(id);
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, [sets]);

  const select = (id: string) => {
    setActive(id);
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="flex flex-col gap-8 lg:gap-10">
      <Chips items={sets} value={active} onChange={select} label="FAQ topics" idPrefix="faq" />
      {sets.map((s) => (
        // Hidden panels stay in the HTML so crawlers read every answer.
        <div key={s.id} role="tabpanel" id={`faq-panel-${s.id}`} aria-labelledby={`faq-tab-${s.id}`} hidden={s.id !== active}>
          <FAQ items={s.items} />
        </div>
      ))}
    </div>
  );
}
