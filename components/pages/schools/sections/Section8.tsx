import { ScrollGradient } from "@/components/shared/ScrollGradient";
import { TextReveal } from "@/components/shared/TextReveal";
import Link from "next/link";

export function Section8() {
  return (
    <section
      id="get-in-touch"
      className="scroll-mt-[120px] px-5 lg:px-24 pt-0 pb-16 lg:pb-24"
    >
      <div className="mx-auto max-w-[1248px]">
        <ScrollGradient
          className="flex flex-col [background:var(--cta-bg-mobile)] lg:items-center lg:text-center lg:[background:var(--cta-bg)] gap-[14px] rounded-[24px] px-[22px] py-7 lg:gap-6 lg:rounded-[32px] lg:px-16 lg:py-[62px] items-center text-center"
          style={{
            "--cta-bg":
              "linear-gradient(90deg, #f6e8f7 0%, #ead3ee 55%, #ddecea 100%)",
            "--cta-bg-mobile":
              "linear-gradient(90deg, #f6e8f7 0%, #ead3ee 55%, #ddecea 100%)",
          }}
        >
          <div className="flex flex-col gap-[14px] lg:items-center lg:gap-3 items-center text-center">
            <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[20px] font-semibold leading-[30px] text-brand-teal lg:text-[40px] lg:leading-[48px]">{"Build a more inclusive school with confidence"}</TextReveal>
            <p className="text-[14px] leading-[22px] text-text-secondary lg:text-[18px] lg:leading-[27px] lg:text-text-default">
              Support your educators. Empower your learners. Keep families
              connected.
            </p>
          </div>
          <Link
            className="btn inline-flex items-center rounded-full whitespace-nowrap font-semibold gap-[10px] px-6 py-[14px] text-[16px] lg:py-[18px] lg:pl-8 lg:pr-[30px] lg:text-[18px] bg-brand-teal text-content-knockout transition-colors hover:bg-[#0f4548] w-full justify-center lg:w-auto "
            href="/contact-us"
          >
            Book a school demo
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
        </ScrollGradient>
      </div>
    </section>
  );
}
