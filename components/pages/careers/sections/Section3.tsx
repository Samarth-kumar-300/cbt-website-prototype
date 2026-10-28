"use client";


export function Section3() {
  return (
    <section className="px-5 py-14 lg:px-24 lg:py-24">
      <div className="mx-auto grid max-w-[1248px] grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16">
        <div className="rounded-[20px] border border-[#d6e8e6] bg-[#f3f9f8] p-6 lg:p-10">
          <h2 className="font-heading text-[22px] font-semibold leading-[30px] text-brand-teal lg:text-[28px] lg:leading-[36px]">
            Don&apos;t See the Right Role?
          </h2>
          <p className="mt-3 text-[14px] leading-[22px] text-text-secondary lg:text-[18px] lg:leading-[27px]">
            We&apos;re always on the lookout for talented and passionate
            individuals. If you don&apos;t see a role that fits you, feel free
            to reach out with your resume.
          </p>
          <form
            className="mt-6 flex flex-col items-start gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <label
              htmlFor="resume"
              className="font-heading text-[14px] font-semibold text-brand-teal"
            >
              Submit your Resume/CV*:
            </label>
            <div className="flex w-full items-center gap-3 rounded-[12px] border border-[#d6e8e6] bg-white px-3 py-3">
              <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#f0f9f9]"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "#3e7b81" }}
                >
                  <path d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24" />
                  <path d="M12 12v9" />
                  <path d="m8 17 4-4 4 4" />
                </svg>
              </span>
              <input
                id="resume"
                name="resume"
                type="file"
                required
                accept=".pdf,.doc,.docx"
                className="w-full text-[14px] text-text-secondary file:mr-3 file:rounded-full file:border-0 file:bg-[#e4f2ef] file:px-4 file:py-2 file:font-semibold file:text-brand-teal"
              />
            </div>
            <button
              type="submit"
              className="btn inline-flex items-center justify-center whitespace-nowrap rounded-full bg-brand-teal px-8 py-[14px] text-[16px] font-semibold text-content-knockout transition-colors hover:bg-[#0f4548]"
            >
              Submit
            </button>
          </form>
        </div>
        <div className="flex flex-col items-start gap-3 lg:pt-6">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#f8f2f9]">
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
              style={{ color: "#a14da5" }}
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 6L2 7" />
            </svg>
          </span>
          <h3 className="font-heading text-[24px] font-semibold leading-[30px] text-brand-teal lg:text-[28px] lg:leading-[36px]">
            Contact Us
          </h3>
          <p className="text-[14px] leading-[22px] text-text-secondary lg:text-[18px] lg:leading-[27px]">
            If you have any questions about the application process or want to
            learn more about our open roles, feel free to reach out to us at
          </p>
          <a
            href="mailto:hrindia@cognitivebotics.com"
            className="inline-flex min-h-[44px] items-center font-semibold text-brand-teal underline-offset-4 hover:underline lg:text-[18px]"
          >
            hrindia@cognitivebotics.com
          </a>
          <p className="text-[14px] leading-[22px] text-text-secondary lg:text-[18px] lg:leading-[27px]">
            We&apos;d love to chat!
          </p>
        </div>
      </div>
    </section>
  );
}
