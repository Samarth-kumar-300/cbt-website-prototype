import Link from "next/link";
import { TextReveal } from "@/components/shared/TextReveal";
import { tryDemoContent as c } from "../content";

export function Section2() {
  return (
    <section className="px-5 pb-14 pt-8 lg:px-[84px] lg:pb-[76px] lg:pt-0">
      <div className="mx-auto max-w-[1248px]">
        <div
          className="flex flex-col items-center gap-5 rounded-[24px] px-[22px] py-9 text-center lg:rounded-[32px] lg:py-[52px]"
          style={{ background: "linear-gradient(90deg, #f6e8f7 0%, #ead3ee 55%, #ddecea 100%)" }}
        >
          <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[28px] font-semibold leading-[40px] text-brand-teal lg:text-[40px] lg:leading-[48px]">{c.cta.heading}</TextReveal>
          <Link
            href={c.cta.href}
            className="btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand-teal px-6 py-[14px] text-[16px] font-semibold text-content-knockout transition-colors hover:bg-[#0f4548]"
          >
            {c.cta.label} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
