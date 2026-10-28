import { TextReveal } from "@/components/shared/TextReveal";
import Link from "next/link";
import { Placeholder } from "@/components/shared/Placeholder";

export function Section1() {
  return (
    <section className="mx-auto flex max-w-[1440px] flex-col items-center gap-9 px-5 py-14 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:py-[88px] lg:px-24">
      <div className="flex max-w-[614px] flex-col items-start gap-3 lg:gap-[18px]">
        <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[40px] lg:leading-[48px]">{"Inclusive learning begins with the right support"}</TextReveal>
        <p className="text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
          CognitiveBotics connects educators, specialists and families to
          personalise learning and track progress. With simplified coordination,
          schools can focus on helping every child thrive.
        </p>
        <Link
          href="/resources#blog"
          className="flex items-center gap-[10px] text-[16px] font-semibold text-brand-teal lg:text-[18px]"
        >
          Learn more about inclusive education
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 12h16m0 0-6-6m6 6-6 6"></path>
          </svg>
        </Link>
      </div>
      <div className="relative h-[260px] w-full shrink-0 lg:h-[451px] lg:max-w-[608px]">
        <Placeholder label="Image" className="object-contain" />
      </div>
    </section>
  );
}
