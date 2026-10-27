import { expect, test } from "@playwright/test";
import QRCode from "qrcode";
import { POST as quotePOST } from "@/app/api/quote/route";
import { buildQuoteEmail } from "@/lib/contact-email";
import { toInboundLead } from "@/lib/producer-os";
import { QUOTE_CONSENT_TEXT, validateQuote } from "@/lib/quote";
import { buildVCard } from "@/lib/vcard";

const SITE = "https://izaakvarela.com";
const visitor = {
  firstName: "Jane",
  lastName: "Doe",
  phone: "(602) 555-0100",
  email: "jane.visitor@example.com",
  state: "Arizona",
  interest: "Final Expense",
  coverageRange: "$25,000 – $100,000",
  bestTime: "Evening",
  message: "Looking for something simple.",
  consent: true,
};

test.describe("homepage", () => {
  test("hero, sections and every CTA target exist", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Izaak Varela");
    await expect(page.locator(".hero-kicker")).toHaveText("Licensed Life Insurance Agent");
    for (const id of ["about", "coverage", "carriers", "credentials", "request"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    const hero = page.locator(".hero");
    await expect(hero.getByRole("link", { name: /Request Coverage/ })).toHaveAttribute(
      "href",
      "#request",
    );
    await expect(hero.getByRole("link", { name: /Verify Credentials/ })).toHaveAttribute(
      "href",
      "#credentials",
    );
    await expect(hero.getByRole("link", { name: /Schedule a Call/ })).toHaveAttribute(
      "href",
      "/schedule",
    );
    await expect(hero.getByRole("link", { name: /Call Izaak/ })).toHaveAttribute(
      "href",
      "tel:+19285811704",
    );
    await expect(page.locator(".coverage-list h3")).toHaveText([
      "Life Insurance",
      "Final Expense",
      "Mortgage Protection",
      "Family Protection",
      "Living Benefits",
      "Term Life",
      "Whole Life / Permanent Coverage",
    ]);
    // Compliance wording present; no unverified geography.
    const text = await page.locator("body").innerText();
    expect(text).toContain("Serving clients across the U.S. where licensed");
    expect(text).toContain(
      "Carrier availability varies by state, product, eligibility, and underwriting",
    );
    expect(text).not.toMatch(/licensed nationwide|licensed in all 50|guaranteed approval/i);
  });

  test("licensing section links to the official NIPR lookup", async ({ page }) => {
    await page.goto("/");
    const nipr = page.locator("#credentials").getByRole("link", { name: /Verify My Credentials/ });
    await expect(nipr).toHaveAttribute(
      "href",
      "https://nipr.com/licensing-center/look-up-a-national-producer-number",
    );
    await expect(nipr).toHaveAttribute("rel", /noopener/);
    await expect(page.locator("#credentials .cred-npn")).toHaveText("22276637");
  });
});

test.describe("credential card", () => {
  test("shows identity, contact actions and a QR code for the clean site URL", async ({ page }) => {
    await page.goto("/credentials");
    const card = page.locator(".cred-card");
    await expect(card.locator(".cred-card-name")).toHaveText("Izaak Varela");
    await expect(card).toContainText("Licensed Life Insurance Agent");
    await expect(card.locator(".cred-card-npn dd")).toHaveText("22276637");
    await expect(card.getByRole("link", { name: /^Call$/ })).toHaveAttribute(
      "href",
      "tel:+19285811704",
    );
    await expect(card.getByRole("link", { name: /^Email$/ })).toHaveAttribute(
      "href",
      "mailto:izaak@izaakvarela.com",
    );
    await expect(card.getByRole("link", { name: /^Schedule$/ })).toHaveAttribute(
      "href",
      "/schedule",
    );
    await expect(card.getByRole("link", { name: /Save contact/ })).toHaveAttribute(
      "href",
      "/izaak-varela.vcf",
    );
    await expect(card.getByRole("link", { name: /Verify Credentials/ })).toHaveAttribute(
      "href",
      /nipr\.com/,
    );

    // The QR on the page is exactly the QR for https://izaakvarela.com (no tracking parameters).
    const qr = card.locator(".qr");
    await expect(qr).toHaveAttribute("aria-label", /izaakvarela\.com/);
    const pagePaths = await qr
      .locator("path")
      .evaluateAll((ps) => ps.map((p) => p.getAttribute("d")));
    const expected = await QRCode.toString(SITE, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 1,
    });
    const expectedPaths = [...expected.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);
    expect(pagePaths).toEqual(expectedPaths);

    const vp = page.viewportSize()!;
    const box = (await card.boundingBox())!;
    expect(box.width).toBeLessThanOrEqual(vp.width);
  });

  test("vCard download contains only the public contact details", async ({ request }) => {
    const res = await request.get("/izaak-varela.vcf");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("text/vcard");
    const body = await res.text();
    expect(body).toBe(buildVCard());
    expect(body).toContain("FN:Izaak Varela");
    expect(body).toContain("TEL;TYPE=WORK,VOICE:+19285811704");
    expect(body).toContain("EMAIL;TYPE=INTERNET,WORK:izaak@izaakvarela.com");
    expect(body).toContain(`URL:${SITE}`);
    expect(body.startsWith("BEGIN:VCARD\r\nVERSION:3.0\r\n")).toBe(true);
    expect(body.trimEnd().endsWith("END:VCARD")).toBe(true);
  });
});

