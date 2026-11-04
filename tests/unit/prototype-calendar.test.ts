import { describe, expect, it } from 'vitest';
import { nextWeekdays } from '@/components/pages/try-demo/PrototypeCalendar';

describe('nextWeekdays', () => {
  it('lists the next weekdays after the given day, skipping weekends', () => {
    // Fri 31 Oct 2025 -> Mon 3, Tue 4, Wed 5, Thu 6, Fri 7 Nov
    const days = nextWeekdays(new Date(2025, 9, 31), 5);
    expect(days.map((d) => d.getDate())).toEqual([3, 4, 5, 6, 7]);
    expect(days.every((d) => d.getDay() >= 1 && d.getDay() <= 5)).toBe(true);
  });
  it('never includes today', () => {
    const today = new Date(2025, 10, 3);
    expect(nextWeekdays(today, 1)[0].getDate()).toBe(4);
  });
});
