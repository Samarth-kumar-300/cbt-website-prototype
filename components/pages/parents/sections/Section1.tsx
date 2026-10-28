import { TextReveal } from "@/components/shared/TextReveal";
import { EarlyDifferenceCards } from "../EarlyDifferenceCards";

export function Section1() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 pt-[56px] pb-[56px] lg:px-24 lg:py-24">
      <TextReveal as="h2" split="words" trigger="scroll" className="max-w-[541px] font-heading text-[20px] font-semibold leading-[30px] text-[#374151] lg:text-[40px] lg:leading-[48px] lg:text-brand-dark">{"Recognising Early Differences"}</TextReveal>
      <EarlyDifferenceCards />
    </section>
  );
}
