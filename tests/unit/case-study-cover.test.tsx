import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { CaseStudyCard } from '@/components/pages/case-studies/CaseStudyCard';
import { CASE_STUDIES } from '@/components/pages/case-studies/content';
import { CARD_GRID_SIZES } from '@/components/shared/card-sizes';

afterEach(cleanup);

describe('case study card cover', () => {
  it.each(CASE_STUDIES.map((s) => s.slug))('%s shows its own thumbnail instead of the organisation tile', (slug) => {
    const study = CASE_STUDIES.find((s) => s.slug === slug)!;
    const { container } = render(<CaseStudyCard study={study} />);
    const cover = container.querySelector('.cs-cover')!; // the chamfered corners and their hover effect hang off this class
    expect(cover.tagName).toBe('IMG');
    expect(cover.getAttribute('alt')).toBe(''); // the headline is the text under the card
    expect(decodeURIComponent(cover.getAttribute('src')!)).toContain(study.cover);
    expect(cover.getAttribute('sizes')).toBe(CARD_GRID_SIZES);
    expect(cover.textContent).toBe('');
  });

  it('uses a different thumbnail for the therapy centre and the school', () => {
    expect(CASE_STUDIES.find((s) => s.group === 'Therapy centres')!.cover).toBe('/images/case-studies/therapy-centre.webp');
    expect(CASE_STUDIES.find((s) => s.group === 'Schools')!.cover).toBe('/images/case-studies/school.webp');
  });

  it('is still one link to the study, with its tag, headline and Read more', () => {
    const study = CASE_STUDIES[0];
    const { container } = render(<CaseStudyCard study={study} />);
    expect(container.querySelector('a')!.getAttribute('href')).toBe(`/case-studies/${study.slug}`);
    expect(container.textContent).toContain(study.group);
    expect(container.textContent).toContain(study.headline);
    expect(container.textContent).toContain('Read more');
  });
});
