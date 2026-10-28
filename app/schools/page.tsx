import type { Metadata } from "next";
import { SchoolsPage } from "@/components/pages/schools/SchoolsPage";

export const metadata: Metadata = {
  title: "Schools | CognitiveBotics",
  description:
    "CognitiveBotics helps schools make inclusive education work every day, bringing educators, specialists and families together on one connected platform.",
};

export default function Page() {
  return <SchoolsPage />;
}
