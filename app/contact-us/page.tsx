import type { Metadata } from "next";
import { ContactUsPage } from "@/components/pages/contact-us/ContactUsPage";

export const metadata: Metadata = {
  title: "Contact CognitiveBotics | CognitiveBotics",
  description:
    "Contact CognitiveBotics for therapy centres, schools, therapists, doctors and parents. Offices in Hyderabad and Dubai.",
};

export default function Page() {
  return <ContactUsPage />;
}
