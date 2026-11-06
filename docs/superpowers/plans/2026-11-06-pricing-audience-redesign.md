# Pricing Audience Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/pricing` as one page with a Therapy Centres / Schools switch, following the IA of the two mocks in `illustrations/` and the visual language of the rest of the site.

**Architecture:** The server renders the shared hero, then both audience panels. A small client `AudienceTabs` uses the shared `Chips` tablist to show one panel and keeps `?for=` in the URL. The page reads `searchParams.for` on the server so deep links arrive on the right tab. The Therapy Centres skills scroller and the Home testimonials become shared components that both their original pages and Pricing render.

**Tech Stack:** Next.js 16 App Router (async `searchParams`), React 19, Tailwind v4, GSAP ScrollTrigger, Vitest + Testing Library (jsdom), Playwright.

**Spec:** `docs/superpowers/specs/2026-11-06-pricing-audience-redesign-design.md`. Its "Corrections found while planning" section overrides the sections above it.

## Global Constraints

- Copy comes verbatim from the spec. Pricing copy has no en dash, em dash or `!`: ranges use a hyphen ("10-15%", "UK-India").
- Colours, radii, borders and shadows come only from existing tokens or classes already used on the site (`brand-teal`, `brand-teal-100`, `brand-subtle-bg`, `brand-dark`, `content-brand`, `content-brand-secondary`, `text-default`, `text-secondary`, `#e4ded4`, lavender `#f6e8f7`/`#ead3ee`).
- Motion only through `Reveal`, `RevealStagger`, `TextReveal` and the existing scroller and rail.
- Page components return `<section>` elements only, with no `<main>`, header or footer.
- `pricingFaq` and `pricingJsonLd` stay exported and unchanged (they feed `/faqs`).
- Home (`/`) and Therapy Centres (`/therapy-centres`) must look and behave the same after the extractions.
- Never `git push`. Commit only if Samarth asks; otherwise leave changes staged-free in the working tree and list them at the end. (Commit steps below are written as "Checkpoint": run them only with permission.)
- Run `npm run build` before declaring done.

## Review Focus

1. **Deep link with a bad or repeated value** (`?for=SCHOOLS`, `?for=schools&for=x`, `?for=`): the page renders Therapy Centres, or Schools for the first `schools`, and never crashes. Covered in Task 3 (`parseAudience`).
2. **Switching tabs after scrolling**: the newly shown panel's skills scroller must measure its width and the page must not jump. Covered in Task 5 (ScrollTrigger refresh, replaceState without scroll) and the Task 6 e2e check.
3. **Hidden panel leaking into assistive tech or tab order**: the inactive panel uses `hidden`. Covered in Task 5 unit test.
4. **Share link where neither Web Share nor clipboard works** (http, old browser): it shows a fallback message and never throws. Covered in Task 4 test.
5. **Pending FAQ answers reaching `/faqs` or JSON-LD**: the new FAQs never touch `pricingFaq`. Covered in Task 3 test.

---

## File map

| Path | Action | Responsibility |
|---|---|---|
| `lib/skills.ts` | create | The 10 skill cards as data |
| `components/shared/SkillsScroller.tsx` | create | Skills section (heading, scroller, cards) |
| `components/pages/therapy-centres/sections/Section2.tsx` | rewrite | Renders `<SkillsScroller />` |
| `components/shared/TestimonialRail.tsx` | move from `components/pages/home/` | Desktop rail, now takes `quotes` |
| `components/shared/TestimonialsSection.tsx` | create | Home testimonial section with props |
| `components/pages/home/sections/Section5.tsx` | rewrite | Renders `<TestimonialsSection />` |
| `components/pages/pricing/icons.ts` | create | Icon data for the 6 platform cards |
| `components/pages/pricing/content.ts` | rewrite | Hero copy, `audiences`, `parseAudience`, keeps `pricingFaq` |
| `components/pages/pricing/sections/Check.tsx` | create | Teal check icon |
| `components/pages/pricing/sections/Hero.tsx` | create | Shared hero |
| `components/pages/pricing/sections/Intro.tsx` | create | H2, lede, 6 cards |
| `components/pages/pricing/sections/Gets.tsx` | create | "What your centre/school gets" |
| `components/pages/pricing/sections/Plans.tsx` | create | Plans heading + `PlanGrid` |
| `components/pages/pricing/sections/ParentsPanel.tsx` | create | Parents app panel |
| `components/pages/pricing/sections/ShareLink.tsx` | create | Client share button |
| `components/pages/pricing/sections/Faq.tsx` | create | FAQ section |
| `lib/app-links.ts` | create | Store URLs |
| `components/pages/pricing/AudienceTabs.tsx` | create | Client switch + panels |
| `components/pages/pricing/PricingPage.tsx` | rewrite | Composes everything |
| `app/pricing/page.tsx` | rewrite | Reads `searchParams.for` |
| `app/globals.css` | modify | Panel fade keyframes |
| `components/pages/pricing/sections/Section0-3.tsx` | delete | Old sections |
| `tests/unit/skills.test.ts` | create | |
| `tests/unit/testimonials-section.test.tsx` | create | |
| `tests/unit/pricing-content.test.ts` | rewrite | |
| `tests/unit/pricing-plans.test.tsx` | rewrite | |
| `tests/unit/pricing-share-link.test.tsx` | create | |
| `tests/unit/pricing-tabs.test.tsx` | create | |
| `tests/unit/learn-cta-copy.test.ts` | modify | Uses the per-audience CTAs |
| `tests/e2e/pricing.spec.ts` | rewrite | |

Screenshot helper used in Tasks 1, 2 and 6. Save it outside the repo as `$SCRATCH/shot.mjs` and run it from the repo root with `node --input-type=module` so `playwright` resolves:

```js
// usage: node --input-type=module -e "$(cat $SCRATCH/shot.mjs)" <baseUrl> <outDir> <tag> <width> <path...>
import { chromium } from 'playwright';
const [base, out, tag, width, ...paths] = process.argv.slice(1);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: Number(width), height: 900 } });
await p.addInitScript(() => localStorage.setItem('cb-cookie-consent', 'rejected'));
await p.emulateMedia({ reducedMotion: 'reduce' });
for (const path of paths) {
  await p.goto(base + path, { waitUntil: 'networkidle', timeout: 120000 });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await p.waitForTimeout(800);
  const name = (path === '/' ? 'home' : path.replace(/[/?=&]/g, '_').replace(/^_/, '')) + `_${width}_${tag}.png`;
  await p.screenshot({ path: `${out}/${name}`, fullPage: true });
  console.log(name);
}
await b.close();
```

Pixel diff (prints `None` when identical):

```bash
python3 -c "from PIL import Image, ImageChops; import sys; a=Image.open(sys.argv[1]).convert('RGB'); b=Image.open(sys.argv[2]).convert('RGB'); print(a.size, b.size, ImageChops.difference(a,b).getbbox() if a.size==b.size else 'size differs')" A.png B.png
```

---

### Task 1: Shared skills scroller

**Files:**
- Create: `lib/skills.ts`, `components/shared/SkillsScroller.tsx`, `tests/unit/skills.test.ts`
- Modify: `components/pages/therapy-centres/sections/Section2.tsx` (whole file)

**Interfaces:**
- Produces: `SKILLS: readonly Skill[]`, `type Skill = { id; title; body; image; alt }` from `@/lib/skills`; `SkillsScroller({ heading?, className? })` and `SKILLS_HEADING` from `@/components/shared/SkillsScroller`.

- [ ] **Step 0: Baseline screenshots** (dev server on 3456: `npm run dev -- -p 3456`)

Run: `node --input-type=module -e "$(cat $SCRATCH/shot.mjs)" http://localhost:3456 $SCRATCH before 1440 /therapy-centres / && node --input-type=module -e "$(cat $SCRATCH/shot.mjs)" http://localhost:3456 $SCRATCH before 375 /therapy-centres /`
Expected: four `*_before.png` files.

- [ ] **Step 1: Write the failing test** `tests/unit/skills.test.ts`

```ts
import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SKILLS } from '@/lib/skills';

describe('SKILLS', () => {
  it('lists the ten skill cards in the Therapy Centres order', () => {
    expect(SKILLS.map((s) => s.title)).toEqual([
      'Reading & Writing', 'Arithmetic Skill', 'Visual Skill', 'Social Skill', 'Play Skill',
      'Self-Help Skill', 'Attending Skill', 'Imitation Skill', 'Receptive Skill', 'Expressive Skill',
    ]);
  });
  it('points every card at an image that exists, with alt text and a description', () => {
    for (const s of SKILLS) {
      expect(existsSync(`public${s.image}`), s.image).toBe(true);
      expect(s.alt).toBe(`${s.title} illustration`);
      expect(s.body.length).toBeGreaterThan(10);
    }
  });
});
```

- [ ] **Step 2: Run it, expect FAIL** — `npx vitest run tests/unit/skills.test.ts` → "Cannot find module '@/lib/skills'".

- [ ] **Step 3: Create `lib/skills.ts`**

