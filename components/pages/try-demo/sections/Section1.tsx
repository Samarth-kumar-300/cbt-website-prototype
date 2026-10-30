import { tryDemoContent as c } from "../content";
import { Reveal } from "@/components/shared/Reveal";
import { Thumb } from "./Thumb";

// Preview cards only: they arrive once and do not respond to hover or click, so they do not look like links.
export function Section1() {
  return (
    <section className="px-5 py-12 lg:px-24 lg:pb-[150px] lg:pt-[96px]">
      <ul className="mx-auto grid max-w-[628px] grid-cols-1 gap-5 sm:grid-cols-2">
        {c.games.map((g, i) => (
          <li key={i}>
            <Reveal
              className="flex h-full flex-col items-center rounded-[16px] bg-white px-4 pb-6 pt-8 text-center"
              style={{ boxShadow: "0 8px 40px rgba(23, 95, 99, 0.12)" }}
            >
              <span className="rounded-full bg-[#eef9f9] px-3 py-1 text-[16px] leading-[22px] text-content-brand">{g.tag}</span>
              <div className="mt-[26px]"><Thumb kind={g.thumb} /></div>
              <p className="mt-[38px] font-heading text-[18px] font-semibold leading-[24px] text-content-brand">{g.skill}</p>
              <h3 className="mt-1 font-heading text-[20px] font-semibold leading-[28px] text-black">{g.title}</h3>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
