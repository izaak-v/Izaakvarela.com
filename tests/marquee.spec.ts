import { expect, test } from "@playwright/test";

const CARRIERS = [
  "Aetna",
  "American Amicable",
  "Americo",
  "Corebridge",
  "Chubb",
  "Ethos",
  "Foresters",
  "Mutual of Omaha",
  "Instabrain",
  "Transamerica",
  "Royal Neighbors",
  "National Life Group",
  "F&G",
];

async function noHorizontalScroll(page: import("@playwright/test").Page) {
  const { sw, cw } = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
  }));
  expect(sw).toBeLessThanOrEqual(cw);
}

test.describe("carrier marquee", () => {
  test("lists every confirmed carrier once for assistive tech, with the disclosure", async ({
    page,
  }) => {
    await page.goto("/");
    const list = page.getByRole("list", { name: "Insurance carriers" });
    await expect(list.locator(".marquee-item")).toHaveText(CARRIERS);
    // The duplicate copy that makes the loop seamless is hidden from screen readers.
    const lists = page.locator(".marquee-list");
    await expect(lists).toHaveCount(2);
    await expect(lists.nth(1)).toHaveAttribute("aria-hidden", "true");
    await expect(lists.nth(1).locator(".marquee-item")).toHaveText(CARRIERS);
    await expect(page.locator("#carriers")).toContainText(
      "Carrier availability varies by state, product, eligibility, and underwriting.",
    );
    await expect(page.locator("#carriers")).not.toContainText(/endorsed by/i);
    await noHorizontalScroll(page);
  });

  test("loops seamlessly: both copies are identical width and the track moves exactly one copy", async ({
    page,
  }) => {
    await page.goto("/");
    const m = await page.evaluate(() => {
      const track = document.querySelector<HTMLElement>(".marquee-track")!;
      const [a, b] = [...track.querySelectorAll<HTMLElement>(".marquee-list")];
      const cs = getComputedStyle(track);
      return {
        a: a.getBoundingClientRect().width,
        b: b.getBoundingClientRect().width,
        track: track.scrollWidth,
        name: cs.animationName,
        duration: parseFloat(cs.animationDuration),
        iterations: cs.animationIterationCount,
        timing: cs.animationTimingFunction,
        marqueeOverflow: getComputedStyle(track.parentElement!).overflowX,
      };
    });
    expect(Math.abs(m.a - m.b)).toBeLessThan(0.5); // no gap or jump when the loop restarts
    expect(Math.abs(m.track - (m.a + m.b))).toBeLessThan(1);
    expect(m.name).toBe("marquee");
    expect(m.iterations).toBe("infinite");
    expect(m.timing).toBe("linear");
    expect(m.duration).toBeGreaterThanOrEqual(30); // slow, not distracting
    expect(m.marqueeOverflow).toBe("hidden");

    // The keyframes end at -50%: exactly one copy's width.
    const end = await page.evaluate(() => {
      for (const sheet of [...document.styleSheets]) {
        try {
          for (const r of [...sheet.cssRules]) {
            if (r instanceof CSSKeyframesRule && r.name === "marquee") {
              return (r.cssRules[r.cssRules.length - 1] as CSSKeyframeRule).style.transform;
            }
          }
        } catch {
          /* cross-origin sheet */
        }
      }
      return null;
    });
    expect(end).toMatch(/^translateX?\(-50%\)$/);
    await noHorizontalScroll(page);
  });

  test("pauses on hover and keyboard focus", async ({ page, isMobile }) => {
    await page.goto("/");
    const track = page.locator(".marquee-track");
    const state = () => track.evaluate((el) => getComputedStyle(el).animationPlayState);
    expect(await state()).toBe("running");
    await page.locator(".marquee").focus();
    expect(await state()).toBe("paused");
    await page.locator("body").click({ position: { x: 2, y: 2 } });
    if (!isMobile) {
      await page.locator(".marquee").hover();
      expect(await state()).toBe("paused");
    }
  });
});

test.describe("carrier marquee — reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });

  test("stops moving and shows a single wrapped list that fits the screen", async ({ page }) => {
    await page.goto("/");
    const track = page.locator(".marquee-track");
    expect(await track.evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
    await expect(page.locator('.marquee-list[aria-hidden="true"]')).toBeHidden();
    const vw = page.viewportSize()!.width;
    for (const item of await page.locator(".marquee-list").first().locator(".marquee-item").all()) {
      const b = (await item.boundingBox())!;
      expect(b.x).toBeGreaterThanOrEqual(0);
      expect(b.x + b.width).toBeLessThanOrEqual(vw);
    }
    await noHorizontalScroll(page);
  });
});

test.describe("credential section and footer", () => {
  test("licensing section and credential card fit the screen with every action", async ({
    page,
  }) => {
    await page.goto("/");
    const section = page.locator("#credentials");
    await expect(section.getByRole("heading", { name: "Licensing & Credentials" })).toBeVisible();
    await expect(section).toContainText(
      "Verify my current licensing credentials through the National Insurance Producer Registry.",
    );
    const card = section.locator(".cred-card");
    const vw = page.viewportSize()!.width;
    const box = (await card.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(vw);
    for (const name of [/Verify Credentials/, /^Call$/, /^Email$/, /^Schedule$/, /Save contact/]) {
      await expect(card.getByRole("link", { name })).toBeVisible();
    }
    await expect(card.locator(".qr svg")).toBeVisible();
    await noHorizontalScroll(page);
  });

  test("footer is compact and links Privacy and Terms", async ({ page }) => {
    await page.goto("/");
    const footer = page.locator(".site-footer");
    await expect(footer).toContainText("Izaak Varela");
    await expect(footer).toContainText("NPN 22276637");
    await expect(footer.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/privacy",
    );
    await expect(footer.getByRole("link", { name: "Terms of Use" })).toHaveAttribute(
      "href",
      "/terms",
    );
    await expect(footer.locator('a[href="tel:+19285811704"]')).toBeVisible();
    await expect(footer.locator('a[href="mailto:izaak@izaakvarela.com"]')).toBeVisible();
    const h = (await footer.boundingBox())!.height;
    expect(h).toBeLessThan(page.viewportSize()!.width < 600 ? 900 : 560);
  });

  test("schedule CTAs lead to /schedule", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.locator(".connect-band").getByRole("link", { name: /Schedule a Call/ }),
    ).toHaveAttribute("href", "/schedule");
    await expect(
      page.locator(".hero").getByRole("link", { name: /Schedule a Call/ }),
    ).toHaveAttribute("href", "/schedule");
  });
});