```ts
export type Skill = {
  readonly id: string;
  readonly title: string;
  readonly body: string;
  /** Path under /public. */
  readonly image: string;
  readonly alt: string;
};

const skill = (id: string, title: string, body: string): Skill => ({
  id,
  title,
  body,
  image: `/images/therapy-centres/skills/${id}.webp`,
  alt: `${title} illustration`,
});

// The 10 skill areas, in the order the Therapy Centres page shows them. Pricing reuses the same cards.
export const SKILLS: readonly Skill[] = [
  skill('reading-writing', 'Reading & Writing', 'Builds reading, writing and comprehension skills.'),
  skill('arithmetic', 'Arithmetic Skill', 'Develops basic maths and problem-solving skills.'),
  skill('visual', 'Visual Skill', 'Helps children interpret visual information.'),
  skill('social', 'Social Skill', 'Builds communication and positive social interaction.'),
  skill('play', 'Play Skill', 'Encourages imaginative play, creativity and problem-solving.'),
  skill('self-help', 'Self-Help Skill', 'Builds independence in everyday activities.'),
  skill('attending', 'Attending Skill', 'Improves focus and attention during activities.'),
  skill('imitation', 'Imitation Skill', 'Encourages learning by observing and copying others.'),
  skill('receptive', 'Receptive Skill', 'Supports understanding of speech and instructions.'),
  skill('expressive', 'Expressive Skill', 'Helps communicate thoughts, needs and emotions.'),
];
```

- [ ] **Step 4: Create `components/shared/SkillsScroller.tsx`** (classes copied verbatim from the current Therapy Centres Section2)

```tsx
import Image from "next/image";
import { SKILLS } from "@/lib/skills";
import { HorizontalScroller } from "./HorizontalScroller";
import { TextReveal } from "./TextReveal";

export const SKILLS_HEADING = "Skills empowering every child’s journey";

// The illustrated skills row from Therapy Centres, shared with Pricing.
export function SkillsScroller({
  heading = SKILLS_HEADING,
  className = "bg-white px-5 pt-14 pb-14 lg:px-24 lg:pt-8 lg:pb-24",
}: {
  heading?: string;
  className?: string;
}) {
  return (
    <section className={className}>
      <HorizontalScroller
        label="Skills"
        className="mx-auto max-w-[1248px]"
        bodyClassName="mt-6"
        header={<TextReveal as="h2" split="words" trigger="scroll" className="max-w-[900px] font-heading text-[24px] font-semibold leading-[32px] text-content-brand-alt lg:text-[40px] lg:leading-[48px] lg:text-brand-teal">{heading}</TextReveal>}
      >
        {SKILLS.map((s) => (
          <div key={s.id} className="flex flex-col items-start gap-[10px] rounded-[16px] border border-[#e4edea] bg-white p-[14px] transition-colors lg:items-center lg:gap-[14px] lg:rounded-[18px] lg:border-brand-teal-100 lg:px-5 lg:pt-5 lg:pb-[22px] lg:hover:bg-background-brand-subtle">
            <div data-motion-image className="relative h-[137px] w-full shrink-0 overflow-hidden rounded-[12px] lg:h-[180px] lg:rounded-none">
              <Image src={s.image} alt={s.alt} fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-contain" />
            </div>
            <p className="w-full font-heading text-[16px] font-bold leading-[27px] text-content-brand-alt lg:text-[20px] lg:leading-[26px] lg:text-brand-teal">
              {s.title}
            </p>
            <p className="w-full text-balance text-[14px] leading-[20px] text-text-secondary lg:text-[18px] lg:leading-[27px] lg:text-text-default">
              {s.body}
            </p>
          </div>
        ))}
      </HorizontalScroller>
    </section>
  );
}
```

- [ ] **Step 5: Replace `components/pages/therapy-centres/sections/Section2.tsx`**

```tsx
import { SkillsScroller } from "@/components/shared/SkillsScroller";

export function Section2() {
  return <SkillsScroller />;
}
```

- [ ] **Step 6: Run tests, expect PASS** — `npx vitest run tests/unit/skills.test.ts` and `npm run lint`.

- [ ] **Step 7: Visual parity** — take `after` shots of `/therapy-centres` at 1440 and 375 (Step 0 command with tag `after`) and diff each pair. Expected: `None`. If a box is reported, open both crops and fix the markup until identical.

- [ ] **Checkpoint** (only with permission): `git add lib/skills.ts components/shared/SkillsScroller.tsx components/pages/therapy-centres/sections/Section2.tsx tests/unit/skills.test.ts && git commit -m "refactor: share the skills scroller"`

---

### Task 2: Shared testimonials section

**Files:**
- Move: `components/pages/home/TestimonialRail.tsx` → `components/shared/TestimonialRail.tsx`
- Create: `components/shared/TestimonialsSection.tsx`, `tests/unit/testimonials-section.test.tsx`
- Modify: `components/pages/home/sections/Section5.tsx` (whole file)

**Interfaces:**
- Produces: `pickTestimonials(order?: readonly string[]): Testimonial[]` (throws `Unknown testimonial: <id>`), `TestimonialsSection({ heading, railOrder?, slideOrder?, showMark? })`, `TestimonialRail({ quotes? })`.

- [ ] **Step 1: Write the failing test** `tests/unit/testimonials-section.test.tsx`

```tsx
import { describe, expect, it } from 'vitest';
import { pickTestimonials } from '@/components/shared/TestimonialsSection';
import { TESTIMONIALS } from '@/lib/testimonials';

describe('pickTestimonials', () => {
  it('returns every testimonial in data order when no order is given', () => {
    expect(pickTestimonials().map((t) => t.id)).toEqual(TESTIMONIALS.map((t) => t.id));
  });
  it('follows the given order', () => {
    expect(pickTestimonials(['pavani', 'tejaswi']).map((t) => t.id)).toEqual(['pavani', 'tejaswi']);
  });
  it('throws on an unknown id so a typo cannot silently drop a quote', () => {
    expect(() => pickTestimonials(['nobody'])).toThrow('Unknown testimonial: nobody');
  });
});
```

- [ ] **Step 2: Run it, expect FAIL** — module not found.

- [ ] **Step 3: Move the rail and add `quotes`**

Run: `git mv components/pages/home/TestimonialRail.tsx components/shared/TestimonialRail.tsx`

Edit `components/shared/TestimonialRail.tsx`:
- import line becomes `import { TESTIMONIALS, VIDEO_TESTIMONIAL, type Testimonial } from "@/lib/testimonials";`
- signature becomes `export function TestimonialRail({ quotes = TESTIMONIALS }: { quotes?: readonly Testimonial[] }) {`
- inside the render, `{TESTIMONIALS.map((q) => (` becomes `{quotes.map((q) => (`

- [ ] **Step 4: Create `components/shared/TestimonialsSection.tsx`**

```tsx
import Image from "next/image";
import { TESTIMONIALS, VIDEO_TESTIMONIAL, type Testimonial } from "@/lib/testimonials";
import { TestimonialCarousel } from "./TestimonialCarousel";
import { TestimonialRail } from "./TestimonialRail";
import { TextReveal } from "./TextReveal";
import { VideoTestimonialCard } from "./VideoTestimonialCard";

export function pickTestimonials(order?: readonly string[]): Testimonial[] {
  if (!order) return [...TESTIMONIALS];
  return order.map((id) => {
    const t = TESTIMONIALS.find((x) => x.id === id);
    if (!t) throw new Error(`Unknown testimonial: ${id}`);
    return t;
  });
}

function QuoteSlide({ q }: { q: Testimonial }) {
  return (
    <div className="flex w-full flex-col gap-[14px] rounded-[20px] bg-white px-5 pb-[22px] pt-[34px] shadow-[0px_6px_20px_0px_rgba(15,74,77,0.05)]">
      <span aria-hidden="true" className="block h-[17px] w-[21px] font-heading text-[54px] font-extrabold leading-[17px]" style={{ color: q.color }}>
        “
      </span>
      <p className="text-[14px] leading-[22px] text-text-default">{q.text}</p>
      <div className="mt-auto flex items-center gap-3">
        <Image src={`/images/homepage/avatars/${q.avatar}.webp`} alt="" width={48} height={48} className="size-12 shrink-0 rounded-full ring-1 ring-[#e4ded4]" />
        <div className="flex flex-col gap-[2px]">
          <p className="font-heading text-[14px] font-bold leading-[normal] text-brand-teal">{q.name}</p>
          <p className="text-[14px] leading-[21px] text-[#646871]">{q.role}</p>
        </div>
      </div>
    </div>
  );
}

// The Home testimonial section: video card plus drifting rail on desktop, carousel on mobile.
// `railOrder` and `slideOrder` pick and order the family quotes; the video card always leads.
export function TestimonialsSection({
  heading,
  railOrder,
  slideOrder = railOrder,
  showMark = false,
}: {
  heading: string;
  railOrder?: readonly string[];
  slideOrder?: readonly string[];
  showMark?: boolean;
}) {
  const rail = pickTestimonials(railOrder);
  const slides = pickTestimonials(slideOrder);
  return (
    <section style={{ background: "linear-gradient(90deg, #f8eaf2 0%, #f4eff6 50%, #eaf5f2 100%)" }}>
      <div className="hidden flex-col gap-10 py-[84px] lg:flex">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-24">
          <TextReveal as="h2" split="words" trigger="scroll" media="(min-width: 1024px)" className="font-heading text-[48px] font-semibold leading-[58px] text-brand-teal">
            {heading}
          </TextReveal>
          {showMark ? <Image src="/images/homepage/home-cb-mark.webp" alt="" width={52} height={47} className="shrink-0" /> : null}
        </div>
        <TestimonialRail quotes={rail} />
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col items-start gap-6 px-5 py-14 lg:hidden">
        <TextReveal as="h2" split="words" trigger="scroll" media="(max-width: 1023px)" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal">
          {heading}
        </TextReveal>
        <TestimonialCarousel
          slides={[
            <VideoTestimonialCard key={VIDEO_TESTIMONIAL.id} video={VIDEO_TESTIMONIAL} variant="slide" />,
            ...slides.map((q) => <QuoteSlide key={q.id} q={q} />),
          ]}
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Replace `components/pages/home/sections/Section5.tsx`**

```tsx
import { TestimonialsSection } from "@/components/shared/TestimonialsSection";

