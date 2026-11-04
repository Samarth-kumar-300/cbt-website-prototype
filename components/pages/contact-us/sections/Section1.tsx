import Link from "next/link";

export function Section1() {
  return (
    <section className="mx-auto flex max-w-[1440px] flex-col gap-6 px-5 pt-10 pb-14 lg:gap-9 lg:px-24 lg:py-[60px]">
      <div className="flex flex-col items-start gap-[10px] lg:gap-4">
        <p className="text-[15px] leading-[23px] text-text-secondary lg:text-[18px] lg:leading-[27px] lg:text-text-default">
          {"For sales or product support please reach out to us at "}
          <a
            href="mailto:contact@cognitivebotics.com"
            className="text-[15px] font-semibold leading-[23px] text-brand-teal underline lg:font-heading lg:text-[20px] lg:font-bold lg:leading-normal"
          >
            contact@cognitivebotics.com
          </a>
        </p>
        <p className="text-[15px] leading-[23px] text-text-secondary lg:text-[18px] lg:leading-[27px] lg:text-text-default">
          {"Looking to join our team? Visit our "}
          <Link
            className="font-semibold text-brand-teal underline"
            href="/careers"
          >
            Careers
          </Link>
          {" page."}
        </p>
      </div>
      <div className="flex flex-col gap-[14px] lg:flex-row lg:items-start lg:gap-6">
        <div
          className="flex flex-1 items-start gap-[14px] rounded-[20px] border-0 px-[18px] py-5 lg:border-[1.5px] lg:px-6 lg:py-[26px]"
          style={{ backgroundColor: "#f4fafe", borderColor: "#cfe6f3" }}
        >
          <span
            data-icon
            className="flex size-9 shrink-0 items-center justify-center rounded-full lg:size-10"
            style={{ backgroundColor: "#f0f9ff" }}
          >
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
              style={{ color: "#0369a1" }}
            >
              <path d="M12 22c1-5 8-5.582 8-12a8 8 0 1 0-16 0c0 6.418 7 7 8 12Z"></path>
              <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
            </svg>
          </span>
          <p className="flex-1 text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
            <span>
              CognitiveBotics Technologies Private Limited,
              <br />
            </span>
            <span>
              8th Floor,
              <br />
            </span>
            <span>
              Sanali Spazio,
              <br />
            </span>
            <span>
              TSIIC Software Units Layout,
              <br />
            </span>
            <span>
              Madhapur,
              <br />
            </span>
            <span>
              Hyderabad 500081
              <br />
            </span>
          </p>
        </div>
        <div
          className="flex flex-1 items-start gap-[14px] rounded-[20px] border-0 px-[18px] py-5 lg:border-[1.5px] lg:px-6 lg:py-[26px]"
          style={{ backgroundColor: "#fffcf2", borderColor: "#efe3be" }}
        >
          <span
            data-icon
            className="flex size-9 shrink-0 items-center justify-center rounded-full lg:size-10"
            style={{ backgroundColor: "#fffbeb" }}
          >
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
              style={{ color: "#b45309" }}
            >
              <path d="M12 22c1-5 8-5.582 8-12a8 8 0 1 0-16 0c0 6.418 7 7 8 12Z"></path>
              <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
            </svg>
          </span>
          <p className="flex-1 text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">
            <span>
              CognitiveBotics MENA Information Technology LLC 705,
              <br />
            </span>
            <span>
              Single Business Tower,
              <br />
            </span>
            <span>
              Business Bay,
              <br />
            </span>
            <span>
              Sheikh Zayed Road,
              <br />
            </span>
            <span>
              Dubai,
              <br />
            </span>
            <span>
              UAE
              <br />
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
