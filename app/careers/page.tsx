import type { Metadata } from "next";
import { CareersPage } from "@/components/pages/careers/CareersPage";

export const metadata: Metadata = {
  title: "Careers | CognitiveBotics | CognitiveBotics",
  description:
    "Join CognitiveBotics in making a difference with AI and care. Browse open positions in sales and customer success.",
};

export default function Page() {
  return <CareersPage />;
}
