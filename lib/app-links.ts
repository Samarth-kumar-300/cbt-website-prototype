// Store listings for the free parent app. Not published yet: both point to the holding page until the URLs arrive.
export const APP_LINKS = {
  googlePlay: '/coming-soon',
  appStore: '/coming-soon',
} as const;

export const isExternal = (href: string) => /^https?:\/\//.test(href);