// Mobile slides keep the order the Home carousel has always used; the desktop rail uses data order.
export function Section5() {
  return (
    <TestimonialsSection
      heading="Real experiences from the families we support"
      slideOrder={["mounila", "tejaswi", "chandrashekhar", "pavani"]}
      showMark
    />
  );
}
```

Check: `grep -rn "home/TestimonialRail" components app tests` returns nothing.

- [ ] **Step 6: Run tests, expect PASS** — `npx vitest run tests/unit/testimonials-section.test.tsx` and `npm run lint`.

- [ ] **Step 7: Visual parity** — `after` shots of `/` at 1440 and 375, diff against Step 0 of Task 1. Expected: `None`. (Reduced motion is on, so the rail does not drift.)

- [ ] **Checkpoint**: `git add -A components/shared components/pages/home tests/unit/testimonials-section.test.tsx && git commit -m "refactor: share the testimonials section"`

---

### Task 3: Pricing content and icons

**Files:**
- Create: `components/pages/pricing/icons.ts`
- Rewrite: `components/pages/pricing/content.ts`, `tests/unit/pricing-content.test.ts`
- Modify: `tests/unit/learn-cta-copy.test.ts`

**Interfaces:**
- Consumes: `FaqCardItem`, `FaqCardIcon` from `@/components/shared/FaqCards`; `pickTestimonials` (test only).
- Produces (from `components/pages/pricing/content.ts`):
  - `type AudienceId = 'therapy-centres' | 'schools'`, `AUDIENCE_IDS`, `DEFAULT_AUDIENCE`, `parseAudience(v: string | string[] | undefined): AudienceId`
  - `PENDING_ANSWER = 'Answer coming soon.'`
  - `hero` (eyebrow, titleLead, titleAccent, subtitle, partner, proofs)
  - `type Feature`, `type PlanCard`, `type Audience`, `audiences: Record<AudienceId, Audience>`
  - `parentsPanel`
  - `pricingContent = { hero, audiences, parentsPanel }` and `pricingFaq` (unchanged)
- Produces (from `icons.ts`): `type PricingIconId`, `PRICING_ICONS: Record<PricingIconId, FaqCardIcon>`

- [ ] **Step 1: Write the failing test** `tests/unit/pricing-content.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { AUDIENCE_IDS, PENDING_ANSWER, audiences, hero, parentsPanel, parseAudience, pricingFaq } from '@/components/pages/pricing/content';
import { pricingJsonLd } from '@/components/pages/pricing/seo';
import { faq as therapyFaq } from '@/components/pages/therapy-centres/content';
import { pickTestimonials } from '@/components/shared/TestimonialsSection';

describe('parseAudience', () => {
  it('reads schools and falls back to therapy centres for anything else', () => {
    expect(parseAudience('schools')).toBe('schools');
    expect(parseAudience(['schools', 'x'])).toBe('schools');
    for (const v of [undefined, '', 'SCHOOLS', 'parents', ['x', 'schools']]) expect(parseAudience(v as never)).toBe('therapy-centres');
  });
});

describe('audiences', () => {
  const tc = audiences['therapy-centres'];
  const sc = audiences.schools;
  it('has both audiences in tab order', () => {
    expect(AUDIENCE_IDS).toEqual(['therapy-centres', 'schools']);
    expect(AUDIENCE_IDS.map((id) => audiences[id].tabLabel)).toEqual(['Therapy Centres', 'Schools']);
  });
  it('gives each audience 6 platform cards and 3 "gets" items', () => {
    for (const a of [tc, sc]) {
      expect(a.features).toHaveLength(6);
      expect(a.gets.items).toHaveLength(3);
    }
  });
  it('has two plans for centres and three for schools, Bloom last', () => {
    expect(tc.plans.map((p) => p.id)).toEqual(['basic', 'custom']);
    expect(sc.plans.map((p) => p.id)).toEqual(['basic', 'custom', 'bloom']);
  });
  it('links the plan buttons to the forms that understand them', () => {
    for (const a of [tc, sc]) {
      expect(a.plans[0].cta).toEqual({ label: 'Book a demo', href: '/try-demo?plan=basic', variant: 'solid' });
      expect(a.plans[1].cta).toEqual({ label: 'Contact us', href: '/try-demo?plan=custom', variant: 'outline' });
      expect(a.cta.href).toBe('/contact-us');
    }
    expect(sc.plans[2].cta).toEqual({ label: 'Contact us', href: '/contact-us', variant: 'solid' });
  });
  it('prices Basic at 2,000 per user per month, up to 5 users, excluding taxes', () => {
    for (const a of [tc, sc]) expect(a.plans[0]).toMatchObject({ price: '₹2,000', unit: '/user/month', meta: 'Up to 5 users', metaNote: 'Excluding taxes' });
  });
  it('has 7 centre and 9 school questions, all pending except the branch answer', () => {
    expect(tc.faq).toHaveLength(7);
    expect(sc.faq).toHaveLength(9);
    expect(tc.faq.filter((f) => f.a === PENDING_ANSWER)).toHaveLength(6);
    expect(sc.faq.filter((f) => f.a === PENDING_ANSWER)).toHaveLength(9);
    expect(tc.faq[1].a).toContain('Each branch needs its own licence per access.');
  });
  it('orders testimonials with ids that exist', () => {
    for (const a of [tc, sc]) expect(() => pickTestimonials(a.testimonials.order)).not.toThrow();
    expect(tc.testimonials.order[0]).toBe('chandrashekhar');
    expect(sc.testimonials.order[0]).toBe('pavani');
  });
  it('gives the two closing panels different headings', () => {
    expect(tc.cta.heading).not.toBe(sc.cta.heading);
  });
  it('uses no en or em dashes or exclamation marks anywhere', () => {
    expect(JSON.stringify({ hero, audiences, parentsPanel, pricingFaq })).not.toMatch(/[—–!]/);
  });
});

describe('pricingFaq (feeds /faqs, must not change)', () => {
  it('still has the four answered questions', () => {
    expect(pricingFaq).toHaveLength(4);
    for (const f of pricingFaq) expect(f.a).not.toBe(PENDING_ANSWER);
    for (const q of ['Is there published research behind this?', 'Is CognitiveBotics suitable for NGOs, not just private therapy centres?']) {
      expect(pricingFaq.find((f) => f.q === q)).toEqual(therapyFaq.find((f) => f.q === q));
    }
  });
});

describe('pricingJsonLd', () => {
  it('still describes the Basic offer in INR', () => {
    expect(JSON.stringify(pricingJsonLd())).toContain('"priceCurrency":"INR"');
  });
});
```

- [ ] **Step 2: Run it, expect FAIL** — missing exports.

- [ ] **Step 3: Create `components/pages/pricing/icons.ts`**

```ts
import type { FaqCardIcon } from '@/components/shared/FaqCards';

// Same tint and stroke pairs as the Schools "connected ecosystem" cards, so the six platform cards read as the same family.
export type PricingIconId = 'plan' | 'objectives' | 'games' | 'cues' | 'home' | 'progress' | 'reports' | 'labels';

