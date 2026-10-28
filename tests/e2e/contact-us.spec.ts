import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { expectPageMatchesReference, noConsentBanner } from "./helpers";

const form = JSON.parse(readFileSync("reference/interactions.json", "utf8"))
  .contactForm as {
  inputs: { type: string; label: string; required: boolean }[];
};
const options = (JSON.parse(readFileSync("reference/interactions.json", "utf8"))
  .contactSelect ?? []) as string[];

test.beforeEach(async ({ page }) => noConsentBanner(page));

test("contact matches the reference structure at all widths", async ({
  page,
}) => {
  await expectPageMatchesReference(page, "/contact-us");
});

test("empty submit shows errors and sends nothing", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/contact-us");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(page.getByRole("alert").first()).toBeVisible();
  await expect(page.getByRole("status")).toHaveCount(0);
});

test("malformed email is rejected", async ({ page }) => {
  test.skip(
    !form.inputs.some((i) => i.type === "email"),
    "form has no email field",
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/contact-us");
  await page.locator('form input[type="email"]').fill("nope");
  await page.getByRole("button", { name: "Submit" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: /valid email/i }),
  ).toBeVisible();
});

test("valid submit shows one confirmation even if clicked twice", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/contact-us");
  const fields = page.locator(
    'form input:not([type="hidden"]):not([type="checkbox"]):not([type="search"]), form textarea',
  );
  const n = await fields.count();
  for (let i = 0; i < n; i++) {
    const f = fields.nth(i);
    const type = (await f.getAttribute("type")) ?? "text";
    const value =
      type === "email"
        ? "asha@example.com"
        : type === "tel"
          ? "9876543210"
          : "Test message";
    await f.fill(value);
  }
  if (options.length) {
    await page.getByRole("button", { name: /choose one/i }).click();
    await page.getByRole("option", { name: options[0] }).click();
  }
  const sent: string[] = [];
  page.on("request", (r) => {
    if (r.method() !== "GET") sent.push(`${r.method()} ${r.url()}`);
  });
  const submit = page.getByRole("button", { name: "Submit" });
  await submit.dblclick();
  await expect(page.getByRole("status")).toHaveCount(1);
  expect(sent, "the form must not make any network call").toEqual([]);
});

test("keyboard-only: the select can be opened and chosen without a mouse", async ({
  page,
}) => {
  test.skip(!options.length, "form has no custom select");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/contact-us");
  await page.getByRole("button", { name: /choose one/i }).focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  // The first ArrowDown from an unselected state highlights the first option.
  await expect(
    page.getByRole("button", { name: new RegExp(`: ${options[0]}$`) }),
  ).toBeVisible();
});
