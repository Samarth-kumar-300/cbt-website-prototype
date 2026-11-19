// lib/demo-meeting.ts
/** The slot a visitor booked, already written the way the confirmation card shows it. */
export type DemoMeeting = { date: string; time: string };

const WEEKDAY = new Intl.DateTimeFormat('en-US', { weekday: 'long' });
const LONG_DATE = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

/** Month day, year (Weekday): November 24, 2026 (Tuesday). The weekday is the quickest check against a calendar. */
export function formatMeetingDate(d: Date): string {
  return `${LONG_DATE.format(d)} (${WEEKDAY.format(d)})`;
}
