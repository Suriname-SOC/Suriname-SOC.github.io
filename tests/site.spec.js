// Toegankelijkheid (axe, WCAG 2.2 AA), werking van de klok en basis-SEO.
const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const paginas = ["/", "/diensten.html", "/academy.html", "/over.html", "/contact.html", "/privacy.html", "/404.html"];

// Poort overslaan in de meeste tests; de poort zelf heeft een eigen test.
test.beforeEach(async ({ page }, info) => {
  if (!info.title.includes("poort")) await page.addInitScript(() => sessionStorage.setItem("poort-open", "1"));
});

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

test("ankerlinks verwijzen naar bestaande secties", async ({ page }) => {
  await page.goto("/");
  const hrefs = await page.locator("a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  for (const h of hrefs.filter((h) => h.includes("#") && !h.startsWith("http"))) {
    const [pad, anker] = h.split("#");
    await page.goto("/" + (pad || ""));
    await expect(page.locator("#" + anker), h).toHaveCount(1);
  }
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
  for (const pad of paginas) await page.goto(pad, { waitUntil: "networkidle" });
  expect(extern).toEqual([]);
});

test("poort toont privacymelding en opent de luiken", async ({ page }) => {
  await page.goto("/");
  const poort = page.getByRole("dialog", { name: "Eerst even over uw privacy" });
  await expect(poort).toBeVisible();
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
  expect(r.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  await expect(page.getByRole("button", { name: "Open de luiken" })).toBeFocused();
  await page.getByRole("button", { name: "Open de luiken" }).click();
  await expect(poort).toHaveCount(0, { timeout: 4000 });
  await page.goto("/diensten.html");
  await expect(page.locator("#poort")).toHaveCount(0);
});

test("oude presentatie-url stuurt door naar de pitch", async ({ page }) => {
  await page.goto("/presentatie.html");
  await expect(page).toHaveURL(/\/pitch\/(#.*)?$/);
});
