import type { Metadata } from "next";
import { ContactUsPage } from "@/components/pages/contact-us/ContactUsPage";

export const metadata: Metadata = {
  title: "Contact CognitiveBotics | CognitiveBotics",
  description:
    "For therapy centres, schools and partners. Reach our offices in Madhapur, Hyderabad and Business Bay, Dubai.",
};

export default function Page() {
  return <ContactUsPage />;
}