export const PRICING_ICONS: Record<PricingIconId, FaqCardIcon> = {
  plan: {
    bg: '#f0f9ff',
    fg: '#0369a1',
    paths: ['M16 4c.93 0 1.395 0 1.776.102a3 3 0 0 1 2.122 2.122C20 6.605 20 7.07 20 8v9.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C17.72 22 16.88 22 15.2 22H8.8c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C4 19.72 4 18.88 4 17.2V8c0-.93 0-1.395.102-1.776a3 3 0 0 1 2.122-2.122C6.605 4 7.07 4 8 4m1 11 2 2 4.5-4.5M9.6 6h4.8c.56 0 .84 0 1.054-.109a1 1 0 0 0 .437-.437C16 5.24 16 4.96 16 4.4v-.8c0-.56 0-.84-.109-1.054a1 1 0 0 0-.437-.437C15.24 2 14.96 2 14.4 2H9.6c-.56 0-.84 0-1.054.109a1 1 0 0 0-.437.437C8 2.76 8 3.04 8 3.6v.8c0 .56 0 .84.109 1.054a1 1 0 0 0 .437.437C8.76 6 9.04 6 9.6 6Z'],
  },
  objectives: {
    bg: '#fffbeb',
    fg: '#b45309',
    paths: ['m12 21-.1-.15c-.695-1.042-1.042-1.563-1.5-1.94a4 4 0 0 0-1.378-.737C8.453 18 7.827 18 6.575 18H5.2c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C2 16.48 2 15.92 2 14.8V6.2c0-1.12 0-1.68.218-2.108a2 2 0 0 1 .874-.874C3.52 3 4.08 3 5.2 3h.4c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C12 6.04 12 7.16 12 9.4M12 21V9.4M12 21l.1-.15c.695-1.042 1.042-1.563 1.5-1.94a3.999 3.999 0 0 1 1.378-.737C15.547 18 16.173 18 17.425 18H18.8c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C22 16.48 22 15.92 22 14.8V6.2c0-1.12 0-1.68-.218-2.108a2 2 0 0 0-.874-.874C20.48 3 19.92 3 18.8 3h-.4c-2.24 0-3.36 0-4.216.436a4 4 0 0 0-1.748 1.748C12 6.04 12 7.16 12 9.4'],
  },
  games: {
    bg: '#f8f2f9',
    fg: '#a14da5',
    paths: ['M15 9h.01M9 9h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-6.5-3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm-6 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm2.5 8.5c2.5 0 4.5-1.833 4.5-3.5h-9c0 1.667 2 3.5 4.5 3.5Z'],
  },
  cues: {
    bg: '#eef9f9',
    fg: '#175f63',
    paths: ['M22 21v-2a4.002 4.002 0 0 0-3-3.874M15.5 3.291a4.001 4.001 0 0 1 0 7.418M17 21c0-1.864 0-2.796-.305-3.53a4 4 0 0 0-2.164-2.165C13.796 15 12.864 15 11 15H8c-1.864 0-2.796 0-3.53.305a4 4 0 0 0-2.166 2.164C2 18.204 2 19.136 2 21M13.5 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z'],
  },
  home: {
    bg: '#fef2f2',
    fg: '#dc2626',
    paths: ['M8.126 14a4.002 4.002 0 0 0 7.748 0M11.018 2.764 4.235 8.039c-.453.353-.68.53-.843.75a2 2 0 0 0-.318.65C3 9.704 3 9.991 3 10.565V17.8c0 1.12 0 1.68.218 2.108a2 2 0 0 0 .874.874C4.52 21 5.08 21 6.2 21h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C21 19.48 21 18.92 21 17.8v-7.235c0-.574 0-.861-.074-1.126a2.002 2.002 0 0 0-.318-.65c-.163-.22-.39-.397-.843-.75l-6.783-5.275c-.351-.273-.527-.41-.72-.462a1 1 0 0 0-.523 0c-.194.052-.37.189-.721.462Z'],
  },
  progress: {
    bg: '#f0fdf4',
    fg: '#15803d',
    paths: ['M12 6v6l4 2m6-2c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Z'],
  },
  reports: {
    bg: '#eef9f9',
    fg: '#175f63',
    paths: ['M18 20V10M12 20V4M6 20v-6'],
  },
  labels: {
    bg: '#f8f2f9',
    fg: '#a14da5',
    paths: ['M15 9h.01M9 9h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10Zm-6.5-3a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm-6 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0Zm2.5 8.5c2.5 0 4.5-1.833 4.5-3.5h-9c0 1.667 2 3.5 4.5 3.5Z'],
  },
};
```

- [ ] **Step 4: Rewrite `components/pages/pricing/content.ts`**

```ts
import type { FaqCardItem } from '@/components/shared/FaqCards';
import { faq as therapyFaq } from '../therapy-centres/content';
import type { PricingIconId } from './icons';

export const AUDIENCE_IDS = ['therapy-centres', 'schools'] as const;
export type AudienceId = (typeof AUDIENCE_IDS)[number];
export const DEFAULT_AUDIENCE: AudienceId = 'therapy-centres';

/** `?for=` value to audience. Only an exact first value of `schools` picks Schools. */
export function parseAudience(v: string | string[] | undefined): AudienceId {
  const first = Array.isArray(v) ? v[0] : v;
  return first === 'schools' ? 'schools' : DEFAULT_AUDIENCE;
}

/** Shown until Sales confirms the answer. A unit test counts these so none ship by accident. */
export const PENDING_ANSWER = 'Answer coming soon.';
const pending = (q: string): FaqCardItem => ({ q, a: PENDING_ANSWER });

export const hero = {
  eyebrow: 'PRICING',
  titleLead: 'One platform for each neurodivergent child’s plan, practice and ',
  titleAccent: 'progress',
  subtitle:
    'Therapy and teaching happen a few hours a week. CognitiveBotics, the AI-powered early intervention platform for therapy centres and schools, carries your plans into each child’s day and shows the progress back to you.',
  partner: 'Working with NIEPID (Govt of India) under an MoU',
  proofs: [
    { claim: '59.57% more tasks done independently', source: 'NIEPID 90-day study' },
    { claim: '+56.8% social age in 12 months', source: 'JMIR Neurotechnology' },
    { claim: 'Winner', source: 'UK-India HealthTech Accelerator 2025' },
    { claim: 'Winner', source: 'AP Govt MedTech Challenge' },
    { claim: 'ISO 27001 certified', source: 'DPDP Act readiness' },
  ],
} as const;

export type Feature = {
  /** Optional leading figure shown in brand purple, e.g. "400+". */
  readonly lead?: string;
  readonly title: string;
  readonly body: string;
  readonly icon: PricingIconId;
};

export type PlanCard = {
  readonly id: 'basic' | 'custom' | 'bloom';
  readonly name: string;
  readonly eyebrow?: string;
  readonly audience: string;
  readonly price: string;
  readonly unit?: string;
  readonly meta: string;
  readonly metaNote: string;
  readonly features: readonly string[];
  readonly cta: { readonly label: string; readonly href: string; readonly variant: 'solid' | 'outline' };
  readonly tone: 'featured' | 'plain' | 'bloom';
};

export type Audience = {
  readonly id: AudienceId;
  readonly tabLabel: string;
  readonly intro: { readonly heading: string; readonly lede: string; readonly highlight?: string };
  readonly features: readonly Feature[];
  readonly gets: { readonly heading: string; readonly items: readonly string[] };
  readonly plansHeading: string;
  readonly plans: readonly PlanCard[];
  readonly testimonials: { readonly heading: string; readonly order: readonly string[] };
  readonly faqHeading: string;
  readonly faq: readonly FaqCardItem[];
  readonly cta: { readonly heading: string; readonly body: string; readonly label: string; readonly href: string };
};

const basicPrice = { price: '₹2,000', unit: '/user/month', meta: 'Up to 5 users', metaNote: 'Excluding taxes' } as const;
const bookDemo = { label: 'Book a demo', href: '/try-demo?plan=basic', variant: 'solid' } as const;
const contactCustom = { label: 'Contact us', href: '/try-demo?plan=custom', variant: 'outline' } as const;

