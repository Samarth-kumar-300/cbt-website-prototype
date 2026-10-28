"use client";

import Image from "next/image";
import { MotionImage } from "@/components/shared/MotionImage";
import { PinnedStages, StageCard } from "@/components/shared/ScrollStages";

const steps = [
  { title: "Understanding Your School’s Needs", body: "Assess existing resources, student needs and inclusion goals.", accent: "#10494c", tint: "#EEF9F9" },
  { title: "Ongoing Specialist Support", body: "Experts provide school visits, practical guidance and team mentoring.", accent: "#0369a1", tint: "#F0F9FF" },
  { title: "Personalised Learning for Every Child", body: "Developmentally appropriate interventions aligned with individual learning goals.", accent: "#a14da5", tint: "#F8F2F9" },
  { title: "Families as Active Partners", body: "Parents reinforce learning through guided home activities and progress updates.", accent: "#b45309", tint: "#FFFBEB" },
  { title: "Continuous monitoring and improvement", body: "Regular outcome reviews help refine strategies and educational practices.", accent: "#b91c1c", tint: "#FEF2F2" },
] as const;

/** The five implementation steps. The section stays pinned while each step opens in turn. */
export function ImplementationSteps() {
  return (
    <PinnedStages count={steps.length} className="items-start! pt-[80px] pb-6 lg:pt-[84px]">
      {(active, flow, goTo) => (
        <div className="mx-auto flex w-full max-w-[1248px] flex-col items-center gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="order-2 flex w-full flex-col items-start gap-3 lg:order-1 lg:max-w-[621px] lg:gap-5">
            {steps.map((s, i) => (
              <StageCard
                key={s.title}
                active={flow || active === i}
                showBar={!flow}
                onSelect={flow ? undefined : () => goTo(i)}
                titleColor={s.accent}
                strokeColor={s.accent}
                fillColor={s.tint}
                barColor={s.accent}
                title={s.title}
                lead={
                  <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-full text-[13px] max-lg:text-[14px] font-bold lg:size-8 lg:text-[14px]"
                    style={{ backgroundColor: s.tint, color: s.accent }}
                  >
                    {i + 1}
                  </span>
                }
              >
                <p>{s.body}</p>
              </StageCard>
            ))}
          </div>
          <MotionImage
            enter="rise"
            className="relative order-1 aspect-[567/725] h-[clamp(120px,calc(100svh-565px),340px)] shrink-0 lg:order-2 lg:h-[min(725px,76svh)]"
          >
            {/* The petals sit still. The centre logo is a separate layer on top. */}
            <div className="absolute inset-0">
              <Image src="/images/schools/tailored-implementation-petals.webp" alt="" fill sizes="100vw" className="object-cover" />
            </div>
            <Image src="/images/schools/tailored-implementation-centre.webp" alt="" fill sizes="100vw" className="object-cover" />
          </MotionImage>
        </div>
      )}
    </PinnedStages>
  );
}
