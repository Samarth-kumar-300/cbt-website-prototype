// TEMPORARY: design review of every Try Demo state. Remove with components/pages/try-demo/DemoPreview.tsx
// and the `preview` plumbing (page.tsx, TryDemoPage.tsx, Section0.tsx, DemoSchedule's previewStatus).
export const PREVIEW_VIEWS = [
  { id: 'form', label: '1 Form' },
  { id: 'book', label: '2 Book a time' },
  { id: 'opening', label: '3 Opening calendar' },
  { id: 'error', label: '4 Calendar error' },
  { id: 'booked', label: '5 Demo booked' },
] as const;

export type PreviewView = (typeof PREVIEW_VIEWS)[number]['id'];

/** `?preview` turns the switch on at the form; `?preview=booked` starts on that state. Absent means off (null). */
export function parsePreview(value: string | string[] | undefined): PreviewView | null {
  if (value === undefined) return null;
  const v = Array.isArray(value) ? value[0] : value;
  return PREVIEW_VIEWS.find((p) => p.id === v)?.id ?? 'form';
}