export const audiences: Record<AudienceId, Audience> = {
  'therapy-centres': {
    id: 'therapy-centres',
    tabLabel: 'Therapy Centres',
    intro: {
      heading: 'For therapy centres: grow beyond therapist hours',
      lede: 'Families stay when they see progress. Each therapist’s plan keeps working at home, between sessions.',
    },
    features: [
      { title: 'Personalised learning plans for each child', body: 'AI-drafted in about 10-15 minutes, then reviewed and finalised by your therapist.', icon: 'plan' },
      { lead: '400+', title: 'learning objectives across 10 skill areas', body: 'From attending and imitation to social, expressive and receptive skills.', icon: 'objectives' },
      { title: 'Game-based activities and social stories', body: 'With gaze, pose and speech detection built in.', icon: 'games' },
      { title: 'Guided videos for home practice', body: 'Parent training videos and guided co-learning in the parent app.', icon: 'home' },
      { title: 'Progress tracking per objective', body: 'Independent and prompted attempts, first-try rate and days practised.', icon: 'progress' },
      { title: 'Outcome reports, generated automatically', body: 'Mastery logs, skill-wise progress, time engaged and a monthly report.', icon: 'reports' },
    ],
    gets: {
      heading: 'What your centre gets',
      items: [
        'Less therapist time on planning, documentation and parent follow-ups',
        'Progress parents can see, between every session',
        'Live within a week',
      ],
    },
    plansHeading: 'Plans for therapy centres',
    plans: [
      {
        id: 'basic',
        name: 'Basic',
        audience: 'For centres starting with a core team',
        ...basicPrice,
        features: [
          'Personalised learning plans for each child',
          '400+ learning objectives across 10 skill areas',
          'Game-based activities and social stories',
          'Guided videos for home practice',
          'Progress tracking and outcome reports',
        ],
        cta: bookDemo,
        tone: 'featured',
      },
      {
        id: 'custom',
        name: 'Custom',
        audience: 'For larger teams and multi-branch centres',
        price: 'Custom pricing',
        meta: '6 or more users',
        metaNote: 'One licence per access, priced for your team size',
        features: ['Everything in Basic', 'Pricing based on the number of users', 'Live within a week'],
        cta: contactCustom,
        tone: 'plain',
      },
    ],
    testimonials: { heading: 'What centres and parents say', order: ['chandrashekhar', 'mounila', 'pavani', 'tejaswi'] },
    faqHeading: 'Questions centres ask before buying',
    faq: [
      pending('Who counts as a user?'),
      {
        q: 'What if we need more than 5 users, or have more than one branch?',
        a: 'Teams of 6 or more users get custom pricing, based on team size. Each branch needs its own licence per access. Contact us and we will put it together.',
      },
      pending('How quickly can our centre go live?'),
      pending('Are prices inclusive of taxes?'),
      pending('How does CognitiveBotics fit our existing therapy process?'),
      pending('Will parents actually use it?'),
      pending('Is children’s data safe?'),
    ],
    cta: {
      heading: 'Find the right plan for your centre',
      body: 'Tell us about your team and the children you support. We’ll walk you through what’s included, how many users you need and how quickly your centre can go live, with no pressure to decide on the call.',
      label: 'Contact us',
      href: '/contact-us',
    },
  },
  schools: {
    id: 'schools',
    tabLabel: 'Schools',
    intro: {
      heading: 'For schools: inclusion that works across class, home and special educator',
      lede: 'Start with the 10-15% of learners who need structured support, then extend it to more.',
      highlight: '10-15%',
    },
    features: [
      { title: 'Personalised learning plans (IEPs) for each child', body: 'AI-drafted in about 10-15 minutes, then finalised by your special educator. Plans adapt with each child’s performance.', icon: 'plan' },
      { lead: '400+', title: 'learning objectives across 10 skill areas', body: 'Mapped to NCF Foundational Stage and ECCE.', icon: 'objectives' },
      { title: 'Classroom cues for class teachers', body: 'Simple cues tied to each child’s goals, ready to use in class.', icon: 'cues' },
      { title: 'Guided home practice', body: 'Daily IEP-aligned activities and take-home worksheets (sensory, motor, pencil control, drawing, cognitive) through the parent app.', icon: 'home' },
      { title: 'Progress tracking and outcome reports', body: 'Real-time dashboards, mastery logs, a monthly report and CBSE-compliant IEP documentation.', icon: 'reports' },
      { title: 'No exams, no labels', body: 'Progress is observed during activities, never graded. No diagnosis required.', icon: 'labels' },
    ],
    gets: {
      heading: 'What your school gets',
      items: [
        'Equips your special educator and documents the work',
        'One shared plan across special educator, class teacher and parent',
        'Live within 6 weeks',
      ],
    },
    plansHeading: 'Plans for schools',
    plans: [
      {
        id: 'basic',
        name: 'Basic',
        audience: 'For schools with a special educator, starting with the children who need structured support most',
        ...basicPrice,
        features: [
          'AI-drafted IEPs for each child',
          '400+ learning objectives across 10 skill areas',
          'Classroom cues for class teachers',
          'Guided home practice through the parent app',
          'Progress tracking and CBSE-compliant IEP documentation',
        ],
        cta: bookDemo,
        tone: 'featured',
      },
      {
        id: 'custom',
        name: 'Custom',
        audience: 'For schools extending support to more class teachers and learners',
        price: 'Custom pricing',
        meta: '6 or more users',
        metaNote: 'Priced for your team size',
        features: [
          'Everything in Basic',
          'More users across your special educator and class teachers',
          'Scale from the 10-15% towards more learners',
          'Live within 6 weeks',
        ],
        cta: contactCustom,
        tone: 'plain',
      },
      {
        id: 'bloom',
        name: 'BLOOM',
        eyebrow: 'NO SPECIAL EDUCATOR? START HERE',
        audience: 'For schools without a special educator',
        price: 'Custom pricing',
        meta: 'Tailored to your school',
        metaNote: 'Licences, services and on-site support',
        features: [
          'A CognitiveBotics-trained resource person placed in your school',
          'Everything in the platform',
          'Manages each child’s plan and supports class teachers',
          'Makes sure home practice reaches parents',
          'Live within 6 weeks',
        ],
        cta: { label: 'Contact us', href: '/contact-us', variant: 'solid' },
        tone: 'bloom',
      },
    ],
    testimonials: { heading: 'What educators and parents say', order: ['pavani', 'tejaswi', 'mounila', 'chandrashekhar'] },
    faqHeading: 'Questions schools ask before buying',
    faq: [
      pending('Who counts as a user?'),
      pending('What if we need more than 5 users?'),
      pending('We don’t have a special educator. Can we still start?'),
      pending('Can we start small?'),
      pending('How quickly can our school go live?'),
      pending('Are prices inclusive of taxes?'),
      pending('Will this add work for our teachers?'),
      pending('Will parents worry about labels?'),
      pending('Is student data safe?'),
    ],
    cta: {
      heading: 'Find the right plan for your school',
      body: 'Tell us about your team and the children you support. With or without a special educator, we’ll walk you through what’s included, how many users you need, whether the platform or BLOOM suits you, and how quickly your school can go live, with no pressure to decide on the call.',
      label: 'Contact us',
      href: '/contact-us',
    },
  },
};

export const parentsPanel = {
  heading: 'For parents: explore CognitiveBotics with your child, free',
  body: 'The free app includes a limited set of lessons, so you can see how your child learns through play. A personalised plan and progress tracking come through your child’s therapist or school. Ask them about using CognitiveBotics together.',
  share: 'Know a parent who could use this? Share the app with them.',
  shareText: 'CognitiveBotics has a free app for parents of neurodivergent children.',
  googlePlay: 'Get it on Google Play',
  appStore: 'Download on the App Store',
} as const;

export const pricingContent = { hero, audiences, parentsPanel } as const;

function reuse(question: string) {
  const hit = therapyFaq.find((f) => f.q === question);
  if (!hit) throw new Error(`FAQ not found on Therapy Centres: ${question}`);
  return hit;
}

// The Pricing chip on /faqs and its FAQPage JSON-LD read this list. Keep it answered and unchanged.
export const pricingFaq: readonly FaqCardItem[] = [
  { q: 'Who counts as a user?', a: 'We’ll confirm the exact count in your demo.' },
  {
    q: 'What happens after I book a demo?',
    a: 'You pick a time right after you submit the form. Our team will get back to you in 2 to 3 business days.',
  },
  reuse('Is there published research behind this?'),
  reuse('Is CognitiveBotics suitable for NGOs, not just private therapy centres?'),
];
```

- [ ] **Step 5: Update `tests/unit/learn-cta-copy.test.ts`** — replace the line `pricing: pricingContent.cta,` with:

```ts
    pricingCentres: pricingContent.audiences['therapy-centres'].cta,
    pricingSchools: pricingContent.audiences.schools.cta,
```

- [ ] **Step 6: Run, expect PASS** — `npx vitest run tests/unit/pricing-content.test.ts tests/unit/learn-cta-copy.test.ts tests/unit/faq-sets.test.ts`. (`tests/unit/pricing-plans.test.tsx` still imports the old `Section1` and is rewritten in Task 4; the old `Section1`/`Section0` files no longer compile against the new content, so delete `components/pages/pricing/sections/Section0.tsx`–`Section3.tsx` and `tests/unit/pricing-plans.test.tsx` now. `PricingPage.tsx` is broken until Task 5, so do not run `build` yet.)

- [ ] **Checkpoint**: `git add -A components/pages/pricing tests/unit && git commit -m "feat: pricing content for therapy centres and schools"`

---

### Task 4: Pricing sections

**Files:**
- Create: `components/pages/pricing/sections/{Check,Hero,Intro,Gets,Plans,ParentsPanel,ShareLink,Faq}.tsx`, `lib/app-links.ts`
- Test: `tests/unit/pricing-plans.test.tsx`, `tests/unit/pricing-share-link.test.tsx`

**Interfaces:**
- Consumes: everything from Task 3 content; `PRICING_ICONS`; `Button`, `Eyebrow`, `TextReveal`, `Reveal`, `RevealStagger`, `FaqList`, `faqIcons` (`../../home/faq-icons`).
- Produces: `Hero()`, `Intro({ a })`, `Gets({ a })`, `Plans({ a })`, `PlanGrid({ plans })`, `ParentsPanel()`, `ShareLink({ label, text, path })`, `Faq({ a })` where `a: Audience`; `APP_LINKS = { googlePlay: string; appStore: string }`.

- [ ] **Step 1: Write failing tests**

`tests/unit/pricing-plans.test.tsx`:

```tsx
import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { audiences } from '@/components/pages/pricing/content';
import { PlanGrid } from '@/components/pages/pricing/sections/Plans';

describe('PlanGrid', () => {
  it('renders the two centre plans as labelled articles', () => {
    render(<PlanGrid plans={audiences['therapy-centres'].plans} />);
    expect(screen.getAllByRole('article').map((a) => a.getAttribute('aria-labelledby'))).toEqual(['plan-therapy-centres-basic', 'plan-therapy-centres-custom']);
    expect(screen.getByRole('article', { name: 'Basic' })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: 'Custom' })).toBeInTheDocument();
  });
  it('shows price, user limit and taxes on Basic only', () => {
    render(<PlanGrid plans={audiences['therapy-centres'].plans} />);
    const basic = within(screen.getByRole('article', { name: 'Basic' }));
    expect(basic.getByText('₹2,000')).toBeInTheDocument();
    expect(basic.getByText('/user/month')).toBeInTheDocument();
    expect(basic.getByText('Up to 5 users')).toBeInTheDocument();
    expect(basic.getByText('Excluding taxes')).toBeInTheDocument();
    expect(basic.getAllByRole('listitem')).toHaveLength(5);
    const custom = within(screen.getByRole('article', { name: 'Custom' }));
    expect(custom.queryByText('/user/month')).toBeNull();
    expect(custom.getAllByRole('listitem')).toHaveLength(3);
  });
  it('adds BLOOM with its eyebrow for schools and links every button', () => {
    render(<PlanGrid plans={audiences.schools.plans} />);
    const bloom = within(screen.getByRole('article', { name: 'BLOOM' }));
    expect(bloom.getByText('NO SPECIAL EDUCATOR? START HERE')).toBeInTheDocument();
    expect(bloom.getByRole('link', { name: 'Contact us' })).toHaveAttribute('href', '/contact-us');
    expect(screen.getByRole('link', { name: /book a demo/i })).toHaveAttribute('href', '/try-demo?plan=basic');
    expect(within(screen.getByRole('article', { name: 'Custom' })).getByRole('link', { name: 'Contact us' })).toHaveAttribute('href', '/try-demo?plan=custom');
  });
});
```

`tests/unit/pricing-share-link.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run, expect FAIL** — modules missing.

