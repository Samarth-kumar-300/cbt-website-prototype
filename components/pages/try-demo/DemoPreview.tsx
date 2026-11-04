'use client';

import { useRef, useState } from 'react';
import { Chips } from '@/components/shared/Chips';
import { PREVIEW_VIEWS, type PreviewView } from '@/lib/demo-preview';
import type { Plan } from '@/lib/demo-plan';
import { DemoDone } from './DemoDone';
import { DEMO_CARD } from './DemoFlow';
import { DemoForm } from './DemoForm';
import { DemoSchedule } from './DemoSchedule';

// TEMPORARY: shows each Try Demo state on its own, behind a switch. Opened with ?preview (or
// ?preview=booked). Nothing here talks to Calendly. Delete this file once the states are approved.
export function DemoPreview({ plan, initial }: { plan: Plan | null; initial: PreviewView }) {
  const [view, setView] = useState<PreviewView>(initial);
  const headingRef = useRef<HTMLHeadingElement>(null);

  return (
    <>
      <div className={DEMO_CARD}>
        {view === 'form' ? <DemoForm plan={plan} onSubmitted={() => setView('book')} /> : null}
        {view === 'book' || view === 'opening' || view === 'error' ? (
          <DemoSchedule
            key={view}
            headingRef={headingRef}
            url=""
            name="Asha Rao"
            email="asha@example.com"
            onBooked={() => setView('booked')}
            previewStatus={view === 'book' ? 'idle' : view}
          />
        ) : null}
        {view === 'booked' ? <DemoDone headingRef={headingRef} /> : null}
      </div>
      <div
        role="region"
        aria-label="Temporary state preview"
        className="fixed inset-x-3 bottom-3 z-[60] mx-auto flex max-w-[860px] flex-col gap-2 rounded-2xl border-[1.5px] border-brand-teal bg-white p-3 shadow-[0px_8px_30px_rgba(10,13,18,0.2)]"
      >
        <p className="text-[12px] font-semibold uppercase tracking-[1px] text-content-secondary">Temporary preview: pick a state</p>
        <Chips items={PREVIEW_VIEWS} value={view} onChange={(id) => setView(id as PreviewView)} label="Try Demo states" idPrefix="preview" className="gap-2 [&_button]:min-h-[36px] [&_button]:px-3 [&_button]:text-[14px]" />
      </div>
    </>
  );
}
