import { TextReveal } from "@/components/shared/TextReveal";
import Image from "next/image";
import { ContactForm } from "../ContactForm";

export function Section0() {
  return (
    <section
      className="px-5 pt-[116px] pb-9 lg:px-24 lg:pt-[180px] lg:pb-20"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(244,228,245,0.8) 0%, rgba(221,243,244,0.8) 57.616%), linear-gradient(90deg, rgb(255,255,255) 0%, rgb(255,255,255) 100%)",
      }}
    >
      <div className="mx-auto flex max-w-[1248px] flex-col items-start justify-between gap-12 lg:flex-row">
        <div className="flex w-full max-w-[560px] flex-col items-center gap-6">
          <div className="flex w-full flex-col items-start gap-4">
            <TextReveal as="h1" split="lines" trigger="load" className="font-heading text-[36px] font-semibold leading-[48px] text-brand-teal lg:text-[48px] lg:leading-[58px]">{"We're Here to Help"}</TextReveal>
            <p className="text-[14px] font-normal leading-[22px] text-text-default lg:font-heading lg:text-[24px] lg:leading-[30px]">
              Have questions or need assistance? Our team is just a message
              away.
            </p>
          </div>
          <Image
            src="/images/contact-us/contact-hero.webp"
            alt="CognitiveBotics mascot flying on a paper plane"
            width={2664}
            height={2356}
            sizes="(min-width: 1024px) 520px, 260px"
            priority
            className="hero-settle hero-delay-2 mt-4 h-auto w-[260px] max-w-[260px] lg:w-full lg:max-w-[520px]"
          />
        </div>
        <div className="w-full max-w-[680px]">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
