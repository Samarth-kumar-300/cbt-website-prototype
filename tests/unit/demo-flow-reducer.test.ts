import { describe, expect, it } from 'vitest';
import { demoReducer, INITIAL_DEMO_STATE } from '@/lib/demo-flow';

describe('demoReducer', () => {
  it('moves from the form to the booking step on submit', () => {
    expect(demoReducer(INITIAL_DEMO_STATE, { type: 'submitted' })).toEqual({ step: 'schedule' });
  });
  it('finishes only by booking', () => {
    expect(demoReducer({ step: 'schedule' }, { type: 'booked' })).toEqual({ step: 'done' });
  });
  it('ignores events that do not fit the current step', () => {
    const done = { step: 'done' } as const;
    const schedule = { step: 'schedule' } as const;
    expect(demoReducer(INITIAL_DEMO_STATE, { type: 'booked' })).toBe(INITIAL_DEMO_STATE);
    expect(demoReducer(done, { type: 'submitted' })).toBe(done);
    expect(demoReducer(done, { type: 'booked' })).toBe(done);
    expect(demoReducer(schedule, { type: 'submitted' })).toBe(schedule);
  });
});