- [ ] **Step 3: `components/pages/pricing/sections/Check.tsx`**

```tsx
export function Check() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-[3px] shrink-0 text-brand-teal">
      <path d="m5 12 5 5 9-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
```

- [ ] **Step 4: `components/pages/pricing/sections/Hero.tsx`** (badge styling copied from the Therapy Centres hero chips)

```tsx
import { Eyebrow } from '@/components/shared/Eyebrow';
import { RevealStagger } from '@/components/shared/RevealStagger';
import { TextReveal } from '@/components/shared/TextReveal';
import { hero } from '../content';

function Shield() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function Hero() {
  return (
    <section
      className="px-5 pb-12 pt-[116px] lg:px-[84px] lg:pb-[72px] lg:pt-[150px]"
      style={{ background: 'linear-gradient(100deg, #e7f1ef 0%, #f3eef5 45%, #fbece9 100%)' }}
    >
      <div className="mx-auto flex max-w-[960px] flex-col items-center gap-4 text-center lg:gap-5">
        <Eyebrow>{hero.eyebrow}</Eyebrow>
        <TextReveal as="h1" split="lines" trigger="load" className="font-heading text-[32px] font-semibold leading-[42px] text-brand-teal lg:text-[52px] lg:leading-[64px]">
          {hero.titleLead}
          <span className="text-content-brand-secondary">{hero.titleAccent}</span>.
        </TextReveal>
        <p className="max-w-[760px] text-[16px] leading-[26px] text-text-default lg:text-[20px] lg:leading-[30px]">{hero.subtitle}</p>
        <p className="font-heading text-[14px] font-bold leading-[22px] text-content-brand lg:text-[16px]">{hero.partner}</p>
        <RevealStagger className="mt-2 flex max-w-[920px] justify-center">
          <ul className="flex flex-wrap justify-center gap-2 lg:gap-3">
          {hero.proofs.map((p) => (
            <li key={p.source} className="flex items-center gap-2 rounded-full border border-[#e4ded4] bg-white px-4 py-2 text-left text-[13px] leading-[19px] lg:px-[18px] lg:py-[10px] lg:text-[14px] lg:leading-[21px]">
              <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#f8f2f9] text-content-brand-secondary">
                <Shield />
              </span>
              <span>
                <strong className="font-semibold text-brand-dark">{p.claim}</strong>
                <span className="text-text-secondary"> · {p.source}</span>
              </span>
            </li>
          ))}
          </ul>
        </RevealStagger>
      </div>
    </section>
  );
}
```

(`RevealStagger` takes only `children` and `className` and renders a `div`, so the list sits inside it.)

- [ ] **Step 5: `components/pages/pricing/sections/Intro.tsx`**

```tsx
import { RevealStagger } from '@/components/shared/RevealStagger';
import { TextReveal } from '@/components/shared/TextReveal';
import type { Audience } from '../content';
import { PRICING_ICONS } from '../icons';

function Lede({ text, highlight }: { text: string; highlight?: string }) {
  if (!highlight || !text.includes(highlight)) return <>{text}</>;
  const [before, after] = text.split(highlight);
  return (
    <>
      {before}
      <strong className="font-bold text-content-brand-secondary">{highlight}</strong>
      {after}
    </>
  );
}

export function Intro({ a }: { a: Audience }) {
  return (
    <section className="px-5 pb-6 pt-10 lg:px-24 lg:pb-8 lg:pt-14">
      <div className="mx-auto flex max-w-[1248px] flex-col gap-8 lg:gap-10">
        <div className="flex max-w-[900px] flex-col gap-3 lg:gap-4">
          <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[40px] lg:leading-[48px]">
            {a.intro.heading}
          </TextReveal>
          <p className="text-[16px] leading-[26px] text-text-default lg:text-[18px] lg:leading-[27px]">
            <Lede text={a.intro.lede} highlight={a.intro.highlight} />
          </p>
        </div>
        <div className="flex flex-col gap-5">
          <h3 className="font-heading text-[18px] font-bold leading-[26px] text-brand-dark lg:text-[22px] lg:leading-[30px]">What’s in the platform</h3>
          <RevealStagger className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {a.features.map((f) => {
              const icon = PRICING_ICONS[f.icon];
              return (
                <div key={f.title} className="flex flex-col items-start gap-3 rounded-[18px] border-[1.5px] border-brand-teal-100 bg-white p-[18px] shadow-[0px_8px_20px_-6px_rgba(23,94,99,0.06)] lg:p-[26px]">
                  <span data-icon className="flex size-11 shrink-0 items-center justify-center rounded-full lg:size-12" style={{ backgroundColor: icon.bg }}>
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: icon.fg }}>
                      {icon.paths.map((d) => <path key={d} d={d} />)}
                    </svg>
                  </span>
                  <h4 className="font-heading text-[18px] font-bold leading-[27px] text-brand-teal lg:text-[20px] lg:leading-[26px]">
                    {f.lead ? <span className="text-content-brand-secondary">{f.lead} </span> : null}
                    {f.title}
                  </h4>
                  <p className="text-[14px] leading-[22px] text-text-default lg:text-[18px] lg:leading-[27px]">{f.body}</p>
                </div>
              );
            })}
          </RevealStagger>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: `components/pages/pricing/sections/Gets.tsx`**

```tsx
import { Reveal } from '@/components/shared/Reveal';
import type { Audience } from '../content';
import { Check } from './Check';

