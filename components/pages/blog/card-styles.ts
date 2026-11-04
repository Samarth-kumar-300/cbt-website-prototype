// Icon and pill colours for each post's card, taken from the blog cards on the original Resources page.
export type PostCardStyle = {
  readonly iconBg: string;
  readonly iconFg: string;
  readonly iconPath: string;
  /** Tint of the cover. */
  readonly pillBg: string;
  /** Supplied thumbnail (a 16:9 image under public/). A post without one shows the tinted placeholder cover. */
  readonly cover?: string;
};

export const CARD_STYLES: Record<string, PostCardStyle> = {
  'the-transformative-power-of-physical-activities-for-children-with-autism': {
    iconBg: '#f0f9ff', iconFg: '#0369a1', pillBg: '#dff4fd', cover: '/images/blog/thumbnail-01.webp',
    iconPath: 'M15.5 11.5h-1l-1.5 3-2-6-1.5 3h-1m3.493-6.364c-2-2.338-5.333-2.966-7.838-.826s-2.858 5.719-.89 8.25c1.485 1.912 5.706 5.751 7.683 7.515.363.324.545.486.758.55.184.055.39.055.575 0 .212-.064.394-.226.757-.55 1.977-1.764 6.198-5.603 7.684-7.515 1.967-2.531 1.658-6.132-.89-8.25-2.549-2.118-5.84-1.512-7.839.826Z',
  },
  'fun-ways-to-boost-motor-skills-of-children-with-autism': {
    iconBg: '#fef2f2', iconFg: '#b91c1c', pillBg: '#fce8e2', cover: '/images/blog/thumbnail-02.webp',
    iconPath: 'M9 17.5H3.5m3-5.5H2m7-5.5H4M17 3l-6.596 9.235c-.292.409-.438.613-.432.784a.5.5 0 0 0 .194.377c.135.104.386.104.889.104H16L15 21l6.596-9.235c.292-.409.438-.613.432-.784a.5.5 0 0 0-.194-.377c-.135-.104-.386-.104-.889-.104H16L17 3Z',
  },
  'understanding-the-underlying-causes-of-autism-a-comprehensive-guide': {
    iconBg: '#f0fdf4', iconFg: '#15803d', pillBg: '#e9fae5', cover: '/images/blog/thumbnail-03.webp',
    iconPath: 'M7.5 4.5a2.5 2.5 0 0 1 5 0V6h1c1.398 0 2.097 0 2.648.228a3 3 0 0 1 1.624 1.624C18 8.403 18 9.102 18 10.5h1.5a2.5 2.5 0 0 1 0 5H18v1.7c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C15.72 22 14.88 22 13.2 22h-.7v-1.75a2.25 2.25 0 0 0-4.5 0V22H6.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C2 19.72 2 18.88 2 17.2v-1.7h1.5a2.5 2.5 0 0 0 0-5H2c0-1.398 0-2.097.228-2.648a3 3 0 0 1 1.624-1.624C4.403 6 5.102 6 6.5 6h1V4.5Z',
  },
  'the-startling-truth-about-screen-time-and-autism': {
    iconBg: '#fffbeb', iconFg: '#b45309', pillBg: '#fff7de', cover: '/images/blog/thumbnail-01.webp',
    iconPath: 'M15 17v4H9v-4m-3.8 0h13.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 15.48 22 14.92 22 13.8V6.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 3 19.92 3 18.8 3H5.2c-1.12 0-1.68 0-2.108.218a2 2 0 0 0-.874.874C2 4.52 2 5.08 2 6.2v7.6c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C3.52 17 4.08 17 5.2 17Z',
  },
  'early-intervention-is-the-key-to-managing-autism': {
    iconBg: '#f8f2f9', iconFg: '#a14da5', pillBg: '#f4e4f5', cover: '/images/blog/thumbnail-02.webp',
    iconPath: 'm22 7-7.869 7.869c-.396.396-.594.594-.822.668a1 1 0 0 1-.618 0c-.228-.074-.426-.272-.822-.668L9.13 12.13c-.396-.396-.594-.594-.822-.668a1 1 0 0 0-.618 0c-.228.074-.426.272-.822.668L2 17M22 7h-7m7 0v7',
  },
  'how-to-travel-with-children-who-have-autism': {
    iconBg: '#eef9f9', iconFg: '#207d82', pillBg: '#ddf3f4', cover: '/images/blog/thumbnail-03.webp',
    iconPath: 'M17.745 2.813a2.483 2.483 0 0 1 3.58 3.442l-2.78 2.91c-.217.228-.326.342-.393.475a.983.983 0 0 0-.104.38c-.01.148.025.302.096.61l1.728 7.487c.072.315.109.473.097.626a.999.999 0 0 1-.11.386c-.072.136-.186.25-.415.479l-.37.37c-.607.607-.91.91-1.22.965a1 1 0 0 1-.77-.182c-.253-.188-.389-.594-.66-1.408l-2.01-6.029-3.345 3.345c-.2.2-.3.3-.366.418a.997.997 0 0 0-.118.336c-.022.134-.006.274.025.555l.184 1.653c.03.28.046.42.025.554a.999.999 0 0 1-.118.337c-.067.117-.166.217-.366.417l-.198.198c-.473.473-.71.71-.972.778a1 1 0 0 1-.69-.069c-.244-.118-.43-.397-.8-.953L6.106 18.54a1.845 1.845 0 0 0-.138-.194.998.998 0 0 0-.111-.112c-.045-.038-.095-.071-.194-.138L3.31 16.528c-.556-.371-.835-.557-.954-.8a1 1 0 0 1-.068-.69c.069-.263.305-.5.778-.973l.198-.197c.2-.2.3-.3.417-.366.104-.06.218-.1.336-.118.134-.022.274-.006.555.025l1.653.184c.281.03.421.046.555.025a.998.998 0 0 0 .336-.118c.118-.067.218-.166.417-.366l3.346-3.345-6.03-2.01c-.813-.271-1.22-.407-1.407-.66a1 1 0 0 1-.182-.77c.055-.31.358-.613.964-1.22l.37-.37c.23-.23.344-.344.48-.414a1 1 0 0 1 .386-.111c.153-.012.31.024.626.097l7.459 1.721c.31.072.465.108.615.097a1 1 0 0 0 .411-.122c.132-.072.242-.186.464-.415l2.71-2.799Z',
  },
};
