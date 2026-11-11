'use client';

import { useState } from 'react';
import { SECONDARY_HOVER } from '@/components/shared/Button';
import { Chips } from '@/components/shared/Chips';
import { RevealStagger } from '@/components/shared/RevealStagger';
import { CaseStudyCard } from './CaseStudyCard';
import { caseStudiesContent as c, caseStudyGroups, type CaseStudy } from './content';

const ALL = 'all';
/** Three rows of three; "Show more" appears only when a view has more studies than this. */
const PAGE = 9;

export function CaseStudyList({ studies }: { studies: readonly CaseStudy[] }) {
  const [active, setActive] = useState(ALL);
  const [more, setMore] = useState(false);
  const chips = [{ id: ALL, label: 'All' }, ...caseStudyGroups(studies).map((g) => ({ id: g, label: g }))];
  const list = active === ALL ? studies : studies.filter((s) => s.group === active);
  const shown = more ? list : list.slice(0, PAGE);

  return (
    <div className="flex flex-col gap-8 lg:gap-12">
      <Chips
        items={chips}
        value={active}
        onChange={(id) => {
          setActive(id);
          setMore(false);
        }}
        label={c.filtersLabel}
        idPrefix="case-studies"
      />
      <div role="tabpanel" id={`case-studies-panel-${active}`} aria-labelledby={`case-studies-tab-${active}`}>
        <RevealStagger key={active} className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-y-12 lg:grid-cols-3">
          {shown.map((s) => (
            <CaseStudyCard key={s.slug} study={s} />
          ))}
        </RevealStagger>
        {list.length > PAGE && !more ? (
          <button
            type="button"
            onClick={() => setMore(true)}
            className={`btn mx-auto mt-12 flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-full border-[1.5px] border-brand-teal bg-transparent px-6 py-[14px] text-[16px] font-semibold text-content-brand transition-colors ${SECONDARY_HOVER}`}
          >
            Show more
          </button>
        ) : null}
      </div>
    </div>
  );
}
