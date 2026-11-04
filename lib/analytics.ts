// lib/analytics.ts
export type DemoEventName = 'demo_submitted' | 'demo_booked';

/** Pushes to the page's dataLayer if a tag manager has created one; otherwise does nothing. */
export function track(event: DemoEventName, params: Record<string, string> = {}): void {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer?.push({ event, ...params });
}
