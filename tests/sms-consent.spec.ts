import { expect, test, type Page } from "@playwright/test";
import { POST as quotePOST } from "@/app/api/quote/route";
import { POST as contactPOST } from "@/app/api/contact/route";
import { validateContact } from "@/lib/contact";
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

const FORMS = [
  {
    name: "Request Coverage",
    path: "/#request",
    prefix: "q-",
    form: ".quote-form",
    note: "Texting is optional. You can request coverage with either choice.",
  },
  {
    name: "Contact",
    path: "/contact",
    prefix: "",
    form: ".contact-form",
    note: "Texting is optional. You can send your message with either choice.",
  },
] as const;

for (const f of FORMS) {
  test.describe(`${f.name} form — shared SMS choice`, () => {
    const g = (page: Page) => page.locator(f.form).getByRole("group", { name: /Text messages/ });

    test("same two visible choices, decline by default, policy links", async ({ page }) => {
      await page.goto(f.path);
      await expect(g(page)).toBeVisible();
      await expect(g(page)).toHaveAccessibleName("Text messages (optional)");
      await expect(g(page)).toHaveAccessibleDescription(f.note);
      await expect(page.locator(`#${f.prefix}sms-no`)).toBeChecked();
      await expect(page.locator(`#${f.prefix}sms-yes`)).not.toBeChecked();
      await expect(page.locator(`#${f.prefix}sms-no`)).toHaveAccessibleName(EXACT_DECLINE_TEXT);
      await expect(page.locator(`#${f.prefix}sms-yes`)).toHaveAccessibleName(EXACT_SMS_TEXT);
      await expect(g(page).getByRole("link", { name: "Privacy Policy" })).toHaveAttribute(
        "href",
        "/privacy",
      );
      await expect(g(page).getByRole("link", { name: "Terms & Conditions" })).toHaveAttribute(
        "href",
        "/terms",
      );
      // Sits directly above the submit button, inside the form, without overflow.
      // Measured in one frame: /#request smooth-scrolls to the form after load.
      const { groupBottom, submitTop } = await page.locator(f.form).evaluate((form) => ({
        groupBottom: form.querySelector(".sms-choice")!.getBoundingClientRect().bottom,
        submitTop: form.querySelector("button[type=submit]")!.getBoundingClientRect().top,
      }));
      expect(groupBottom).toBeLessThanOrEqual(submitTop);
      const { sw, cw } = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        cw: document.documentElement.clientWidth,
      }));
      expect(sw).toBeLessThanOrEqual(cw);
    });

    test("keyboard selection between the two choices", async ({ page }) => {
      await page.goto(f.path);
      await page.locator(`#${f.prefix}sms-no`).focus();
      await page.keyboard.press("ArrowDown");
      await expect(page.locator(`#${f.prefix}sms-yes`)).toBeChecked();
      await page.keyboard.press("ArrowUp");
      await expect(page.locator(`#${f.prefix}sms-no`)).toBeChecked();
    });
  });
}

