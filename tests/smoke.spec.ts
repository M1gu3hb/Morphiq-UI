import { expect, test, type Locator, type Page } from "@playwright/test";

type PublicRoute = {
  anchor: (page: Page) => Locator;
  componentName?: RegExp;
  label: string;
  path: string;
};

const publicRoutes: PublicRoute[] = [
  {
    anchor: (page) => page.locator("main h1").first(),
    label: "landing",
    path: "/",
  },
  {
    anchor: (page) => page.locator("main h1").first(),
    label: "component catalog",
    path: "/components",
  },
  {
    anchor: (page) => page.locator("main h1").first(),
    componentName: /^(Button|Botón)$/i,
    label: "Button detail",
    path: "/components/button",
  },
  {
    anchor: (page) => page.locator("main h1").first(),
    componentName: /^(Card|Tarjeta)$/i,
    label: "Card detail",
    path: "/components/card",
  },
  {
    anchor: (page) => page.locator("main h1").first(),
    componentName: /^(Toggle|Interruptor)$/i,
    label: "Toggle detail",
    path: "/components/toggle",
  },
  {
    anchor: (page) => page.locator("main h1").first(),
    label: "library",
    path: "/library",
  },
  {
    anchor: (page) => page.locator(".v5-topbar"),
    label: "studio",
    path: "/studio",
  },
];

test.describe("production public routes", () => {
  for (const route of publicRoutes) {
    test(`${route.label} responds and hydrates without browser errors`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const pageErrors: string[] = [];

      page.on("console", (message) => {
        if (message.type() !== "error") return;
        const location = message.location();
        const source = location.url
          ? ` (${location.url}:${location.lineNumber ?? 0}:${location.columnNumber ?? 0})`
          : "";
        consoleErrors.push(`${message.text()}${source}`);
      });
      page.on("pageerror", (error) => {
        pageErrors.push(error.stack ?? error.message);
      });

      const response = await page.goto(route.path);
      expect(response, `${route.path} did not return a document response`).not.toBeNull();
      expect(response?.status(), `${route.path} did not respond with HTTP 200`).toBe(200);

      await expect(route.anchor(page), `${route.path} did not render its page anchor`).toBeVisible();
      await page.waitForLoadState("networkidle");

      if (route.componentName) {
        await expect(
          page.getByRole("heading", { level: 1, name: route.componentName }),
          `${route.path} did not render the component name`,
        ).toBeVisible();
        await expect(
          page.getByText(/^(Real source|Código real)$/i),
          `${route.path} did not render the real-source label`,
        ).toBeVisible();
        const sourceCode = page.locator("pre code");
        await expect(sourceCode, `${route.path} did not render its source block`).toBeVisible();
        await expect(sourceCode, `${route.path} rendered an empty source block`).not.toBeEmpty();
      }

      expect(consoleErrors, `${route.path} emitted console.error`).toEqual([]);
      expect(pageErrors, `${route.path} emitted an uncaught pageerror`).toEqual([]);
    });
  }
});
