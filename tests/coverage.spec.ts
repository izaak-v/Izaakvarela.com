import { expect, test, type Page } from "@playwright/test";

const COVERAGE = [
  "Life Insurance",
  "Final Expense",
  "Mortgage Protection",
  "Family Protection",
  "Living Benefits",
  "Term Life",
  "Whole Life / Permanent Coverage",
];

const LABELS = ["What it is", "Often used for", "Why people consider it", "Key points"];

async function noHorizontalScroll(page: Page) {
  const { sw, cw } = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  expect(sw).toBeLessThanOrEqual(cw);
}

const rows = (page: Page) => page.locator(".coverage-list > li");

test.describe("coverage breakdowns", () => {
  test("all seven coverage types have a visible summary and a collapsed breakdown", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator(".coverage-list h3")).toHaveText(COVERAGE);
    await expect(rows(page)).toHaveCount(COVERAGE.length);
    for (const [i, title] of COVERAGE.entries()) {
      const row = rows(page).nth(i);
      await expect(row.locator(".coverage-text > p")).toBeVisible();
      // Each "Learn more" has a unique accessible name and starts closed.
      const summary = row.locator("summary");
      await expect(summary).toHaveAccessibleName(`Learn more about ${title}`);
      await expect(row.locator("details")).not.toHaveAttribute("open", /.*/);
      await expect(row.locator(".coverage-detail")).toBeHidden();
    }
    await expect(page.locator("#coverage")).toContainText(
      "Coverage features, riders, availability, eligibility, and underwriting vary by carrier, product, and state.",
    );
  });

  test("each breakdown explains what it is, who it is for, why, key points and a CTA", async ({
    page,
  }) => {
    await page.goto("/");
    for (let i = 0; i < COVERAGE.length; i++) {
      const row = rows(page).nth(i);
      await row.locator("summary").click();
      const detail = row.locator(".coverage-detail");
      await expect(detail).toBeVisible();
      await expect(detail.locator("dt")).toHaveText(LABELS);
      for (const dd of await detail.locator("dd").all()) {
        expect((await dd.innerText()).trim().length).toBeGreaterThan(10);
      }
      const points = detail.locator("dd ul li");
      expect(await points.count()).toBeGreaterThanOrEqual(1);
      await expect(detail.locator(".coverage-cta-link")).toHaveAttribute("href", "#request");
    }
  });

  test("breakdowns open and close by keyboard", async ({ page }) => {
    await page.goto("/");
    // The first "Learn more" follows the section's Request Coverage button in tab order.
    await page.locator(".coverage-head .btn").focus();
    await page.keyboard.press("Tab");
    const first = rows(page).first();
    await expect(first.locator("summary")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(first.locator("details")).toHaveAttribute("open", "");
    await expect(first.locator(".coverage-detail")).toBeVisible();
    await expect(first.locator("summary")).toContainText("Show less");
    await page.keyboard.press("Space");
    await expect(first.locator(".coverage-detail")).toBeHidden();

    // Tab reaches the CTA inside an open breakdown.
    const term = rows(page).nth(COVERAGE.indexOf("Term Life"));
    await term.locator("summary").focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await expect(term.locator(".coverage-cta-link")).toBeFocused();
    await expect(term.locator(".coverage-cta-link")).toHaveText(/Explore Term Coverage/);
  });

  test("open breakdowns fit the screen with no horizontal scroll", async ({ page }) => {
    await page.goto("/");
    const vw = page.viewportSize()!.width;
    for (let i = 0; i < COVERAGE.length; i++) await rows(page).nth(i).locator("summary").click();
    await noHorizontalScroll(page);
    for (const d of await page.locator(".coverage-detail").all()) {
      const box = (await d.boundingBox())!;
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(vw + 0.5);
    }
  });

  test("a coverage CTA leads to the Request Coverage form", async ({ page }) => {
    await page.goto("/");
    const row = rows(page).nth(COVERAGE.indexOf("Final Expense"));
    await row.locator("summary").click();
    await row.getByRole("link", { name: /Explore Final Expense Coverage/ }).click();
    await expect(page).toHaveURL(/#request$/);
    await expect(page.locator("#request h2")).toBeInViewport();
    await expect(page.locator("#request form")).toBeVisible();
  });

  test("copy stays general: no rates, guarantees or personal recommendations", async ({ page }) => {
    await page.goto("/");
    for (let i = 0; i < COVERAGE.length; i++) await rows(page).nth(i).locator("summary").click();
    const text = (await page.locator("#coverage").innerText()).toLowerCase();
    for (const banned of [
      "guarantee",
      "approval",
      "$",
      "per month",
      "/mo",
      "rates",
      "no medical exam",
      "everyone qualifies",
      "you should",
      "best for you",
      "we recommend",
      "i recommend",
      "licensed nationwide",
    ]) {
      expect(text, `coverage copy must not contain "${banned}"`).not.toContain(banned);
    }
  });
});