test.describe("request coverage form", () => {
  async function fill(page: import("@playwright/test").Page) {
    await page.fill("#q-firstName", visitor.firstName);
    await page.fill("#q-lastName", visitor.lastName);
    await page.fill("#q-phone", visitor.phone);
    await page.fill("#q-email", visitor.email);
    await page.selectOption("#q-state", visitor.state);
    await page.selectOption("#q-interest", visitor.interest);
    await page.fill("#q-message", visitor.message);
  }

  test("requires consent and valid fields before sending", async ({ page }) => {
    let calls = 0;
    await page.route("/api/quote", (r) => {
      calls++;
      return r.fulfill({ json: { ok: true } });
    });
    await page.goto("/#request");
    await page.locator(".quote-form button[type=submit]").click();
    await expect(page.locator("#quote-error")).toHaveText(/first name/);
    await expect(page.locator("#q-firstName")).toHaveAttribute("aria-invalid", "true");
    await fill(page);
    await page.locator(".quote-form button[type=submit]").click();
    await expect(page.locator("#quote-error")).toHaveText(/check the box/);
    expect(calls).toBe(0);
  });

  test("submits once and shows next steps", async ({ page }) => {
    const bodies: unknown[] = [];
    await page.route("/api/quote", async (r) => {
      bodies.push(r.request().postDataJSON());
      await new Promise((res) => setTimeout(res, 400));
      return r.fulfill({ json: { ok: true } });
    });
    await page.goto("/#request");
    await fill(page);
    await page.locator("#q-consent").check();
    const submit = page.locator(".quote-form button[type=submit]");
    await submit.click();
    await submit.click({ force: true, timeout: 1000 }).catch(() => {});
    await expect(page.getByText("Thanks — your request has been received.")).toBeVisible();
    await expect(page.locator(".form-success a[href^='tel:']")).toHaveAttribute(
      "href",
      "tel:+19285811704",
    );
    expect(bodies).toHaveLength(1);
    expect(bodies[0]).toMatchObject({ firstName: "Jane", consent: true, state: "Arizona" });
  });

  test("falls back to the email app when delivery isn't configured", async ({ page }) => {
    await page.goto("/#request");
    await fill(page);
    await page.locator("#q-consent").check();
    await page.locator(".quote-form button[type=submit]").click();
    const link = page.locator(".quote-form").getByRole("link", { name: /Open in my email app/ });
    await expect(link).toBeVisible();
    expect(decodeURIComponent((await link.getAttribute("href"))!)).toContain(
      "Coverage Request — Jane Doe",
    );
    await expect(page.locator("#q-message")).toHaveValue(visitor.message);
  });
});

