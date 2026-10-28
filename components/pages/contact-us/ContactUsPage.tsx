import { Reveal } from "@/components/shared/Reveal";
import { Section0 } from "./sections/Section0";
import { Section1 } from "./sections/Section1";

export function ContactUsPage() {
  return (
    <>
      <Section0 />
      <Reveal><Section1 /></Reveal>
    </>
  );
}
