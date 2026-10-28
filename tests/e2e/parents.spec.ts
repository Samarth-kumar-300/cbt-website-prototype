import { expect, test, type Page } from "@playwright/test";
import { faq } from "../../components/pages/parents/content";
import { expectPageMatchesReference, noConsentBanner } from "./helpers";

test.beforeEach(async ({ page }) => noConsentBanner(page));

test("parents matches the reference structure at all widths", async ({
  page,
}) => {
  await expectPageMatchesReference(page, "/parents", {
    changedHeadings: ["Every child deserves care that’s made just for them"],
  });
});

test("faq toggles", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/parents");
  const q = page.getByRole("button", { name: faq[0].q });
  await q.click();
  await expect(q).toHaveAttribute("aria-expanded", "true");
});

test.describe("faq behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/parents");
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

  for (const i of [3, 4]) {
    test(`answer ${i + 1} shows labelled citation links`, async ({ page }) => {
      const item = faq[i] as (typeof faq)[number] & {
        links: readonly { text: string; href: string }[];
      };
      expect(item.links.length).toBeGreaterThan(0);
      const panel = await answerOf(page, i);
      await question(page, i).click();
      await expect(panel).toBeVisible();
      for (const label of new Set(item.links.map((l) => l.text))) {
        const expected = item.links.filter((l) => l.text === label);
        const found = panel.getByRole("link", { name: label });
        await expect(found).toHaveCount(expected.length);
        for (const [n, l] of expected.entries()) {
          const link = found.nth(n);
          await expect(link).toBeVisible();
          // visible text is the label itself (label in name), not a raw URL or aria-label override
          await expect(link).toContainText(label);
          await expect(link).not.toHaveAttribute("aria-label", /.*/);
          await expect(link).toHaveAttribute("href", l.href);
          await expect(link).toHaveAttribute("target", "_blank");
          await expect(link).toHaveAttribute("rel", /noopener/);
          expect(await link.evaluate((e) => e.tagName)).toBe("A");
        }
      }
      // Same-label links must stay distinguishable by accessible name.
      const names = await panel
        .getByRole("link")
        .evaluateAll((els) => els.map((e) => e.textContent ?? ""));
      expect(new Set(names).size).toBe(names.length);
    });
  }
});

test("checklist, games and contact CTAs link correctly", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/parents");
  await expect(
    page.getByRole("link", { name: "Start the Checklist" }),
  ).toHaveAttribute("href", "/developmental-checklist");
  await expect(
    page.getByRole("link", { name: /Try interactive games/ }),
  ).toHaveAttribute("href", "/try-demo");
  await expect(
    page.getByRole("link", { name: "Get in Touch with the Team" }),
  ).toHaveAttribute("href", "/contact-us");
});

test("closing section draws the footer top curve that only the original parents page has", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/parents");
  const curve = page.getByTestId("parents-footer-curve");
  await expect(curve).toHaveCount(1);
  const [c, footer] = await Promise.all([
    curve.boundingBox(),
    page.locator("footer").boundingBox(),
  ]);
  // Box straddles the footer's top edge (about half above it).
  expect(c!.y).toBeLessThan(footer!.y);
  expect(c!.y + c!.height).toBeGreaterThan(footer!.y);
  expect(c!.width).toBeCloseTo(1440, 0);
  await page.goto("/about");
  await expect(page.getByTestId("parents-footer-curve")).toHaveCount(0);
});
