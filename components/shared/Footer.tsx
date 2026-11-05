import Image from "next/image";
import Link from "next/link";
import { RevealStagger } from "./RevealStagger";
import { Reveal } from "./Reveal";
import { LEARN_PAGES, livePages } from "./nav-links";
import { LIVE_PAGES } from "@/lib/launch-gates";
import { InstagramIcon, LinkedInIcon, XIcon, YouTubeIcon } from "./social-icons";

// Structure and class strings follow reference/footer.json (the captured live footer):
// a desktop layout (lg and up) and a separate mobile layout (below lg), toggled with
// `hidden lg:flex` / `lg:hidden` exactly like the original.

type L = { label: string; href: string; external?: boolean };

function resourceLinks(): L[] {
  return [
    ...livePages()
      .filter((p) => p !== LEARN_PAGES.achievements)
      .map(({ label, href }) => ({ label, href })),
    {
      label: "Knowledge base",
      href: "https://support.cognitivebotics.com/support/solutions",
      external: true,
    },
    { label: "Development checklist", href: "/developmental-checklist" },
  ];
}

const COLUMNS: { heading: string; links: L[] }[] = [
  {
    heading: "PLATFORM",
    links: [
      { label: "For parents", href: "/parents" },
      { label: "For therapy centres", href: "/therapy-centres" },
      { label: "For schools", href: "/schools" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  { heading: "LEARN", links: resourceLinks() },
  {
    heading: "COMPANY",
    links: [
      { label: "About us", href: "/about" },
      { label: "Get in touch", href: "/contact-us" },
      { label: "Careers", href: "/careers" },
      ...(LIVE_PAGES.achievements ? [{ label: LEARN_PAGES.achievements.label, href: LEARN_PAGES.achievements.href }] : []),
    ],
  },
];

const SOCIAL: { label: string; href: string; Icon: () => React.JSX.Element }[] =
  [
    {
      label: "instagram",
      href: "https://www.instagram.com/cognitivebotics_/?hl=en",
      Icon: InstagramIcon,
    },
    { label: "twitter", href: "https://x.com/CognitiveBotics", Icon: XIcon },
    {
      label: "linkedin",
      href: "https://www.linkedin.com/company/cognitivebotics",
      Icon: LinkedInIcon,
    },
    {
      label: "youtube",
      href: "https://www.youtube.com/@COGNITIVE_BOTICS",
      Icon: YouTubeIcon,
    },
  ];

const LEGAL: L[] = [
  { label: "Privacy policy", href: "/privacy-policy" },
  { label: "Terms of service", href: "/terms-of-use" },
  { label: "Medical disclaimer", href: "/medical-disclaimer" },
];

function A({ l, className = "" }: { l: L; className?: string }) {
  return l.external ? (
    <a
      href={l.href}
      target="_blank"
      rel="noopener noreferrer"
      className={className || undefined}
    >
      {l.label}
    </a>
  ) : (
    <Link href={l.href} className={className || undefined}>
      {l.label}
    </Link>
  );
}

function IsoBadge() {
  return (
    <div className="relative h-[86px] w-[67px] shrink-0">
      <Image
        src="/brand/iso-27001.webp"
        alt="ISO 27001 certified"
        fill
        sizes="67px"
        className="object-contain"
      />
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative flex flex-col items-center gap-7 bg-brand-dark px-5 pb-8 pt-11 lg:gap-10 lg:px-24 lg:pb-12 lg:pt-[72px]">
      {/* Desktop */}
      <div className="relative z-10 hidden w-full max-w-[1248px] flex-col items-start justify-between gap-12 lg:flex lg:flex-row">
        <div className="flex flex-col items-start gap-6">
          <div className="flex flex-col items-start gap-4 text-content-knockout">
            <p className="font-heading text-[24px] font-bold leading-[30px]">
              CognitiveBotics
            </p>
            <p className="max-w-[631px] text-[18px] leading-[27px]">
              AI-powered support for early intervention in neurodiverse
              children.
            </p>
          </div>
          <Reveal><IsoBadge /></Reveal>
        </div>
        <RevealStagger className="flex flex-wrap gap-16">
          {COLUMNS.map((c) => (
            <div
              key={c.heading}
              className="flex flex-col items-start gap-[14px] text-[16px] text-content-knockout"
            >
              <p>{c.heading}</p>
              {c.links.map((l) => (
                <A key={l.href} l={l} className="nav-link inline-block whitespace-nowrap" />
              ))}
            </div>
          ))}
        </RevealStagger>
      </div>
      <div className="relative z-10 hidden w-full max-w-[1248px] justify-end lg:flex">
        <div className="flex items-center gap-5">
          {SOCIAL.map(({ label, href, Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="social-lift text-content-knockout/80 hover:text-content-knockout"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
      <div className="hidden h-px w-full max-w-[1248px] bg-white/15 lg:block" />
      <div className="hidden w-full max-w-[1248px] flex-col items-center gap-4 text-content-knockout sm:flex-row sm:justify-between lg:flex">
        <p className="text-[18px] leading-[27px]">
          © {year} CognitiveBotics. All rights reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-[16px] leading-6 sm:flex-nowrap sm:gap-7">
          {LEGAL.map((l) => (
            <A key={l.href} l={l} className="nav-link inline-block whitespace-nowrap" />
          ))}
        </div>
      </div>

      {/* Mobile and tablet */}
      <div className="relative z-10 flex w-full flex-col items-start gap-[8px] text-content-knockout lg:hidden">
        <p className="font-heading text-[20px] font-bold leading-[27px]">
          CognitiveBotics
        </p>
        <p className="text-[14px] leading-[21px] text-content-knockout/70">
          AI-powered support for early intervention in neurodiverse children.
        </p>
      </div>
      <div className="grid w-full grid-cols-2 gap-x-4 gap-y-7 lg:hidden">
        <IsoBadge />
        {COLUMNS.map((c) => (
          <div key={c.heading} className="flex flex-col items-start gap-0">
            <p className="pb-1 text-[14px] font-semibold tracking-[1px] text-content-knockout/60">
              {c.heading}
            </p>
            {c.links.map((l) => (
              <A
                key={l.href}
                l={l}
                className="inline-flex min-h-[44px] items-center text-[14px] leading-[21px] text-content-knockout"
              />
            ))}
          </div>
        ))}
      </div>
      <div className="h-px w-full bg-white/[0.18] lg:hidden" />
      <div className="flex w-full flex-col items-start gap-1 text-[14px] leading-[20px] lg:hidden">
        <p className="w-full text-content-knockout/60">
          © {year} CognitiveBotics. All rights reserved.
        </p>
        <div className="flex w-full flex-wrap gap-x-[18px] text-content-knockout/70">
          {LEGAL.map((l) => (
            <A key={l.href} l={l} className="nav-link inline-flex min-h-[44px] items-center whitespace-nowrap" />
          ))}
        </div>
      </div>
    </footer>
  );
}
