import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import assert from "node:assert/strict";
import { serve } from "./serve.mjs";

const server = await serve(0);
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch(
  process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {},
);
const report = {
  viewports: [],
  scans: [],
  interactions: [],
  consoleErrors: [],
  failedResources: [],
};
await mkdir("test-results", { recursive: true });
try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => report.consoleErrors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      !message.location().url.startsWith("https://formspree.io/")
    )
      report.consoleErrors.push(`${message.text()} ${message.location().url}`);
  });
  page.on("response", (response) => {
    if (
      response.status() >= 400 &&
      !response.url().startsWith("https://formspree.io/")
    )
      report.failedResources.push({
        url: response.url(),
        status: response.status(),
      });
  });
  await page.goto(base);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Wajahat Naqvi, Shopify Full-StackDeveloper.",
  );
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  report.interactions.push("Keyboard skip link");
  for (const width of [320, 375, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(base);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    assert.equal(overflow, false, `Horizontal overflow at ${width}px`);
    report.viewports.push({ width, overflow });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base);
  await page.getByRole("button", { name: "Storefronts", exact: true }).click();
  await expect(page.locator(".project-grid article")).toHaveCount(1);
  await page.getByRole("button", { name: "Applications", exact: true }).click();
  await expect(page.locator(".project-grid article")).toHaveCount(3);
  await page.getByRole("button", { name: "All work" }).click();
  await expect(page.locator(".project-grid article")).toHaveCount(4);
  await page.getByText("More from the archive", { exact: false }).click();
  await expect(page.locator(".archive-list a")).toHaveCount(4);
  await page.getByRole("tab", { name: /^Backend/ }).click();
  await expect(page.getByRole("tabpanel", { name: /^Backend/ })).toBeVisible();
  await expect(page.locator(".technology-card")).toHaveCount(6);
  report.interactions.push("Project filters, archive, and technology tabs");
  const scan = async (name) => {
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    report.scans.push({ name, violations: result.violations });
    assert.deepEqual(
      result.violations.map(
        (item) =>
          `${item.id}: ${item.nodes.map((n) => n.target.join(" ")).join(", ")}`,
      ),
      [],
      `Accessibility: ${name}`,
    );
  };
  await scan(
    "Home desktop, archive expanded and backend technologies selected",
  );
  await page.route("https://formspree.io/**", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"ok":true}',
    }),
  );
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(
    page.getByRole("textbox", { name: "Your name", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("textbox", { name: "Your name", exact: true }),
  ).toHaveAttribute("aria-invalid", "true");
  await expect(
    page.getByText("Please enter a valid email address."),
  ).toBeVisible();
  await scan("Contact validation errors and associated descriptions");
  await page
    .getByRole("textbox", { name: "Your name", exact: true })
    .fill("Portfolio QA");
  await page
    .getByRole("textbox", { name: "Email address", exact: true })
    .fill("qa@example.com");
  await page
    .getByRole("textbox", { name: "What are you working on?", exact: true })
    .fill("Testing the contact interaction without sending a real message.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(
    page.getByText("Thanks — your message has been sent."),
  ).toBeVisible();
  await page.unroute("https://formspree.io/**");
  await page.route("https://formspree.io/**", (route) =>
    route.fulfill({
      status: 422,
      contentType: "application/json",
      body: '{"error":"test"}',
    }),
  );
  await page
    .getByRole("textbox", { name: "Your name", exact: true })
    .fill("Portfolio QA");
  await page
    .getByRole("textbox", { name: "Email address", exact: true })
    .fill("qa@example.com");
  await page
    .getByRole("textbox", { name: "What are you working on?", exact: true })
    .fill("Testing the recoverable error state without sending a message.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText(/Your message couldn’t be sent/)).toBeVisible();
  report.interactions.push("Mocked form success and failure; no messages sent");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await scan("Home mobile, navigation expanded");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
  report.interactions.push(
    "Mobile navigation, Escape, focus restoration, and link close",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base);
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.evaluate(() =>
    Promise.all(
      Array.from(document.images).map(
        (image) => ((image.loading = "eager"), image.decode().catch(() => {})),
      ),
    ),
  );
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/home-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base);
  await page.locator("#about").scrollIntoViewIfNeeded();
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.evaluate(() =>
    Promise.all(
      Array.from(document.images).map(
        (image) => ((image.loading = "eager"), image.decode().catch(() => {})),
      ),
    ),
  );
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({
    path: "test-results/home-desktop.png",
    fullPage: true,
  });
  const projectLinks = await page
    .locator(".project-info h3 a, .archive-list a")
    .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  await page
    .getByRole("link", {
      name: "View Rocket Label Lock case study",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(`${base}/projects/rocket-label-lock/`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Rocket Label Lock.",
  );
  await page.getByRole("link", { name: "Next project Djordan Media" }).click();
  await expect(page).toHaveURL(`${base}/projects/djordan-media/`);
  report.interactions.push("Client navigation and next-project routing");
  for (const href of projectLinks) {
    const response = await page.goto(`${base}${href}`);
    assert.equal(response.status(), 200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  await scan("Case study mobile/desktop semantic structure");
  await page.screenshot({
    path: "test-results/case-study.png",
    fullPage: true,
  });
  const noScript = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const staticPage = await noScript.newPage();
  await staticPage.goto(base);
  await expect(staticPage.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    staticPage.getByRole("link", {
      name: "View Rocket Label Lock case study",
      exact: true,
    }),
  ).toBeVisible();
  await noScript.close();
  report.interactions.push(
    "Direct project navigation, reduced motion, and essential content without JavaScript",
  );
  assert.deepEqual(report.failedResources, [], "Failed resource requests");
  assert.deepEqual(report.consoleErrors, [], "Browser console errors");
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile(
    "test-results/browser-report.json",
    JSON.stringify(report, null, 2),
  );
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
