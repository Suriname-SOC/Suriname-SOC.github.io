// Toegankelijkheid (axe, WCAG 2.2 AA), werking van de klok en basis-SEO.
const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const paginas = ["/", "/404.html"];

for (const pad of paginas) {
  test(`geen toegankelijkheidsfouten op ${pad}`, async ({ page }) => {
    await page.goto(pad);
    const r = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
      .analyze();
    expect(r.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });
}

test("klok toont tijd in Paramaribo", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#nu-label")).toHaveText(/^Nu \d{2}:\d{2} in Paramaribo$/);
});

test("ankerlinks in menu verwijzen naar bestaande secties", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page.locator("nav a").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  for (const h of hrefs) await expect(page.locator(h)).toHaveCount(1);
});

test("geen horizontale scroll op mobiel", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  const breed = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(breed).toBeLessThanOrEqual(360);
});

test("geen externe verzoeken (privacy: geen trackers of CDN's)", async ({ page }) => {
  const extern = [];
  page.on("request", (req) => { if (!req.url().startsWith("http://localhost")) extern.push(req.url()); });
  await page.goto("/", { waitUntil: "networkidle" });
  expect(extern).toEqual([]);
});
