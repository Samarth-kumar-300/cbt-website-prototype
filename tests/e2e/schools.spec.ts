import { expect, test, type Page } from "@playwright/test";
import { faq } from "../../components/pages/schools/content";
import { expectPageMatchesReference, noConsentBanner } from "./helpers";

test.beforeEach(async ({ page }) => noConsentBanner(page));

test("schools matches the reference structure at all widths", async ({
  page,
}) => {
  await expectPageMatchesReference(page, "/schools", {
    changedHeadings: [
      "Supporting inclusive education with evidence that matters",
      "Making inclusive education work, every day",
      "Building inclusive schools starts with empowered educators",
      "Tailored implementation, built around your school’s needs.",
    ],
  });
});

test("faq toggles", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/schools");
  const q = page.getByRole("button", { name: faq[0].q });
  await q.click();
  await expect(q).toHaveAttribute("aria-expanded", "true");
});

test.describe("faq behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/schools");
    await page.getByRole("button", { name: "View All" }).click();
  });

  const question = (page: Page, i: number) =>
    page.getByRole("button", { name: faq[i].q });
  const answerOf = async (page: Page, i: number) => {
    const id = await question(page, i).getAttribute("aria-controls");
    expect(id, `question ${i} has aria-controls`).toBeTruthy();
    return page.locator(`[id="${id}"]`);
  };

  test("aria-controls target is hidden when collapsed and visible when open", async ({
    page,
  }) => {
    for (let i = 0; i < faq.length; i++) {
      const panel = await answerOf(page, i);
      await expect(question(page, i)).toHaveAttribute("aria-expanded", "false");
      await expect(panel).toBeHidden();
      await question(page, i).click();
      await expect(question(page, i)).toHaveAttribute("aria-expanded", "true");
      await expect(panel).toBeVisible();
      await expect(panel).toContainText(faq[i].a);
    }
  });

  test("opening one question collapses the previous one, re-click collapses", async ({
    page,
  }) => {
    const first = await answerOf(page, 0);
    const second = await answerOf(page, 1);
    await question(page, 0).click();
    await expect(first).toBeVisible();
    await question(page, 1).click();
    await expect(question(page, 1)).toHaveAttribute("aria-expanded", "true");
    await expect(second).toBeVisible();
    await expect(question(page, 0)).toHaveAttribute("aria-expanded", "false");
    await expect(first).toBeHidden();
    await question(page, 1).click();
    await expect(question(page, 1)).toHaveAttribute("aria-expanded", "false");
    await expect(second).toBeHidden();
  });

  test("keyboard: Enter opens, Space closes", async ({ page }) => {
    const panel = await answerOf(page, 2);
    await question(page, 2).focus();
    await page.keyboard.press("Enter");
    await expect(question(page, 2)).toHaveAttribute("aria-expanded", "true");
    await expect(panel).toBeVisible();
    await page.keyboard.press("Space");
    await expect(question(page, 2)).toHaveAttribute("aria-expanded", "false");
    await expect(panel).toBeHidden();
  });

  test("each answer region is labelled by its question", async ({ page }) => {
    await question(page, 0).click();
    await expect(page.getByRole("region", { name: faq[0].q })).toContainText(
      faq[0].a,
    );
  });
});

test("demo CTA targets contact", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/schools");
  // The CTA appears more than once (hero and closing band), so check every instance.
  const demo = page.getByRole("link", { name: "Book a School Demo" });
  expect(await demo.count()).toBeGreaterThan(0);
  for (const href of await demo.evaluateAll((els) =>
    els.map((e) => e.getAttribute("href")),
  )) {
    expect(href).toBe("/contact-us");
  }
});
