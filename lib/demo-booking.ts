// lib/demo-booking.ts
// Remembers that this tab has booked a demo, so reloading the confirmation brings it back instead of an
// empty form (which invites a second submit and a duplicate booking). It lives in sessionStorage, so it
// is per tab and gone when the tab closes, and it expires so an old booking never blocks a new one.
import type { DemoMeeting } from './demo-meeting';

const KEY = 'cb-demo-booked';
export const BOOKING_TTL_MS = 15 * 60 * 1000;

/** `meeting` is null when the booking source could not tell us the time. */
export type SavedBooking = { meeting: DemoMeeting | null };

const isText = (v: unknown): v is string => typeof v === 'string' && v.trim() !== '';

export function parseBooking(raw: string | null, now: number): SavedBooking | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as { meeting?: unknown; savedAt?: unknown };
    if (typeof data.savedAt !== 'number' || now - data.savedAt > BOOKING_TTL_MS || now < data.savedAt) return null;
    if (data.meeting === null) return { meeting: null };
    const m = data.meeting as { date?: unknown; time?: unknown } | undefined;
    return m && isText(m.date) && isText(m.time) ? { meeting: { date: m.date, time: m.time } } : null;
  } catch {
    return null;
  }
}

// The in-memory copy is what React reads. `undefined` means sessionStorage has not been read yet.
let cache: SavedBooking | null | undefined;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

function load(): SavedBooking | null {
  try {
    return parseBooking(sessionStorage.getItem(KEY), Date.now());
  } catch {
    return null; // storage blocked (private window): the booking still shows for this page view
  }
}

/** Shaped for useSyncExternalStore. The server snapshot is null, so the first paint always matches the server. */
export const savedBooking = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => void listeners.delete(listener);
  },
  getSnapshot(): SavedBooking | null {
    if (cache === undefined) cache = load();
    return cache;
  },
  getServerSnapshot: (): SavedBooking | null => null,
};

export function saveBooking(meeting: DemoMeeting | null) {
  cache = { meeting };
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ meeting, savedAt: Date.now() }));
  } catch {
    // Not saved: a reload shows the form again, which is how it behaved before.
  }
  emit();
}

export function clearBooking() {
  cache = null;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Nothing to remove.
  }
  emit();
}

/** Forgets the in-memory copy so the next read goes to sessionStorage again, as a page reload does. */
export function dropBookingCache() {
  cache = undefined;
}

// Leaving the page through the site starts the next visit fresh. A reload never unmounts, so it keeps the
// booking. The clear waits one tick so React's development remount (unmount, then mount again) cancels it.
let pendingClear: ReturnType<typeof setTimeout> | null = null;
export function keepBookingWhileMounted(): () => void {
  if (pendingClear) clearTimeout(pendingClear);
  pendingClear = null;
  return () => {
    pendingClear = setTimeout(() => {
      pendingClear = null;
      clearBooking();
    }, 0);
  };
}
