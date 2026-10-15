import { expect, test, type Page } from "@playwright/test";

/** The mobile menu is used below 1024px wide; desktop shows the inline nav instead. */
async function isMobileLayout(page: Page) {
  return page.locator(".menu-toggle").isVisible();
}

async function noHorizontalScroll(page: Page) {
  const { sw, cw } = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  expect(sw, "page should not scroll horizontally").toBeLessThanOrEqual(cw);
}

/** Tap the toggle at its screen position, like a finger (locator.click() would scroll first). */
async function tapToggle(page: Page) {
  const b = (await page.locator(".menu-toggle").boundingBox())!;
  await page.mouse.click(b.x + b.width / 2, b.y + b.height / 2);
}

async function openMenu(page: Page) {
  await tapToggle(page);
  await expect(page.locator("#mobile-menu")).toBeVisible();
  await expect(page.locator(".menu-toggle")).toHaveAttribute("aria-expanded", "true");
}

async function expectClosed(page: Page) {
  await expect(page.locator("#mobile-menu")).toBeHidden();
  await expect(page.locator(".menu-toggle")).toHaveAttribute("aria-expanded", "false");
  expect(await page.evaluate(() => document.body.style.position)).toBe("");
  expect(await page.locator("#main").getAttribute("inert")).toBeNull();
}

test.describe("mobile navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    test.skip(!(await isMobileLayout(page)), "desktop uses inline navigation");
  });

  for (const path of ["/", "/schedule", "/credentials", "/contact"]) {
    test(`opens as a full-screen sheet above all content on ${path}`, async ({ page }) => {
      await page.goto(path);
      await page.evaluate(() => window.scrollTo(0, 400));
      await openMenu(page);

      const vp = page.viewportSize()!;
      const box = (await page.locator("#mobile-menu").boundingBox())!;
      expect(box.x).toBe(0);
      expect(box.y).toBe(0);
      expect(Math.round(box.width)).toBe(vp.width);
      expect(Math.round(box.height)).toBe(vp.height);

      // Every probed point below the header belongs to the menu sheet — nothing page-level on top.
      const header = (await page.locator(".site-header").boundingBox())!;
      const points = [
        [vp.width / 2, header.height + 10],
        [vp.width / 2, vp.height / 2],
        [10, vp.height - 10],
        [vp.width - 10, vp.height - 10],
      ];
      for (const [x, y] of points) {
        const inMenu = await page.evaluate(
          ([px, py]) => !!document.elementFromPoint(px, py)?.closest("#mobile-menu"),
          [x, y],
        );
        expect(inMenu, `point ${x},${y} should be covered by the menu`).toBe(true);
      }

      // The close button stays on top and tappable.
      const t = (await page.locator(".menu-toggle").boundingBox())!;
      const hitsToggle = await page.evaluate(
        ([px, py]) => !!document.elementFromPoint(px, py)?.closest(".menu-toggle"),
        [t.x + t.width / 2, t.y + t.height / 2],
      );
      expect(hitsToggle).toBe(true);

      // Background is locked and inert.
      expect(await page.evaluate(() => document.body.style.position)).toBe("fixed");
      expect(await page.locator("#main").getAttribute("inert")).not.toBeNull();
      await noHorizontalScroll(page);
    });
  }

  test("all links and actions are reachable (menu scrolls when taller than the screen)", async ({
    page,
  }) => {
    await openMenu(page);
    const menu = page.locator("#mobile-menu");
    await menu.evaluate((el) => el.scrollTo(0, el.scrollHeight));
    await expect(menu.getByRole("link", { name: /Schedule Consultation/ })).toBeInViewport();
    await expect(menu.getByRole("link", { name: /Call \(928\) 581-1704/ })).toBeInViewport();
    await expect(menu.getByRole("link", { name: /Call/ })).toHaveAttribute(
      "href",
      "tel:+19285811704",
    );
  });

  test("closes with the X button and restores the scroll position", async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: "instant" }));
    await openMenu(page);
    await tapToggle(page);
    await expectClosed(page);
    expect(Math.abs((await page.evaluate(() => window.scrollY)) - 600)).toBeLessThan(2);
  });

  test("closes with Escape and returns focus to the toggle", async ({ page }) => {
    await openMenu(page);
    await page.keyboard.press("Escape");
    await expectClosed(page);
    await expect(page.locator(".menu-toggle")).toBeFocused();
  });

  test("closes when a page link is selected", async ({ page }) => {
    await openMenu(page);
    await page.locator("#mobile-menu").getByRole("link", { name: "Credentials" }).click();
    await expect(page).toHaveURL(/\/credentials$/);
    await expectClosed(page);
  });

  test("in-page links scroll to their section", async ({ page }) => {
    await openMenu(page);
    await page.locator("#mobile-menu").getByRole("link", { name: "Services" }).click();
    await expect(page).toHaveURL(/#services$/);
    await expectClosed(page);
    await expect(page.locator("#services h2")).toBeInViewport();
  });

  test("closes when tapping the empty area of the sheet", async ({ page }) => {
    await openMenu(page);
    const menu = page.locator("#mobile-menu");
    const fits = await menu.evaluate((el) => el.scrollHeight <= el.clientHeight);
    test.skip(!fits, "no empty area when the menu content fills the screen");
    const vp = page.viewportSize()!;
    await page.mouse.click(vp.width / 2, vp.height - 4);
    await expectClosed(page);
  });
});
