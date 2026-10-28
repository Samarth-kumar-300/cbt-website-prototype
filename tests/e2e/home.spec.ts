import { expect, test, type Page } from "@playwright/test";
import { faq as allFaq } from "../../components/pages/home/content";

const faq = allFaq.slice(0, 3);
import { expectPageMatchesReference, noConsentBanner } from "./helpers";

test.beforeEach(async ({ page }) => noConsentBanner(page));

test("home matches the reference structure at all widths", async ({ page }) => {
  // The home page temporarily carries the growth path twice (the original, then the rebuilt rail section
  // directly below it). Remove the allowance when one of the two is deleted.
  await expectPageMatchesReference(page, "/", {
    extraSections: 1,
    removedSections: 1,
    changedHeadings: [
      "AI-powered early intervention platform for neurodivergent children, built to connect therapy, home and school",
      "One shared path, from first questions to thriving",
      "Could Your Child Benefit from Extra Support?",
      "Better outcomes begin when everyone works from the same understanding",
    ],
  });
});

// The FAQ is exercised through roles, aria attributes and visibility only, so it survives a swap of the
// component that renders it.
test("faq toggles", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const question = (i: number) => page.getByRole("button", { name: faq[i].q });
  const region = async (i: number) => {
    const id = await question(i).getAttribute("aria-controls");
    expect(id, `question ${i} has aria-controls`).toBeTruthy();
    return page.locator(`[id="${id}"]`);
  };
  const expectState = async (i: number, open: boolean) => {
    await expect(question(i)).toHaveAttribute("aria-expanded", String(open));
    if (open) await expect(await region(i)).toBeVisible();
    else await expect(await region(i)).toBeHidden();
  };

  await question(0).scrollIntoViewIfNeeded();
  for (let i = 0; i < faq.length; i++) await expectState(i, false);

  await question(0).click();
  await expectState(0, true);
  await expect(await region(0)).toContainText(faq[0].a.slice(0, 40));

  // single-open mode: opening Q2 collapses Q1
  await question(1).click();
  await expectState(1, true);
  await expectState(0, false);

  // re-click collapses
  await question(1).click();
  await expectState(1, false);

  // keyboard: Enter opens, Space closes
  await question(0).focus();
  await page.keyboard.press("Enter");
  await expectState(0, true);
  await page.keyboard.press("Space");
  await expectState(0, false);
});

test("find-your-path anchor is present and the checklist band is gone", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("#find-your-path")).toHaveCount(1);
  // The "Could your child benefit from extra support?" checklist band is no longer on the home page.
  await expect(
    page.getByRole("link", { name: "Take the Developmental Checklist" }),
  ).toHaveCount(0);
});

// Guards against the image scaffold regressing to Placeholder for slots that have a local file.
const REAL_IMAGES = [
  { alt: "Hero_Section", file: "home-hero-devices" },
  { alt: "What_Is_CBT", file: "whatiscbt" },
  {
    alt: "Observing and understanding a child’s unique needs",
    file: "steps01",
  },
  {
    alt: "Turning observations into clearer developmental insights",
    file: "steps02",
  },
  {
    alt: "Building learning activities around developmental goals",
    file: "steps03",
  },
  { alt: "Adapting learning to a child’s pace and progress", file: "steps04" },
  { alt: "Tracking meaningful progress over time", file: "steps05" },
  { alt: "Growth_Looks_Diff", file: "home-growth-phones" },
];

async function expectRealImage(page: Page, alt: string, file: string) {
  const img = page.locator(`main img[alt="${alt}"]:visible`).first();
  await img.scrollIntoViewIfNeeded();
  await expect(img).toBeVisible();
  const src = decodeURIComponent((await img.getAttribute("src")) ?? "");
  expect(src, `${alt} src`).toContain(file);
  await expect
    .poll(
      () =>
        img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth),
      { message: `${alt} loaded` },
    )
    .toBeGreaterThan(0);
}

for (const width of [1440, 375]) {
  test(`illustrations render as real images at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    for (const { alt, file } of REAL_IMAGES)
      await expectRealImage(page, alt, file);
  });
}

test("mobile testimonial dots switch the visible card", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  const first = page.locator("p:visible", {
    hasText: "Nyra’s attention span has improved",
  });
  const second = page.locator("p:visible", {
    hasText: "We haven’t seen such a variety of activities",
  });
  const dots = page.getByRole("tab", { name: /testimonial/i });
  await expect(dots).toHaveCount(4);
  await dots.first().scrollIntoViewIfNeeded();
  await expect(first).toHaveCount(1);
  await expect(second).toHaveCount(0);
  await dots.nth(1).click();
  await expect(dots.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(dots.first()).toHaveAttribute("aria-selected", "false");
  await expect(second).toHaveCount(1);
  await expect(first).toHaveCount(0);
});
