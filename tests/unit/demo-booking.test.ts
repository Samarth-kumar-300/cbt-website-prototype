import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  BOOKING_TTL_MS,
  clearBooking,
  dropBookingCache,
  keepBookingWhileMounted,
  parseBooking,
  saveBooking,
  savedBooking,
} from '@/lib/demo-booking';

const MEETING = { date: 'November 24, 2026 (Tuesday)', time: '3:30 pm IST' };

beforeEach(() => {
  sessionStorage.clear();
  clearBooking();
  dropBookingCache();
});
afterEach(() => vi.useRealTimers());

describe('parseBooking', () => {
  const at = 1_000_000;
  const raw = (o: unknown) => JSON.stringify(o);

  it('reads a saved meeting and a saved booking with no meeting', () => {
    expect(parseBooking(raw({ meeting: MEETING, savedAt: at }), at + 1000)).toEqual({ meeting: MEETING });
    expect(parseBooking(raw({ meeting: null, savedAt: at }), at + 1000)).toEqual({ meeting: null });
  });
  it('ignores empty, broken, incomplete or expired entries', () => {
    expect(parseBooking(null, at)).toBeNull();
    expect(parseBooking('not json', at)).toBeNull();
    expect(parseBooking(raw({ meeting: { date: 'x' }, savedAt: at }), at)).toBeNull();
    expect(parseBooking(raw({ meeting: MEETING }), at)).toBeNull();
    expect(parseBooking(raw({ meeting: MEETING, savedAt: at }), at + BOOKING_TTL_MS + 1)).toBeNull();
    expect(parseBooking(raw({ meeting: MEETING, savedAt: at }), at - 1)).toBeNull();
  });
});

describe('saved booking', () => {
  it('is empty on the server and on a fresh tab', () => {
    expect(savedBooking.getServerSnapshot()).toBeNull();
    expect(savedBooking.getSnapshot()).toBeNull();
  });
  it('survives a page reload (the in-memory copy is dropped, storage is read again)', () => {
    saveBooking(MEETING);
    dropBookingCache();
    expect(savedBooking.getSnapshot()).toEqual({ meeting: MEETING });
  });
  it('gives React a stable snapshot between reads', () => {
    saveBooking(MEETING);
    expect(savedBooking.getSnapshot()).toBe(savedBooking.getSnapshot());
  });
  it('tells subscribers when it changes', () => {
    const listener = vi.fn();
    const off = savedBooking.subscribe(listener);
    saveBooking(null);
    clearBooking();
    off();
    saveBooking(null);
    expect(listener).toHaveBeenCalledTimes(2);
  });
  it('still works for this page view when storage is blocked', () => {
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    expect(() => saveBooking(MEETING)).not.toThrow();
    expect(savedBooking.getSnapshot()).toEqual({ meeting: MEETING });
    set.mockRestore();
  });
});

describe('keepBookingWhileMounted', () => {
  it('forgets the booking after the page unmounts', () => {
    vi.useFakeTimers();
    saveBooking(MEETING);
    keepBookingWhileMounted()();
    vi.runAllTimers();
    expect(savedBooking.getSnapshot()).toBeNull();
    expect(sessionStorage.length).toBe(0);
  });
  it('keeps the booking when the page mounts again straight away (development remount)', () => {
    vi.useFakeTimers();
    saveBooking(MEETING);
    keepBookingWhileMounted()();
    keepBookingWhileMounted();
    vi.runAllTimers();
    expect(savedBooking.getSnapshot()).toEqual({ meeting: MEETING });
  });
});
