import { RevealStagger } from "@/components/shared/RevealStagger";
import { TextReveal } from "@/components/shared/TextReveal";
import Link from "next/link";

export function Section3() {
  return (
    <section
      id="research"
      className="scroll-mt-[120px] px-5 py-14 lg:px-24 lg:pb-[90px] lg:pt-[84px]"
    >
      <div className="mx-auto flex max-w-[1248px] flex-col items-start gap-5 lg:gap-10">
        <div className="flex flex-col items-start gap-[10px] lg:gap-3">
          <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-dark lg:text-[40px] lg:leading-[48px]">{"Research"}</TextReveal>
          <p className="text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
            Explore peer-reviewed research and validation studies showcasing how
            we deliver measurable outcomes
          </p>
        </div>
        <RevealStagger className="flex w-full flex-col gap-6 lg:flex-row">
          <Link
            href="/resources/research/effectiveness-of-artificial-intelligence-based-platform-in-administering-therapies-for-children-with-autism-spectrum-disorder-12-month-observational-study"
            className="flex w-full flex-1 flex-col items-start gap-4 rounded-[20px] border-[1.5px] border-brand-teal-100 bg-white px-6 py-6 shadow-[0px_10px_24px_-6px_rgba(23,94,99,0.07)] card-lift hover:bg-background-brand-subtle lg:px-7 lg:py-7 lg:min-h-[380px]"
          >
            <span
              data-icon
              className="flex size-10 shrink-0 items-center justify-center rounded-full lg:size-12"
              style={{ backgroundColor: "#eef9f9" }}
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
                style={{ color: "#207d82" }}
              >
                <path d="M14 2.27V6.4c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437c.214.11.494.11 1.054.11h4.13M16 13H8m8 4H8m2-8H8m6-7H8.8c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C4 4.28 4 5.12 4 6.8v10.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311C6.28 22 7.12 22 8.8 22h6.4c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C20 19.72 20 18.88 20 17.2V8l-6-6Z"></path>
              </svg>
            </span>
            <span
              className="inline-block rounded-full px-[10px] py-[5px] text-[13px] max-lg:text-[14px] lg:text-[14px]"
              style={{ backgroundColor: "#ddf3f4", color: "#175f63" }}
            >
              12-Month Observational Study
            </span>
            <p
              className="font-heading text-[18px] leading-[24px] lg:text-[20px] lg:leading-[26px] font-bold"
              style={{ color: "#175f63" }}
            >
              Effectiveness of Artificial Intelligence–Based Platform in
              Administering Therapies for Children With Autism Spectrum
              Disorder: 12-Month Observational Study
            </p>
            <div className="flex-1"></div>
            <span className="flex items-center gap-[6px] text-[14px] font-semibold text-brand-teal">
              Read more
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
          </Link>
          <Link
            href="/resources/research/application-of-ai-based-learning-platform-for-children-with-asd-developmental-delay-and-intellectual-disability-a-prospective-cohort-study"
            className="flex w-full flex-1 flex-col items-start gap-4 rounded-[20px] border-[1.5px] border-brand-teal-100 bg-white px-6 py-6 shadow-[0px_10px_24px_-6px_rgba(23,94,99,0.07)] card-lift hover:bg-background-brand-subtle lg:px-7 lg:py-7 lg:min-h-[380px]"
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
                <path d="M14 2.27V6.4c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437c.214.11.494.11 1.054.11h4.13M14 17H8m8-4H8m12-3.012V17.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C17.72 22 16.88 22 15.2 22H8.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C4 19.72 4 18.88 4 17.2V6.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C6.28 2 7.12 2 8.8 2h3.212c.733 0 1.1 0 1.446.083.306.073.598.195.867.36.303.185.562.444 1.08.963l3.19 3.188c.518.519.777.778.963 1.081a3 3 0 0 1 .36.867c.082.346.082.712.082 1.446Z"></path>
              </svg>
            </span>
            <span
              className="inline-block rounded-full px-[10px] py-[5px] text-[13px] max-lg:text-[14px] lg:text-[14px]"
              style={{ backgroundColor: "#dff4fd", color: "#387792" }}
            >
              A Prospective Cohort Study
            </span>
            <p
              className="font-heading text-[18px] leading-[24px] lg:text-[20px] lg:leading-[26px] font-bold"
              style={{ color: "#175f63" }}
            >
              Application of AI-Based Learning Platform for Children with ASD,
              Developmental Delay and Intellectual Disability – A Prospective
              Cohort Study
            </p>
            <div className="flex-1"></div>
            <span className="flex items-center gap-[6px] text-[14px] font-semibold text-brand-teal">
              Read more
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
          </Link>
          <Link
            href="/resources/research/methods-for-aiding-persons-with-autism-to-acquire-skills"
            className="flex w-full flex-1 flex-col items-start gap-4 rounded-[20px] border-[1.5px] border-brand-teal-100 bg-white px-6 py-6 shadow-[0px_10px_24px_-6px_rgba(23,94,99,0.07)] card-lift hover:bg-background-brand-subtle lg:px-7 lg:py-7 lg:min-h-[380px]"
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
              className="font-heading text-[18px] leading-[24px] lg:text-[20px] lg:leading-[26px] font-bold"
              style={{ color: "#175f63" }}
            >
              Methods for Aiding Persons with Autism to Acquire Skills
            </p>
            <div className="flex-1"></div>
            <span className="flex items-center gap-[6px] text-[14px] font-semibold text-brand-teal">
              Read more
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
          </Link>
        </RevealStagger>
      </div>
    </section>
  );
}
