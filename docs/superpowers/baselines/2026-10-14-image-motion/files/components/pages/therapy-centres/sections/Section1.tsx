import { TextReveal } from "@/components/shared/TextReveal";
import Link from "next/link";
import { Placeholder } from "@/components/shared/Placeholder";

export function Section1() {
  return (
    <section className="mx-auto flex max-w-[1440px] flex-col items-center gap-9 px-5 py-14 lg:flex-row lg:gap-16 lg:px-24 lg:py-24">
      <div className="flex max-w-[740px] flex-col items-start gap-6 lg:gap-6">
        <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[40px] lg:leading-[48px]">{"What we believe"}</TextReveal>
        <div className="flex flex-col items-start gap-3 lg:gap-[22px]">
          <p className="text-[14px] leading-[22px] text-text-default lg:text-[22px] lg:leading-[33px]">
            Tracking a child’s progress across therapy, home and school can be
            challenging. CognitiveBotics connects these settings, helping
            therapists, schools and parents reinforce skills, track progress and
            support everyday learning.
          </p>
          <div className="hidden lg:block">
            <Link
              className="btn inline-flex items-center rounded-full whitespace-nowrap font-semibold gap-[8px] py-[14px] px-6 text-[16px] bg-brand-teal text-content-knockout transition-colors hover:bg-[#0f4548] mt-2"
              href="/contact-us"
            >
              Start a Conversation
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
        </div>
      </div>
      <div className="relative h-[238px] w-full max-w-[300px] shrink-0 lg:h-[403px] lg:max-w-[508px]">
        <Placeholder
          label="A therapist working with a child"
          className="object-contain"
        />
      </div>
      <Link
        href="/contact-us"
        className="btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand-teal px-6 py-[14px] text-[16px] font-semibold text-content-knockout transition-colors hover:bg-[#0f4548] lg:hidden"
      >
        Start a Conversation
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
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
    </section>
  );
}
