import { RevealStagger } from "@/components/shared/RevealStagger";
import { Reveal } from "@/components/shared/Reveal";
import Image from "next/image";
import type { CSSProperties } from "react";

// w/h: rendered size of the icon's visible artwork at lg, from the design PDF.
const programme = [
  { icon: "bloom-v2-objectives.webp", w: 68, h: 49, bold: "450+ learning objectives", rest: " across 10 skill areas" },
  { icon: "bloom-v2-tasks.webp", w: 72, h: 57, bold: "1,800+ structured tasks", rest: " to support individualised learning" },
  { icon: "bloom-v2-social-stories.webp", w: 70, h: 55, bold: "20+ social stories", rest: " to build communication and everyday skills" },
  { icon: "bloom-v2-parent-videos.webp", w: 71, h: 57, bold: "450+ guided parent training videos", rest: " to extend practice into the home" },
  { icon: "bloom-v2-learning-plans.webp", w: 48, h: 64, bold: "Individualised learning plans", rest: " aligned to each student’s needs" },
  { icon: "bloom-v2-ai.webp", w: 78, h: 78, bold: "AI-powered learning experiences", rest: " that adapt to student progress" },
  { icon: "bloom-v2-onboarding.webp", w: 68, h: 47, bold: "Teacher onboarding and professional development", rest: " with specialist mentoring" },
  { icon: "bloom-v2-progress.webp", w: 45, h: 59, bold: "Progress tracking and outcome reporting", rest: " to monitor implementation" },
  { icon: "bloom-v2-reviews.webp", w: 65, h: 70, bold: "Continuous implementation reviews", rest: " to refine the programme as you evolve" },
] as const;

export function Section6() {
  return (
    <section className="bg-white px-5 pt-14 pb-14 lg:px-24 lg:pt-[90px] lg:pb-[90px]">
      <div className="mx-auto flex max-w-[1248px] flex-col items-start gap-6 lg:gap-8">
        <Reveal><h2 className="font-heading text-[24px] font-semibold leading-[32px] text-brand-dark lg:text-[40px] lg:leading-[48px]">
          {"Designed around your "}
          <span className="text-content-brand-secondary">classroom needs</span>
        </h2></Reveal>
        <RevealStagger className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {programme.map((item) => (
            <div
              key={item.bold}
              className="flex h-[72px] items-center gap-3 rounded-[14px] border-[1.5px] border-[#f4e4f5] bg-white px-3 py-3 lg:h-[92px] lg:px-[18px] lg:py-4"
            >
              <div className="flex h-[40px] w-[50px] shrink-0 items-center justify-center lg:h-[76px] lg:w-[74px]">
                <div
                  data-motion-image
                  className="relative h-[calc(var(--icon-h)*0.7)] w-[calc(var(--icon-w)*0.7)] lg:h-[var(--icon-h)] lg:w-[var(--icon-w)]"
                  style={{ "--icon-w": `${item.w}px`, "--icon-h": `${item.h}px` } as CSSProperties}
                >
                  <Image
                    src={`/images/schools/${item.icon}`}
                    alt=""
                    fill
                    sizes="74px"
                    className="object-contain"
                  />
                </div>
              </div>
              <p className="flex-1 text-[13px] max-lg:text-[14px] leading-[normal] text-text-default lg:text-[14px]">
                <span className="font-bold text-brand-teal">
                  {item.bold}
                </span>
                {item.rest}
              </p>
            </div>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
