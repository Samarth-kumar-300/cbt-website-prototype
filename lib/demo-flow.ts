// lib/demo-flow.ts
// details (the form) -> schedule (pick a time) -> done (booked). There is no way past the schedule step
// except booking, so a "done" state always means booked.
export type DemoStep = 'details' | 'schedule' | 'done';
export type DemoState = { readonly step: DemoStep };
export type DemoEvent = { type: 'submitted' } | { type: 'booked' };

export const INITIAL_DEMO_STATE: DemoState = { step: 'details' };

// Each event only applies from the step it belongs to, so a repeated or late event changes nothing.
export function demoReducer(state: DemoState, event: DemoEvent): DemoState {
  switch (event.type) {
    case 'submitted':
      return state.step === 'details' ? { step: 'schedule' } : state;
    case 'booked':
      return state.step === 'schedule' ? { step: 'done' } : state;
  }
}
