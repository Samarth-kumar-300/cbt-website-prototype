import { devices, expect, test } from "@playwright/test";

// On a touch phone the Skills row is pinned like on desktop: scrolling the page with a finger moves the
// cards sideways one pixel for one pixel, and the heading, row and progress bar stay on screen meanwhile.
// (Before, only mouse/trackpad devices pinned, so a real phone got a plain row that did not follow the page.)
test.use({ ...devices["Pixel 7"] });

test("therapy skills row follows a vertical finger scroll on a touch phone", async ({ page, context }) => {
  await page.goto("/therapy-centres");
  const row = page.getByRole("region", { name: "Skills" });
  await expect(row).toBeVisible();
  await page.waitForTimeout(1000);
  await row.evaluate((el) => window.scrollTo(0, el.closest("[data-testid=hscroll-pin]")!.getBoundingClientRect().top + window.scrollY - 200));
  await expect(page.locator(".hscroll-pinned")).toHaveCount(1);

  const cdp = await context.newCDPSession(page);
  const left = () => row.evaluate((el) => el.scrollLeft);
  const topBefore = (await row.boundingBox())!.y;
  const before = await left();
  await cdp.send("Input.synthesizeScrollGesture", { x: 150, y: 500, xDistance: 0, yDistance: -350, gestureSourceType: "touch", speed: 900 });
  await expect.poll(left).toBeGreaterThan(before + 150);
  // the block stays put on screen while the cards travel
  expect(Math.abs((await row.boundingBox())!.y - topBefore)).toBeLessThan(2);
});
