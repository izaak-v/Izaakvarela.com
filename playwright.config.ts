import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PORT ?? 3210);
const baseURL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

/**
 * Browser tests. Run with `npm run test:e2e` (builds and starts the production server).
 * First time on a new machine: `npx playwright install chromium`.
 * Set BASE_URL to test a deployed site instead, e.g. BASE_URL=https://izaakvarela.com
 */
const chromium = { browserName: "chromium" as const };
const chromeOnIPhoneUA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/129.0.6668.69 Mobile/15E148 Safari/604.1";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: { baseURL, trace: "retain-on-failure" },
  projects: [
    { name: "iphone-portrait", use: { ...devices["iPhone 13"], ...chromium } },
    { name: "iphone-landscape", use: { ...devices["iPhone 13 landscape"], ...chromium } },
    { name: "iphone-narrow-safari", use: { ...devices["iPhone SE"], ...chromium } },
    {
      name: "chrome-on-iphone",
      use: { ...devices["iPhone 13"], ...chromium, userAgent: chromeOnIPhoneUA },
    },
    { name: "ipad-portrait", use: { ...devices["iPad (gen 7)"], ...chromium } },
    { name: "ipad-landscape", use: { ...devices["iPad (gen 7) landscape"], ...chromium } },
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npm run build && npx next start -p ${PORT}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 180_000,
      },
});
