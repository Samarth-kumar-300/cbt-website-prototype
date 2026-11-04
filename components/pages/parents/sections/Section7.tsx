import { ScrollGradient } from "@/components/shared/ScrollGradient";
import { TextReveal } from "@/components/shared/TextReveal";
import { WipeIn } from "@/components/shared/WipeIn";
import Link from "next/link";

export function Section7() {
  return (
    <section
      id="get-in-touch"
      className="relative scroll-mt-[120px] px-5 lg:px-24 pb-48"
    >
      <div className="mx-auto max-w-[1248px]">
        <ScrollGradient
          className="flex flex-col [background:var(--cta-bg-mobile)] lg:items-center lg:text-center lg:[background:var(--cta-bg)] gap-[14px] rounded-[24px] px-[22px] py-7 lg:gap-6 lg:rounded-[32px] lg:px-16 lg:py-[62px] items-center text-center"
          style={{
            "--cta-bg":
              "linear-gradient(90deg, rgba(246, 232, 247, 0.8) 0%, rgba(234, 211, 238, 0.8) 55%, rgba(221, 236, 234, 0.8) 100%)",
            "--cta-bg-mobile":
              "linear-gradient(90deg, rgba(246, 232, 247, 0.8) 0%, rgba(234, 211, 238, 0.8) 55%, rgba(221, 236, 234, 0.8) 100%)",
          }}
        >
          <div className="flex flex-col gap-[14px] lg:items-center lg:gap-3 items-center text-center">
            <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[20px] font-semibold leading-[30px] text-brand-teal lg:text-[40px] lg:leading-[48px]">{"Every child deserves care that’s made just for them"}</TextReveal>
            <p className="text-[14px] leading-[22px] text-text-secondary lg:text-[16px] lg:leading-[24px] lg:text-text-muted">
              Talk to our team about bringing CognitiveBotics home for your
              child.
            </p>
          </div>
          <Link
            className="btn inline-flex items-center rounded-full whitespace-nowrap font-semibold gap-[8px] py-[14px] px-6 text-[16px] bg-brand-teal text-content-knockout transition-colors hover:bg-[#0f4548] w-full justify-center lg:w-auto "
            href="/contact-us"
          >
            Get in touch with the team
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
              className="hidden lg:inline-block"
            >
              <path d="M4 12h16m0 0-6-6m6 6-6 6"></path>
            </svg>
          </Link>
        </ScrollGradient>
      </div>
      {/* The original parents footer has a curved top edge that rises into this
          section's bottom padding (Footer_top.png, remote, not available locally).
          Traced from reference/parents/1440.png; the mascot beside it is omitted
          because no local image exists. Scales with width like the original's
          10080:1932 aspect box. */}
      <WipeIn
        className="pointer-events-none absolute inset-x-0 top-full w-full -translate-y-[50.7%] text-brand-dark"
        style={{ aspectRatio: "10080 / 1932" }}
      >
      <svg
        data-testid="parents-footer-curve"
        aria-hidden="true"
        viewBox="0 0 1440 276"
        preserveAspectRatio="none"
        className="block h-full w-full"
      >
        <path
          fill="currentColor"
          d="M0 276 L0 9 L20 18 L40 25 L60 32 L80 39 L100 44 L120 50 L140 55 L160 60 L180 64 L200 68 L220 73 L240 76 L260 80 L280 84 L300 87 L320 91 L340 94 L360 97 L380 100 L400 102 L420 104 L440 106 L460 108 L480 109 L500 110 L520 111 L540 112 L560 113 L580 114 L600 115 L620 115 L640 115 L660 116 L680 116 L700 116 L720 116 L740 116 L760 116 L780 116 L800 115 L820 115 L840 115 L860 114 L880 113 L900 112 L920 111 L940 110 L960 109 L980 108 L1000 106 L1020 104 L1040 102 L1060 100 L1080 97 L1100 94 L1120 91 L1140 87 L1160 84 L1180 80 L1200 76 L1220 73 L1240 68 L1260 64 L1280 60 L1300 55 L1320 50 L1340 44 L1360 39 L1380 32 L1400 25 L1420 18 L1440 9 L1440 276 Z"
        />
      </svg>
      </WipeIn>
    </section>
  );
}
