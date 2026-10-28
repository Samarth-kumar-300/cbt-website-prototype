import { Reveal } from "@/components/shared/Reveal";
import { Section0 } from "./sections/Section0";
import { Section1 } from "./sections/Section1";
import { Section2 } from "./sections/Section2";
import { Section3 } from "./sections/Section3";
import { Section4 } from "./sections/Section4";
import { Section5 } from "./sections/Section5";
import { Section6 } from "./sections/Section6";

export function ResourcesPage() {
  return (
    <>
      <Section0 />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Reveal><Section6 /></Reveal>
    </>
  );
}
