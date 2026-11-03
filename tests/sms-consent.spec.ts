import { expect, test, type Page } from "@playwright/test";
import { POST as quotePOST } from "@/app/api/quote/route";
import { buildQuoteEmail } from "@/lib/contact-email";
import { consentPageUrl, toInboundLead } from "@/lib/producer-os";
import { QUOTE_CONSENT_TEXT, SMS_CONSENT_TEXT, SMS_DECLINE_TEXT, validateQuote } from "@/lib/quote";

const SITE = "https://izaakvarela.com";
const EXACT_SMS_TEXT =
  "Yes, I agree to receive recurring text messages from Izaak Varela regarding my insurance inquiry, coverage options, appointment scheduling and reminders, and follow-up. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for assistance. Consent is not a condition of purchase.";
const EXACT_DECLINE_TEXT = "No thanks, continue without text messages.";

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

const group = (page: Page) => page.getByRole("group", { name: /Text messages/ });
const yes = (page: Page) => page.locator("#q-sms-yes");
const no = (page: Page) => page.locator("#q-sms-no");

test.describe("SMS preference choice", () => {
  test("offers two explicit, visible choices with decline selected by default", async ({
    page,
  }) => {
    await page.goto("/#request");
    const g = group(page);
    await expect(g).toBeVisible();
    await expect(g).toHaveAccessibleName("Text messages (optional)");
    await expect(g).toHaveAccessibleDescription(
      "Texting is optional. You can request coverage with either choice.",
    );
    // Both choices are plain radios in one group: same role, size and treatment.
    await expect(g.getByRole("radio")).toHaveCount(2);
    await expect(no(page)).toBeVisible();
    await expect(yes(page)).toBeVisible();
    await expect(no(page)).toHaveAccessibleName(EXACT_DECLINE_TEXT);
    await expect(yes(page)).toHaveAccessibleName(EXACT_SMS_TEXT);
    expect(SMS_CONSENT_TEXT).toBe(EXACT_SMS_TEXT);
    expect(SMS_DECLINE_TEXT).toBe(EXACT_DECLINE_TEXT);
    // Default is no SMS consent; the affirmative option is never preselected.
    await expect(no(page)).toBeChecked();
    await expect(yes(page)).not.toBeChecked();
    for (const r of [yes(page), no(page)]) expect(await r.getAttribute("required")).toBeNull();
    const [a, b] = [(await yes(page).boundingBox())!, (await no(page).boundingBox())!];
    expect(Math.round(a.width)).toBe(Math.round(b.width));

    await expect(g.getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
      "href",
      "/privacy",
    );
    await expect(g.getByRole("link", { name: "Terms & Conditions" })).toHaveAttribute(
      "href",
      "/terms",
    );
    expect(await g.locator("label a").count()).toBe(0);
    // SMS is not bundled into the required phone/email agreement.
    await expect(page.locator("label[for=q-consent]")).not.toContainText(/text/i);
    expect(QUOTE_CONSENT_TEXT).not.toMatch(/text|STOP/i);
    // Choices are inline in the form — no dialog, disclosure widget or hidden panel.
    expect(await g.evaluate((el) => !!el.closest("details, dialog, [hidden]"))).toBe(false);
  });

  test("choices work by click/tap on either label and by keyboard", async ({ page }) => {
    await page.goto("/#request");
    await page.locator("label[for=q-sms-yes]").click();
    await expect(yes(page)).toBeChecked();
    await expect(no(page)).not.toBeChecked();
    await page.locator("label[for=q-sms-no]").click();
    await expect(no(page)).toBeChecked();
    // Arrow keys move between the two choices, like any radio group.
    await no(page).focus();
    await page.keyboard.press("ArrowDown");
    await expect(yes(page)).toBeFocused();
    await expect(yes(page)).toBeChecked();
    await page.keyboard.press("ArrowUp");
    await expect(no(page)).toBeChecked();
  });

  test("Test A — declining SMS still submits and records no consent", async ({ page }) => {
    const bodies = await captureSubmit(page);
    await page.goto("/#request");
    await fill(page);
    await no(page).check();
    const submit = page.locator(".quote-form button[type=submit]");
    await expect(submit).toBeVisible();
    await expect(submit).toBeEnabled();
    await submit.click();
    await expect(page.getByText("Thanks — your request has been received.")).toBeVisible();
    expect(bodies).toHaveLength(1);
    expect(bodies[0]).toMatchObject({ consent: true, smsConsent: false });
    expect(new URL(String(bodies[0].pageUrl)).pathname).toBe("/");
    expect(String(bodies[0].pageUrl)).not.toMatch(/[?#]/);
  });

  test("leaving the default choice also submits with no SMS consent", async ({ page }) => {
    const bodies = await captureSubmit(page);
    await page.goto("/#request");
    await fill(page);
    await page.locator(".quote-form button[type=submit]").click();
    await expect(page.getByText("Thanks — your request has been received.")).toBeVisible();
    expect(bodies[0]).toMatchObject({ smsConsent: false });
  });

  test("Test B — choosing SMS submits and records consent", async ({ page }) => {
    const bodies = await captureSubmit(page);
    await page.goto("/#request");
    await fill(page);
    await yes(page).check();
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
      await group(page).getByRole("link", { name }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.locator("h1")).toHaveText(heading);
    }
  });

  test("fits the form without overflow or overlapping the submit button", async ({ page }) => {
    await page.goto("/#request");
    const g = group(page);
    await g.scrollIntoViewIfNeeded();
    const { sw, cw } = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    expect(sw).toBeLessThanOrEqual(cw);
    const r = (await g.boundingBox())!;
    const form = (await page.locator(".quote-form").boundingBox())!;
    const submit = (await page.locator(".quote-form button[type=submit]").boundingBox())!;
    expect(r.x).toBeGreaterThanOrEqual(form.x - 0.5);
    expect(r.x + r.width).toBeLessThanOrEqual(form.x + form.width + 0.5);
    expect(r.y + r.height).toBeLessThanOrEqual(submit.y);
    // The legend renders inside the tinted box, not on its edge.
    const legend = (await g.locator("legend").boundingBox())!;
    expect(legend.y).toBeGreaterThanOrEqual(r.y + 4);
    for (const radio of [yes(page), no(page)])
      expect((await radio.boundingBox())!.width).toBeGreaterThanOrEqual(20);
    for (const link of await g.getByRole("link").all())
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
    expect(validateQuote({ ...visitor, smsConsent: "yes" })).toMatchObject({
      ok: true,
      data: { smsConsent: true },
    });
    // Declining, or anything other than an affirmative value, is never consent.
    for (const v of ["no", "", "false", "off", "0", null, false, 1])
      expect(validateQuote({ ...visitor, smsConsent: v })).toMatchObject({
        ok: true,
        data: { smsConsent: false },
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
    expect(buildQuoteEmail(no.data, at).text).toContain(`No — "${EXACT_DECLINE_TEXT}"`);
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
      "Text messaging is optional. You can request coverage",
      "No thanks, continue without text messages.",
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
      "Text messaging is optional: you can decline it and still request coverage",
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