export function Gets({ a }: { a: Audience }) {
  return (
    <section className="px-5 lg:px-24">
      <Reveal className="mx-auto max-w-[1248px]">
        <div className="flex flex-col gap-4 rounded-[24px] bg-brand-subtle-bg p-5 lg:gap-5 lg:p-8">
          <h3 className="font-heading text-[20px] font-bold leading-[28px] text-brand-teal lg:text-[22px] lg:leading-[30px]">{a.gets.heading}</h3>
          <ul className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-8">
            {a.gets.items.map((item) => (
              <li key={item} className="flex gap-3 text-[16px] leading-[24px] text-text-default lg:text-[18px] lg:leading-[27px]">
                <Check />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 7: `components/pages/pricing/sections/Plans.tsx`**

```tsx
import { Button } from '@/components/shared/Button';
import { RevealStagger } from '@/components/shared/RevealStagger';
import { TextReveal } from '@/components/shared/TextReveal';
import type { Audience, PlanCard } from '../content';
import { Check } from './Check';

const TONE: Record<PlanCard['tone'], string> = {
  featured: 'border-brand-teal bg-white',
  plain: 'border-brand-teal-100 bg-white',
  bloom: 'border-[#ead3ee] bg-[#f6e8f7]',
};

export function PlanGrid({ plans, prefix = 'therapy-centres' }: { plans: readonly PlanCard[]; prefix?: string }) {
  return (
    <RevealStagger className={`grid grid-cols-1 gap-6 lg:gap-8 ${plans.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
      {plans.map((p) => {
        const id = `plan-${prefix}-${p.id}`;
        return (
          <article key={p.id} aria-labelledby={id} className={`flex flex-col rounded-[24px] border-[1.5px] p-6 shadow-[0px_10px_24px_-6px_rgba(23,94,99,0.07)] lg:p-8 ${TONE[p.tone]}`}>
            {p.eyebrow ? <p className="mb-2 font-heading text-[12px] font-bold leading-[18px] tracking-[1.2px] text-content-brand-secondary lg:text-[13px]">{p.eyebrow}</p> : null}
            <h3 id={id} className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[28px] lg:leading-[36px]">
              {p.name}
            </h3>
            <p className="mt-1 text-[15px] leading-[23px] text-text-secondary lg:text-[16px] lg:leading-[24px]">{p.audience}</p>
            <p className="mt-6 flex flex-wrap items-baseline gap-x-1 font-heading">
              {p.unit ? (
                <>
                  <span className="text-[40px] font-bold leading-[48px] text-content-brand-secondary lg:text-[48px] lg:leading-[56px]">{p.price}</span>
                  <span className="text-[16px] font-semibold text-text-secondary lg:text-[18px]">{p.unit}</span>
                </>
              ) : (
                <span className="text-[32px] font-bold leading-[40px] text-brand-teal lg:text-[40px] lg:leading-[56px]">{p.price}</span>
              )}
            </p>
            <div className="mt-3 flex flex-col gap-[2px]">
              <p className="text-[16px] font-semibold leading-[24px] text-content-brand">{p.meta}</p>
              <p className="text-[15px] leading-[23px] text-text-secondary lg:text-[16px]">{p.metaNote}</p>
            </div>
            <hr className={`my-6 ${p.tone === 'bloom' ? 'border-[#ead3ee]' : 'border-border-subtle'}`} />
            <ul className="flex flex-1 flex-col gap-3">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3 text-[16px] leading-[24px] text-text-default lg:text-[17px] lg:leading-[26px]">
                  <Check />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href={p.cta.href} size="lg" variant={p.cta.variant} className="w-full">
                {p.cta.label}
              </Button>
            </div>
          </article>
        );
      })}
    </RevealStagger>
  );
}

export function Plans({ a }: { a: Audience }) {
  return (
    <section className="px-5 py-12 lg:px-24 lg:py-[84px]">
      <div className="mx-auto flex max-w-[1248px] flex-col gap-8 lg:gap-10">
        <TextReveal as="h2" split="words" trigger="scroll" className="font-heading text-[24px] font-semibold leading-[32px] text-brand-teal lg:text-[40px] lg:leading-[48px]">
          {a.plansHeading}
        </TextReveal>
        <PlanGrid plans={a.plans} prefix={a.id} />
      </div>
    </section>
  );
}
```

The plan id includes the audience (`plan-schools-basic`) because both panels are in the DOM and ids must be unique.

- [ ] **Step 8: `lib/app-links.ts`**

```ts
// Store listings for the free parent app. Not published yet: both point to the holding page until the URLs arrive.
export const APP_LINKS = {
  googlePlay: '/coming-soon',
  appStore: '/coming-soon',
} as const;

export const isExternal = (href: string) => /^https?:\/\//.test(href);
```

- [ ] **Step 9: `components/pages/pricing/sections/ShareLink.tsx`**

```tsx
'use client';

import { useState } from 'react';

// Shares the Parents page through the system share sheet, or copies its link. Never throws.
export function ShareLink({ label, text, path }: { label: string; text: string; path: string }) {
  const [message, setMessage] = useState('');
  const onClick = async () => {
    const url = `${window.location.origin}${path}`;
    setMessage('');
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share({ title: 'CognitiveBotics', text, url });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setMessage('Link copied');
        return;
      }
      setMessage(`Copy this link: ${url}`);
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return;
      setMessage(`Copy this link: ${url}`);
    }
  };
  return (
    <div className="flex flex-col items-start gap-1">
      <button type="button" onClick={onClick} className="min-h-[44px] text-left font-heading text-[15px] font-bold leading-[22px] text-content-brand underline-offset-4 hover:underline focus-visible:underline lg:text-[16px]">
        {label}
      </button>
      <p role="status" aria-live="polite" className="text-[14px] leading-[20px] text-text-secondary">
        {message}
      </p>
    </div>
  );
}
```

- [ ] **Step 10: `components/pages/pricing/sections/ParentsPanel.tsx`**

```tsx
import Link from 'next/link';
import { Reveal } from '@/components/shared/Reveal';
import { APP_LINKS, isExternal } from '@/lib/app-links';
import { parentsPanel as c } from '../content';
import { ShareLink } from './ShareLink';

function StoreButton({ href, children }: { href: string; children: string }) {
  const cls = 'btn inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-brand-dark px-6 py-3 text-center text-[16px] font-semibold text-content-knockout transition-colors hover:bg-[#0b3436] lg:w-[240px]';
  return isExternal(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>
  ) : (
    <Link href={href} className={cls}>{children}</Link>
  );
}

export function ParentsPanel() {
  return (
    <section className="px-5 pb-12 lg:px-24 lg:pb-[84px]">
      <Reveal className="mx-auto max-w-[1248px]">
        <div className="flex flex-col gap-6 rounded-[24px] bg-brand-subtle-bg p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:rounded-[32px] lg:p-11">
          <div className="flex max-w-[780px] flex-col gap-3">
            <h2 className="font-heading text-[22px] font-semibold leading-[30px] text-brand-teal lg:text-[30px] lg:leading-[40px]">{c.heading}</h2>
            <p className="text-[15px] leading-[24px] text-text-default lg:text-[17px] lg:leading-[26px]">{c.body}</p>
            <ShareLink label={c.share} text={c.shareText} path="/parents" />
          </div>
          <div className="flex shrink-0 flex-col gap-3">
            <StoreButton href={APP_LINKS.googlePlay}>{c.googlePlay}</StoreButton>
            <StoreButton href={APP_LINKS.appStore}>{c.appStore}</StoreButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 11: `components/pages/pricing/sections/Faq.tsx`**

```tsx
import { FaqList } from '@/components/shared/FaqList';
import { TextReveal } from '@/components/shared/TextReveal';
import { faqIcons } from '../../home/faq-icons';
import type { Audience } from '../content';

// Same layout as the FAQ section on the Home, Parents and Schools pages.
export function Faq({ a }: { a: Audience }) {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-14 lg:px-24 lg:py-24">
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-5">
        <div className="flex max-w-[403px] flex-col items-start gap-[10px]">
          <TextReveal
            as="h2"
            split="words"
            trigger="scroll"
            className="font-heading text-[24px] font-semibold leading-[32px] text-[color:var(--faq-heading-mobile)] lg:text-[38px] lg:leading-[46px] lg:text-[color:var(--faq-heading-color)]"
            style={{ '--faq-heading-color': 'var(--color-brand-teal)', '--faq-heading-mobile': 'var(--color-content-brand-alt)' } as React.CSSProperties}
          >
            {a.faqHeading}
          </TextReveal>
        </div>
        <FaqList items={a.faq} icons={faqIcons} questionColor="#207d82" />
      </div>
    </section>
  );
}
```

- [ ] **Step 12: Run, expect PASS** — `npx vitest run tests/unit/pricing-plans.test.tsx tests/unit/pricing-share-link.test.tsx` and `npm run lint`.

- [ ] **Checkpoint**: `git add -A components/pages/pricing/sections lib/app-links.ts tests/unit && git commit -m "feat: pricing sections"`

---

### Task 5: Audience tabs, page assembly, route

**Files:**
- Create: `components/pages/pricing/AudienceTabs.tsx`, `tests/unit/pricing-tabs.test.tsx`
- Rewrite: `components/pages/pricing/PricingPage.tsx`, `app/pricing/page.tsx`
- Modify: `app/globals.css` (append)

**Interfaces:**
- Consumes: `Chips` (`items`, `value`, `onChange`, `label`, `idPrefix`, `className`), all Task 4 sections, `SkillsScroller`, `TestimonialsSection`, `CtaPanel`, `parseAudience`.
- Produces: `AudienceTabs({ initial, tabs, panels })`, `PricingPage({ initial? })`.

- [ ] **Step 1: Write the failing test** `tests/unit/pricing-tabs.test.tsx`

```tsx
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { AudienceTabs } from '@/components/pages/pricing/AudienceTabs';

const tabs = [
  { id: 'therapy-centres', label: 'Therapy Centres' },
  { id: 'schools', label: 'Schools' },
] as const;
const panels = { 'therapy-centres': <p>centres body</p>, schools: <p>schools body</p> };

beforeEach(() => window.history.replaceState(null, '', '/pricing'));

describe('AudienceTabs', () => {
  it('shows the initial panel and hides the other from everyone', () => {
    render(<AudienceTabs initial="schools" tabs={tabs} panels={panels} />);
    expect(screen.getByRole('tab', { name: 'Schools' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel', { name: 'Schools' })).toHaveTextContent('schools body');
    expect(screen.getByText('centres body').closest('[role="tabpanel"]')).toHaveAttribute('hidden');
  });
  it('switches panels and writes ?for= without adding history', () => {
    const before = window.history.length;
    render(<AudienceTabs initial="therapy-centres" tabs={tabs} panels={panels} />);
    expect(window.location.search).toBe('');
    fireEvent.click(screen.getByRole('tab', { name: 'Schools' }));
    expect(screen.getByText('schools body').closest('[role="tabpanel"]')).not.toHaveAttribute('hidden');
    expect(window.location.search).toBe('?for=schools');
    fireEvent.click(screen.getByRole('tab', { name: 'Therapy Centres' }));
    expect(window.location.search).toBe('');
    expect(window.history.length).toBe(before);
  });
  it('moves with the arrow keys', () => {
    render(<AudienceTabs initial="therapy-centres" tabs={tabs} panels={panels} />);
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Therapy Centres' }), { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Schools' })).toHaveAttribute('aria-selected', 'true');
  });
  it('keeps other query parameters', () => {
    window.history.replaceState(null, '', '/pricing?utm_source=x');
    render(<AudienceTabs initial="therapy-centres" tabs={tabs} panels={panels} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Schools' }));
    expect(window.location.search).toBe('?utm_source=x&for=schools');
  });
});
```

- [ ] **Step 2: Run, expect FAIL** — module missing.

- [ ] **Step 3: `components/pages/pricing/AudienceTabs.tsx`**

```tsx
'use client';

import { useEffect, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Chips } from '@/components/shared/Chips';
import { DEFAULT_AUDIENCE, type AudienceId } from './content';

gsap.registerPlugin(ScrollTrigger);

type Tab = { readonly id: AudienceId; readonly label: string };

// The Therapy Centres / Schools switch. Both panels come from the server; the inactive one is `hidden`
// so it is out of the tab order and the accessibility tree. The choice is mirrored into ?for= with
// replaceState, so it is shareable without adding back-button steps or moving the scroll position.
export function AudienceTabs({ initial, tabs, panels }: { initial: AudienceId; tabs: readonly Tab[]; panels: Record<AudienceId, ReactNode> }) {
  const [active, setActive] = useState<AudienceId>(initial);
  // True once the visitor has switched at least once; the first paint never fades.
  const [switched, setSwitched] = useState(false);

  const choose = (id: string) => {
    const next = id as AudienceId;
    if (next === active) return;
    setSwitched(true);
    setActive(next);
    const url = new URL(window.location.href);
    if (next === DEFAULT_AUDIENCE) url.searchParams.delete('for');
    else url.searchParams.set('for', next);
    window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  };

  // The newly shown panel had no layout while hidden; let scroll-driven pieces measure it again.
  useEffect(() => {
    if (!switched) return;
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(raf);
  }, [active, switched]);

  return (
    <>
      <div className="flex justify-center px-5 pt-10 lg:pt-14">
        <Chips items={tabs} value={active} onChange={choose} label="Choose who the pricing is for" idPrefix="pricing" className="justify-center" />
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`pricing-panel-${t.id}`}
          aria-labelledby={`pricing-tab-${t.id}`}
          hidden={t.id !== active}
          data-switched={switched && t.id === active ? '' : undefined}
          className="pricing-panel"
        >
          {panels[t.id]}
        </div>
      ))}
    </>
  );
}
```

- [ ] **Step 4: Append to `app/globals.css`**

```css
/* Pricing audience switch: the newly chosen panel fades in. */
@keyframes pricing-panel-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@media (prefers-reduced-motion: no-preference) {
  .pricing-panel[data-switched] { animation: pricing-panel-in 200ms ease-out; }
}
```

- [ ] **Step 5: Run the tab tests, expect PASS** — `npx vitest run tests/unit/pricing-tabs.test.tsx`.

- [ ] **Step 6: Rewrite `components/pages/pricing/PricingPage.tsx`**

```tsx
import { CtaPanel } from '@/components/shared/CtaPanel';
import { JsonLd } from '@/components/shared/JsonLd';
import { SkillsScroller } from '@/components/shared/SkillsScroller';
import { TestimonialsSection } from '@/components/shared/TestimonialsSection';
import { AudienceTabs } from './AudienceTabs';
import { AUDIENCE_IDS, DEFAULT_AUDIENCE, audiences, type Audience, type AudienceId } from './content';
import { pricingJsonLd } from './seo';
import { Faq } from './sections/Faq';
import { Gets } from './sections/Gets';
import { Hero } from './sections/Hero';
import { Intro } from './sections/Intro';
import { ParentsPanel } from './sections/ParentsPanel';
import { Plans } from './sections/Plans';

function AudiencePanel({ a }: { a: Audience }) {
  return (
    <>
      <Intro a={a} />
      <SkillsScroller className="bg-white px-5 pb-10 pt-6 lg:px-24 lg:pb-14 lg:pt-4" />
      <Gets a={a} />
      <Plans a={a} />
      <ParentsPanel />
      <TestimonialsSection heading={a.testimonials.heading} railOrder={a.testimonials.order} />
      <Faq a={a} />
      <CtaPanel heading={a.cta.heading} body={a.cta.body} label={a.cta.label} href={a.cta.href} />
    </>
  );
}

export function PricingPage({ initial = DEFAULT_AUDIENCE }: { initial?: AudienceId }) {
  return (
    <>
      <Hero />
      <AudienceTabs
        initial={initial}
        tabs={AUDIENCE_IDS.map((id) => ({ id, label: audiences[id].tabLabel }))}
        panels={{
          'therapy-centres': <AudiencePanel a={audiences['therapy-centres']} />,
          schools: <AudiencePanel a={audiences.schools} />,
        }}
      />
      <JsonLd data={pricingJsonLd()} />
    </>
  );
}
```

- [ ] **Step 7: Rewrite `app/pricing/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { PricingPage } from '@/components/pages/pricing/PricingPage';
import { parseAudience } from '@/components/pages/pricing/content';

export const metadata: Metadata = {
  title: 'Pricing | CognitiveBotics',
  description:
    'Pricing for therapy centres and schools: ₹2,000 per user per month for up to 5 users, custom pricing for larger teams, and BLOOM for schools without a special educator.',
};

// ?for=schools opens the Schools view. Reading searchParams renders this route per request, like /try-demo.
export default async function Page({ searchParams }: { searchParams: Promise<{ for?: string | string[] }> }) {
  const { for: audience } = await searchParams;
  return <PricingPage initial={parseAudience(audience)} />;
}
```

- [ ] **Step 8: Full unit run + lint + build** — `npm test && npm run lint && npm run build`. Expected: all green; `/pricing` listed as dynamic (ƒ).

- [ ] **Checkpoint**: `git add -A app components/pages/pricing tests/unit && git commit -m "feat: pricing page with therapy centres and schools switch"`

---

### Task 6: E2E, visual check against the mocks, final verification

**Files:**
- Rewrite: `tests/e2e/pricing.spec.ts`

- [ ] **Step 1: Rewrite `tests/e2e/pricing.spec.ts`**

```ts
import { expect, test } from '@playwright/test';
import { noConsentBanner, overflowAt } from './helpers';

test.beforeEach(async ({ page }) => noConsentBanner(page));

const panel = (page: import('@playwright/test').Page, id: string) => page.locator(`#pricing-panel-${id}`);

test('pricing: hero, centres by default, structured data in INR', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pricing');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('One platform for each neurodivergent child’s plan, practice and progress.');
  await expect(page.getByRole('tab', { name: 'Therapy Centres' })).toHaveAttribute('aria-selected', 'true');
  await expect(panel(page, 'therapy-centres').getByRole('article')).toHaveCount(2);
  await expect(panel(page, 'schools')).toBeHidden();
  const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(ld.join('')).toContain('INR');
});

test('pricing: switching to schools shows BLOOM and updates the URL', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pricing');
  await page.getByRole('tab', { name: 'Schools' }).click();
  await expect(page).toHaveURL(/\/pricing\?for=schools$/);
  await expect(panel(page, 'schools').getByRole('article')).toHaveCount(3);
  await expect(panel(page, 'schools').getByRole('article', { name: 'BLOOM' })).toBeVisible();
  await page.getByRole('tab', { name: 'Schools' }).press('ArrowLeft');
  await expect(page.getByRole('tab', { name: 'Therapy Centres' })).toHaveAttribute('aria-selected', 'true');
  await expect(page).toHaveURL(/\/pricing$/);
});

test('pricing: ?for=schools opens on schools, a bad value falls back', async ({ page }) => {
  await page.goto('/pricing?for=schools');
  await expect(page.getByRole('tab', { name: 'Schools' })).toHaveAttribute('aria-selected', 'true');
  await expect(panel(page, 'therapy-centres')).toBeHidden();
  await page.goto('/pricing?for=nope');
  await expect(page.getByRole('tab', { name: 'Therapy Centres' })).toHaveAttribute('aria-selected', 'true');
});

test('pricing: switching keeps the reader where they are', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pricing');
  const tab = page.getByRole('tab', { name: 'Schools' });
  await tab.scrollIntoViewIfNeeded();
  const before = await page.evaluate(() => window.scrollY);
  await tab.click();
  expect(Math.abs((await page.evaluate(() => window.scrollY)) - before)).toBeLessThan(4);
  await expect(panel(page, 'schools').getByRole('heading', { name: 'Skills empowering every child’s journey' })).toBeVisible();
});

test('pricing: plan buttons open the right forms', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/pricing');
  await panel(page, 'therapy-centres').getByRole('link', { name: /book a demo/i }).click();
  await expect(page).toHaveURL(/\/try-demo\?plan=basic$/);
  await page.goto('/pricing');
  await panel(page, 'therapy-centres').getByRole('article', { name: 'Custom' }).getByRole('link', { name: 'Contact us' }).click();
  await expect(page).toHaveURL(/\/try-demo\?plan=custom$/);
});

