// Shared scroll mapping for the step interactions. Both the rotating image and the list items read
// the same progress through the enclosing section, so they always agree on the current step.
export const STEP_TRIGGER = { start: 'top 60%', end: 'bottom 60%' } as const;

// Phones are shorter than the section they scroll through, so a step should land a little earlier
// and finish a little later than the desktop 60/60 window.
export const STEP_TRIGGER_TOUCH = { start: 'top 70%', end: 'bottom 50%' } as const;

export function stepTrigger() {
  const narrow = typeof matchMedia === 'function' && matchMedia('(max-width: 1023px)').matches;
  return narrow ? STEP_TRIGGER_TOUCH : STEP_TRIGGER;
}

export function stepFor(progress: number, steps: number) {
  return Math.min(steps - 1, Math.floor(progress * steps));
}

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
