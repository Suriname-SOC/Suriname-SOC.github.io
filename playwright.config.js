const { defineConfig, devices } = require("@playwright/test");
module.exports = defineConfig({
  testDir: "tests",
  reporter: [["list"]],
  use: { baseURL: "http://localhost:4173" },
  webServer: { command: "npx http-server . -p 4173 -s", url: "http://localhost:4173", reuseExistingServer: true },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobiel", use: { ...devices["Pixel 7"] } },
  ],
});
