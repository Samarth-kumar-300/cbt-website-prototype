// Import this at the top of a test that asserts a mid-animation value (opacity 0, overflow hidden, an inline
// height). GSAP's clock runs in real time, so on a loaded machine a 50ms delay can already have elapsed by the
// time an assertion runs. GSAP renders lazily on its next tick, so the clock cannot simply be stopped.
// Instead, lag smoothing counts every frame as 1ms: tweens still render their start state on the next tick,
// but animation time barely advances however slow the run is.
import { afterEach, beforeEach } from 'vitest';
import gsap from 'gsap';

beforeEach(() => {
  gsap.ticker.lagSmoothing(1, 1);
});

afterEach(() => {
  gsap.ticker.lagSmoothing(500, 33); // GSAP's defaults
});
