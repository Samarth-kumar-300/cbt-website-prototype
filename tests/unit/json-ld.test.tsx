import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { JsonLd } from '@/components/shared/JsonLd';

afterEach(cleanup);

describe('JsonLd', () => {
  it('renders the data as an ld+json script', () => {
    const { container } = render(<JsonLd data={{ '@type': 'Thing', name: 'A' }} />);
    const script = container.querySelector('script[type="application/ld+json"]')!;
    expect(JSON.parse(script.textContent ?? '')).toEqual({ '@type': 'Thing', name: 'A' });
  });
  it('escapes "<" so a value cannot close the script tag', () => {
    const { container } = render(<JsonLd data={{ name: '</script><b>x' }} />);
    const raw = container.querySelector('script')!.textContent ?? '';
    expect(raw).not.toContain('</script>');
    expect(raw).toContain('\\u003c');
    expect(JSON.parse(raw).name).toBe('</script><b>x');
  });
});
