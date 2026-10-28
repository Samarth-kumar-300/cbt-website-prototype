import { Button } from "@/components/shared/Button";

export function Section4() {
  return (
    <section className="px-5 pb-16 lg:px-24 lg:pb-24">
      <div
        className="mx-auto flex max-w-[1248px] flex-col items-center gap-5 rounded-[24px] px-6 py-12 text-center lg:py-16"
        style={{
          background:
            "linear-gradient(90deg, #f5e9f6 0%, #e7d5ed 50%, #e0ecea 100%)",
        }}
      >
        <h2 className="font-heading text-[32px] font-semibold leading-[40px] text-brand-teal lg:text-[48px] lg:leading-[56px]">
          Join us!
        </h2>
        <p className="max-w-[860px] text-[16px] leading-[26px] text-text-default lg:text-[18px] lg:leading-[27px]">
          {
            "If you’re passionate about making a difference and want to be part of something bigger,"
          }
          <br className="hidden xl:block" />
          {" we’d love to hear from you. Explore our open positions and apply today."}
        </p>
        <Button href="#open-positions" size="md">
          Browse open positions
        </Button>
      </div>
    </section>
  );
}
