import { ScrollIllustration } from "@/components/shared/ScrollIllustration";
import { ScrollStepRotate } from "@/components/shared/ScrollStepRotate";
import { ScrollStepItem } from "@/components/shared/ScrollStepItem";
import { RevealStagger } from "@/components/shared/RevealStagger";
import Image from "next/image";

export function Section4() {
  return (
    <section className="bg-[#fafcfb] px-5 pb-14 lg:px-24 lg:pb-[90px]">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
        <RevealStagger className="order-2 flex w-full flex-col items-start gap-3 lg:order-1 lg:gap-4 lg:max-w-[621px]">
          <ScrollStepItem index={0} steps={5} className="w-full">
            <div className="flex w-full flex-col gap-2 rounded-[18px] border-[1.5px] border-brand-teal-100 bg-white px-4 py-4 shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] lg:px-6 lg:py-5">
              <div className="flex w-full items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-teal text-[13px] font-bold text-content-knockout lg:size-8 lg:text-[14px]">
                  1
                </span>
                <p
                  className="flex-1 font-heading text-[16px] font-bold leading-[24px] lg:text-[20px] lg:leading-[26px]"
                  style={{ color: "#175f63" }}
                >
                  Understanding Your School&apos;s Needs
                </p>
              </div>
              <div className="flex w-full items-center justify-center pl-10 lg:pl-[44px]">
                <p className="flex-1 text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
                  Assess existing resources, student needs and inclusion goals.
                </p>
              </div>
            </div>
          </ScrollStepItem>
          <ScrollStepItem index={1} steps={5} className="w-full">
            <div className="flex w-full flex-col gap-2 rounded-[18px] border-[1.5px] border-brand-teal-100 bg-white px-4 py-4 shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] lg:px-6 lg:py-5">
              <div className="flex w-full items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-teal text-[13px] font-bold text-content-knockout lg:size-8 lg:text-[14px]">
                  2
                </span>
                <p
                  className="flex-1 font-heading text-[16px] font-bold leading-[24px] lg:text-[20px] lg:leading-[26px]"
                  style={{ color: "#10494c" }}
                >
                  Ongoing Specialist Support
                </p>
              </div>
              <div className="flex w-full items-center justify-center pl-10 lg:pl-[44px]">
                <p className="flex-1 text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
                  Experts provide school visits, practical guidance and team mentoring.
                </p>
              </div>
            </div>
          </ScrollStepItem>
          <ScrollStepItem index={2} steps={5} className="w-full">
            <div className="flex w-full flex-col gap-2 rounded-[18px] border-[1.5px] border-brand-teal-100 bg-white px-4 py-4 shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] lg:px-6 lg:py-5">
              <div className="flex w-full items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-teal text-[13px] font-bold text-content-knockout lg:size-8 lg:text-[14px]">
                  3
                </span>
                <p
                  className="flex-1 font-heading text-[16px] font-bold leading-[24px] lg:text-[20px] lg:leading-[26px]"
                  style={{ color: "#10494c" }}
                >
                  Personalised Learning for Every Child
                </p>
              </div>
              <div className="flex w-full items-center justify-center pl-10 lg:pl-[44px]">
                <p className="flex-1 text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
                  Developmentally appropriate interventions aligned with individual learning goals.
                </p>
              </div>
            </div>
          </ScrollStepItem>
          <ScrollStepItem index={3} steps={5} className="w-full">
            <div className="flex w-full flex-col gap-2 rounded-[18px] border-[1.5px] border-brand-teal-100 bg-white px-4 py-4 shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] lg:px-6 lg:py-5">
              <div className="flex w-full items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-teal text-[13px] font-bold text-content-knockout lg:size-8 lg:text-[14px]">
                  4
                </span>
                <p
                  className="flex-1 font-heading text-[16px] font-bold leading-[24px] lg:text-[20px] lg:leading-[26px]"
                  style={{ color: "#10494c" }}
                >
                  Families as Active Partners
                </p>
              </div>
              <div className="flex w-full items-center justify-center pl-10 lg:pl-[44px]">
                <p className="flex-1 text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
                  Parents reinforce learning through guided home activities and progress updates.
                </p>
              </div>
            </div>
          </ScrollStepItem>
          <ScrollStepItem index={4} steps={5} className="w-full">
            <div className="flex w-full flex-col gap-2 rounded-[18px] border-[1.5px] border-brand-teal-100 bg-white px-4 py-4 shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] lg:px-6 lg:py-5">
              <div className="flex w-full items-start gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-teal text-[13px] font-bold text-content-knockout lg:size-8 lg:text-[14px]">
                  5
                </span>
                <p
                  className="flex-1 font-heading text-[16px] font-bold leading-[24px] lg:text-[20px] lg:leading-[26px]"
                  style={{ color: "#10494c" }}
                >
                  Continuous monitoring and improvement
                </p>
              </div>
              <div className="flex w-full items-center justify-center pl-10 lg:pl-[44px]">
                <p className="flex-1 text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
                  Regular outcome reviews help refine strategies and educational practices.
                </p>
              </div>
            </div>
          </ScrollStepItem>
        </RevealStagger>
        {/* Sticky on desktop keeps the flower in view while the steps scroll past; it adds no height. */}
        {/* Sticky on desktop keeps the flower in view while the steps scroll past; it adds no height. */}
        <ScrollIllustration className="relative order-1 h-[332px] w-full max-w-[260px] shrink-0 lg:sticky lg:top-[calc(50vh-362px)] lg:order-2 lg:h-[725px] lg:max-w-[567px]">
          {/* The petals turn in 72° steps. The centre logo is a separate upright layer on top. */}
          <ScrollStepRotate steps={5} stepAngle={72} className="absolute inset-0">
            <Image
              src="/images/schools/tailored-implementation-petals.webp"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
          </ScrollStepRotate>
          <Image
            src="/images/schools/tailored-implementation-centre.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </ScrollIllustration>
      </div>
    </section>
  );
}
