import type { JourneyRailItem } from "../../home/sections/JourneyRailList";

// The early-years rail on the parents page: one step per age band, with the accent colour from each card.
export const EARLY_YEARS_STEPS: readonly JourneyRailItem[] = [
  {
    id: "age2",
    kicker: "AGE 2",
    title: "Recognising Early Signs",
    body: "Identify differences in speech, play and social interaction to seek timely support.",
    src: "/images/parents/early-years-age2.webp",
    alt: "A child steering a toy red car, showing early play and movement",
    bg: "#f8e9e4",
    border: "#efd0c5",
    accent: "#c07158",
  },
  {
    id: "age3-4",
    kicker: "AGE 3–4",
    title: "Building Essential Skills",
    body: "Improve communication, social interaction, learning and daily routines through early intervention.",
    src: "/images/parents/early-years-age3-4.webp",
    alt: "A child brushing her teeth at a sink, building daily routines",
    bg: "#e3eff4",
    border: "#c5dde7",
    accent: "#387792",
  },
  {
    id: "age5",
    kicker: "AGE 5",
    title: "Preparing for New Experiences",
    body: "Develop skills for classroom learning, social relationships and adapting to new routines.",
    src: "/images/parents/early-years-age5.webp",
    alt: "A child packing a backpack beside a desk with an alarm clock, getting ready for school",
    bg: "#e9f3e6",
    border: "#cde3c6",
    accent: "#58894b",
  },
  {
    id: "age6-7",
    kicker: "AGE 6–7",
    title: "Supporting Continued Progress",
    body: "Track developmental milestones, reinforce skills and plan future learning goals.",
    src: "/images/parents/early-years-age6-7.webp",
    alt: "Two children talking together at a table with books, learning side by side",
    bg: "#f5e7f6",
    border: "#e6c9e8",
    accent: "#9a3fa0",
  },
];
