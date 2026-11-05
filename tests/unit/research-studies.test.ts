import { describe, expect, it } from 'vitest';
import { researchCards } from '@/components/pages/research/content';
import { getStudy, STUDIES } from '@/components/pages/research/studies';

const [observational, cohort, patent] = STUDIES;

describe('research studies', () => {
  it('has one study per Research card, in the same order, at the card hrefs', () => {
    expect(STUDIES.map((s) => `/research/${s.slug}`)).toEqual(researchCards.map((c) => c.href));
    for (const c of researchCards) expect(getStudy(c.href.replace('/research/', ''))).toBeDefined();
  });

  it('returns undefined for an unknown slug', () => {
    expect(getStudy('not-a-study')).toBeUndefined();
  });

  it('gives every study a title, a status line, a button and at least one heading', () => {
    for (const s of STUDIES) {
      expect(s.title).not.toBe('');
      expect(s.status).not.toBe('');
      expect(s.button.href).toMatch(/^https:\/\//);
      expect(s.blocks.some((b) => b.type === 'heading')).toBe(true);
    }
  });

  it('carries the 12-month study findings from the live page', () => {
    const lists = observational.blocks.filter((b) => b.type === 'list');
    expect(lists.flatMap((l) => (l.type === 'list' ? l.items : []))).toContain('Social Age increased by 56.84%');
    expect(observational.status).toBe('Status: Published in JMIR Neurotechnology, 2025; DOI: 10.2196/70589');
    expect(observational.button.label).toBe('View research paper');
  });

  it('carries the cohort study findings and institution from the live page', () => {
    const items = cohort.blocks.flatMap((b) => (b.type === 'list' ? b.items : []));
    expect(items).toContain('Independent task completion increased by 59.56%');
    expect(cohort.blocks).toContainEqual({ type: 'paragraph', text: 'National Institute for the Empowerment of Persons with Intellectual Disabilities (NIEPID), Ministry of Social Justice & Empowerment, Govt. of India' });
    expect(cohort.status).toBe('Status: Completed at NIEPID, 2025');
  });

  it('carries the patent facts and links to the patent PDF', () => {
    expect(patent.blocks.map((b) => (b.type === 'heading' ? b.text : null)).filter(Boolean)).toEqual(['Patentee', 'Granted By', 'Patent No.', 'What This Patent Covers', 'Why It Matters']);
    expect(patent.status).toBe('Patent No. 586929 - Granted by the Patent Office, Government of India');
    expect(patent.button).toEqual({ label: 'View patent details', href: 'https://d2gq2a16cq5v8g.cloudfront.net/documents/CognitiveBotics_India_Patent.pdf' });
  });
});
