import { RevealStagger } from "@/components/shared/RevealStagger";
import { TextReveal } from "@/components/shared/TextReveal";
import Image from "next/image";
import Link from "next/link";
import { TestimonialCarousel } from "../TestimonialCarousel";
import { TestimonialRail } from "../TestimonialRail";

function QuoteMark({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`block h-[17px] w-[21px] font-heading text-[54px] font-extrabold leading-[17px] ${className ?? ""}`}
      style={{ color }}
    >
      “
    </span>
  );
}

export function Section5() {
  return (
    <section
      style={{
        background:
          "linear-gradient(90deg, #f8eaf2 0%, #f4eff6 50%, #eaf5f2 100%)",
      }}
    >
      <div className="hidden flex-col gap-10 py-[84px] lg:flex">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-24">
          <TextReveal
            as="h2"
            split="words"
            trigger="scroll"
            media="(min-width: 1024px)"
            className="font-heading text-[48px] font-semibold leading-[58px] text-brand-teal"
          >
            {"Real experiences from the families we support"}
          </TextReveal>
          <Image
            src="/images/homepage/home-cb-mark.webp"
            alt=""
            width={52}
            height={47}
            className="shrink-0"
          />
        </div>
        <TestimonialRail />
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-6 px-5 py-14 lg:hidden">
        <TextReveal
          as="h2"
          split="words"
          trigger="scroll"
          media="(max-width: 1023px)"
          className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal"
        >
          {"Real experiences from the families we support"}
        </TextReveal>
        <TestimonialCarousel
          slides={[
            <Link
              key="ram-kamal"
              href="/resources"
              className="group flex w-full flex-col overflow-hidden rounded-[20px] border-[1.5px] border-[#e4ded4] bg-white shadow-[0px_6px_20px_0px_rgba(15,74,77,0.05)]"
            >
              <Image
                src="/images/homepage/testimonial-ram-kamal.webp"
                alt="Ram Kamal, Inclusive Education Specialist and Founder Trustee of Chakshumathi, on early intervention"
                width={1250}
                height={716}
                sizes="(max-width: 1023px) 100vw, 628px"
                className="h-auto w-full"
              />
              <div className="flex flex-col items-start gap-3 px-5 pb-[22px] pt-4">
                <p className="font-heading text-[16px] font-semibold leading-[24px] text-content-brand">
                  Importance of Early Intervention and preparing children for healthy digital engagement
                </p>
                <span className="inline-flex items-center gap-2 text-[14px] font-semibold leading-[22px] text-content-brand">
                  Explore expert insights
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 12h16m0 0-6-6m6 6-6 6" />
                  </svg>
                </span>
              </div>
            </Link>,
            <div
              key="mounila"
              className="flex w-full flex-col gap-[14px] rounded-[20px] bg-white px-5 pb-[22px] pt-[34px] shadow-[0px_6px_20px_0px_rgba(15,74,77,0.05)]"
            >
              <QuoteMark color="#4ca154" />
              <p className="text-[14px] leading-[22px] text-text-default">
                Nyra’s attention span has improved. The app fits well with her
                ongoing therapies as it gives her extra practice at home, and it
                has helped us spend more structured and meaningful time
                together.
              </p>
              <div className="mt-auto flex items-center gap-3">
                <Image
                  src="/images/homepage/avatars/mounila.webp"
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-full ring-1 ring-[#e4ded4]"
                />
                <div className="flex flex-col gap-[2px]">
                  <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal">
                    Mounila Thustam
                  </p>
                  <p className="text-[14px] leading-[21px] text-[#646871]">
                    Parent
                  </p>
                </div>
              </div>
            </div>,
            <div
              key="tejaswi"
              className="flex w-full flex-col gap-[14px] rounded-[20px] bg-white px-5 pb-[22px] pt-[34px] shadow-[0px_6px_20px_0px_rgba(15,74,77,0.05)]"
            >
              <QuoteMark color="#a85923" />
              <p className="text-[14px] leading-[22px] text-text-default">
                We haven’t seen such a variety of activities in other apps or
                cartoons. He enjoys them and has even started using the app
                independently. Over the past two months, he has begun saying his
                name, answering questions and responding to people.
              </p>
              <div className="mt-auto flex items-center gap-3">
                <Image
                  src="/images/homepage/avatars/tejaswi.webp"
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-full ring-1 ring-[#e4ded4]"
                />
                <div className="flex flex-col gap-[2px]">
                  <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal">
                    Tejaswi Kumar
                  </p>
                  <p className="text-[14px] leading-[21px] text-[#646871]">
                    Parent
                  </p>
                </div>
              </div>
            </div>,
            <div
              key="chandrashekhar"
              className="flex w-full flex-col gap-[14px] rounded-[20px] bg-white px-5 pb-[22px] pt-[34px] shadow-[0px_6px_20px_0px_rgba(15,74,77,0.05)]"
            >
              <QuoteMark color="#2d679c" />
              <p className="text-[14px] leading-[22px] text-text-default">
                In our therapy center, maintaining continuity was a challenge.
                CognitiveBotics has helped us address this with engaging,
                user-friendly activities that support parents, educators and
                therapists in building children’s independence.
              </p>
              <div className="mt-auto flex items-center gap-3">
                <Image
                  src="/images/homepage/avatars/chandrashekhar.webp"
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-full ring-1 ring-[#e4ded4]"
                />
                <div className="flex flex-col gap-[2px]">
                  <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal">
                    Dr Chandrashekhar
                  </p>
                  <p className="text-[14px] leading-[21px] text-[#646871]">
                    Therapist Director, Resplice Child Development Center
                  </p>
                </div>
              </div>
            </div>,
            <div
              key="pavani"
              className="flex w-full flex-col gap-[14px] rounded-[20px] bg-white px-5 pb-[22px] pt-[34px] shadow-[0px_6px_20px_0px_rgba(15,74,77,0.05)]"
            >
              <QuoteMark color="#a95fb5" />
              <p className="text-[14px] leading-[22px] text-text-default">
                CognitiveBotics has been very helpful in continuing my child’s
                learning at home, especially with pointing and imitation skills.
                He has also started communicating his needs and I feel the app
                supports faster learning when used alongside therapy.
              </p>
              <div className="mt-auto flex items-center gap-3">
                <Image
                  src="/images/homepage/avatars/pavani.webp"
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-full ring-1 ring-[#e4ded4]"
                />
                <div className="flex flex-col gap-[2px]">
                  <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal">
                    Pavani
                  </p>
                  <p className="text-[14px] leading-[21px] text-[#646871]">
                    Parent
                  </p>
                </div>
              </div>
            </div>,
          ]}
        />
      </div>
    </section>
  );
}
