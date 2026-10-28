import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Placeholder } from '@/components/shared/Placeholder';

describe('Placeholder', () => {
  it('fills its sized parent when no ratio is given, like next/image fill', () => {
    render(<Placeholder label="Image" className="object-contain" />);
    const el = screen.getByTestId('placeholder');
    expect(el.className).toContain('absolute');
    expect(el.className).toContain('inset-0');
    expect(el.className).toContain('h-full');
    expect(el.className).toContain('w-full');
  });

  it('keeps its own aspect ratio and stays in flow when a ratio is given', () => {
    render(<Placeholder label="Quote" ratio={1.24} className="w-[31px]" />);
    const el = screen.getByTestId('placeholder');
    expect(el.style.aspectRatio).toMatch(/^1\.24/);
    expect(el.className).not.toContain('absolute');
  });

  it('lets a caller-set width win over the ratio default, so a 31px quote mark stays 31px', () => {
    render(<Placeholder label="Quote" ratio={1.24} className="h-[24.5px] w-[31px]" />);
    expect(screen.getByTestId('placeholder').className).not.toMatch(/(^|\s)w-full(\s|$)/);
  });

  it('keeps the label as its accessible name', () => {
    render(<Placeholder label="Hunny Agarwal" />);
    expect(screen.getByRole('img', { name: 'Hunny Agarwal' })).toBeInTheDocument();
  });
});
