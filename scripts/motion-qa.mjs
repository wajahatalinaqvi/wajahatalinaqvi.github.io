import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { serve } from "./serve.mjs";

const server = await serve(0);
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch(
  process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {},
);
const report = { motion: {}, interactions: [], accessibility: [], errors: [] };
await mkdir("test-results", { recursive: true });

const matrix = async (page, selector, value) =>
  page
    .locator(selector)
    .first()
    .evaluate(
      (element, key) => new DOMMatrix(getComputedStyle(element).transform)[key],
      value,
    );
const scrollTo = async (page, selector, viewportOffset = 200) =>
  page
    .locator(selector)
    .first()
    .evaluate((element, offset) => {
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      // Desktop fine-pointer pages scroll through Lenis; jump it directly so
      // an in-flight inertial scroll cannot carry the page past the target.
      if (window.__lenis) window.__lenis.scrollTo(top, { immediate: true });
      else window.scrollTo({ top, behavior: "instant" });
    }, viewportOffset);
const noOverflow = async (page) =>
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    "Horizontal overflow",
  );

try {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => report.errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") report.errors.push(message.text());
  });
  await page.addInitScript(() => {
    window.__motionEvidence = {
      heroMoved: false,
      projectMask: false,
      wireDraw: false,
      technologiesMoved: false,
    };
    new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        const element = mutation.target;
        if (!(element instanceof Element)) continue;
        if (
          element.matches(".hero-line, .hero-char") &&
          Math.abs(new DOMMatrix(getComputedStyle(element).transform).m42) > 2
        )
          window.__motionEvidence.heroMoved = true;
        if (
          element.matches(".project-shutter") &&
          new DOMMatrix(getComputedStyle(element).transform).m22 > 0.1
        )
          window.__motionEvidence.projectMask = true;
        if (
          element.matches(".architecture-wire") &&
          parseFloat(getComputedStyle(element).strokeDashoffset) > 1
        )
          window.__motionEvidence.wireDraw = true;
        if (
          element.matches(".technology-card") &&
          Math.abs(new DOMMatrix(getComputedStyle(element).transform).m42) > 2
        )
          window.__motionEvidence.technologiesMoved = true;
      }
    }).observe(document, {
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });
  });
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await expect(page.locator(".hero")).toHaveAttribute(
    "data-motion-ready",
    "true",
  );
  await expect.poll(() => matrix(page, ".hero-line", "m42")).toBe(0);
  await expect(page.locator(".architecture-enter")).toHaveCSS("opacity", "1");
  report.motion.entry = await page.evaluate(
    () => window.__motionEvidence.heroMoved,
  );
  assert.equal(
    report.motion.entry,
    true,
    "Masked hero entrance did not visibly move",
  );
  await page.screenshot({ path: "test-results/v2-hero-desktop.png" });

  await page.getByRole("button", { name: "Explore backend layer" }).focus();
  await expect(page.locator(".architecture-explanation > p")).toContainText(
    "Laravel applications",
  );
  await expect(
    page.getByRole("button", { name: "Explore backend layer" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Explore commerce layer" }).hover();
  await expect(page.locator(".architecture-explanation > p")).toContainText(
    "Shopify apps",
  );
  report.interactions.push(
    "Architecture panels respond to hover and keyboard focus",
  );
  await page.evaluate(() =>
    window.__lenis
      ? window.__lenis.scrollTo(0, { immediate: true })
      : scrollTo({ top: 0, behavior: "instant" }),
  );
  await expect.poll(() => matrix(page, ".architecture-scroll", "m11")).toBe(1);
  const initialScale = await matrix(page, ".architecture-scroll", "m11");
  await page.mouse.wheel(0, 430);
  await expect
    .poll(() => matrix(page, ".architecture-scroll", "m11"))
    .toBeLessThan(initialScale - 0.005);
  await expect
    .poll(() => matrix(page, ".reading-progress", "m11"))
    .toBeGreaterThan(0);
  report.motion.heroScroll = true;

  await scrollTo(page, ".project-card", 160);
  await expect(page.locator(".project-summary").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await expect.poll(() => matrix(page, ".project-shutter", "m22")).toBe(0);
  const project = page.locator(".project-image-link").first();
  const bounds = await project.boundingBox();
  await page.mouse.move(
    bounds.x + bounds.width * 0.88,
    bounds.y + bounds.height * 0.72,
  );
  await expect
    .poll(async () => Math.abs(await matrix(page, ".project-tilt", "m13")))
    .toBeGreaterThan(0.005);
  await expect(page.locator(".project-view-cue").first()).toHaveCSS(
    "opacity",
    "1",
  );
  report.motion.projectTilt = true;
  await page.getByRole("button", { name: "Storefronts", exact: true }).click();
  await expect(page.locator(".project-card")).toHaveCount(1);
  await expect(page.locator(".project-card")).toHaveAttribute(
    "data-motion-ready",
    "true",
  );
  await expect(page.locator(".project-summary")).toHaveCSS("opacity", "1");
  await page.getByRole("button", { name: "All work" }).click();
  await expect(page.locator(".project-card")).toHaveCount(4);
  report.interactions.push(
    "Filtered project cards initialize their own reveal and pointer lifecycle",
  );

  await scrollTo(page, "#about", 160);
  await expect(page.locator(".about-copy > p").last()).toHaveCSS(
    "opacity",
    "1",
  );
  await expect.poll(() => matrix(page, ".portrait-shutter", "m22")).toBe(0);
  const portraitStart = await matrix(page, ".about-photo > img", "m42");
  await page.mouse.wheel(0, 250);
  await expect
    .poll(async () =>
      Math.abs(
        (await matrix(page, ".about-photo > img", "m42")) - portraitStart,
      ),
    )
    .toBeGreaterThan(1);
  report.motion.portraitRevealAndParallax = true;

  await page.getByRole("tab", { name: /^Frontend/ }).click();
  await expect(page.locator(".technology-card")).toHaveCount(6);
  await expect(page.locator(".technology-card").last()).toHaveCSS(
    "opacity",
    "1",
  );
  await page.getByRole("tab", { name: /^Frontend/ }).focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("tab", { name: /^Backend/ })).toBeFocused();
  await expect(page.getByRole("tab", { name: /^Backend/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByRole("tabpanel")).toContainText("Laravel");
  await expect(page.getByRole("tabpanel")).toContainText("Profile capability");
  await expect(page.locator(".skill-evidence")).toContainText(
    "still being documented",
  );
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: /^Workflow/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByRole("tabpanel")).toContainText("Codex");
  await page.keyboard.press("Home");
  await page
    .getByRole("button", { name: "Show commerce technologies" })
    .click();
  await expect(page.getByRole("tab", { name: /^Commerce/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator(".skill-evidence")).toContainText("Djordan Media");
  await expect(page.locator(".technology-card").last()).toHaveCSS(
    "opacity",
    "1",
  );
  for (const name of [
    "Frontend",
    "Backend",
    "Commerce",
    "Workflow",
    "Frontend",
    "Commerce",
  ])
    await page.getByRole("tab", { name: new RegExp(`^${name}`) }).click();
  await expect(page.locator(".technology-card").last()).toHaveCSS(
    "opacity",
    "1",
  );
  await noOverflow(page);
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  report.accessibility.push({
    state: "Interactive skills, commerce selected",
    violations: scan.violations,
  });
  assert.deepEqual(
    scan.violations.map((item) => item.id),
    [],
  );
  await page
    .locator("#expertise")
    .screenshot({ path: "test-results/v2-skills-desktop.png" });
  report.interactions.push(
    "Skills keyboard arrows/Home/End, diagram selection, six technology cards, evidence, and rapid category changes",
  );

  await scrollTo(page, ".timeline", 650);
  const before = await matrix(page, ".timeline-progress", "m22");
  await scrollTo(page, ".timeline li:last-child", 350);
  await expect
    .poll(() => matrix(page, ".timeline-progress", "m22"))
    .toBeGreaterThan(before + 0.1);
  assert.ok((await page.locator(".timeline .is-reached").count()) >= 2);
  const after = await matrix(page, ".timeline-progress", "m22");
  await scrollTo(page, ".timeline", 700);
  await expect
    .poll(() => matrix(page, ".timeline-progress", "m22"))
    .toBeLessThan(after);
  report.motion.reversibleTimeline = true;

  await page.evaluate(() =>
    scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "instant",
    }),
  );
  await expect(page.locator(".contact-form")).toHaveCSS("opacity", "1");
  await expect
    .poll(() =>
      page
        .locator(
          ".project-summary, .about-copy > p, .timeline-description, .technology-card",
        )
        .evaluateAll((elements) =>
          elements.every(
            (element) => Number(getComputedStyle(element).opacity) >= 0.99,
          ),
        ),
    )
    .toBe(true);
  await page.evaluate(() =>
    window.__lenis
      ? window.__lenis.scrollTo(0, { immediate: true })
      : scrollTo({ top: 0, behavior: "instant" }),
  );
  await expect(page.locator(".hero-line").first()).toHaveCSS("opacity", "1");
  for (const width of [768, 1024, 390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await noOverflow(page);
  }
  // Only the process section pins (desktop); nothing else may add pins.
  assert.ok((await page.locator(".pin-spacer").count()) <= 1);
  report.motion.fastReverseResize = true;
  report.motion.traces = await page.evaluate(() => window.__motionEvidence);
  assert.ok(
    report.motion.traces.projectMask &&
      report.motion.traces.wireDraw &&
      report.motion.traces.technologiesMoved,
  );

  for (let cycle = 0; cycle < 2; cycle++) {
    await page
      .getByRole("link", {
        name: "View Rocket Label Lock case study",
        exact: true,
      })
      .click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Rocket Label Lock.",
    );
    await page.goBack();
    await expect(page.locator(".project-card")).toHaveCount(4);
    await expect(page.locator(".project-card").first()).toHaveAttribute(
      "data-motion-ready",
      "true",
    );
    await scrollTo(page, "#about", 100);
    await expect(
      page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "About", exact: true }),
    ).toHaveAttribute("aria-current", "location");
    await scrollTo(page, "#expertise", 100);
    await expect(
      page
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "Expertise", exact: true }),
    ).toHaveAttribute("aria-current", "location");
  }
  report.interactions.push(
    "Repeated client navigation and browser back restore the home experience",
  );
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 6 });
  await page.goto(base);
  await expect(page.locator(".architecture-enter")).toHaveCSS("opacity", "1", {
    timeout: 20000,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });
  report.motion.cpuSlowdown =
    "6x simulation: entry completes and controls remain usable";

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base);
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  await expect(page.locator(".hero-line").first()).toHaveCSS(
    "transform",
    "none",
  );
  await page.getByRole("tab", { name: /^Backend/ }).click();
  await expect(page.locator(".technology-card").first()).toHaveCSS(
    "opacity",
    "1",
  );
  await expect(page.locator(".technology-card").first()).toHaveCSS(
    "transform",
    "none",
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
  await page.evaluate(() =>
    window.__lenis
      ? window.__lenis.scrollTo(0, { immediate: true })
      : scrollTo({ top: 0, behavior: "instant" }),
  );
  await page.screenshot({
    path: "test-results/v2-home-desktop.png",
    fullPage: true,
  });
  report.motion.reducedMotion = true;

  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const mobile = await mobileContext.newPage();
  mobile.on("pageerror", (error) => report.errors.push(error.message));
  await mobile.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...options) {
      if (/webgl/i.test(type)) return null;
      return original.call(this, type, ...options);
    };
  });
  await mobile.goto(base);
  await mobile.getByRole("button", { name: "Explore commerce layer" }).tap();
  await expect(mobile.locator(".architecture-explanation > p")).toContainText(
    "Shopify apps",
  );
  await mobile.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
  const mobileCdp = await mobileContext.newCDPSession(mobile);
  await mobileCdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 180, y: 700 }],
  });
  for (const y of [650, 570, 480, 380, 280, 180]) {
    await mobileCdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 180, y }],
    });
    await mobile.evaluate(() => new Promise(requestAnimationFrame));
  }
  await mobileCdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect.poll(() => mobile.evaluate(() => scrollY)).toBeGreaterThan(100);
  await mobile.getByRole("tab", { name: /^Commerce/ }).tap();
  await expect(mobile.locator(".technology-card")).toHaveCount(6);
  await expect(mobile.locator(".technology-card").last()).toHaveCSS(
    "opacity",
    "1",
  );
  await noOverflow(mobile);
  const mobileScan = await new AxeBuilder({ page: mobile })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  report.accessibility.push({
    state: "Touch skills, WebGL unavailable",
    violations: mobileScan.violations,
  });
  assert.deepEqual(
    mobileScan.violations.map((item) => item.id),
    [],
  );
  await mobile
    .locator("#expertise")
    .screenshot({ path: "test-results/v2-skills-mobile.png" });
  report.interactions.push(
    "Native touch scroll, tap architecture and skills, WebGL unavailable",
  );
  const noScriptContext = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const noScript = await noScriptContext.newPage();
  await noScript.goto(base);
  await expect(noScript.locator(".skills-nojs")).toContainText("Laravel");
  await expect(noScript.locator(".skills-nojs")).toContainText("Codex");
  assert.equal(
    await noScript.locator(".contact-form").evaluate((form) => form.noValidate),
    false,
  );
  await noScriptContext.close();
  report.interactions.push(
    "Without JavaScript: all skill categories remain readable and native form validation is preserved",
  );
  assert.deepEqual(report.errors, []);
  console.log(JSON.stringify(report, null, 2));
} finally {
  await writeFile(
    "test-results/motion-report.json",
    JSON.stringify(report, null, 2),
  );
  await browser.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
