import { describe, expect, it } from 'vitest';
import { formatMeetingDate } from '@/lib/demo-meeting';

describe('formatMeetingDate', () => {
  it('writes Month day, year with the weekday in brackets and no leading zero', () => {
    expect(formatMeetingDate(new Date(2026, 10, 24))).toBe('November 24, 2026 (Tuesday)');
    expect(formatMeetingDate(new Date(2026, 0, 4))).toBe('January 4, 2026 (Sunday)');
  });
});
