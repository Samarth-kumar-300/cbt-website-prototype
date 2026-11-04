import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { CaseStudyList } from '@/components/pages/case-studies/CaseStudyList';
import { CASE_STUDIES, type CaseStudy } from '@/components/pages/case-studies/content';

afterEach(cleanup);

const many = (n: number): CaseStudy[] => Array.from({ length: n }, (_, i) => ({ ...CASE_STUDIES[0], slug: `study-${i}`, org: `Centre ${i}` }));

describe('CaseStudyList', () => {
  it('shows three rows of three, then the rest after Show more', async () => {
    render(<CaseStudyList studies={many(10)} />);
    expect(screen.getAllByRole('link', { name: /Read more/ })).toHaveLength(9);
    await userEvent.click(screen.getByRole('button', { name: 'Show more' }));
    expect(screen.getAllByRole('link', { name: /Read more/ })).toHaveLength(10);
    expect(screen.queryByRole('button', { name: 'Show more' })).toBeNull();
  });

  it('has no Show more button for nine or fewer', () => {
    render(<CaseStudyList studies={many(9)} />);
    expect(screen.queryByRole('button', { name: 'Show more' })).toBeNull();
  });

  it('shows the read time beside each tag', () => {
    render(<CaseStudyList studies={many(2)} />);
    expect(screen.getAllByText(/^\d+ min read$/)).toHaveLength(2);
  });
});
