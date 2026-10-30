import { expect, test, type Page } from "@playwright/test";
import { POST as quotePOST } from "@/app/api/quote/route";
import { buildQuoteEmail } from "@/lib/contact-email";
import { consentPageUrl, toInboundLead } from "@/lib/producer-os";
import { QUOTE_CONSENT_TEXT, SMS_CONSENT_TEXT, validateQuote } from "@/lib/quote";

const SITE = "https://izaakvarela.com";
const EXACT_SMS_TEXT =
  "I agree to receive recurring text messages from Izaak Varela regarding my life insurance inquiry, coverage options, appointment scheduling and reminders, and follow-up. Message frequency varies. Message and data rates may apply. Reply STOP to opt out and HELP for help. Consent is not a condition of purchase.";

const visitor = {
  firstName: "Jane",
  lastName: "Doe",
  phone: "(602) 555-0100",
  email: "jane.visitor@example.com",
  state: "Arizona",
  interest: "Final Expense",
  coverageRange: "",
  bestTime: "",
  message: "",
  consent: true,
};

async function fill(page: Page) {
  await page.fill("#q-firstName", visitor.firstName);
  await page.fill("#q-lastName", visitor.lastName);
  await page.fill("#q-phone", visitor.phone);
  await page.fill("#q-email", visitor.email);
  await page.selectOption("#q-state", visitor.state);
  await page.locator("#q-consent").check();
}

async function captureSubmit(page: Page) {
  const bodies: Record<string, unknown>[] = [];
  await page.route("/api/quote", (r) => {
    bodies.push(r.request().postDataJSON());
    return r.fulfill({ json: { ok: true } });
  });
  return bodies;
}

