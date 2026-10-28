import { RevealStagger } from "@/components/shared/RevealStagger";
import { Reveal } from "@/components/shared/Reveal";
import { TextReveal } from "@/components/shared/TextReveal";
import Image from "next/image";

export function Section5() {
  return (
    <section className="bg-brand-subtle-bg px-5 py-14 lg:px-24 lg:py-24">
      <div className="mx-auto flex max-w-[1248px] flex-col items-center gap-6 lg:gap-10">
        <Reveal className="flex w-full flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-[824px] flex-col items-start gap-[10px] lg:gap-4">
            <p className="font-heading text-[13px] max-lg:text-[14px] font-semibold leading-[18px] tracking-[1.2px] text-content-brand-secondary lg:text-[20px] lg:font-bold lg:leading-[26px] lg:tracking-normal">
              CLINICAL EVIDENCE
            </p>
            <TextReveal as="h2" split="sentences" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-content-brand-alt lg:text-[40px] lg:leading-[48px] lg:text-brand-teal">{"Clinical Research. Measurable Developmental Progress"}</TextReveal>
            <p className="text-[14px] leading-[22px] text-text-secondary lg:text-[22px] lg:leading-[33px] lg:text-text-default">
              A 12 month study with NIEPID evaluated developmental outcomes in 43
              children using CognitiveBotics.
            </p>
          </div>
          <div className="relative hidden h-[245px] w-full max-w-[377px] shrink-0 lg:block">
            <Image
              src="/images/therapy-centres/clinical-mascot-v2.webp"
              alt=""
              fill
              sizes="377px"
              className="object-contain"
            />
          </div>
        </Reveal>
        <RevealStagger className="relative grid w-full grid-cols-1 gap-[14px] pt-10 sm:grid-cols-3 lg:gap-6 lg:pt-0">
          <div className="pointer-events-none absolute -top-14 -right-4 z-10 h-40 w-40 lg:hidden">
            <Image
              src="/images/therapy-centres/clinical-mascot-v2.webp"
              alt=""
              fill
              sizes="160px"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-center gap-2 rounded-[18px] border border-brand-teal-100 bg-white px-5 py-[22px] text-center lg:min-h-[214px] lg:items-start lg:gap-[10px] lg:rounded-[20px] lg:border-[1.5px] lg:px-7 lg:py-[30px] lg:text-left">
            <p className="font-heading text-[14px] font-bold leading-[normal] text-text-secondary lg:text-[24px] lg:leading-[30px] lg:text-brand-teal">
              Social Age
            </p>
            <p
              className="font-heading text-[36px] font-semibold leading-[48px] lg:text-[48px] lg:leading-[58px]"
              style={{ color: "#175f63" }}
            >
              +56.84%
            </p>
            <p className="text-[14px] leading-[22px] text-[#646871] lg:text-[18px] lg:leading-[27px] lg:text-text-default">
              Improvement in social maturity and everyday interactions.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-[18px] border border-brand-teal-100 bg-white px-5 py-[22px] text-center lg:min-h-[214px] lg:items-start lg:gap-[10px] lg:rounded-[20px] lg:border-[1.5px] lg:px-7 lg:py-[30px] lg:text-left">
            <p className="font-heading text-[14px] font-bold leading-[normal] text-text-secondary lg:text-[24px] lg:leading-[30px] lg:text-brand-teal">
              Expressive Language
            </p>
            <p
              className="font-heading text-[36px] font-semibold leading-[48px] lg:text-[48px] lg:leading-[58px]"
              style={{ color: "#9a3fa0" }}
            >
              +59.93%
            </p>
            <p className="text-[14px] leading-[22px] text-[#646871] lg:text-[18px] lg:leading-[27px] lg:text-text-default">
              Improvement in the ability to communicate, measured through REEL.
            </p>
          </div>
          <div className="flex flex-col items-center gap-2 rounded-[18px] border border-brand-teal-100 bg-white px-5 py-[22px] text-center lg:min-h-[214px] lg:items-start lg:gap-[10px] lg:rounded-[20px] lg:border-[1.5px] lg:px-7 lg:py-[30px] lg:text-left">
            <p className="font-heading text-[14px] font-bold leading-[normal] text-text-secondary lg:text-[24px] lg:leading-[30px] lg:text-brand-teal">
              Developmental Age
            </p>
            <p
              className="font-heading text-[36px] font-semibold leading-[48px] lg:text-[48px] lg:leading-[58px]"
              style={{ color: "#a85923" }}
            >
              +46.49%
            </p>
            <p className="text-[14px] leading-[22px] text-[#646871] lg:text-[18px] lg:leading-[27px] lg:text-text-default">
              Improvement in developmental skills relative to age-based milestones.
            </p>
          </div>
        </RevealStagger>
        <div className="flex w-full flex-row flex-wrap items-center gap-x-2 gap-y-1 text-[18px] leading-[27px]">
          <p className="text-text-default">
            Published in JMIR Neurotechnology
          </p>
          <a
            href="https://doi.org/10.2196/70589"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center font-bold text-brand-teal underline"
          >
            View published study
          </a>
        </div>
      </div>
    </section>
  );
}
