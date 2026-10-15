import { expect, test } from "@playwright/test";

const PAGES = ["/", "/credentials", "/schedule", "/contact", "/privacy", "/terms"];
const PHONE_TEL = "tel:+19285811704";
const EMAIL = "mailto:izaak@izaakvarela.com";
// Content that must never appear publicly.
const FORBIDDEN = [
  "ProducerOS",
  "Driven Life",
  "Family First",
  "Twilio",
  "gmail",
  "Sample testimonial",
  "Development placeholder",
  "difi.az",
];

test.describe("site content", () => {
  for (const path of PAGES) {
    test(`${path} renders cleanly with only approved contact details`, async ({ page }) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);

      const { sw, cw } = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        cw: document.documentElement.clientWidth,
      }));
      expect(sw).toBeLessThanOrEqual(cw);

      const html = await page.content();
      for (const bad of FORBIDDEN) expect(html, `must not contain "${bad}"`).not.toContain(bad);

      const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href")!));
      for (const h of hrefs.filter((h) => h.startsWith("tel:"))) expect(h).toBe(PHONE_TEL);
      for (const h of hrefs.filter((h) => h.startsWith("mailto:")))
        expect(h.split("?")[0]).toBe(EMAIL);

      const text = await page.locator("body").innerText();
      const phones = text.match(/\(?\d{3}\)?[\s.-]?\d{3}[\s.-]\d{4}/g) ?? [];
      for (const p of phones) expect(p.replace(/\D/g, "")).toBe("9285811704");

      // External links opening new tabs use safe rel attributes.
      const unsafe = await page.$$eval('a[target="_blank"]', (as) =>
        (as as HTMLAnchorElement[]).filter((a) => !/noopener/.test(a.rel)).map((a) => a.href),
      );
      expect(unsafe).toEqual([]);
      expect(errors).toEqual([]);
    });
  }

  test("credentials page: NPN, NIPR verification, contact details", async ({ page }) => {
    await page.goto("/credentials");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Izaak Varela");
    await expect(page.getByText("Licensed Life Insurance Agent").first()).toBeVisible();
    await expect(page.locator(".nipr-value")).toHaveText("22276637");
    const nipr = page.getByRole("link", { name: /Verify My Credentials on NIPR/ });
    await expect(nipr).toHaveAttribute(
      "href",
      "https://nipr.com/licensing-center/look-up-a-national-producer-number",
    );
    await expect(nipr).toHaveAttribute("rel", /noopener/);
    await expect(page.getByText(/not affiliated with or endorsed by NIPR, NAIC/)).toBeVisible();
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(og).toContain("/credentials/opengraph-image");
  });

  test("share images render", async ({ request }) => {
    for (const p of ["/opengraph-image", "/credentials/opengraph-image"]) {
      const res = await request.get(p);
      expect(res.status()).toBe(200);
      expect(res.headers()["content-type"]).toContain("image/png");
    }
  });

  test("schedule page offers Google booking", async ({ page }) => {
    await page.goto("/schedule");
    await expect(page.getByRole("link", { name: /Open Booking Page/ })).toHaveAttribute(
      "href",
      "https://calendar.app.google/aEjZtfNMAWdBLpKJA",
    );
  });

  test("structured data identifies the agent", async ({ page }) => {
    await page.goto("/");
    const data = JSON.parse(
      (await page.locator('script[type="application/ld+json"]').first().textContent())!,
    );
    expect(data).toMatchObject({
      "@type": "Person",
      name: "Izaak Varela",
      jobTitle: "Licensed Life Insurance Agent",
      url: "https://izaakvarela.com",
      telephone: "+19285811704",
      email: "mailto:izaak@izaakvarela.com",
    });
  });
});

test.describe("contact form", () => {
  async function fill(page: import("@playwright/test").Page) {
    await page.fill("#firstName", "Test");
    await page.fill("#lastName", "Visitor");
    await page.fill("#email", "test@example.com");
    await page.fill("#phone", "(555) 010-0000");
    await page.selectOption("#state", "Texas");
    await page.selectOption("#topic", "Final Expense");
    await page.fill("#message", "Hello, I have a question.");
  }

  test("rejects invalid input without sending", async ({ page }) => {
    let calls = 0;
    await page.route("/api/contact", (r) => {
      calls++;
      return r.fulfill({ json: { ok: true } });
    });
    await page.goto("/contact");
    await page.click("button[type=submit]");
    await expect(page.locator(".form-status [role=alert]")).toHaveText(/enter your name/);
    await fill(page);
    await page.fill("#email", "not-an-email");
    await page.click("button[type=submit]");
    await expect(page.locator(".form-status [role=alert]")).toHaveText(/valid email/);
    expect(calls).toBe(0);
  });

  test("shows a confirmation with next steps after sending, once", async ({ page }) => {
    let calls = 0;
    await page.route("/api/contact", async (r) => {
      calls++;
      await new Promise((res) => setTimeout(res, 400));
      return r.fulfill({ json: { ok: true } });
    });
    await page.goto("/contact");
    await fill(page);
    await page.click("button[type=submit]");
    await page.click("button[type=submit]", { force: true, timeout: 1000 }).catch(() => {});
    await expect(page.getByText("Thanks — your message has been sent.")).toBeVisible();
    await expect(page.getByRole("link", { name: /Schedule a Consultation/ }).last()).toBeVisible();
    await expect(page.locator(".form-success a[href^='tel:']")).toHaveAttribute("href", PHONE_TEL);
    expect(calls).toBe(1);
    await expect(page).toHaveURL(/\/contact$/);
  });

  test("keeps the message and explains when sending fails", async ({ page }) => {
    await page.route("/api/contact", (r) =>
      r.fulfill({
        status: 502,
        json: { error: "Sorry, your message couldn't be sent right now." },
      }),
    );
    await page.goto("/contact");
    await fill(page);
    await page.click("button[type=submit]");
    await expect(page.locator(".form-status [role=alert]")).toContainText("couldn't be sent");
    await expect(page.locator("#message")).toHaveValue("Hello, I have a question.");
  });

  test("falls back to the email app when delivery isn't configured", async ({ page }) => {
    // Unmocked: without RESEND_API_KEY the real API answers 503.
    await page.goto("/contact");
    await fill(page);
    await page.click("button[type=submit]");
    const link = page.getByRole("link", { name: /Open in my email app/ });
    await expect(link).toBeVisible();
    const href = (await link.getAttribute("href"))!;
    expect(href.startsWith(`${EMAIL}?subject=`)).toBe(true);
    expect(decodeURIComponent(href)).toContain("Website Inquiry — Test Visitor");
    await expect(page.locator("#message")).toHaveValue("Hello, I have a question.");
  });
});
