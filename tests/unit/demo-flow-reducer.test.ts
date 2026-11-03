import { describe, expect, it } from 'vitest';
import { demoReducer, INITIAL_DEMO_STATE } from '@/lib/demo-flow';

describe('demoReducer', () => {
  it('moves to scheduling after submit when booking is available', () => {
    expect(demoReducer(INITIAL_DEMO_STATE, { type: 'submitted', canBook: true })).toEqual({ step: 'schedule', booked: false });
  });
  it('goes straight to done when booking is not available', () => {
    expect(demoReducer(INITIAL_DEMO_STATE, { type: 'submitted', canBook: false })).toEqual({ step: 'done', booked: false });
  });
  it('finishes as booked or skipped from the scheduling step', () => {
    const schedule = { step: 'schedule', booked: false } as const;
    expect(demoReducer(schedule, { type: 'booked' })).toEqual({ step: 'done', booked: true });
    expect(demoReducer(schedule, { type: 'skipped' })).toEqual({ step: 'done', booked: false });
  });
  it('ignores events that do not fit the current step', () => {
    const done = { step: 'done', booked: true } as const;
    expect(demoReducer(INITIAL_DEMO_STATE, { type: 'booked' })).toBe(INITIAL_DEMO_STATE);
    expect(demoReducer(INITIAL_DEMO_STATE, { type: 'skipped' })).toBe(INITIAL_DEMO_STATE);
    expect(demoReducer(done, { type: 'skipped' })).toBe(done);
    expect(demoReducer(done, { type: 'submitted', canBook: true })).toBe(done);
    const schedule = { step: 'schedule', booked: false } as const;
    expect(demoReducer(schedule, { type: 'submitted', canBook: true })).toBe(schedule);
  });
});
