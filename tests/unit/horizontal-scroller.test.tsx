import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HorizontalScroller } from '@/components/shared/HorizontalScroller';

function setGeometry(el: HTMLElement, g: { scrollWidth: number; clientWidth: number; scrollLeft: number }) {
  Object.defineProperty(el, 'scrollWidth', { configurable: true, value: g.scrollWidth });
  Object.defineProperty(el, 'clientWidth', { configurable: true, value: g.clientWidth });
  Object.defineProperty(el, 'scrollLeft', { configurable: true, writable: true, value: g.scrollLeft });
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} });
  vi.stubGlobal('matchMedia', (q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {} }));
});

const cards = [1, 2, 3, 4, 5, 6].map((n) => <div key={n}>Card {n}</div>);

describe('HorizontalScroller', () => {
  it('renders every card in a labelled region', () => {
    render(<HorizontalScroller label="Skills">{cards}</HorizontalScroller>);
    expect(screen.getByRole('region', { name: 'Skills' })).toBeInTheDocument();
    expect(screen.getByText('Card 6')).toBeInTheDocument();
  });

  it('is a keyboard tab stop only when it overflows', () => {
    render(<HorizontalScroller label="Skills">{cards}</HorizontalScroller>);
    const region = screen.getByRole('region', { name: 'Skills' });
    setGeometry(region, { scrollWidth: 500, clientWidth: 500, scrollLeft: 0 });
    act(() => { fireEvent.scroll(region); });
    expect(region).not.toHaveAttribute('tabindex');
    setGeometry(region, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 0 });
    act(() => { fireEvent.scroll(region); });
    expect(region).toHaveAttribute('tabindex', '0');
  });

  it('shows no controls when everything fits', () => {
    render(<HorizontalScroller label="Skills">{cards}</HorizontalScroller>);
    const region = screen.getByRole('region', { name: 'Skills' });
    setGeometry(region, { scrollWidth: 500, clientWidth: 500, scrollLeft: 0 });
    act(() => { fireEvent.scroll(region); });
    expect(screen.queryByRole('button', { name: 'Next Skills' })).not.toBeInTheDocument();
  });

  it('disables Previous at the start and Next at the end, enables both in between', () => {
    render(<HorizontalScroller label="Skills">{cards}</HorizontalScroller>);
    const region = screen.getByRole('region', { name: 'Skills' });
    setGeometry(region, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 0 });
    act(() => { fireEvent.scroll(region); });
    expect(screen.getByRole('button', { name: 'Previous Skills' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next Skills' })).toBeEnabled();
    setGeometry(region, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 300 });
    act(() => { fireEvent.scroll(region); });
    expect(screen.getByRole('button', { name: 'Previous Skills' })).toBeEnabled();
    setGeometry(region, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 600 });
    act(() => { fireEvent.scroll(region); });
    expect(screen.getByRole('button', { name: 'Next Skills' })).toBeDisabled();
  });

  it('Next scrolls forward by one card step, smoothly unless reduced motion is on', () => {
    render(<HorizontalScroller label="Skills">{cards}</HorizontalScroller>);
    const region = screen.getByRole('region', { name: 'Skills' });
    setGeometry(region, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 0 });
    region.scrollBy = vi.fn();
    Object.defineProperty(region.children[0], 'offsetLeft', { configurable: true, value: 0 });
    Object.defineProperty(region.children[1], 'offsetLeft', { configurable: true, value: 100 });
    act(() => { fireEvent.scroll(region); });
    fireEvent.click(screen.getByRole('button', { name: 'Next Skills' }));
    expect(region.scrollBy).toHaveBeenCalledWith({ left: 100, behavior: 'smooth' });
  });

  it('uses behavior auto under reduced motion', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} }));
    render(<HorizontalScroller label="Skills">{cards}</HorizontalScroller>);
    const region = screen.getByRole('region', { name: 'Skills' });
    setGeometry(region, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 0 });
    region.scrollBy = vi.fn();
    Object.defineProperty(region.children[0], 'offsetLeft', { configurable: true, value: 0 });
    Object.defineProperty(region.children[1], 'offsetLeft', { configurable: true, value: 100 });
    act(() => { fireEvent.scroll(region); });
    fireEvent.click(screen.getByRole('button', { name: 'Next Skills' }));
    expect(region.scrollBy).toHaveBeenCalledWith({ left: 100, behavior: 'auto' });
  });
});

