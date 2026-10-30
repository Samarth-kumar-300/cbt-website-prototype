"use client";

import Image from "next/image";
import { MotionImage } from "@/components/shared/MotionImage";
import { PinnedStages, StageCard } from "@/components/shared/ScrollStages";

const steps = [
  {
    title: "Daily Journal",
    body: "Capture daily moments, milestones and observations, helping parents and therapists identify meaningful patterns in a child’s progress.",
    src: "/images/parents/parents-toolkit-journal.webp",
    accent: "#10494c",
    tint: "#EEF9F9",
    alt: "CognitiveBotics daily journal on a tablet and a phone",
  },
  {
    title: "Personalised Learning Plans",
    body: "Every learning plan is tailored to a child’s developmental goals, keeping each session focused on the skills that matter most.",
    src: "/images/parents/parents-toolkit-learn-illustration.webp",
    accent: "#a14da5",
    tint: "#F8F2F9",
    alt: "CognitiveBotics personalised learning plan on a tablet and a phone",
  },
  {
    title: "Progress Reports",
    body: "Clear, easy-to-understand reports help parents and therapists follow progress over time and see how learning is evolving.",
    src: "/images/parents/parents-toolkit-progress.webp",
    accent: "#b45309",
    tint: "#FFFBEB",
    alt: "CognitiveBotics progress report on a tablet and a phone",
  },
] as const;

/** The three toolkit features. The block stays pinned while each opens in turn and shows its illustration. */
export function ToolkitSteps() {
  return (
    <PinnedStages count={steps.length} className="pt-[72px] pb-6 lg:pt-[88px]">
      {(active, flow, goTo) =>
        flow ? (
          // Not enough room to pin: each feature opens with its own illustration under it.
          <div className="flex flex-col gap-6">
            {steps.map((s) => (
              <div key={s.title} className="flex flex-col gap-3">
                <StageCard active showBar={false} titleColor={s.accent} strokeColor={s.accent} fillColor={s.tint} title={s.title}>
                  <p>{s.body}</p>
                </StageCard>
                <MotionImage enter="rise" className="relative aspect-[1400/1071] w-full">
                  <Image src={s.src} alt={s.alt} fill sizes="(min-width: 1024px) 600px, 92vw" className="object-contain" />
                </MotionImage>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid w-full grid-cols-1 items-center gap-4 lg:grid-cols-2 lg:gap-10">
            <div className="relative aspect-[1400/1071] max-h-[34svh] w-full lg:order-2 lg:max-h-none">
              {steps.map((s, i) => (
                <Image
                  key={s.src}
                  src={s.src}
                  alt={active === i ? s.alt : ""}
                  fill
                  sizes="(min-width: 1024px) 600px, 92vw"
                  className={`object-contain transition-opacity duration-500 ease-in-out ${active === i ? "opacity-100" : "opacity-0"}`}
                />
              ))}
            </div>
            <div className="flex flex-col gap-3 lg:order-1 lg:gap-6">
              {steps.map((s, i) => (
                <StageCard
                  key={s.title}
                  active={active === i}
                  titleColor={s.accent}
                  strokeColor={s.accent}
                  fillColor={s.tint}
                  barColor={s.accent}
                  title={s.title}
                  onSelect={() => goTo(i)}
                >
                  <p>{s.body}</p>
                </StageCard>
              ))}
            </div>
          </div>
        )
      }
    </PinnedStages>
  );
}
