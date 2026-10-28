import type { Metadata } from "next";
import { ParentsPage } from "@/components/pages/parents/ParentsPage";

export const metadata: Metadata = {
  title: "For Parents | CognitiveBotics | CognitiveBotics",
  description:
    "Extend therapy beyond the clinic with guided activities that help caregivers continue their child’s learning at home between sessions.",
};

export default function Page() {
  return <ParentsPage />;
}
