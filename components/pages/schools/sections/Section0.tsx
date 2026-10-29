import Link from "next/link";
import Image from "next/image";

const chips = [
  {
    label: "JMIR Outcomes",
    bg: "#eef9f9",
    fg: "#175f63",
    paths: [
      "M14 2.27V6.4c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437c.214.11.494.11 1.054.11h4.13M14 17H8m8-4H8m12-3.012V17.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C17.72 22 16.88 22 15.2 22H8.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C4 19.72 4 18.88 4 17.2V6.8c0-1.68 0-2.52.327-3.162a3 3 0 0 1 1.311-1.311C6.28 2 7.12 2 8.8 2h3.212c.733 0 1.1 0 1.446.083.306.073.598.195.867.36.303.185.562.444 1.08.963l3.19 3.188c.518.519.777.778.963 1.081a3 3 0 0 1 .36.867c.082.346.082.712.082 1.446Z",
    ],
  },
  {
    label: "Patented technology",
    bg: "#f0fdf4",
    fg: "#15803d",
    paths: [
      "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4",
    ],
  },
  {
    label: "ISO Certification",
    bg: "#fef2f2",
    fg: "#dc2626",
    paths: [
      "M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z",
      "M8.21 13.89 7 23l5-3 5 3-1.21-9.12",
    ],
  },
] as const;

export function Section0() {
  return (
    <section
      className="relative overflow-hidden rounded-bl-[50%_24px] rounded-br-[50%_24px] pt-[116px] pb-16 lg:rounded-bl-[50%_120px] lg:rounded-br-[50%_120px] lg:pt-[150px] lg:pb-[100px]"
      style={{
        background:
          "linear-gradient(90deg, rgba(244,228,245,0.8) 0%, rgba(221,243,244,0.8) 47%, rgba(255,247,222,0.8) 100%)",
      }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-5 lg:flex-row lg:items-center lg:justify-between lg:gap-14 lg:px-24">
        <div className="flex w-full max-w-[706px] flex-col items-start self-start lg:w-auto lg:self-auto gap-[14px] lg:gap-[26px]">
          <p className="font-heading text-[13px] max-lg:text-[14px] font-semibold leading-[18px] tracking-[1.2px] text-content-brand-secondary lg:text-[20px] lg:font-bold lg:leading-[26px] lg:tracking-normal">
            FOR SCHOOLS
          </p>
          <h1 className="font-heading text-[36px] font-semibold leading-[48px] text-brand-teal lg:text-[48px] lg:leading-[58px]">
            Inclusive education shaped around every child&apos;s unique needs
          </h1>
          <ul className="flex flex-wrap gap-3">
            {chips.map((chip) => (
              <li
                key={chip.label}
                className="flex items-center gap-[10px] rounded-full border-[1.5px] border-brand-teal-100 bg-white py-[7px] pl-[7px] pr-4 text-[14px] leading-[20px] text-brand-teal lg:text-[16px] lg:leading-[22px]"
              >
                <span
                  className="flex size-8 shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: chip.bg }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ color: chip.fg }}
                  >
                    {chip.paths.map((d) => (
                      <path key={d} d={d} />
                    ))}
                  </svg>
                </span>
                {chip.label}
              </li>
            ))}
          </ul>
          <div className="hidden lg:block">
            <Link
              className="btn inline-flex items-center rounded-full whitespace-nowrap font-semibold gap-[10px] px-6 py-[14px] text-[16px] lg:py-[18px] lg:pl-8 lg:pr-[30px] lg:text-[18px] bg-brand-teal text-content-knockout transition-colors hover:bg-[#0f4548] "
              href="/contact-us"
            >
              Book a school demo
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
              >
                <path d="M4 12h16m0 0-6-6m6 6-6 6"></path>
              </svg>
            </Link>
          </div>
        </div>
        <div className="hero-settle hero-delay-2 relative h-[261px] w-full max-w-[320px] shrink-0 lg:h-[397px] lg:max-w-[486px]">
          <Image
            src="/images/schools/hero-teachers.webp"
            alt="A teacher and pupils learning together in a classroom"
            fill
            sizes="(min-width: 1024px) 486px, 320px"
            className="object-contain"
            priority
          />
        </div>
        <div className="w-full lg:hidden">
          <Link
            className="btn inline-flex items-center rounded-full whitespace-nowrap font-semibold gap-[10px] px-6 py-[14px] text-[16px] lg:py-[18px] lg:pl-8 lg:pr-[30px] lg:text-[18px] bg-brand-teal text-content-knockout transition-colors hover:bg-[#0f4548] w-full justify-center"
            href="/contact-us"
          >
            Book a school demo
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
            >
              <path d="M4 12h16m0 0-6-6m6 6-6 6"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
