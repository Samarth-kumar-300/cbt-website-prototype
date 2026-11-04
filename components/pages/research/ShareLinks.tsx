'use client';

import { InstagramIcon, LinkedInIcon, XIcon } from '@/components/shared/social-icons';

const INSTAGRAM_PROFILE = 'https://www.instagram.com/cognitivebotics_/?hl=en';

function openTab(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

// Same three buttons as the live detail pages. Instagram has no share URL, so it opens the profile.
// LinkedIn and X share the page the visitor is on, read at click time so no site URL has to be configured.
export function ShareLinks({ title }: { title: string }) {
  const button = 'text-[#6b7280] transition-colors hover:text-brand-teal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal';
  return (
    <div className="flex items-center gap-[14px]">
      <p className="text-[15px] font-semibold leading-[23px] text-brand-dark lg:font-heading lg:text-[20px] lg:font-bold lg:leading-[26px]">Share:</p>
      <button type="button" aria-label="Open Instagram" className={button} onClick={() => openTab(INSTAGRAM_PROFILE)}>
        <InstagramIcon />
      </button>
      <button
        type="button"
        aria-label="Share on LinkedIn"
        className={button}
        onClick={() => openTab(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`)}
      >
        <LinkedInIcon />
      </button>
      <button
        type="button"
        aria-label="Share on X"
        className={button}
        onClick={() => openTab(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`)}
      >
        <XIcon />
      </button>
    </div>
  );
}
