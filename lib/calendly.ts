// lib/calendly.ts
export const CALENDLY_ORIGIN = 'https://calendly.com';
const SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js';

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget(options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: { name?: string; email?: string };
      }): void;
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

/** Adds Calendly's widget script once. Called only when the booking step opens, so no other page loads it. */
export function loadCalendly(): Promise<void> {
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
