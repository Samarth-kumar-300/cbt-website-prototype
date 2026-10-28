import { RevealStagger } from "@/components/shared/RevealStagger";
import { TextReveal } from "@/components/shared/TextReveal";
export function Section4() {
  return (
    <section className="bg-[#f7fbfb] px-5 py-14 lg:px-24 lg:pb-[88px] lg:pt-12">
      <div className="mx-auto flex max-w-[1248px] flex-col items-start gap-5 lg:gap-11">
        <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-dark lg:text-[40px] lg:leading-[48px]">{"Achievements"}</TextReveal>
        <RevealStagger className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href="https://d2gq2a16cq5v8g.cloudfront.net/documents/CognitiveBotics_India_Patent.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full flex-1 flex-col items-start gap-4 rounded-[20px] border-[1.5px] border-brand-teal-100 bg-white px-6 py-6 shadow-[0px_10px_24px_-6px_rgba(23,94,99,0.07)] card-lift hover:bg-background-brand-subtle lg:px-7 lg:py-7 lg:min-h-[420px]"
          >
            <span
              data-icon
              className="flex size-10 shrink-0 items-center justify-center rounded-full lg:size-12"
              style={{ backgroundColor: "#fffbeb" }}
            >
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
                className="lg:size-6"
                style={{ color: "#b45309" }}
              >
                <path d="M10 17.659V20a2 2 0 1 0 4 0v-2.341M12 2v1m-9 9H2m3.5-6.5-.6-.6m13.6.6.6-.6M22 12h-1m-3 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"></path>
              </svg>
            </span>
            <span
              className="inline-block rounded-full px-[10px] py-[5px] text-[13px] max-lg:text-[14px] lg:text-[14px]"
              style={{ backgroundColor: "#fff7de", color: "#998035" }}
            >
              Granted Indian Patent • No. 586929
            </span>
            <p
              className="font-heading text-[18px] leading-[24px] lg:text-[20px] lg:leading-[26px] font-semibold"
              style={{ color: "#10494c" }}
            >
              Methods for Aiding Persons with Autism to Acquire Skills
            </p>
            <p className="text-[16px] leading-[24px] text-text-default lg:text-[18px] lg:leading-[27px]">
              Granted by the Patent Office, Government of India - protecting
              CognitiveBotics’ AI-guided skill-acquisition methodology for
              children with autism through 2039.
            </p>
            <div className="flex-1"></div>
            <span className="flex items-center gap-[6px] text-[14px] font-semibold text-brand-teal">
              View Certificate
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 12h16m0 0-6-6m6 6-6 6"></path>
              </svg>
            </span>
          </a>
          <a
            href="https://d2gq2a16cq5v8g.cloudfront.net/documents/Final-ISO-27001-Certificate-2026.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full flex-1 flex-col items-start gap-4 rounded-[20px] border-[1.5px] border-brand-teal-100 bg-white px-6 py-6 shadow-[0px_10px_24px_-6px_rgba(23,94,99,0.07)] card-lift hover:bg-background-brand-subtle lg:px-7 lg:py-7 lg:min-h-[420px]"
          >
            <span
              data-icon
              className="flex size-10 shrink-0 items-center justify-center rounded-full lg:size-12"
              style={{ backgroundColor: "#f0f9ff" }}
            >
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
                className="lg:size-6"
                style={{ color: "#0369a1" }}
              >
                <path d="M7.967 14.722 7 22l4.588-2.753c.15-.09.225-.135.305-.152a.5.5 0 0 1 .214 0c.08.017.155.062.305.152L17 22l-.966-7.279M19 9A7 7 0 1 1 5 9a7 7 0 0 1 14 0Z"></path>
              </svg>
            </span>
            <span
              className="inline-block rounded-full px-[10px] py-[5px] text-[13px] max-lg:text-[14px] lg:text-[14px]"
              style={{ backgroundColor: "#dff4fd", color: "#646871" }}
            >
              Certified
            </span>
            <p
              className="font-heading text-[18px] leading-[24px] lg:text-[20px] lg:leading-[26px] font-semibold"
              style={{ color: "#10494c" }}
            >
              ISO Certification
            </p>
            <p className="text-[16px] leading-[24px] text-text-default lg:text-[18px] lg:leading-[27px]">
              ISO 27001 certified
            </p>
            <div className="flex-1"></div>
            <span className="flex items-center gap-[6px] text-[14px] font-semibold text-brand-teal">
              View Certificate
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 12h16m0 0-6-6m6 6-6 6"></path>
              </svg>
            </span>
          </a>
        </RevealStagger>
      </div>
    </section>
  );
}
