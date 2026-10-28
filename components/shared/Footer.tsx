import Image from "next/image";
import Link from "next/link";
import { RevealStagger } from "./RevealStagger";
import { Reveal } from "./Reveal";

// Structure and class strings follow reference/footer.json (the captured live footer):
// a desktop layout (lg and up) and a separate mobile layout (below lg), toggled with
// `hidden lg:flex` / `lg:hidden` exactly like the original.

type L = { label: string; href: string; external?: boolean };

const COLUMNS: { heading: string; links: L[] }[] = [
  {
    heading: "PLATFORM",
    links: [
      { label: "For parents", href: "/parents" },
      { label: "For therapy centres", href: "/therapy-centres" },
      { label: "For schools", href: "/schools" },
    ],
  },
  {
    heading: "RESOURCES",
    links: [
      {
        label: "Knowledge base",
        href: "https://support.cognitivebotics.com/support/solutions",
        external: true,
      },
      { label: "Blog", href: "/resources#blog" },
      { label: "Development checklist", href: "/developmental-checklist" },
    ],
  },
  {
    heading: "COMPANY",
    links: [
      { label: "About us", href: "/about" },
      { label: "Get in touch", href: "/contact-us" },
      { label: "Careers", href: "/careers" },
    ],
  },
];

const InstagramIcon = () => (
  <svg
    viewBox="0 0 20 20"
    width="20"
    height="20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M10 1.80078C12.6719 1.80078 12.9883 1.8125 14.0391 1.85937C15.0156 1.90234 15.543 2.06641 15.8945 2.20313C16.3594 2.38281 16.6953 2.60156 17.043 2.94922C17.3945 3.30078 17.6094 3.63281 17.7891 4.09766C17.9258 4.44922 18.0898 4.98047 18.1328 5.95313C18.1797 7.00781 18.1914 7.32422 18.1914 9.99219C18.1914 12.6641 18.1797 12.9805 18.1328 14.0313C18.0898 15.0078 17.9258 15.5352 17.7891 15.8867C17.6094 16.3516 17.3906 16.6875 17.043 17.0352C16.6914 17.3867 16.3594 17.6016 15.8945 17.7813C15.543 17.918 15.0117 18.082 14.0391 18.125C12.9844 18.1719 12.668 18.1836 10 18.1836C7.32813 18.1836 7.01172 18.1719 5.96094 18.125C4.98438 18.082 4.45703 17.918 4.10547 17.7813C3.64063 17.6016 3.30469 17.3828 2.95703 17.0352C2.60547 16.6836 2.39063 16.3516 2.21094 15.8867C2.07422 15.5352 1.91016 15.0039 1.86719 14.0313C1.82031 12.9766 1.80859 12.6602 1.80859 9.99219C1.80859 7.32031 1.82031 7.00391 1.86719 5.95313C1.91016 4.97656 2.07422 4.44922 2.21094 4.09766C2.39063 3.63281 2.60938 3.29688 2.95703 2.94922C3.30859 2.59766 3.64063 2.38281 4.10547 2.20313C4.45703 2.06641 4.98828 1.90234 5.96094 1.85937C7.01172 1.8125 7.32813 1.80078 10 1.80078ZM10 0C7.28516 0 6.94531 0.0117187 5.87891 0.0585938C4.81641 0.105469 4.08594 0.277344 3.45313 0.523437C2.79297 0.78125 2.23438 1.12109 1.67969 1.67969C1.12109 2.23438 0.78125 2.79297 0.523438 3.44922C0.277344 4.08594 0.105469 4.8125 0.0585938 5.875C0.0117188 6.94531 0 7.28516 0 10C0 12.7148 0.0117188 13.0547 0.0585938 14.1211C0.105469 15.1836 0.277344 15.9141 0.523438 16.5469C0.78125 17.207 1.12109 17.7656 1.67969 18.3203C2.23438 18.875 2.79297 19.2188 3.44922 19.4727C4.08594 19.7188 4.8125 19.8906 5.875 19.9375C6.94141 19.9844 7.28125 19.9961 9.99609 19.9961C12.7109 19.9961 13.0508 19.9844 14.1172 19.9375C15.1797 19.8906 15.9102 19.7188 16.543 19.4727C17.1992 19.2188 17.7578 18.875 18.3125 18.3203C18.8672 17.7656 19.2109 17.207 19.4648 16.5508C19.7109 15.9141 19.8828 15.1875 19.9297 14.125C19.9766 13.0586 19.9883 12.7188 19.9883 10.0039C19.9883 7.28906 19.9766 6.94922 19.9297 5.88281C19.8828 4.82031 19.7109 4.08984 19.4648 3.45703C19.2188 2.79297 18.8789 2.23438 18.3203 1.67969C17.7656 1.125 17.207 0.78125 16.5508 0.527344C15.9141 0.28125 15.1875 0.109375 14.125 0.0625C13.0547 0.0117188 12.7148 0 10 0Z" />
    <path d="M10 4.86328C7.16406 4.86328 4.86328 7.16406 4.86328 10C4.86328 12.8359 7.16406 15.1367 10 15.1367C12.8359 15.1367 15.1367 12.8359 15.1367 10C15.1367 7.16406 12.8359 4.86328 10 4.86328ZM10 13.332C8.16016 13.332 6.66797 11.8398 6.66797 10C6.66797 8.16016 8.16016 6.66797 10 6.66797C11.8398 6.66797 13.332 8.16016 13.332 10C13.332 11.8398 11.8398 13.332 10 13.332Z" />
    <path d="M16.5391 4.66012C16.5391 5.32418 16 5.85934 15.3398 5.85934C14.6758 5.85934 14.1406 5.32027 14.1406 4.66012C14.1406 3.99605 14.6797 3.4609 15.3398 3.4609C16 3.4609 16.5391 3.99996 16.5391 4.66012Z" />
  </svg>
);

