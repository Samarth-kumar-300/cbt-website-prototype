import { RevealStagger } from "@/components/shared/RevealStagger";
import { TextReveal } from "@/components/shared/TextReveal";
import Link from "next/link";

export function Section4() {
  return (
    <section
      id="find-your-path"
      className="mx-auto max-w-[1440px] scroll-mt-[120px] px-5 py-14 lg:px-24 lg:pt-[84px] lg:pb-[88px]"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-5">
        <div className="flex flex-col items-start gap-2 lg:w-[403px] lg:shrink-0 lg:gap-3">
          <p className="font-heading text-[14px] font-bold leading-[normal] text-content-brand-secondary lg:text-[20px] lg:leading-[26px]">
            WHERE WOULD YOU LIKE TO GO NEXT?
          </p>
          <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[20px] font-bold leading-[30px] text-content-brand lg:text-[40px] lg:font-semibold lg:leading-[48px]">{"Find your path"}</TextReveal>
        </div>
        <RevealStagger className="flex flex-1 flex-col gap-3 lg:gap-4">
          <Link
            href="/therapy-centres" style={{ "--row-color": "#15803d" }}
            className="group flex items-center gap-[14px] rounded-[16px] border-2 border-brand-teal-100 bg-white p-[18px] transition-all duration-200 motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1 hover:border-[rgba(23,95,99,0.38)] hover:bg-[color-mix(in_srgb,var(--row-color)_7%,white)] hover:shadow-[0px_10px_28px_-8px_rgba(23,94,99,0.18)] lg:gap-3 lg:rounded-[14px] lg:border-[1.5px] lg:border-[#e4ded4] lg:p-6"
          >
            <div className="flex flex-1 flex-col items-start gap-1 lg:w-[240px] lg:flex-none lg:flex-row lg:items-center lg:gap-0">
              <p
                className="font-heading text-[14px] font-bold leading-[normal] lg:shrink-0 lg:text-[20px] lg:leading-[26px]"
                style={{ color: "#15803d" }}
              >
                For Therapy Centres
              </p>
              <p className="text-[14px] leading-[22px] text-text-default lg:hidden">
                Delivering consistent, high-quality care at scale.
              </p>
            </div>
            <p className="hidden flex-1 text-[18px] leading-[27px] text-text-secondary lg:block">
              Delivering consistent, high-quality care at scale.
            </p>
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="shrink-0 transition-transform duration-200 motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1"
              style={{ color: "#15803d" }}
            >
              <path d="M4 12h16m0 0-6-6m6 6-6 6"></path>
            </svg>
          </Link>
          <Link
            href="/parents" style={{ "--row-color": "#b45309" }}
            className="group flex items-center gap-[14px] rounded-[16px] border-2 border-brand-teal-100 bg-white p-[18px] transition-all duration-200 motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1 hover:border-[rgba(23,95,99,0.38)] hover:bg-[color-mix(in_srgb,var(--row-color)_7%,white)] hover:shadow-[0px_10px_28px_-8px_rgba(23,94,99,0.18)] lg:gap-3 lg:rounded-[14px] lg:border-[1.5px] lg:border-[#e4ded4] lg:p-6"
          >
            <div className="flex flex-1 flex-col items-start gap-1 lg:w-[240px] lg:flex-none lg:flex-row lg:items-center lg:gap-0">
              <p
                className="font-heading text-[14px] font-bold leading-[normal] lg:shrink-0 lg:text-[20px] lg:leading-[26px]"
                style={{ color: "#b45309" }}
              >
                For Parents
              </p>
              <p className="text-[14px] leading-[22px] text-text-default lg:hidden">
                Understanding your child: guidance, clarity and support.
              </p>
            </div>
            <p className="hidden flex-1 text-[18px] leading-[27px] text-text-secondary lg:block">
              Understanding your child: guidance, clarity and support.
            </p>
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="shrink-0 transition-transform duration-200 motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1"
              style={{ color: "#b45309" }}
            >
              <path d="M4 12h16m0 0-6-6m6 6-6 6"></path>
            </svg>
          </Link>
          <Link
            href="/schools" style={{ "--row-color": "#0369a1" }}
            className="group flex items-center gap-[14px] rounded-[16px] border-2 border-brand-teal-100 bg-white p-[18px] transition-all duration-200 motion-safe:hover:-translate-y-1 motion-safe:focus-visible:-translate-y-1 hover:border-[rgba(23,95,99,0.38)] hover:bg-[color-mix(in_srgb,var(--row-color)_7%,white)] hover:shadow-[0px_10px_28px_-8px_rgba(23,94,99,0.18)] lg:gap-3 lg:rounded-[14px] lg:border-[1.5px] lg:border-[#e4ded4] lg:p-6"
          >
            <div className="flex flex-1 flex-col items-start gap-1 lg:w-[240px] lg:flex-none lg:flex-row lg:items-center lg:gap-0">
              <p
                className="font-heading text-[14px] font-bold leading-[normal] lg:shrink-0 lg:text-[20px] lg:leading-[26px]"
                style={{ color: "#0369a1" }}
              >
                For Schools
              </p>
              <p className="text-[14px] leading-[22px] text-text-default lg:hidden">
                Creating inclusive classrooms where every child belongs.
              </p>
            </div>
            <p className="hidden flex-1 text-[18px] leading-[27px] text-text-secondary lg:block">
              Creating inclusive classrooms where every child belongs.
            </p>
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="shrink-0 transition-transform duration-200 motion-safe:group-hover:translate-x-1 motion-safe:group-focus-visible:translate-x-1"
              style={{ color: "#0369a1" }}
            >
              <path d="M4 12h16m0 0-6-6m6 6-6 6"></path>
            </svg>
          </Link>
        </RevealStagger>
      </div>
    </section>
  );
}
