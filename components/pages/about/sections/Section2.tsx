import { RevealStagger } from "@/components/shared/RevealStagger";
import { TextReveal } from "@/components/shared/TextReveal";
import Image from "next/image";
import { LinkedInIcon } from "../LinkedInIcon";

export function Section2() {
  return (
    <section className="px-5 py-14 lg:px-24 lg:py-24 bg-[#f0f5f4] lg:bg-brand-subtle-bg">
      <div className="mx-auto max-w-[1248px]">
        <TextReveal
          as="h2"
          split="words"
          trigger="scroll"
          className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[40px] lg:leading-[48px]"
        >
          {"Leadership"}
        </TextReveal>
        <RevealStagger className="mt-5 grid grid-cols-2 gap-3 lg:mt-10 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-6">
          <div className="flex h-full w-full flex-col items-start gap-[10px] rounded-[18px] border border-[#e4edea] bg-white p-4 relative lg:gap-6 lg:rounded-[20px] lg:border-[#e8e2d8] lg:px-[26px] lg:py-7">
            <LinkedInIcon />
            <div
              data-motion-image
              className="avatar-hover relative size-14 shrink-0 overflow-hidden rounded-full bg-background-brand-subtle lg:size-[100px]"
            >
              <Image
                src="/images/about/udaya-dintyala.webp"
                alt="Udaya Dintyala"
                fill
                sizes="(min-width: 1024px) 100px, 56px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal lg:text-[24px] lg:leading-[30px]">
                Udaya Dintyala
              </p>
              <div className="flex flex-col items-start text-[13px] max-lg:text-[14px] leading-[19px] text-content-secondary lg:text-[18px] lg:leading-[27px]">
                <p>{"Founder & Chairman"}</p>
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
                src="/images/about/dr-ravindranath-kancherla.webp"
                alt="Dr. Ravindranath Kancherla"
                fill
                sizes="(min-width: 1024px) 100px, 56px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal lg:text-[24px] lg:leading-[30px]">
                Dr. Ravindranath Kancherla
              </p>
              <div className="flex flex-col items-start text-[13px] max-lg:text-[14px] leading-[19px] text-content-secondary lg:text-[18px] lg:leading-[27px]">
                <p>{"Co-Founder & Investor"}</p>
                <p>
                  {"Founder, Global Hospitals & Global University Foundation"}
                </p>
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
                src="/images/about/hunny-agarwal-crop.webp"
                alt="Hunny Agarwal"
                fill
                sizes="(min-width: 1024px) 100px, 56px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal lg:text-[24px] lg:leading-[30px]">
                Hunny Agarwal
              </p>
              <div className="flex flex-col items-start text-[13px] max-lg:text-[14px] leading-[19px] text-content-secondary lg:text-[18px] lg:leading-[27px]">
                <p>Chief Business Officer</p>
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
                src="/images/about/sudheer-narra.webp"
                alt="Sudheer Narra"
                fill
                sizes="(min-width: 1024px) 100px, 56px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal lg:text-[24px] lg:leading-[30px]">
                Sudheer Narra
              </p>
              <div className="flex flex-col items-start text-[13px] max-lg:text-[14px] leading-[19px] text-content-secondary lg:text-[18px] lg:leading-[27px]">
                <p>Chief Technology Officer</p>
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
                src="/images/about/anastasia-trofilova.webp"
                alt="Anastasia Trofilova"
                fill
                sizes="(min-width: 1024px) 100px, 56px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal lg:text-[24px] lg:leading-[30px]">
                Anastasia Trofilova
              </p>
              <div className="flex flex-col items-start text-[13px] max-lg:text-[14px] leading-[19px] text-content-secondary lg:text-[18px] lg:leading-[27px]">
                <p>Chief Clinical Officer</p>
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
                src="/images/about/zoya-belyaeva-crop.webp"
                alt="Zoya Belyaeva"
                fill
                sizes="(min-width: 1024px) 100px, 56px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal lg:text-[24px] lg:leading-[30px]">
                Zoya Belyaeva
              </p>
              <div className="flex flex-col items-start text-[13px] max-lg:text-[14px] leading-[19px] text-content-secondary lg:text-[18px] lg:leading-[27px]">
                <p>{"Head of Business & Operations, MENA"}</p>
              </div>
            </div>
          </div>
        </RevealStagger>
      </div>
    </section>
  );
}
