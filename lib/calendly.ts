// lib/calendly.ts
export const CALENDLY_ORIGIN = 'https://calendly.com';
const SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js';
const STYLE_HREF = 'https://assets.calendly.com/assets/external/widget.css';

declare global {
  interface Window {
    Calendly?: {
      initPopupWidget(options: { url: string; prefill?: { name?: string; firstName?: string; lastName?: string; email?: string } }): void;
      closePopupWidget?(): void;
    };
  }
}

/** True only for the "booked" message that Calendly's own origin sends. */
export function isScheduledEvent(e: { origin: string; data: unknown }): boolean {
  if (e.origin !== CALENDLY_ORIGIN) return false;
  const data = e.data;
  return typeof data === 'object' && data !== null && (data as { event?: unknown }).event === 'calendly.event_scheduled';
}

let loading: Promise<void> | null = null;

function ensureStyle() {
  if (document.querySelector(`link[href="${STYLE_HREF}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = STYLE_HREF;
  document.head.appendChild(link);
}

/** Adds Calendly's popup script and stylesheet once. Called only when the visitor asks to book, so no other page loads them. */
export function loadCalendly(): Promise<void> {
  ensureStyle();
  if (window.Calendly) return Promise.resolve();
  if (!loading) {
    loading = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        loading = null;
        script.remove();
        reject(new Error('Calendly failed to load'));
      };
      document.head.appendChild(script);
    });
  }
  return loading;
}
