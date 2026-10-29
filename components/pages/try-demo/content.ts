export const tryDemoContent = {
  title: "Try the learning games in our autism app",
  subtitle:
    "Explore the games in the CognitiveBotics autism app, each built around a developmental goal to help children build essential skills through play.",
  games: [
    { tag: "Animation game", skill: "Self help skill", title: "Wear and remove socks", thumb: "stars" },
    { tag: "Pose game", skill: "Self help skill", title: "Wear and remove socks", thumb: "bus" },
    { tag: "Speech game", skill: "Self help skill", title: "Wear and remove socks", thumb: "kids" },
    { tag: "Animation game", skill: "Self help skill", title: "Wear and remove socks", thumb: "kids" },
  ],
  cta: { heading: "Ready to get started?", label: "Get in Touch", href: "/contact-us" },
} as const;

export type GameThumb = (typeof tryDemoContent.games)[number]["thumb"];
