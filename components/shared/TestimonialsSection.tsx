import Image from "next/image";
import { TESTIMONIALS, VIDEO_TESTIMONIAL, type Testimonial, type VideoTestimonial } from "@/lib/testimonials";
import { TestimonialCarousel } from "./TestimonialCarousel";
import { TestimonialRail } from "./TestimonialRail";
import { TextReveal } from "./TextReveal";
import { VideoTestimonialCard } from "./VideoTestimonialCard";

export function pickTestimonials(order?: readonly string[]): Testimonial[] {
  if (!order) return [...TESTIMONIALS];
  return order.map((id) => {
    const t = TESTIMONIALS.find((x) => x.id === id);
    if (!t) throw new Error(`Unknown testimonial: ${id}`);
    return t;
  });
}

const BACKGROUNDS = {
  gradient: "linear-gradient(90deg, #f8eaf2 0%, #f4eff6 50%, #eaf5f2 100%)",
  "flat-aqua": "var(--color-brand-subtle-bg)",
} as const;

function QuoteSlide({ q }: { q: Testimonial }) {
  return (
    <div className="flex w-full flex-col gap-[14px] rounded-[20px] bg-white px-5 pb-[22px] pt-[34px] shadow-[0px_6px_20px_0px_rgba(15,74,77,0.05)]">
      <span aria-hidden="true" className="block h-[17px] w-[21px] font-heading text-[54px] font-extrabold leading-[17px]" style={{ color: q.color }}>
        “
      </span>
      <p className="text-[14px] leading-[22px] text-text-default">{q.text}</p>
      <div className="mt-auto flex items-center gap-3">
        <Image src={`/images/homepage/avatars/${q.avatar}.webp`} alt="" width={48} height={48} className="size-12 shrink-0 rounded-full ring-1 ring-[#e4ded4]" />
        <div className="flex flex-col gap-[2px]">
          <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal">{q.name}</p>
          <p className="text-[14px] leading-[21px] text-[#646871]">{q.role}</p>
        </div>
      </div>
    </div>
  );
}

// The Home testimonial section: video card plus drifting rail on desktop, carousel on mobile.
// `railOrder` and `slideOrder` pick and order the family quotes; the video card always leads.
export function TestimonialsSection({
  heading,
  railOrder,
  slideOrder = railOrder,
  showMark = false,
  tone = "gradient",
  video,
}: {
  heading: string;
  railOrder?: readonly string[];
  slideOrder?: readonly string[];
  showMark?: boolean;
  /** `flat-aqua` swaps the gradient for the flat pale teal brand-subtle-bg (Pricing). */
  tone?: "gradient" | "flat-aqua";
  /** Optional overrides for the video card (Pricing). Defaults to the shared video as is. */
  video?: Partial<Pick<VideoTestimonial, "title" | "role">> & { linkLabel?: string; byline?: boolean };
}) {
  const { linkLabel, byline, ...videoOverrides } = video ?? {};
  const v: VideoTestimonial = { ...VIDEO_TESTIMONIAL, ...videoOverrides };
  const rail = pickTestimonials(railOrder);
  const slides = pickTestimonials(slideOrder);
  return (
    <section style={{ background: BACKGROUNDS[tone] }}>
      <div className="hidden flex-col gap-10 py-[84px] lg:flex">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-24">
          <TextReveal as="h2" split="words" trigger="scroll" media="(min-width: 1024px)" className="font-heading text-[48px] font-semibold leading-[58px] text-brand-teal">
            {heading}
          </TextReveal>
          {showMark ? <Image src="/images/homepage/home-cb-mark.webp" alt="" width={52} height={47} className="shrink-0" /> : null}
        </div>
        <TestimonialRail quotes={rail} video={v} linkLabel={linkLabel} byline={byline} />
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-6 px-5 py-14 lg:hidden">
        <TextReveal as="h2" split="words" trigger="scroll" media="(max-width: 1023px)" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal">
          {heading}
        </TextReveal>
        <TestimonialCarousel
          slides={[
            <VideoTestimonialCard key={v.id} video={v} variant="slide" linkLabel={linkLabel} byline={byline} />,
            ...slides.map((q) => <QuoteSlide key={q.id} q={q} />),
          ]}
        />
      </div>
    </section>
  );
}