test.describe("coverage breakdowns — reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("reveal animation is disabled and content is still reachable", async ({ page }) => {
    await page.goto("/");
    const row = rows(page).first();
    await row.locator("summary").focus();
    await page.keyboard.press("Enter");
    const detail = row.locator(".coverage-detail");
    await expect(detail).toBeVisible();
    expect(await detail.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    await noHorizontalScroll(page);
  });
});

const CTA_TO_OPTION: [cta: string, option: string][] = [
  ["Explore Life Insurance Options", "Life Insurance"],
  ["Explore Final Expense Coverage", "Final Expense"],
  ["Explore Mortgage Protection", "Mortgage Protection"],
  ["Build a Family Protection Plan", "Family Protection"],
  ["Learn About Living Benefits", "Living Benefits"],
  ["Explore Term Coverage", "Term Life"],
  ["Explore Permanent Coverage", "Whole Life / Permanent Coverage"],
];

async function clickCta(page: Page, cta: string, option: string) {
  const row = rows(page).nth(COVERAGE.indexOf(option));
  await row.locator("summary").click();
  await row.getByRole("link", { name: new RegExp(cta) }).click();
}

test.describe("coverage CTAs preselect the Request Coverage form", () => {
  test("the form offers every coverage category plus Not Sure", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#q-interest option")).toHaveText([
      "Choose one",
      ...COVERAGE,
      "Not Sure",
    ]);
  });

  for (const [cta, option] of CTA_TO_OPTION) {
    test(`"${cta}" selects ${option}`, async ({ page }) => {
      await page.goto("/");
      // A marker on window survives only if the page is not reloaded.
      await page.evaluate(() => ((window as unknown as { __noReload: boolean }).__noReload = true));
      await clickCta(page, cta, option);
      await expect(page.locator("#q-interest")).toHaveValue(option);
      await expect(page.locator("#request h2")).toBeInViewport();
      // Nothing but the in-page anchor goes into the URL.
      expect(new URL(page.url()).search).toBe("");
      expect(new URL(page.url()).hash).toBe("#request");
      expect(
        await page.evaluate(() => (window as unknown as { __noReload?: boolean }).__noReload),
      ).toBe(true);
      await noHorizontalScroll(page);
    });
  }

  test("the visitor can change the preselected option, and a later CTA updates it", async ({
    page,
  }) => {
    await page.goto("/");
    await clickCta(page, "Explore Term Coverage", "Term Life");
    await expect(page.locator("#q-interest")).toHaveValue("Term Life");
    await page.selectOption("#q-interest", "Not Sure");
    await expect(page.locator("#q-interest")).toHaveValue("Not Sure");
    await clickCta(page, "Explore Mortgage Protection", "Mortgage Protection");
    await expect(page.locator("#q-interest")).toHaveValue("Mortgage Protection");
  });

  test("works from the keyboard", async ({ page }) => {
    await page.goto("/");
    const row = rows(page).nth(COVERAGE.indexOf("Living Benefits"));
    await row.locator("summary").focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await expect(row.locator(".coverage-cta-link")).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page.locator("#q-interest")).toHaveValue("Living Benefits");
    await expect(page).toHaveURL(/#request$/);
  });
});
