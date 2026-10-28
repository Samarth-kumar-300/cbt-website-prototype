import { Reveal } from "@/components/shared/Reveal";
import { TextReveal } from "@/components/shared/TextReveal";
import Image from "next/image";

export function Section0() {
  return (
    <section
      className="relative overflow-hidden rounded-bl-[50%_23px] rounded-br-[50%_23px] pt-[150px] pb-[68px] lg:rounded-bl-[50%_120px] lg:rounded-br-[50%_120px] lg:pb-[102px]"
      style={{
        background:
          "linear-gradient(90deg, #eaf5f2 0%, #f4eff6 49.038%, #fcede9 100%)",
      }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-[26px] px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:px-24">
        <div className="flex max-w-[730px] flex-col items-start gap-[14px] lg:gap-6">
          <p className="font-heading text-[13px] max-lg:text-[14px] font-semibold leading-[18px] tracking-[1.2px] text-content-brand-secondary lg:text-[20px] lg:font-bold lg:leading-[26px] lg:tracking-normal">
            FOR PARENTS
          </p>
          <h1 className="font-heading text-[36px] font-semibold leading-[48px] text-brand-teal lg:text-[48px] lg:leading-[58px]">
            Extend your child’s therapy beyond the clinic with support tailored to their unique needs
          </h1>
          <ul className="flex flex-wrap gap-3 lg:mt-2">
            <li className="flex items-center gap-2 rounded-full border border-[#e2e8ef] bg-white py-[6px] pl-[6px] pr-4 text-[14px] leading-[22px] text-text-default shadow-[0px_1px_2px_rgba(16,24,40,0.04)]">
              <span className="flex size-8 items-center justify-center rounded-full" style={{ backgroundColor: "#eef6fb" }}>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "#387792" }}>
                  <path d="M14 2.27V6.4c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437c.214.11.494.11 1.054.11h4.13M14 17H8m8-4H8m12-3.012V17.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C17.72 22 16.88 22 15.2 22H8.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C4 19.72 4 18.88 4 17.2V6.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C6.28 2 7.12 2 8.8 2h3.212c.733 0 1.1 0 1.446.083.306.073.598.195.867.36.303.185.562.444 1.08.963l3.19 3.188c.518.519.777.778.963 1.081a3 3 0 0 1 .36.867c.082.346.082.712.082 1.446Z"></path>
                </svg>
              </span>
              JMIR Outcomes
            </li>
            <li className="flex items-center gap-2 rounded-full border border-[#e2e8ef] bg-white py-[6px] pl-[6px] pr-4 text-[14px] leading-[22px] text-text-default shadow-[0px_1px_2px_rgba(16,24,40,0.04)]">
              <span className="flex size-8 items-center justify-center rounded-full" style={{ backgroundColor: "#f1f8f1" }}>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "#3d7a3f" }}>
                  <path d="M10 17.659V20a2 2 0 1 0 4 0v-2.341M12 2v1m-9 9H2m3.5-6.5-.6-.6m13.6.6.6-.6M22 12h-1m-3 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"></path>
                </svg>
              </span>
              Patented technology
            </li>
            <li className="flex items-center gap-2 rounded-full border border-[#e2e8ef] bg-white py-[6px] pl-[6px] pr-4 text-[14px] leading-[22px] text-text-default shadow-[0px_1px_2px_rgba(16,24,40,0.04)]">
              <span className="flex size-8 items-center justify-center rounded-full" style={{ backgroundColor: "#fef2f2" }}>
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: "#dc2626" }}>
                  <path d="M19 9A7 7 0 1 1 5 9a7 7 0 0 1 14 0Z M7.967 14.722 7 22l4.588-2.753c.15-.09.225-.135.305-.152a.5.5 0 0 1 .214 0c.08.017.155.062.305.152L17 22l-.966-7.279"></path>
                </svg>
              </span>
              ISO Certification
            </li>
          </ul>
        </div>
        <div className="hero-settle hero-delay-2 relative h-[300px] w-full max-w-[492px] shrink-0 lg:h-[489px]">
          <Image
            src="/images/parents/parents-hero.webp"
            alt="A family of three and a blue mascot with a tablet at a table"
            fill
            sizes="(min-width: 1024px) 492px, 92vw"
            className="object-contain"
          />
        </div>
      </div>
      <div
        id="what-is-autism"
        className="mx-auto mt-[26px] max-w-[1440px] scroll-mt-[120px] px-6 lg:mt-16 lg:px-24"
      >
        <Reveal className="rounded-[32px] border border-[#e2ede9] bg-white px-5 py-6 lg:p-12">
          <div className="flex flex-col items-start gap-5">
            <p className="font-heading text-[20px] font-bold leading-[26px] text-content-brand-secondary">
              WHAT IS AUTISM?
            </p>
            <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[32px] font-semibold leading-[40px] text-brand-dark lg:text-[40px] lg:leading-[48px]">{"Understanding Autism"}</TextReveal>
            <p className="text-[18px] leading-[27px] text-text-default">
              Autism is a condition that affects how children communicate, learn
              and connect with others. Some children may find it harder to
              express themselves, make friends or manage everyday changes.
              Understanding these needs early can help parents find the right
              support.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