test.describe("Contact form — SMS consent", () => {
  async function fillContact(page: Page, phone = "") {
    await page.fill("#firstName", "Test");
    await page.fill("#lastName", "Visitor");
    await page.fill("#email", "test@example.com");
    if (phone) await page.fill("#phone", phone);
    await page.fill("#message", "Hello, I have a question.");
  }
  async function captureContact(page: Page) {
    const bodies: Record<string, unknown>[] = [];
    await page.route("/api/contact", (r) => {
      bodies.push(r.request().postDataJSON());
      return r.fulfill({ json: { ok: true } });
    });
    return bodies;
  }
  const submit = (page: Page) => page.locator(".contact-form button[type=submit]").click();
  const sent = (page: Page) =>
    expect(page.getByText("Thanks — your message has been sent.")).toBeVisible();

  test("both forms use identical consent wording and styling", async ({ page }) => {
    const read = async (path: string, form: string) => {
      await page.goto(path);
      const grp = page.locator(`${form} .sms-choice`);
      return {
        labels: await grp.locator("label").allInnerTexts(),
        legend: await grp.locator("legend").innerText(),
        links: await grp.locator(".consent-links a").allInnerTexts(),
        style: await grp.evaluate((el) => {
          const cs = getComputedStyle(el);
          return [cs.backgroundColor, cs.borderRadius, cs.padding, cs.fontSize].join("|");
        }),
      };
    };
    expect(await read("/contact", ".contact-form")).toEqual(await read("/#request", ".quote-form"));
  });

  test("declining (the default) sends the message with no SMS consent, once", async ({ page }) => {
    const bodies = await captureContact(page);
    await page.goto("/contact");
    await fillContact(page);
    await submit(page);
    await sent(page);
    expect(bodies).toHaveLength(1);
    expect(bodies[0]).toMatchObject({ smsConsent: false });
    expect(new URL(String(bodies[0].pageUrl)).pathname).toBe("/contact");
  });

  test("explicit 'No thanks' with any phone sends the message with no SMS consent", async ({
    page,
  }) => {
    const bodies = await captureContact(page);
    await page.goto("/contact");
    await fillContact(page, "(555) 010-0000");
    await page.locator("#sms-no").check();
    await submit(page);
    await sent(page);
    expect(bodies[0]).toMatchObject({ smsConsent: false, phone: "(555) 010-0000" });
  });

  test("'Yes' with a valid mobile number records SMS consent", async ({ page }) => {
    const bodies = await captureContact(page);
    await page.goto("/contact");
    await fillContact(page, "(602) 555-0100");
    await page.locator("#sms-yes").check();
    await submit(page);
    await sent(page);
    expect(bodies[0]).toMatchObject({ smsConsent: true, phone: "(602) 555-0100" });
    expect(new URL(String(bodies[0].pageUrl)).pathname).toBe("/contact");
  });

  test("'Yes' without a valid number asks for one; switching to 'No thanks' still sends", async ({
    page,
  }) => {
    const bodies = await captureContact(page);
    await page.goto("/contact");
    await fillContact(page);
    await page.locator("#sms-yes").check();
    await submit(page);
    const alert = page.locator(".form-status [role=alert]");
    await expect(alert).toContainText("valid 10-digit U.S. mobile number");
    await expect(page.locator("#phone")).toBeFocused();
    await expect(page.locator("#phone")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#phone")).toHaveAccessibleDescription(/10-digit U\.S\. mobile/);
    // An invalid number is refused the same way.
    await page.fill("#phone", "(555) 010-0000");
    await submit(page);
    await expect(alert).toContainText("valid 10-digit U.S. mobile number");
    expect(bodies).toHaveLength(0);
    // The submit button stays available; declining sends normally.
    await expect(page.locator(".contact-form button[type=submit]")).toBeEnabled();
    await page.locator("label[for=sms-no]").click();
    await submit(page);
    await sent(page);
    expect(bodies).toHaveLength(1);
    expect(bodies[0]).toMatchObject({ smsConsent: false });
  });

  test("required fields are unchanged and phone stays optional", async ({ page }) => {
    await page.goto("/contact");
    for (const id of ["firstName", "lastName", "email", "message"])
      expect(await page.locator(`#${id}`).getAttribute("required")).not.toBeNull();
    expect(await page.locator("#phone").getAttribute("required")).toBeNull();
    await expect(page.locator("label[for=phone]")).toContainText("(optional)");
  });
});

test.describe("Contact form — SMS consent recorded server-side", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "server-only test runs once");
  });
  const contactVisitor = {
    firstName: "Jane",
    lastName: "Doe",
    email: "jane.visitor@example.com",
    phone: "(602) 555-0100",
    state: "",
    topic: "",
    message: "Hello.",
  };

  test("validation: consent only with an explicit Yes and a valid number", () => {
    expect(validateContact({ ...contactVisitor })).toMatchObject({
      ok: true,
      data: { smsConsent: false },
    });
    expect(validateContact({ ...contactVisitor, smsConsent: "no" })).toMatchObject({
      ok: true,
      data: { smsConsent: false },
    });
    expect(validateContact({ ...contactVisitor, smsConsent: "yes" })).toMatchObject({
      ok: true,
      data: { smsConsent: true },
    });
    for (const phone of ["", "(555) 010-0000"])
      expect(validateContact({ ...contactVisitor, phone, smsConsent: "yes" })).toMatchObject({
        ok: false,
        field: "phone",
      });
    // A number too short to be any phone is refused by the existing phone check first.
    expect(validateContact({ ...contactVisitor, phone: "12345", smsConsent: "yes" })).toMatchObject(
      { ok: false },
    );
    // Declining never needs a phone number.
    expect(validateContact({ ...contactVisitor, phone: "", smsConsent: "no" })).toMatchObject({
      ok: true,
    });
  });

  test("the route emails the SMS choice with timestamp and Contact page source", async () => {
    const originalFetch = globalThis.fetch;
    const originalKey = process.env.RESEND_API_KEY;
    const emails: string[] = [];
    globalThis.fetch = (async (_url: string, init: RequestInit) => {
      emails.push(String(JSON.parse(String(init.body)).text));
      return new Response("{}", { status: 200 });
    }) as typeof fetch;
    const post = (extra: Record<string, unknown>) =>
      contactPOST(
        new Request(`${SITE}/api/contact`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
            host: "izaakvarela.com",
            origin: SITE,
            "x-forwarded-for": "203.0.113.88",
          },
          body: JSON.stringify({ ...contactVisitor, company: "", ...extra }),
        }),
      );
    try {
      process.env.RESEND_API_KEY = "re_test_key_not_real";
      expect((await post({ smsConsent: true, pageUrl: `${SITE}/contact` })).status).toBe(200);
      expect((await post({ smsConsent: false, pageUrl: `${SITE}/contact` })).status).toBe(200);
      const refused = await post({ smsConsent: true, phone: "" });
      expect(refused.status).toBe(400);
      expect(await refused.json()).toMatchObject({ field: "phone" });
      // A foreign or missing page URL falls back to the Contact page itself.
      expect((await post({ smsConsent: true, pageUrl: "https://evil.example/" })).status).toBe(200);
    } finally {
      globalThis.fetch = originalFetch;
      if (originalKey === undefined) delete process.env.RESEND_API_KEY;
      else process.env.RESEND_API_KEY = originalKey;
    }
    expect(emails).toHaveLength(3);
    expect(emails[0]).toMatch(
      new RegExp(`Yes — chosen at \\d{4}-\\d\\d-\\d\\dT[\\d:.]+Z on ${SITE}/contact — `),
    );
    expect(emails[0]).toContain(`"${EXACT_SMS_TEXT}"`);
    expect(emails[1]).toContain(`No — "${EXACT_DECLINE_TEXT}" (no text message consent).`);
    expect(emails[2]).toContain(`on ${SITE}/contact — `);
  });
});