describe('HorizontalScroller pinned scroll-through', () => {
  const pinnedMatchMedia = (q: string) => ({
    // fine pointer with hover, motion allowed
    matches: q.includes('hover: hover') || q.includes('pointer: fine') ? true : false,
    media: q,
    addEventListener() {},
    removeEventListener() {},
  });

  function setup() {
    vi.stubGlobal('matchMedia', pinnedMatchMedia);
    render(<HorizontalScroller label="Skills">{cards}</HorizontalScroller>);
    const region = screen.getByRole('region', { name: 'Skills' });
    const outer = screen.getByTestId('hscroll-pin');
    const inner = outer.firstElementChild as HTMLElement;
    setGeometry(region, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 0 });
    Object.defineProperty(inner, 'offsetHeight', { configurable: true, value: 500 });
    act(() => { fireEvent(window, new Event('resize')); });
    return { region, outer, inner };
  }

  it('makes the wrapper tall enough that one pixel of page scroll moves the row one pixel', () => {
    const { outer } = setup();
    expect(outer.style.height).toBe('1100px'); // 500 pinned height + 600 of horizontal travel
    expect(outer.className).toContain('hscroll-pinned');
  });

  it('maps page scroll progress to the row position', () => {
    const { region, outer } = setup();
    const pinTop = parseFloat((outer.firstElementChild as HTMLElement).style.top);
    outer.getBoundingClientRect = () => ({ top: pinTop - 300 }) as DOMRect; // 300px past the pin point, travel is 600
    act(() => { fireEvent.scroll(window); });
    expect(region.scrollLeft).toBe(300);
    outer.getBoundingClientRect = () => ({ top: -9999 }) as DOMRect;
    act(() => { fireEvent.scroll(window); });
    expect(region.scrollLeft).toBe(600); // clamped at the end
    outer.getBoundingClientRect = () => ({ top: pinTop + 200 }) as DOMRect;
    act(() => { fireEvent.scroll(window); });
    expect(region.scrollLeft).toBe(0); // clamped at the start
  });

  it('turns a sideways trackpad swipe into page scroll so the two never fight', () => {
    const { region } = setup();
    window.scrollBy = vi.fn();
    const ev = new WheelEvent('wheel', { deltaX: 80, deltaY: 5, cancelable: true, bubbles: true });
    region.dispatchEvent(ev);
    expect(ev.defaultPrevented).toBe(true);
    expect(window.scrollBy).toHaveBeenCalledWith({ top: 80 });
  });

  it('arrows scroll the page by one card step while pinned', () => {
    const { region } = setup();
    window.scrollBy = vi.fn();
    Object.defineProperty(region.children[0], 'offsetLeft', { configurable: true, value: 0 });
    Object.defineProperty(region.children[1], 'offsetLeft', { configurable: true, value: 100 });
    act(() => { fireEvent.scroll(region); });
    fireEvent.click(screen.getByRole('button', { name: 'Next Skills' }));
    expect(window.scrollBy).toHaveBeenCalledWith({ top: 100, behavior: 'smooth' });
  });

  it('is not pinned under reduced motion or without a fine pointer', () => {
    vi.stubGlobal('matchMedia', (q: string) => ({ matches: q.includes('reduce'), media: q, addEventListener() {}, removeEventListener() {} }));
    render(<HorizontalScroller label="Skills">{cards}</HorizontalScroller>);
    const region = screen.getByRole('region', { name: 'Skills' });
    const outer = screen.getByTestId('hscroll-pin');
    setGeometry(region, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 0 });
    act(() => { fireEvent(window, new Event('resize')); });
    expect(outer.style.height).toBe('');
    expect(outer.className).not.toContain('hscroll-pinned');
  });

  it('re-aims an in-page anchor once the wrapper has grown, so #links still land on target', () => {
    const target = document.createElement('div');
    target.id = 'later-section';
    target.scrollIntoView = vi.fn();
    document.body.appendChild(target);
    window.location.hash = '#later-section';
    setup();
    expect(target.scrollIntoView).toHaveBeenCalledTimes(1);
    expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant', block: 'start' });
    target.remove();
    window.location.hash = '';
  });

  it('keeps the whole pinned block on screen: centred when there is room, never pushed below the fold', () => {
    const { outer, inner } = setup(); // jsdom viewport is 768 tall, the block is 500 tall
    expect(inner.style.top).toBe('134px'); // (768 - 500) / 2
    Object.defineProperty(inner, 'offsetHeight', { configurable: true, value: 700 });
    act(() => { fireEvent(window, new Event('resize')); });
    expect(inner.style.top).toBe('52px'); // 768 - 700 - 16: slides up under the header rather than being cut off
    expect(outer.style.height).toBe('1300px');
  });
});

describe('HorizontalScroller progress indicator', () => {
  it('is a progress bar that fills from empty to full, not a sliding scrollbar thumb', () => {
    render(<HorizontalScroller label="Skills">{cards}</HorizontalScroller>);
    const region = screen.getByRole('region', { name: 'Skills' });
    setGeometry(region, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 0 });
    act(() => { fireEvent.scroll(region); });
    const bar = screen.getByRole('progressbar', { name: 'Skills progress' });
    expect(bar).toHaveAttribute('aria-valuenow', '0');
    setGeometry(region, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 300 });
    act(() => { fireEvent.scroll(region); });
    expect(bar).toHaveAttribute('aria-valuenow', '50');
    expect((bar.firstElementChild as HTMLElement).style.width).toBe('50%');
    expect((bar.firstElementChild as HTMLElement).style.left).toBe('');
    setGeometry(region, { scrollWidth: 1000, clientWidth: 400, scrollLeft: 600 });
    act(() => { fireEvent.scroll(region); });
    expect(bar).toHaveAttribute('aria-valuenow', '100');
  });

  it('shows how many cards have been reached, "4 / 6" at the start and "6 / 6" at the end', () => {
    render(<HorizontalScroller label="Skills">{cards}</HorizontalScroller>);
    const region = screen.getByRole('region', { name: 'Skills' });
    [0, 100, 200, 300, 400, 500].forEach((left, i) => Object.defineProperty(region.children[i], 'offsetLeft', { configurable: true, value: left }));
    setGeometry(region, { scrollWidth: 600, clientWidth: 400, scrollLeft: 0 });
    act(() => { fireEvent.scroll(region); });
    expect(screen.getByText('4 / 6')).toBeInTheDocument();
    setGeometry(region, { scrollWidth: 600, clientWidth: 400, scrollLeft: 200 });
    act(() => { fireEvent.scroll(region); });
    expect(screen.getByText('6 / 6')).toBeInTheDocument();
  });
});
