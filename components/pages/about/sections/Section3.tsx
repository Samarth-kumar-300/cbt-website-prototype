import { RevealStagger } from "@/components/shared/RevealStagger";
import { TextReveal } from "@/components/shared/TextReveal";
import Image from "next/image";
import { LinkedInIcon } from "../LinkedInIcon";

export function Section3() {
  return (
    <section className="px-5 py-14 lg:px-24 lg:py-24 ">
      <div className="mx-auto max-w-[1248px]">
        <TextReveal
          as="h2"
          split="words"
          trigger="scroll"
          className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[40px] lg:leading-[48px]"
        >
          {"Advisory Board"}
        </TextReveal>
        <RevealStagger className="mt-5 grid grid-cols-2 gap-3 lg:mt-10 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-6">
          <div className="flex h-full w-full flex-col items-start gap-[10px] rounded-[18px] border border-[#e4edea] bg-white p-4 relative lg:gap-6 lg:rounded-[20px] lg:border-[#e8e2d8] lg:px-[26px] lg:py-7">
            <LinkedInIcon />
            <div
              data-motion-image
              className="avatar-hover relative size-14 shrink-0 overflow-hidden rounded-full bg-background-brand-subtle lg:size-[100px]"
            >
              <Image
                src="/images/about/dr-venkat-reddy.webp"
                alt="Dr. Venkat Reddy"
                fill
                sizes="(min-width: 1024px) 100px, 56px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal lg:text-[24px] lg:leading-[30px]">
                Dr. Venkat Reddy
              </p>
              <div className="flex flex-col items-start text-[13px] max-lg:text-[14px] leading-[19px] text-content-secondary lg:text-[18px] lg:leading-[27px]">
                <p>Neurodevelopmental Paediatrician,</p>
                <p>Cambridge UK</p>
              </div>
            </div>
          </div>
          <div className="flex h-full w-full flex-col items-start gap-[10px] rounded-[18px] border border-[#e4edea] bg-white p-4 relative lg:gap-6 lg:rounded-[20px] lg:border-[#e8e2d8] lg:px-[26px] lg:py-7">
            <LinkedInIcon />
            <div
              data-motion-image
              className="avatar-hover relative size-14 shrink-0 overflow-hidden rounded-full bg-background-brand-subtle lg:size-[100px]"
            >
              <Image
                src="/images/about/satish-kottapalli.webp"
                alt="Satish Kottapalli"
                fill
                sizes="(min-width: 1024px) 100px, 56px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal lg:text-[24px] lg:leading-[30px]">
                Satish Kottapalli
              </p>
              <div className="flex flex-col items-start text-[13px] max-lg:text-[14px] leading-[19px] text-content-secondary lg:text-[18px] lg:leading-[27px]">
                <p>Advisor (Chief Innovation Officer, Global HealthX)</p>
              </div>
            </div>
          </div>
          <div className="flex h-full w-full flex-col items-start gap-[10px] rounded-[18px] border border-[#e4edea] bg-white p-4 relative lg:gap-6 lg:rounded-[20px] lg:border-[#e8e2d8] lg:px-[26px] lg:py-7">
            <LinkedInIcon />
            <div
              data-motion-image
              className="avatar-hover relative size-14 shrink-0 overflow-hidden rounded-full bg-background-brand-subtle lg:size-[100px]"
            >
              <Image
                src="/images/about/venkat-nalam.webp"
                alt="Venkat Nalam"
                fill
                sizes="(min-width: 1024px) 100px, 56px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal lg:text-[24px] lg:leading-[30px]">
                Venkat Nalam
              </p>
              <div className="flex flex-col items-start text-[13px] max-lg:text-[14px] leading-[19px] text-content-secondary lg:text-[18px] lg:leading-[27px]">
                <p>Board of Directors (Finance)</p>
              </div>
            </div>
          </div>
          <div className="flex h-full w-full flex-col items-start gap-[10px] rounded-[18px] border border-[#e4edea] bg-white p-4 relative lg:gap-6 lg:rounded-[20px] lg:border-[#e8e2d8] lg:px-[26px] lg:py-7">
            <LinkedInIcon />
            <div
              data-motion-image
              className="avatar-hover relative size-14 shrink-0 overflow-hidden rounded-full bg-background-brand-subtle lg:size-[100px]"
            >
              <Image
                src="/images/about/dr-mark-aszkenasy.webp"
                alt="Dr. Mark Aszkenasy"
                fill
                sizes="(min-width: 1024px) 100px, 56px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal lg:text-[24px] lg:leading-[30px]">
                Dr. Mark Aszkenasy
              </p>
              <div className="flex flex-col items-start text-[13px] max-lg:text-[14px] leading-[19px] text-content-secondary lg:text-[18px] lg:leading-[27px]">
                <p>
                  Board of Advisors, NHS UK Autism Specialist, Parent of an
                  autistic child
                </p>
              </div>
            </div>
          </div>
          <div className="flex h-full w-full flex-col items-start gap-[10px] rounded-[18px] border border-[#e4edea] bg-white p-4 relative lg:gap-6 lg:rounded-[20px] lg:border-[#e8e2d8] lg:px-[26px] lg:py-7">
            <div
              data-motion-image
              className="avatar-hover relative size-14 shrink-0 overflow-hidden rounded-full bg-background-brand-subtle lg:size-[100px]"
            >
              <Image
                src="/images/about/eugene-huang.webp"
                alt="Eugene Huang"
                fill
                sizes="(min-width: 1024px) 100px, 56px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal lg:text-[24px] lg:leading-[30px]">
                Eugene Huang
              </p>
              <div className="flex flex-col items-start text-[13px] max-lg:text-[14px] leading-[19px] text-content-secondary lg:text-[18px] lg:leading-[27px]">
                <p>
                  Board Advisor, Chairman - TIS Taiwan, Parent of an autistic
                  child
                </p>
              </div>
            </div>
          </div>
        </RevealStagger>
      </div>
    </section>
  );
}
