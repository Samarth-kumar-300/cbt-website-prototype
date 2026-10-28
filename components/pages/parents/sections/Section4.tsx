import { ToolkitSteps } from "../ToolkitSteps";
import { Reveal } from "@/components/shared/Reveal";
import { RevealStagger } from "@/components/shared/RevealStagger";
import { TextReveal } from "@/components/shared/TextReveal";

export function Section4() {
  return (
    <section
      style={{ background: "linear-gradient(90deg, #f3f2f8 0%, #ddf2f4 100%)" }}
    >
      <div className="mx-auto max-w-[1440px] px-5 pt-[56px] pb-[56px] lg:px-24 lg:py-24">
      <p className="font-heading text-[13px] max-lg:text-[14px] font-semibold tracking-[1.2px] leading-[18px] text-content-brand-secondary lg:text-[20px] lg:font-bold lg:leading-[26px] lg:tracking-normal lg:text-[#9a3fa0]">
        HOW COGNITIVEBOTICS HELPS
      </p>
      <TextReveal as="h2" split="words" trigger="scroll" className="mt-[10px] font-heading text-[24px] font-semibold leading-[32px] text-content-brand-alt lg:mt-3 lg:text-[40px] lg:leading-[48px] lg:text-brand-dark">{"The Daily Toolkit"}</TextReveal>
      <p className="mt-[10px] text-[14px] leading-[22px] text-text-secondary lg:mt-3 lg:text-[18px] lg:leading-[27px]">
        Supporting everyday learning and meaningful progress.
      </p>
      <RevealStagger className="mt-10 grid grid-cols-1 gap-[14px] lg:mt-16 lg:grid-cols-3 lg:gap-6">
        <div
          className="flex flex-col items-start gap-[6px] rounded-[18px] border border-brand-teal-100 bg-white px-[18px] py-5 shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] lg:gap-2 lg:p-8"
          style={{ "--stat-color": "#175f63" }}
        >
          <p
            className="font-heading text-[24px] font-semibold leading-[32px] lg:text-[48px] lg:leading-[58px] lg:text-[color:var(--stat-color)]"
            style={{ color: "var(--stat-color)" }}
          >
            450+
          </p>
          <p className="font-heading text-[16px] font-bold leading-[27px] text-brand-teal lg:text-[20px] lg:leading-[26px]">
            Learning Objectives
          </p>
          <p className="text-[14px] leading-[22px] text-text-secondary lg:text-[18px] lg:leading-[27px]">
            Personalised learning across 10 developmental areas, including communication social and motor skills.
          </p>
        </div>
        <div
          className="flex flex-col items-start gap-[6px] rounded-[18px] border border-brand-teal-100 bg-white px-[18px] py-5 shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] lg:gap-2 lg:p-8"
          style={{ "--stat-color": "#9a3fa0" }}
        >
          <p
            className="font-heading text-[24px] font-semibold leading-[32px] lg:text-[48px] lg:leading-[58px] lg:text-[color:var(--stat-color)]"
            style={{ color: "var(--stat-color)" }}
          >
            1,800+
          </p>
          <p className="font-heading text-[16px] font-bold leading-[27px] text-brand-teal lg:text-[20px] lg:leading-[26px]">
            Guided Activities
          </p>
          <p className="text-[14px] leading-[22px] text-text-secondary lg:text-[18px] lg:leading-[27px]">
            Structured, interactive exercises families can use at home to make daily practice engaging.
          </p>
        </div>
        <div
          className="flex flex-col items-start gap-[6px] rounded-[18px] border border-brand-teal-100 bg-white px-[18px] py-5 shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] lg:gap-2 lg:p-8"
          style={{ "--stat-color": "#c07158" }}
        >
          <p
            className="font-heading text-[24px] font-semibold leading-[32px] lg:text-[48px] lg:leading-[58px] lg:text-[color:var(--stat-color)]"
            style={{ color: "var(--stat-color)" }}
          >
            20+
          </p>
          <p className="font-heading text-[16px] font-bold leading-[27px] text-brand-teal lg:text-[20px] lg:leading-[26px]">
            Social Stories
          </p>
          <p className="text-[14px] leading-[22px] text-text-secondary lg:text-[18px] lg:leading-[27px]">
            Age-appropriate stories that help children understand everyday situations and practise new skills.
          </p>
        </div>
      </RevealStagger>
      <ToolkitSteps />
      <Reveal className="mt-10 flex items-start gap-[10px] rounded-[12px] border-2 border-[#eff1f0] px-6 py-3 lg:items-center lg:justify-center lg:gap-3 lg:rounded-full lg:border-0 lg:bg-brand-subtle-bg lg:px-6 lg:py-4">
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
          className="shrink-0 text-brand-teal lg:size-6"
        >
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10m0-20a15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0 4 10m0-20C6.477 2 2 6.477 2 12s4.477 10 10 10m0-20c5.523 0 10 4.477 10 10s-4.477 10-10 10M2.5 9h19m-19 6h19"></path>
        </svg>
        <p className="flex flex-col gap-[2px] text-[14px] leading-[21px] lg:flex-row lg:items-baseline lg:gap-0 lg:text-[18px] lg:leading-[27px]">
          <span className="font-semibold text-brand-teal lg:font-normal">
            App available in 8 languages.
          </span>
          <span style={{ color: "#646871" }} className="lg:hidden">
            Learning content in English and Telugu, with more coming soon
          </span>
          <span className="hidden text-text-secondary lg:ml-2 lg:inline">
            Learning content in English and Telugu, with more coming soon
          </span>
        </p>
      </Reveal>
      </div>
    </section>
  );
}
