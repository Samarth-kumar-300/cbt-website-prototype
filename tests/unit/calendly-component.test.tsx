import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/calendly', async (importOriginal) => {
  const real = await importOriginal<typeof import('@/lib/calendly')>();
  return { ...real, loadCalendly: vi.fn() };
});

import { Calendly } from '@/components/pages/try-demo/Calendly';
import { loadCalendly } from '@/lib/calendly';

const load = vi.mocked(loadCalendly);
const init = vi.fn();
const URL = 'https://calendly.com/cognitivebotics/demo';
const fromCalendly = (data: unknown, origin = 'https://calendly.com') =>
  window.dispatchEvent(new MessageEvent('message', { origin, data }));

beforeEach(() => {
  init.mockReset();
  load.mockReset();
  load.mockResolvedValue(undefined);
  (window as unknown as { Calendly: unknown }).Calendly = { initInlineWidget: init };
});
afterEach(() => {
  cleanup();
  Reflect.deleteProperty(window, 'Calendly');
});

describe('Calendly', () => {
  it('starts the inline widget with the link and the visitor details', async () => {
    render(<Calendly url={URL} name="Asha" email="asha@example.com" onBooked={vi.fn()} onFailed={vi.fn()} />);
    await waitFor(() => expect(init).toHaveBeenCalledTimes(1));
    expect(init.mock.calls[0][0]).toMatchObject({ url: URL, prefill: { name: 'Asha', email: 'asha@example.com' } });
    await waitFor(() => expect(screen.queryByRole('status')).toBeNull());
  });

  it('reports a booking from calendly.com', async () => {
    const onBooked = vi.fn();
    render(<Calendly url={URL} name="A" email="a@b.co" onBooked={onBooked} onFailed={vi.fn()} />);
    fromCalendly({ event: 'calendly.event_scheduled' });
    expect(onBooked).toHaveBeenCalledTimes(1);
  });

  it('ignores the booking message from another origin and other Calendly events', () => {
    const onBooked = vi.fn();
    render(<Calendly url={URL} name="A" email="a@b.co" onBooked={onBooked} onFailed={vi.fn()} />);
    fromCalendly({ event: 'calendly.event_scheduled' }, 'https://evil.example');
    fromCalendly({ event: 'calendly.page_height' });
    fromCalendly('calendly.event_scheduled');
    expect(onBooked).not.toHaveBeenCalled();
  });

  it('reports a failed load', async () => {
    load.mockRejectedValue(new Error('blocked'));
    const onFailed = vi.fn();
    render(<Calendly url={URL} name="A" email="a@b.co" onBooked={vi.fn()} onFailed={onFailed} />);
    await waitFor(() => expect(onFailed).toHaveBeenCalledTimes(1));
  });

  it('reports a failed load when the script runs but does not define Calendly', async () => {
    Reflect.deleteProperty(window, 'Calendly');
    const onFailed = vi.fn();
    render(<Calendly url={URL} name="A" email="a@b.co" onBooked={vi.fn()} onFailed={onFailed} />);
    await waitFor(() => expect(onFailed).toHaveBeenCalledTimes(1));
    expect(init).not.toHaveBeenCalled();
  });
});
