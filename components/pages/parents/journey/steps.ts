import type { JourneyRailItem } from "../../home/sections/JourneyRailList";

// The early-years rail on the parents page: one step per age band, with the accent colour from each card.
export const EARLY_YEARS_STEPS: readonly JourneyRailItem[] = [
  {
    id: "age2",
    kicker: "AGE 2",
    title: "Recognising Early Signs",
    body: "Identify differences in speech, play and social interaction to seek timely support.",
    src: "/images/parents/early-years-2.webp",
    alt: "A smiling girl with a flower headband stacking colourful building blocks",
    bg: "#f8e9e4",
    border: "#efd0c5",
    accent: "#c07158",
  },
  {
    id: "age3-4",
    kicker: "AGE 3–4",
    title: "Building Essential Skills",
    body: "Improve communication, social interaction, learning and daily routines through early intervention.",
    src: "/images/parents/early-years-3-4.webp",
    alt: "A girl in heart-print pyjamas brushing her teeth at a sink, building daily routines",
    bg: "#e3eff4",
    border: "#c5dde7",
    accent: "#387792",
  },
  {
    id: "age5",
    kicker: "AGE 5",
    title: "Preparing for New Experiences",
    body: "Develop skills for classroom learning, social relationships and adapting to new routines.",
    src: "/images/parents/early-years-5.webp",
    alt: "A girl drawing a star in a notebook at her desk, getting ready for school",
    bg: "#e9f3e6",
    border: "#cde3c6",
    accent: "#58894b",
  },
  {
    id: "age6-7",
    kicker: "AGE 6–7",
    title: "Supporting Continued Progress",
    body: "Track developmental milestones, reinforce skills and plan future learning goals.",
    src: "/images/parents/early-years-6-7-v2.webp",
    alt: "A girl and a boy chatting together beside a table of books, learning side by side",
    bg: "#f5e7f6",
    border: "#e6c9e8",
    accent: "#9a3fa0",
  },
];
