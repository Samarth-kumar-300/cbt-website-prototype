import { Section0 } from "./sections/Section0";
// import { Section1 } from "./sections/Section1"; // vertical growth timeline, parked: JourneyRail replaces it for now
import { JourneyRail } from "./sections/JourneyRail";
import { Section2 } from "./sections/Section2";
import { Section4 } from "./sections/Section4";
import { Section5 } from "./sections/Section5";
import { Section6 } from "./sections/Section6";
import { Section7 } from "./sections/Section7";
import { Reveal } from "@/components/shared/Reveal";

// Section1 animates itself with GSAP; JourneyRail (the rebuilt growth path, directly below it) animates itself too. Sections 2, 4, 5 and 6 animate their own groups; Reveal wraps only the CTA panels.
export function HomePage() {
  return (
    <>
      <Section0 />
      <Section4 />
      <div className="bg-[#F1F8F8]">
        {/* <Section1 /> */}
        <JourneyRail />
      </div>
      <Section2 />
      <Section5 />
      <Section6 />
      <Reveal><Section7 /></Reveal>
    </>
  );
}