test('pricing: no horizontal overflow at any width, either audience', async ({ page }) => {
  for (const route of ['/pricing', '/pricing?for=schools']) {
    for (const w of [375, 768, 1024, 1440]) {
      expect(await overflowAt(page, route, w), `${route} ${w}px`).toBeLessThanOrEqual(0);
    }
  }
});
```

- [ ] **Step 2: Run e2e** — `npm run e2e -- tests/e2e/pricing.spec.ts tests/e2e/integration.spec.ts tests/e2e/mobile.spec.ts tests/e2e/nav.spec.ts`. Expected: PASS. If `integration.spec.ts` or `mobile.spec.ts` asserts the old pricing H1 or section count, update that assertion to the new H1 only.

- [ ] **Step 3: Visual check against the mocks** — dev server running; shots of `/pricing` and `/pricing?for=schools` at 1440 and 375 (tag `final`). Open each next to the matching mock crop and confirm section order, card counts, Bloom placement and copy. Confirm visual language: no flat mint background, chips are the site `Chips`, cards use teal-100 borders, the type scale matches Schools/Therapy Centres. Fix anything off and re-shoot.

- [ ] **Step 4: Regression shots** — `/` and `/therapy-centres` at 1440 and 375 (tag `final`), diff against `before`. Expected: `None`.

- [ ] **Step 5: Final verification** — `npm test && npm run lint && npm run build`. All green.

- [ ] **Checkpoint**: `git add tests/e2e && git commit -m "test: pricing audience switch e2e"`