const XIcon = () => (
  <svg
    viewBox="0 0 20 20"
    width="20"
    height="20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.1386 18.75L8.72425 12.458L3.19808 18.75H0.860161L7.68701 10.9793L0.860161 1.25H6.86262L11.0231 7.18013L16.2359 1.25H18.5738L12.0638 8.66084L19.141 18.75H13.1386ZM15.7421 16.9762H14.1681L4.20771 3.02386H5.78191L9.77112 8.61047L10.461 9.57989L15.7421 16.9762Z"
    />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    viewBox="0 0 20 20"
    width="20"
    height="20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.5195 0H1.47656C0.660156 0 0 0.644531 0 1.44141V18.5547C0 19.3516 0.660156 20 1.47656 20H18.5195C19.3359 20 20 19.3516 20 18.5586V1.44141C20 0.644531 19.3359 0 18.5195 0ZM5.93359 17.043H2.96484V7.49609H5.93359V17.043ZM4.44922 6.19531C3.49609 6.19531 2.72656 5.42578 2.72656 4.47656C2.72656 3.52734 3.49609 2.75781 4.44922 2.75781C5.39844 2.75781 6.16797 3.52734 6.16797 4.47656C6.16797 5.42187 5.39844 6.19531 4.44922 6.19531ZM17.043 17.043H14.0781V12.4023C14.0781 11.2969 14.0586 9.87109 12.5352 9.87109C10.9922 9.87109 10.7578 11.0781 10.7578 12.3242V17.043H7.79688V7.49609H10.6406V8.80078H10.6797C11.0742 8.05078 12.043 7.25781 13.4844 7.25781C16.4883 7.25781 17.043 9.23438 17.043 11.8047V17.043V17.043Z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg
    viewBox="0 0 20.0399 17.0909"
    width="20"
    height="17"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M18.9555 4.02844C19.2658 4.34074 19.4887 4.72907 19.6018 5.15456C20.0199 6.72501 20.0199 10 20.0199 10C20.0199 10 20.0199 13.275 19.6018 14.8455C19.4887 15.271 19.2658 15.6593 18.9555 15.9716C18.6452 16.2839 18.2583 16.5092 17.8336 16.625C16.2699 17.0455 10.0199 17.0455 10.0199 17.0455C10.0199 17.0455 3.76994 17.0455 2.2063 16.625C1.78155 16.5092 1.39465 16.2839 1.08434 15.9716C0.774035 15.6593 0.551193 15.271 0.43812 14.8455C0.0199382 13.275 0.0199382 10 0.0199382 10C0.0199382 10 0.0199382 6.72501 0.43812 5.15456C0.551193 4.72907 0.774035 4.34074 1.08434 4.02844C1.39465 3.71614 1.78155 3.49081 2.2063 3.37501C3.76994 2.95456 10.0199 2.95456 10.0199 2.95456C10.0199 2.95456 16.2699 2.95456 17.8336 3.37501C18.2583 3.49081 18.6452 3.71614 18.9555 4.02844ZM13.2017 10L7.97445 7.02616V12.9739L13.2017 10Z"
    />
  </svg>
);

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
