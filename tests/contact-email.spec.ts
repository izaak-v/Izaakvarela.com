import { expect, test } from "@playwright/test";
import { POST } from "@/app/api/contact/route";
import { CONTACT_FROM, CONTACT_TO, buildContactEmail } from "@/lib/contact-email";

// Pure server-side tests: no browser needed, so run them once.
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "server-only test runs once");
});

const visitor = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jane.visitor@example.com",
  phone: "(555) 010-0000",
  state: "Arizona",
  topic: "Final Expense",
  message: "Hello — I have a question about coverage.",
};

const TESTING_SENDERS = /resend\.dev|onboarding@/i;

test("sender, recipient, and Reply-To use the verified domain and the visitor's email", () => {
  const email = buildContactEmail(visitor);
  expect(CONTACT_FROM).toBe("Izaak Varela Website <website@izaakvarela.com>");
  expect(email.from).toMatch(/<[^@<>]+@izaakvarela\.com>$/);
  expect(email.to).toEqual(["izaak@izaakvarela.com"]);
  expect(CONTACT_TO).toBe("izaak@izaakvarela.com");
  expect(email.reply_to).toBe("jane.visitor@example.com");
  expect(email.subject).toBe("Website Inquiry — Jane Doe");
  expect(JSON.stringify(email)).not.toMatch(TESTING_SENDERS);
});

test("the /api/contact route sends exactly that payload to Resend", async () => {
  const originalFetch = globalThis.fetch;
  const originalKey = process.env.RESEND_API_KEY;
  const sent: { url: string; headers: Record<string, string>; body: Record<string, unknown> }[] =
    [];
  process.env.RESEND_API_KEY = "re_test_key_not_real";
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    sent.push({
      url: String(url),
      headers: init.headers as Record<string, string>,
      body: JSON.parse(String(init.body)),
    });
    return new Response(JSON.stringify({ id: "test" }), { status: 200 });
  }) as typeof fetch;

  try {
    const res = await POST(
      new Request("https://izaakvarela.com/api/contact", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          host: "izaakvarela.com",
          origin: "https://izaakvarela.com",
          "x-forwarded-for": "203.0.113.7",
        },
        body: JSON.stringify({ ...visitor, company: "" }),
      }),
    );
    expect(res.status).toBe(200);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = originalKey;
  }

  expect(sent).toHaveLength(1);
  const [call] = sent;
  expect(call.url).toBe("https://api.resend.com/emails");
  expect(call.headers.Authorization).toBe("Bearer re_test_key_not_real");
  expect(call.body.from).toBe("Izaak Varela Website <website@izaakvarela.com>");
  expect(String(call.body.from)).toMatch(/@izaakvarela\.com>$/);
  expect(call.body.to).toEqual(["izaak@izaakvarela.com"]);
  expect(call.body.reply_to).toBe("jane.visitor@example.com");
  expect(call.body.subject).toBe("Website Inquiry — Jane Doe");
  expect(String(call.body.text)).toContain("Email:       jane.visitor@example.com");
  expect(JSON.stringify(call.body)).not.toMatch(TESTING_SENDERS);
});
