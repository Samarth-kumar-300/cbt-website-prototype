import type { Metadata } from "next";
import { ContactUsPage } from "@/components/pages/contact-us/ContactUsPage";

export const metadata: Metadata = {
  title: "Get in Touch | CognitiveBotics",
  description:
    "Have questions or need assistance? Our team is just a message away.",
};

export default function Page() {
  return <ContactUsPage />;
}
