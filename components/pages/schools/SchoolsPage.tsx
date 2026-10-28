import { Reveal } from "@/components/shared/Reveal";
import { Section0 } from "./sections/Section0";
import { Section1 } from "./sections/Section1";
import { Section2 } from "./sections/Section2";
import { Section3 } from "./sections/Section3";
import { Section4 } from "./sections/Section4";
import { Section5 } from "./sections/Section5";
import { Section6 } from "./sections/Section6";
import { Section7 } from "./sections/Section7";
import { Section8 } from "./sections/Section8";

export function SchoolsPage() {
  return (
    <>
      <Section0 />
      <Reveal><Section1 /></Reveal>
      <Section2 />
      <Reveal><Section3 /></Reveal>
      <Section4 />
      <Section5 />
      <Section6 />
      <Section7 />
      <Reveal><Section8 /></Reveal>
    </>
  );
}
