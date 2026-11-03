// lib/demo-flow.ts
export type DemoStep = 'details' | 'schedule' | 'done';
export type DemoState = { readonly step: DemoStep; readonly booked: boolean };
export type DemoEvent = { type: 'submitted'; canBook: boolean } | { type: 'booked' } | { type: 'skipped' };

export const INITIAL_DEMO_STATE: DemoState = { step: 'details', booked: false };

// Each event only applies from the step it belongs to, so a repeated or late event changes nothing.
export function demoReducer(state: DemoState, event: DemoEvent): DemoState {
  switch (event.type) {
    case 'submitted':
      return state.step === 'details' ? { step: event.canBook ? 'schedule' : 'done', booked: false } : state;
    case 'booked':
      return state.step === 'schedule' ? { step: 'done', booked: true } : state;
    case 'skipped':
      return state.step === 'schedule' ? { step: 'done', booked: false } : state;
  }
}
