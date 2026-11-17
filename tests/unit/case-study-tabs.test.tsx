import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CaseStudyTabs } from '@/components/pages/case-studies/CaseStudyTabs';
import { CASE_STUDIES, caseStudySections, getCaseStudy } from '@/components/pages/case-studies/content';

afterEach(cleanup);

describe('caseStudySections', () => {
  it('lists every section the Manasa study shows (it has no features list), in page order', () => {
    const ids = caseStudySections(getCaseStudy('manasa-institute')!).map((s) => s.id);
    expect(ids).toEqual(['challenge', 'solution', 'adoption', 'outcomes', 'about']);
  });

  it('uses short labels so a tab never wraps', () => {
    const labels = caseStudySections(getCaseStudy('manasa-institute')!).map((s) => s.label);
    expect(labels).toEqual(['Challenge', 'Solution', 'Adoption', 'Results', 'About']);
  });

  it('leaves out sections a study does not have', () => {
    const bare = { ...getCaseStudy('manasa-institute')!, steps: undefined, solution: undefined, adoption: undefined, outcomes: undefined, about: undefined };
    expect(caseStudySections(bare).map((s) => s.label)).toEqual(['Challenge']);
    expect(caseStudySections({ ...bare, features: ['One'] }).map((s) => s.label)).toEqual(['Challenge', 'Features used']);
  });

  it('never gives a metric a before and after arrow that wraps', () => {
    for (const s of CASE_STUDIES) for (const m of s.metrics) expect(m.value).not.toContain('→');
  });
});

describe('CaseStudyTabs', () => {
  const sections = [
    { id: 'challenge', label: 'Challenge' },
    { id: 'solution', label: 'Solution' },
  ];

  beforeEach(() => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;
    sections.forEach((s, i) => {
      const el = document.createElement('section');
      el.id = s.id;
      el.scrollIntoView = vi.fn();
      // jsdom has no layout: the first section is at the top, the rest are below the reading line.
      el.getBoundingClientRect = () => ({ top: i === 0 ? 0 : 900 }) as DOMRect;
      document.body.appendChild(el);
    });
  });
  afterEach(() => {
    document.body.querySelectorAll('section').forEach((el) => el.remove());
  });

  it('renders one link per section inside a named nav, with the first marked current', () => {
    render(<CaseStudyTabs sections={sections} />);
    expect(screen.getByRole('navigation', { name: 'Sections' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Challenge' }).getAttribute('href')).toBe('#challenge');
    expect(screen.getByRole('link', { name: 'Challenge' }).getAttribute('aria-current')).toBe('true');
    expect(screen.getByRole('link', { name: 'Solution' }).getAttribute('aria-current')).toBeNull();
  });

  it('scrolls to the section and marks its tab current when clicked', () => {
    render(<CaseStudyTabs sections={sections} />);
    fireEvent.click(screen.getByRole('link', { name: 'Solution' }));
    expect(document.getElementById('solution')!.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(screen.getByRole('link', { name: 'Solution' }).getAttribute('aria-current')).toBe('true');
  });
});
