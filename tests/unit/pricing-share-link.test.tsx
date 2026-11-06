import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ShareLink } from '@/components/pages/pricing/sections/ShareLink';

afterEach(() => vi.unstubAllGlobals());
const click = async () => act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Share it' })); });

describe('ShareLink', () => {
  it('uses the share sheet when there is one', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, share });
    render(<ShareLink label="Share it" text="Hello" path="/parents" />);
    await click();
    expect(share).toHaveBeenCalledWith({ title: 'CognitiveBotics', text: 'Hello', url: `${location.origin}/parents` });
    expect(screen.getByRole('status')).toHaveTextContent('');
  });
  it('copies the link when there is no share sheet', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { ...navigator, share: undefined, clipboard: { writeText } });
    render(<ShareLink label="Share it" text="Hello" path="/parents" />);
    await click();
    expect(writeText).toHaveBeenCalledWith(`${location.origin}/parents`);
    expect(screen.getByRole('status')).toHaveTextContent('Link copied');
  });
  it('says so when neither works, without throwing', async () => {
    vi.stubGlobal('navigator', { ...navigator, share: undefined, clipboard: undefined });
    render(<ShareLink label="Share it" text="Hello" path="/parents" />);
    await click();
    expect(screen.getByRole('status')).toHaveTextContent(`Copy this link: ${location.origin}/parents`);
  });
  it('stays quiet when the visitor closes the share sheet', async () => {
    vi.stubGlobal('navigator', { ...navigator, share: vi.fn().mockRejectedValue(new DOMException('x', 'AbortError')) });
    render(<ShareLink label="Share it" text="Hello" path="/parents" />);
    await click();
    expect(screen.getByRole('status')).toHaveTextContent('');
  });
});
