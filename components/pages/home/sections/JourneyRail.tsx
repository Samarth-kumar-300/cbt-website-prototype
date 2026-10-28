import { JOURNEY_EYEBROW, JOURNEY_HEADING, JOURNEY_STEPS } from '../journey/steps';
import { JourneyRailList } from './JourneyRailList';
import { JourneyRailMotion } from './JourneyRailMotion';

// The growth path, rebuilt: one ordered list, two layouts (CSS only, see the .jr-* block in
// globals.css): five equal columns from 1280px, a compact vertical list below. The data-jr-* hooks
// are the contract JourneyRailMotion animates; it never moves layout.
// Node and number colour per step, a deeper shade of each card's hue, dark enough for 4.5:1 against white (the mobile node is filled, the number is white).
const STEP_ACCENTS = ['#1f7a6e', '#9a3fa0', '#9a6b0f', '#b84e32', '#3d7f2e'] as const;
const RAIL_STEPS = JOURNEY_STEPS.map((step, i) => ({ ...step, accent: STEP_ACCENTS[i] }));

export function JourneyRail() {
  return (
    <section data-journey="rail" className="mx-auto max-w-[1440px] px-6 pt-20 pb-20 lg:px-24 lg:pt-32 lg:pb-32">
      <p className="font-heading text-[14px] font-bold leading-[normal] text-content-brand-secondary lg:text-[20px] lg:leading-[26px]">
        {JOURNEY_EYEBROW}
      </p>
      <h2 className="mt-3 font-heading text-[20px] font-bold leading-[30px] text-content-brand lg:text-[40px] lg:font-semibold lg:leading-[48px]">
        {JOURNEY_HEADING}
      </h2>
      <JourneyRailMotion className="mt-8 xl:mt-14">
        <JourneyRailList steps={RAIL_STEPS} />
      </JourneyRailMotion>
    </section>
  );
}
