import 'react';

// Allow CSS custom properties (e.g. style={{ "--cta-bg": "#fff" }}) in inline style objects,
// which the HTML-to-JSX scaffolder emits verbatim.
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}
