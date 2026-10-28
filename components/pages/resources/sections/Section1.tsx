import { Reveal } from "@/components/shared/Reveal";
import { TextReveal } from "@/components/shared/TextReveal";
import { Placeholder } from "@/components/shared/Placeholder";

export function Section1() {
  return (
    <section className="px-6 pb-16 pt-8 lg:px-24 lg:pb-[88px] lg:pt-12">
      <div className="mx-auto flex max-w-[1248px] flex-col items-start gap-6 lg:gap-[44px]">
        <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[28px] font-semibold leading-[36px] text-brand-dark lg:text-[40px] lg:leading-[48px]">{"Knowledge Base"}</TextReveal>
        <Reveal
          className="flex w-full flex-col items-start gap-6 rounded-[24px] px-6 py-6 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-5"
          style={{
            background:
              "linear-gradient(90deg, rgba(246,232,247,0.8) 0%, rgba(234,211,238,0.8) 55%, rgba(221,236,234,0.8) 100%)",
          }}
        >
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-5">
            <div data-motion-image className="relative h-[110px] w-[150px] shrink-0 lg:h-[171px] lg:w-[230px]">
              <Placeholder label="Image" className="object-contain" />
            </div>
            <p className="font-heading text-[18px] font-bold leading-[24px] text-brand-teal text-center lg:text-[24px] lg:leading-[30px] lg:text-left">
              Guides, troubleshooting and best practices to help you get the
              most out of CognitiveBotics
            </p>
          </div>
          <a
            href="https://support.cognitivebotics.com/support/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="btn inline-flex w-full items-center justify-center gap-[10px] whitespace-nowrap rounded-full bg-brand-teal px-5 py-[13px] text-[14px] font-semibold leading-[20px] text-content-knockout transition-colors hover:bg-[#0f4548] lg:w-auto lg:px-[28px] lg:py-4 lg:text-[18px] lg:leading-[27px]"
          >
            Visit the knowledge base
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
              <path d="M21 9V3m0 0h-6m6 0-9 9m-2-9H7.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C3 5.28 3 6.12 3 7.8v8.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C5.28 21 6.12 21 7.8 21h8.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C21 18.72 21 17.88 21 16.2V14"></path>
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
