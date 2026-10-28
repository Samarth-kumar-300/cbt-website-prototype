import { RevealStagger } from "@/components/shared/RevealStagger";
import { TextReveal } from "@/components/shared/TextReveal";

const CARDS = [
  {
    title: "Our Mission",
    body: "Empowering neurodivergent children through personalised digital therapy tools, connecting therapists, schools and parents to make learning accessible.",
    bg: "#f3f9f8",
    border: "#e4edea",
    iconBg: "#eef9f9",
    iconColor: "#207d82",
  },
  {
    title: "Our Vision",
    body: "A world where every neurodivergent child can thrive through technology, empathy and innovative learning solutions.",
    bg: "#f5faff",
    border: "#dbe9f5",
    iconBg: "#f0f9ff",
    iconColor: "#0369a1",
  },
  {
    title: "Our Culture",
    body: "A collaborative, creative and inclusive team driven by continuous learning, innovation and a shared commitment to making a meaningful impact.",
    bg: "#fbf5fc",
    border: "#eedff0",
    iconBg: "#f8f2f9",
    iconColor: "#a14da5",
  },
];

export function Section1() {
  return (
    <section className="px-5 py-14 lg:px-24 lg:py-24">
      <div className="mx-auto max-w-[1248px]">
        <TextReveal
          as="h2"
          split="words"
          trigger="scroll"
          className="font-heading text-[24px] font-semibold leading-[32px] text-brand-dark lg:text-[40px] lg:leading-[48px]"
        >
          {"About "}
          <span className="text-content-brand-secondary">CognitiveBotics</span>
        </TextReveal>
        <p className="mt-3 text-[14px] leading-[22px] text-text-secondary lg:mt-5 lg:text-[18px] lg:leading-[27px]">
          CognitiveBotics is an AI-powered personalised learning platform
          connecting therapists, schools and parents to support early
          intervention and skill development for neurodivergent children.
        </p>
        <RevealStagger className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-10 lg:gap-6 lg:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-start gap-3 rounded-[18px] border px-[18px] py-5 lg:gap-[14px] lg:rounded-[20px] lg:px-[26px] lg:py-7"
              style={{ backgroundColor: card.bg, borderColor: card.border }}
            >
              <span
                data-icon
                className="flex size-12 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: card.iconBg }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="shrink-0"
                  style={{ color: card.iconColor }}
                >
                  {card.title === "Our Mission" ? (
                    <>
                      <circle cx="12" cy="12" r="9" />
                      <circle cx="12" cy="12" r="5" />
                      <circle cx="12" cy="12" r="1" />
                    </>
                  ) : card.title === "Our Vision" ? (
                    <>
                      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  ) : (
                    <path d="M6 20.087h2.61c.34 0 .679.04 1.009.122l2.758.67a4.26 4.26 0 0 0 1.826.042l3.05-.593a4.204 4.204 0 0 0 2.127-1.107l2.158-2.1a1.503 1.503 0 0 0 0-2.168 1.61 1.61 0 0 0-2.06-.143l-2.515 1.835a2.12 2.12 0 0 1-1.25.405h-2.427 1.545c.871 0 1.577-.687 1.577-1.534v-.307a1.54 1.54 0 0 0-1.194-1.487l-2.385-.58A5.025 5.025 0 0 0 11.643 13c-.965 0-2.711.799-2.711.799L6 15.025M2 14.6v5.8c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437C2.76 22 3.04 22 3.6 22h.8c.56 0 .84 0 1.054-.109a1 1 0 0 0 .437-.437C6 21.24 6 20.96 6 20.4v-5.8c0-.56 0-.84-.109-1.054a1 1 0 0 0-.437-.437C5.24 13 4.96 13 4.4 13h-.8c-.56 0-.84 0-1.054.109a1 1 0 0 0-.437.437C2 13.76 2 14.04 2 14.6ZM17.191 3.592c-.596-1.249-1.972-1.91-3.31-1.272-1.339.639-1.909 2.153-1.348 3.483.346.821 1.338 2.417 2.045 3.516.261.406.392.61.583.728.164.102.369.157.561.15.225-.007.44-.118.87-.339 1.161-.598 2.818-1.483 3.529-2.022a2.66 2.66 0 0 0 .574-3.69c-.861-1.217-2.362-1.337-3.504-.554Z" />
                  )}
                </svg>
              </span>
              <p className="font-heading text-[16px] font-bold leading-[27px] text-brand-teal lg:text-[24px] lg:leading-[30px]">
                {card.title}
              </p>
              <p className="text-[14px] leading-[22px] text-text-secondary lg:text-[18px] lg:leading-[27px]">
                {card.body}
              </p>
            </div>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