test.describe("SMS consent checkbox", () => {
  test("is a separate, optional, unchecked box with the exact disclosure and policy links", async ({
    page,
  }) => {
    await page.goto("/#request");
    const box = page.locator("#q-smsConsent");
    await expect(box).not.toBeChecked();
    expect(await box.getAttribute("required")).toBeNull();
    await expect(box).toHaveAccessibleName(EXACT_SMS_TEXT);
    expect(SMS_CONSENT_TEXT).toBe(EXACT_SMS_TEXT);

    const row = page.locator(".consent").filter({ has: box });
    await expect(row.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/privacy",
    );
    await expect(row.getByRole("link", { name: "Terms & Conditions" })).toHaveAttribute(
      "href",
      "/terms",
    );
    // Links follow the disclosure but sit outside the <label>, so they never toggle the box.
    expect(await row.locator("label a").count()).toBe(0);
    // The required contact consent no longer covers texting.
    await expect(page.locator("label[for=q-consent]")).not.toContainText(/text/i);
    expect(QUOTE_CONSENT_TEXT).not.toMatch(/text|STOP/i);
  });

  test("toggles by tap/click on the box or its text, and by keyboard", async ({ page }) => {
    await page.goto("/#request");
    const box = page.locator("#q-smsConsent");
    await page.locator("label[for=q-smsConsent]").click();
    await expect(box).toBeChecked();
    await box.click();
    await expect(box).not.toBeChecked();
    await box.focus();
    await page.keyboard.press("Space");
    await expect(box).toBeChecked();
    await page.keyboard.press("Space");
    await expect(box).not.toBeChecked();
  });

  test("submits with SMS consent unchecked and records false", async ({ page }) => {
    const bodies = await captureSubmit(page);
    await page.goto("/#request");
    await fill(page);
    await page.locator(".quote-form button[type=submit]").click();
    await expect(page.getByText("Thanks — your request has been received.")).toBeVisible();
    expect(bodies).toHaveLength(1);
    expect(bodies[0]).toMatchObject({ consent: true, smsConsent: false });
    // Only the page (no query/hash, no personal data) is sent as the consent source.
    expect(new URL(String(bodies[0].pageUrl)).pathname).toBe("/");
    expect(String(bodies[0].pageUrl)).not.toMatch(/[?#]/);
  });

  test("submits with SMS consent checked and records true", async ({ page }) => {
    const bodies = await captureSubmit(page);
    await page.goto("/#request");
    await fill(page);
    await page.locator("#q-smsConsent").check();
    await page.locator(".quote-form button[type=submit]").click();
    await expect(page.getByText("Thanks — your request has been received.")).toBeVisible();
    expect(bodies[0]).toMatchObject({ consent: true, smsConsent: true });
  });

  test("Privacy Policy and Terms & Conditions links open the site's pages", async ({ page }) => {
    for (const [name, path, heading] of [
      ["Privacy Policy", "/privacy", "Privacy Policy"],
      ["Terms & Conditions", "/terms", "Terms of Use"],
    ]) {
      await page.goto("/#request");
      const row = page.locator(".consent").filter({ has: page.locator("#q-smsConsent") });
      await row.getByRole("link", { name }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.locator("h1")).toHaveText(heading);
    }
  });

  test("fits the form without overflow or overlapping the submit button", async ({ page }) => {
    await page.goto("/#request");
    const row = page.locator(".consent").filter({ has: page.locator("#q-smsConsent") });
    await row.scrollIntoViewIfNeeded();
    const { sw, cw } = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    expect(sw).toBeLessThanOrEqual(cw);
    const r = (await row.boundingBox())!;
    const form = (await page.locator(".quote-form").boundingBox())!;
    const submit = (await page.locator(".quote-form button[type=submit]").boundingBox())!;
    expect(r.x).toBeGreaterThanOrEqual(form.x - 0.5);
    expect(r.x + r.width).toBeLessThanOrEqual(form.x + form.width + 0.5);
    expect(r.y + r.height).toBeLessThanOrEqual(submit.y);
    // Checkbox and links stay comfortably tappable.
    const box = (await page.locator("#q-smsConsent").boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(20);
    for (const link of await row.getByRole("link").all())
      expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(24);
  });
});

test.describe("SMS consent — recorded server-side", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "server-only test runs once");
  });

  test("validation never requires SMS consent and defaults it to false", () => {
    const r = validateQuote({ ...visitor });
    expect(r).toMatchObject({ ok: true, data: { smsConsent: false } });
    expect(validateQuote({ ...visitor, smsConsent: "on" })).toMatchObject({
      ok: true,
      data: { smsConsent: true },
    });
    // The required contact consent is still required.
    expect(validateQuote({ ...visitor, consent: false })).toMatchObject({ field: "consent" });
  });

  test("ProducerOS payload carries the SMS consent fields", () => {
    const at = new Date("2026-10-30T15:00:00Z");
    const yes = validateQuote({ ...visitor, smsConsent: true });
    const no = validateQuote({ ...visitor });
    if (!yes.ok || !no.ok) throw new Error("invalid fixture");
    expect(toInboundLead(yes.data, at, `${SITE}/`)).toMatchObject({
      sms_consent: true,
      sms_consent_timestamp: "2026-10-30T15:00:00.000Z",
      sms_consent_source: `${SITE}/`,
      sms_consent_text: EXACT_SMS_TEXT,
      // Existing fields unchanged.
      first_name: "Jane",
      consent_timestamp: "2026-10-30T15:00:00.000Z",
      lead_source: "izaakvarela.com",
    });
    const off = toInboundLead(no.data, at, `${SITE}/`);
    expect(off.sms_consent).toBe(false);
    expect(off.sms_consent_timestamp).toBeUndefined();
    expect(JSON.parse(JSON.stringify(off))).not.toHaveProperty("sms_consent_timestamp");
  });

  test("the consent source is this site's page URL, never a foreign or query URL", () => {
    expect(consentPageUrl(`${SITE}/?utm=x#request`, "izaakvarela.com")).toBe(`${SITE}/`);
    expect(consentPageUrl("https://www.izaakvarela.com/", "www.izaakvarela.com")).toBe(
      "https://www.izaakvarela.com/",
    );
    expect(consentPageUrl("https://evil.example/", "izaakvarela.com")).toBe(`${SITE}/`);
    expect(consentPageUrl(undefined, "izaakvarela.com")).toBe(`${SITE}/`);
    expect(consentPageUrl("javascript:alert(1)", "izaakvarela.com")).toBe(`${SITE}/`);
  });

  test("the emailed record states the SMS choice", () => {
    const at = new Date("2026-10-30T15:00:00Z");
    const yes = validateQuote({ ...visitor, smsConsent: true });
    const no = validateQuote({ ...visitor });
    if (!yes.ok || !no.ok) throw new Error("invalid fixture");
    expect(buildQuoteEmail(yes.data, at).text).toContain(`"${EXACT_SMS_TEXT}"`);
    expect(buildQuoteEmail(no.data, at).text).toContain("text message box was not checked");
  });

  test("the route forwards SMS consent to ProducerOS for checked and unchecked submissions", async () => {
    const originalFetch = globalThis.fetch;
    const env = { key: process.env.RESEND_API_KEY, crm: process.env.PRODUCEROS_INBOUND_URL };
    const crm: Record<string, unknown>[] = [];
    globalThis.fetch = (async (url: string, init: RequestInit) => {
      if (String(url).includes("inbound-leads")) crm.push(JSON.parse(String(init.body)));
      return new Response("{}", { status: 200 });
    }) as typeof fetch;
    const post = (extra: Record<string, unknown>) =>
      quotePOST(
        new Request(`${SITE}/api/quote`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            host: "izaakvarela.com",
            origin: SITE,
            "x-forwarded-for": "203.0.113.77",
          },
          body: JSON.stringify({ ...visitor, company: "", pageUrl: `${SITE}/`, ...extra }),
        }),
      );
    try {
      process.env.RESEND_API_KEY = "re_test_key_not_real";
      process.env.PRODUCEROS_INBOUND_URL =
        "https://crm.example.com/api/inbound-leads/pos_in_abcdefghijklmnopqrstuvwx";
      expect((await post({ smsConsent: true })).status).toBe(200);
      expect((await post({})).status).toBe(200);
      expect(crm[0]).toMatchObject({
        sms_consent: true,
        sms_consent_source: `${SITE}/`,
        sms_consent_text: EXACT_SMS_TEXT,
      });
      expect(typeof crm[0].sms_consent_timestamp).toBe("string");
      expect(crm[1]).toMatchObject({ sms_consent: false, sms_consent_source: `${SITE}/` });
      expect(crm[1]).not.toHaveProperty("sms_consent_timestamp");
    } finally {
      globalThis.fetch = originalFetch;
      if (env.key === undefined) delete process.env.RESEND_API_KEY;
      else process.env.RESEND_API_KEY = env.key;
      if (env.crm === undefined) delete process.env.PRODUCEROS_INBOUND_URL;
      else process.env.PRODUCEROS_INBOUND_URL = env.crm;
    }
  });
});

