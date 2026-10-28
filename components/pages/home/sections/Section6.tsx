import { TextReveal } from "@/components/shared/TextReveal";
import { FaqList } from "@/components/shared/FaqList";
import { faq } from "../content";
import { faqIcons } from "../faq-icons";

export function Section6() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-14 lg:px-24 lg:py-24">
      <div className="flex flex-col lg:flex-row lg:gap-5 gap-6">
        <div className="flex max-w-[403px] flex-col items-start gap-[10px]">
          <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-[color:var(--faq-heading-mobile)] lg:text-[38px] lg:leading-[46px] lg:text-[color:var(--faq-heading-color)]" style={{
              "--faq-heading-color": "var(--color-brand-teal)",
              "--faq-heading-mobile": "var(--color-content-brand-alt)",
            }}>{"Frequently Asked Questions"}</TextReveal>
        </div>
        <FaqList items={faq} icons={faqIcons} questionColor="#207d82" />
      </div>
    </section>
  );
}
