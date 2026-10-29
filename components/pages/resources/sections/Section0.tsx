import { TextReveal } from "@/components/shared/TextReveal";
export function Section0() {
  return (
    <section
      className="px-5 pb-9 pt-[116px] lg:px-24 lg:pb-20 lg:pt-[150px]"
      style={{
        background:
          "linear-gradient(90deg, rgba(147, 229, 125, 0.1) 0%, rgba(93, 198, 243, 0.1) 50%, rgba(181, 90, 186, 0.1) 100%), #FFF",
      }}
    >
      <div className="mx-auto flex max-w-[1248px] flex-col items-start gap-3 lg:gap-[26px]">
        <p className="font-heading text-[13px] max-lg:text-[14px] font-semibold leading-[18px] tracking-[1.2px] text-content-brand-secondary lg:text-[20px] lg:font-bold lg:leading-[26px] lg:tracking-normal">
          RESOURCES
        </p>
        <div className="flex flex-col items-start gap-2 lg:gap-4">
          <TextReveal as="h1" split="lines" trigger="load" className="font-heading text-[36px] font-semibold leading-[48px] text-brand-teal lg:text-[48px] lg:leading-[58px]">Autism and early intervention resources,<br className="hidden lg:block" /> answers and stories</TextReveal>
          <p className="text-[14px] leading-[22px] text-text-default lg:text-[22px] lg:leading-[33px]">
            Resources on autism and early intervention, honest stories and best
            practices for families and professionals walking the journey
            together.
          </p>
        </div>
      </div>
    </section>
  );
}