test.describe("SMS policy pages", () => {
  test("/privacy is public and has the SMS/Text Messaging Privacy section", async ({ page }) => {
    const res = await page.goto("/privacy");
    expect(res!.status()).toBe(200);
    const sms = page.locator("#sms");
    await expect(sms).toHaveText("SMS/Text Messaging Privacy");
    const text = await page.locator(".prose").innerText();
    for (const s of [
      "voluntarily opt in to receive text messages from Izaak Varela",
      "Message and data rates may apply",
      "reply STOP at any time",
      "HELP for assistance",
      "will not be sold, rented, or shared with third parties or affiliates for their marketing or promotional purposes",
      "service providers when necessary",
      "Consent to receive SMS messages is not a condition of purchasing any product or service.",
    ])
      expect(text).toContain(s);
  });

  test("/terms is public and has the SMS Messaging Terms section", async ({ page }) => {
    const res = await page.goto("/terms");
    expect(res!.status()).toBe(200);
    await expect(page.locator("#sms")).toHaveText("SMS Messaging Terms");
    const text = await page.locator(".prose").innerText();
    for (const s of [
      "By voluntarily opting in, you agree to receive recurring text messages from Izaak Varela",
      "Message frequency varies. Message and data rates may apply.",
      "not a condition of purchasing any product or service",
      "reply STOP at any time to unsubscribe",
      "unless you subsequently provide consent again",
      "Reply HELP for assistance",
      "Wireless carriers are not liable for delayed or undelivered messages.",
    ])
      expect(text).toContain(s);
    await expect(
      page.locator(".prose").getByRole("link", { name: "Privacy Policy" }).first(),
    ).toHaveAttribute("href", "/privacy");
  });
});