test.describe("request coverage — server", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "server-only test runs once");
  });

  test("validation rejects sensitive-free but incomplete submissions", () => {
    expect(validateQuote({ ...visitor, consent: false })).toMatchObject({
      ok: false,
      field: "consent",
    });
    expect(validateQuote({ ...visitor, phone: "123" })).toMatchObject({
      ok: false,
      field: "phone",
    });
    expect(validateQuote({ ...visitor, state: "Atlantis" })).toMatchObject({
      ok: false,
      field: "state",
    });
    expect(validateQuote(visitor)).toMatchObject({ ok: true });
  });

  test("email uses the verified sender, Reply-To the visitor, and records consent", () => {
    const at = new Date("2026-10-27T15:00:00Z");
    const v = validateQuote(visitor);
    if (!v.ok) throw new Error(v.error);
    const email = buildQuoteEmail(v.data, at);
    expect(email.from).toBe("Izaak Varela Website <website@izaakvarela.com>");
    expect(email.to).toEqual(["izaak@izaakvarela.com"]);
    expect(email.reply_to).toBe(visitor.email);
    expect(email.subject).toBe("Coverage Request — Jane Doe (Final Expense)");
    expect(email.text).toContain("2026-10-27T15:00:00.000Z");
    expect(email.text).toContain(QUOTE_CONSENT_TEXT);
  });

  test("ProducerOS payload uses the inbound webhook's standard field names", () => {
    const at = new Date("2026-10-27T15:00:00Z");
    const lead = toInboundLead({ ...visitor }, at);
    expect(lead).toMatchObject({
      first_name: "Jane",
      last_name: "Doe",
      phone: visitor.phone,
      email: visitor.email,
      state: "Arizona",
      product_interest: "Final Expense",
      coverage_interest: visitor.coverageRange,
      preferred_contact_time: "Evening",
      lead_source: "izaakvarela.com",
      consent_timestamp: "2026-10-27T15:00:00.000Z",
    });
  });

  test("route emails and forwards to ProducerOS only when configured", async () => {
    const originalFetch = globalThis.fetch;
    const env = { key: process.env.RESEND_API_KEY, crm: process.env.PRODUCEROS_INBOUND_URL };
    const calls: { url: string; body: Record<string, unknown> }[] = [];
    globalThis.fetch = (async (url: string, init: RequestInit) => {
      calls.push({ url: String(url), body: JSON.parse(String(init.body)) });
      return new Response("{}", { status: 200 });
    }) as typeof fetch;
    const req = () =>
      new Request(`${SITE}/api/quote`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          host: "izaakvarela.com",
          origin: SITE,
          "x-forwarded-for": "203.0.113.9",
        },
        body: JSON.stringify({ ...visitor, company: "" }),
      });
    try {
      delete process.env.RESEND_API_KEY;
      delete process.env.PRODUCEROS_INBOUND_URL;
      expect((await quotePOST(req())).status).toBe(503);

      process.env.RESEND_API_KEY = "re_test_key_not_real";
      expect((await quotePOST(req())).status).toBe(200);
      expect(calls.map((c) => c.url)).toEqual(["https://api.resend.com/emails"]);

      calls.length = 0;
      process.env.PRODUCEROS_INBOUND_URL =
        "https://crm.example.com/api/inbound-leads/pos_in_abcdefghijklmnopqrstuvwx";
      expect((await quotePOST(req())).status).toBe(200);
      expect(calls.map((c) => c.url).sort()).toEqual([
        "https://api.resend.com/emails",
        "https://crm.example.com/api/inbound-leads/pos_in_abcdefghijklmnopqrstuvwx",
      ]);
      const crm = calls.find((c) => c.url.includes("inbound-leads"))!;
      expect(crm.body).toMatchObject({ first_name: "Jane", lead_source: "izaakvarela.com" });

      // A non-https or non-inbound URL is ignored rather than trusted.
      calls.length = 0;
      process.env.PRODUCEROS_INBOUND_URL =
        "http://crm.example.com/api/inbound-leads/pos_in_abcdefghijklmnopqrstuvwx";
      await quotePOST(req());
      expect(calls.map((c) => c.url)).toEqual(["https://api.resend.com/emails"]);
    } finally {
      globalThis.fetch = originalFetch;
      for (const [k, v] of [
        ["RESEND_API_KEY", env.key],
        ["PRODUCEROS_INBOUND_URL", env.crm],
      ] as const) {
        if (v === undefined) delete process.env[k];
        else process.env[k] = v;
      }
    }
  });
});
